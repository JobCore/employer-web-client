import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import {store, fetchTemporal, update} from '../actions.js';
import {TIME_FORMAT, DATETIME_FORMAT, DATE_FORMAT, NOW} from '../components/utils.js';
import {validator, ValidationError} from '../utils/validation';
import DateTime from 'react-datetime';
import moment from 'moment';

export const Employer = (data={}) => {
    
    const _defaults = {
        title: '',
        website: '',
        payroll_period_starting_time: NOW(),
        maximum_clockout_delay_minutes: 0,
        bio: '',
        response_time: 'not yet calculated',
        rating: 'not yet calculated',
        serialize: function(){
            
            const newShift = {
//                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
            };
            
            return Object.assign(this, newShift);
        }
    };
    
    let _employer = Object.assign(_defaults, data);
    return {
        validate: () => {
            if(validator.isEmpty(_employer.bio)) throw new ValidationError('The company bio cannot be empty');
            if(validator.isEmpty(_employer.title)) throw new ValidationError('The company name cannot be empty');
            if(validator.isEmpty(_employer.website)) throw new ValidationError('The company website cannot be empty');
            return _employer;
        },
        defaults: () => {
            return _defaults;
        }
    };
};

export class Profile extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            employer: Employer().defaults()
        };
    }
    
    setEmployer(newEmployer){
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }
    
    componentDidMount(){
        
        fetchTemporal('employers/me', 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });
        
    }
    
    render() {
        return (<div className="p-1 listcontents company-profile">
            <h1><span id="company_details">Company Details</span></h1>
            <form>
                <div className="row mt-2">
                    <div className="col-6">
                        <label>Response Time</label>
                        <p>You answer applications within <span className="text-success">{this.state.employer.response_time} min.</span></p>
                    </div>
                    <div className="col-6">
                        <label>Rating</label>
                        <p>Talents rated you with <span className="text-success">{this.state.employer.rating} points.</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label>Company Name</label>
                        <input type="text" className="form-control" value={this.state.employer.title} 
                            onChange={(e) => this.setEmployer({ title: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <label>Website</label>
                        <input type="text" className="form-control" value={this.state.employer.website}
                            onChange={(e) => this.setEmployer({ website: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <label>Bio</label>
                        <input type="text" className="form-control" value={this.state.employer.bio} 
                            onChange={(e) => this.setEmployer({ bio: e.target.value })}
                        />
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => update({path: 'employers', event_name: 'current_employer'}, Employer(this.state.employer).validate().serialize())}
                    >Save</button>
                </div>
            </form>
        </div>);
    }
}

export class PayrollSettings extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            employer: Employer().defaults()
        };
    }
    
    setEmployer(newEmployer){
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }
    
    componentDidMount(){
        
        fetchTemporal('employers/me', 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });
        
    }
    
    render() {
        const autoClockout = this.state.employer.maximum_clockout_delay_minutes == null ? false : true;
        const weekday = this.state.employer.payroll_period_starting_time.isoWeekday();
        return (<div className="p-1 listcontents company-payroll-settings">
            <h1><span id="company_details">Your Payroll Settings</span></h1>
            <form>
                <div className="row mt-2">
                    <div className="col-12">
                        <label className="d-block">When do you want your payroll to run?</label>
                        <span>Every </span>
                        <select className="form-control" style={{ width: "100px", display: "inline-block" }}>
                            <option>Week</option>
                        </select>
                        <span> starting </span>
                        <select 
                            value={weekday || 1}
                            className="form-control" style={{ width: "100px", display: "inline-block" }}
                            onChange={(e)=> {
                                const diff = (e.target.value - weekday);
                                let newDate =  this.state.employer.payroll_period_starting_time.clone().add(diff, 'days');
                                this.setEmployer({ 
                                    payroll_period_starting_time: newDate
                                });
                            }}
                        >
                            <option value={1}>Monday{"'"}</option>
                            <option value={2}>Tuesday{"'"}</option>
                            <option value={3}>Wednesday{"'"}</option>
                            <option value={4}>Thursday{"'"}</option>
                            <option value={5}>Friday{"'"}</option>
                            <option value={6}>Saturday{"'"}</option>
                            <option value={7}>Sunday{"'"}</option>
                        </select>
                        <span> at </span>
                        <DateTime 
                            dateFormat={false}
                            styles={{ width: "100px", display: "inline-block" }}
                            timeFormat={DATETIME_FORMAT}
                            timeConstraints={{ minutes: { step: 15 }}}
                            value={this.state.employer.payroll_period_starting_time}
                            renderInput={(properties) => {
                                const { value, ...rest } = properties;
                                return <input value={value.match(/\d{1,2}:\d{1,2}\s?[ap]m/gm)} {...rest} />;
                            }}
                            onChange={(value)=> {
                                const starting = moment( this.state.employer.payroll_period_starting_time.format("MM-DD-YYYY")+" "+value.format("hh:mm a"), "MM-DD-YYYY hh:mm a");
                                this.setEmployer({ payroll_period_starting_time: starting });
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label className="d-block">When can talents start clocking in?</label>
                        <select 
                            value={this.state.employer.maximum_clockin_delta_minutes}
                            className="form-control" style={{ width: "100px", display: "inline-block" }}
                            onChange={(e) => this.setEmployer({ maximum_clockin_delta_minutes: e.target.value })}
                        >
                            <option value={5}>5 min</option>
                            <option value={10}>10 min</option>
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>1 hour</option>
                        </select>
                        <span> before or after the starting time of the shift</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <label className="d-block">Do you want automatic checkout?</label>
                        <select value={autoClockout} className="form-control" style={{ width: "300px", display: "inline-block" }} onChange={(e) => {
                            this.setEmployer({ maximum_clockout_delay_minutes: e.target.value == 'true' ? 10 : null });
                        }}>
                            <option value={true}>Only if the talent forgets to checkout</option>
                            <option value={false}>No, leave the shift active until the talent checkouts</option>
                        </select>
                        { !autoClockout ? '': 
                        <span> 
                            , wait 
                            <input type="number" style={{width: "60px"}} className="form-control d-inline-block ml-2 mr-2"
                                value={this.state.employer.maximum_clockout_delay_minutes} 
                                onChange={(e) => this.setEmployer({ maximum_clockout_delay_minutes: e.target.value })}
                            />
                            min to auto checkout
                        </span>
                        }
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => update({path: 'employers', event_name: 'current_employer'}, Employer(this.state.employer).validate().serialize())}
                    >Save</button>
                </div>
            </form>
        </div>);
    }
}