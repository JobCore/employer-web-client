import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import { store, fetchTemporal, update, searchMe, remove } from '../actions.js';
import { DATETIME_FORMAT, NOW } from '../components/utils.js';
import { validator, ValidationError } from '../utils/validation';
import DateTime from 'react-datetime';
import moment from 'moment';
import { DeductionExtendedCard, Theme } from '../components/index';
import {Notify} from 'bc-react-notifier';
export const Employer = (data = {}) => {

    const _defaults = {
        title: '',
        website: '',
        payroll_period_starting_time: NOW(),
        maximum_clockout_delay_minutes: 0,
        bio: '',
        uploadCompanyLogo: null,
        editingImage: false,
        response_time: 'not yet calculated',
        rating: 'not yet calculated',
        serialize: function () {

            const newShift = {
                //                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
            };

            return Object.assign(this, newShift);
        }
    };

    let _employer = Object.assign(_defaults, data);
    return {
        validate: () => {
            if (validator.isEmpty(_employer.bio)) throw new ValidationError('The company bio cannot be empty');
            if (validator.isEmpty(_employer.title)) throw new ValidationError('The company name cannot be empty');
            if (validator.isEmpty(_employer.website)) throw new ValidationError('The company website cannot be empty');
            return _employer;
        },
        defaults: () => {
            return _defaults;
        }
    };
};

export class PayrollSettings extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            employer: Employer().defaults(),
            deductions: [],
        };
    }

    setEmployer(newEmployer) {
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }

    componentDidMount() {

        const deductions = store.getState('deduction');
        if(!deductions){
            searchMe('deduction');
        } else {
            this.setState({ deductions });
        }
        fetchTemporal('employers/me', 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });
        this.subscribe(store, 'deduction', (deductions) => {
            this.setState({ deductions });
        });

    }

    render() {
        console.log("===============deductions: ", this.state.deductions);
        const autoClockout = this.state.employer.maximum_clockout_delay_minutes == null ? false : true;
        const weekday = this.state.employer.payroll_period_starting_time.isoWeekday();
        let nextDate = this.state.employer.payroll_period_starting_time.clone();
        while (nextDate.isBefore(NOW())) nextDate = nextDate.add(7, 'days');

        return (<div className="p-1 listcontents company-payroll-settings">
            <h1><span id="company_details">Your Payroll Settings</span></h1>
            <div className="row mt-2">
                <div className="col-12">
                    <h4>Next payroll will run on {nextDate.format("dddd, MMMM Do YYYY, h:mm a")}</h4>
                </div>
            </div>
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
                            onChange={(e) => {
                                const diff = (e.target.value - weekday);
                                let newDate = this.state.employer.payroll_period_starting_time.clone().add(diff, 'days');
                                this.setEmployer({
                                    payroll_period_starting_time: newDate
                                });
                            }}
                        >
                            <option value={1}>Monday{"'s"}</option>
                            <option value={2}>Tuesday{"'s"}</option>
                            <option value={3}>Wednesday{"'s"}</option>
                            <option value={4}>Thursday{"'s"}</option>
                            <option value={5}>Friday{"'s"}</option>
                            <option value={6}>Saturday{"'s"}</option>
                            <option value={7}>Sunday{"'s"}</option>
                        </select>
                        <span> at </span>
                        <DateTime
                            dateFormat={false}
                            styles={{ width: "100px", display: "inline-block" }}
                            timeFormat={DATETIME_FORMAT}
                            timeConstraints={{ minutes: { step: 15 } }}
                            value={this.state.employer.payroll_period_starting_time}
                            renderInput={(properties) => {
                                const { value, ...rest } = properties;
                                return <input value={value.match(/\d{1,2}:\d{1,2}\s?[ap]m/gm)} {...rest} />;
                            }}
                            onChange={(value) => {
                                const starting = moment(this.state.employer.payroll_period_starting_time.format("MM-DD-YYYY") + " " + value.format("hh:mm a"), "MM-DD-YYYY hh:mm a");
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
                        {!autoClockout ? '' :
                        <span>
                                , wait
                            <input type="number" style={{ width: "60px" }} className="form-control d-inline-block ml-2 mr-2"
                                    value={this.state.employer.maximum_clockout_delay_minutes}
                                    onChange={(e) => this.setEmployer({ maximum_clockout_delay_minutes: e.target.value })}
                                />
                                min to auto checkout
                        </span>
                        }
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <label>Deductions</label>
                        <div className="p-1 listcontents">
                            <Theme.Consumer>
                                {({ bar }) => (<span>
                                    {/* <Wizard continuous
                                        steps={this.state.steps}
                                        run={this.state.runTutorial}
                                        callback={callback}
                                    /> */}
                                    {/* <h1><span id="talent_search_header">Talent Search</span></h1> */}
                                    { this.state.deductions.length > 0
                                    ? <table className="table table-striped payroll-summary">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Deduction</th>
                                                <th>Status</th>
                                                <th>Description</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.deductions.map((deduction, i) => (
                                                <DeductionExtendedCard
                                        key={i}
                                        deduction={deduction}
                                        onEditClick={() => bar.show({ 
                                            slug: "update_deduction", 
                                            data: deduction
                                            })}
                                        onDelete={() => {
                                            const noti = Notify.info("Are you sure you want to delete this deduction?",(answer) => {
                                                if(answer) remove('deduction', deduction);
                                                noti.remove();
                                            });
                                        }}    
                                            >
                                                </DeductionExtendedCard>
                                ))}
                                        </tbody>
                                    </table>
                                : <p>No deductions yet</p>}
                                </span>)}
                            </Theme.Consumer>
                        </div>
                        <Theme.Consumer>
                            {({ bar }) => (
                                <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: "10px" }}
                        onClick={() => bar.show({ 
                            slug: "create_deduction", 
                            data: {
                                name: "", 
                                active: false, 
                                value: null,
                                description: "",
                                type: ""
                        } 
                        })}
                    >
                        Create deduction
                                </button>
                            )}
                        </Theme.Consumer>
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => update({ path: 'employers/me', event_name: 'current_employer' }, Employer(this.state.employer).validate().serialize())}
                    >Save</button>
                </div>
            </form>
        </div>);
    }
}