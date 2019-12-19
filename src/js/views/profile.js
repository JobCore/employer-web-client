import React, { useState, useContext, useEffect } from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import {store, fetchTemporal, update, updateProfileImage, searchMe, remove } from '../actions.js';
import {TIME_FORMAT, DATETIME_FORMAT, DATE_FORMAT, NOW} from '../components/utils.js';
import {Button, Theme, GenericCard, Avatar} from '../components/index';
import {Notify} from 'bc-react-notifier';
import {Session} from 'bc-react-session';
import {validator, ValidationError} from '../utils/validation';
import Dropzone from 'react-dropzone';
import DateTime from 'react-datetime';
import moment from 'moment';

export const Employer = (data={}) => {

    const _defaults = {
        title: undefined,
        website: undefined,
        payroll_period_starting_time: NOW(),
        maximum_clockout_delay_minutes: 0,
        bio: undefined,
        uploadCompanyLogo: null,
        editingImage: false,
        response_time: undefined,
        rating: undefined,
        retroactive: undefined,
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
            if(_employer.bio && validator.isEmpty(_employer.bio)) throw new ValidationError('The company bio cannot be empty');
            if(_employer.title && validator.isEmpty(_employer.title)) throw new ValidationError('The company name cannot be empty');
            if(_employer.website && validator.isEmpty(_employer.website)) throw new ValidationError('The company website cannot be empty');
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

        let employer = store.getState('current_employer');
        if(!employer) fetchTemporal('employers/me', 'current_employer');
        else this.setState({ employer });

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
                        <label>Company Logo</label>
                        { !this.state.editingImage ?
                            <div className="company-logo" style={{ backgroundImage: `url(${this.state.employer.picture})`}}>
                                <Button color="primary" size="small" onClick={() => this.setState({ editingImage: true })} icon="pencil" />
                            </div>
                            :
                            <div>
                                <Dropzone onDrop={acceptedFiles => this.setState({ uploadCompanyLogo: acceptedFiles[0] })}>
                                    {({getRootProps, getInputProps}) => (
                                        <section className="upload-zone">
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <p>Drop your company logo here, or click me to open the file browser</p>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                                <Button onClick={() => this.setState({ editingImage: false })} color="secondary">Cancel</Button>
                                <Button onClick={() => updateProfileImage(this.state.uploadCompanyLogo)} color="success">Save</Button>
                            </div>
                        }
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
                        onClick={() => update({ path: 'employers/me', event_name: 'current_employer' }, Employer(this.state.employer).validate().serialize()).catch(e => Notify.error(e.message || e))}
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

        let employer = store.getState('current_employer');
        if(!employer) fetchTemporal('employers/me', 'current_employer');
        else this.setState({ employer });
        
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });

    }

    render() {

        if(!this.state.employer) return "Loading...";

        const autoClockout = this.state.employer.maximum_clockout_delay_minutes == null ? false : true;

        const weekday = this.state.employer.payroll_period_starting_time.isoWeekday();
        let nextDate = this.state.employer.payroll_period_starting_time.clone();
        while(nextDate.isBefore(NOW())) nextDate = nextDate.add(7,'days');

        return (<div className="p-1 listcontents company-payroll-settings">
            <h1><span id="company_details">Your Payroll Settings</span></h1>
            <div className="row mt-4">
                <div className="col-12">
                    {nextDate && <h4>Next payroll will run on {nextDate.format("dddd, MMMM Do YYYY, h:mm a")}</h4>}
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
                            onChange={(e)=> {
                                const diff = (e.target.value - weekday);
                                let newDate =  this.state.employer.payroll_period_starting_time.clone().add(diff, 'days');
                                this.setEmployer({
                                    payroll_period_starting_time: newDate
                                });
                            }}
                        >
                            <option value={1}>Monday{"s"}</option>
                            <option value={2}>Tuesday{"s"}</option>
                            <option value={3}>Wednesday{"s"}</option>
                            <option value={4}>Thursday{"s"}</option>
                            <option value={5}>Friday{"s"}</option>
                            <option value={6}>Saturday{"s"}</option>
                            <option value={7}>Sunday{"s"}</option>
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
                <h2 className="mt-4 mb-2">Time clock settings</h2>
                <div className="row">
                    <div className="col-12">
                        <label className="d-block">When can talents start clocking in?</label>
                        <select
                            value={this.state.employer.maximum_clockin_delta_minutes}
                            className="form-control" style={{ width: "100px", display: "inline-block" }}
                            onChange={(e) => this.setEmployer({ maximum_clockin_delta_minutes: isNaN(e.target.value) ? null : e.target.value, timeclock_warning: true })}
                        >
                            <option value={null}>Anytime</option>
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
                        <label className="d-block">Do you want automatic clock out?</label>
                        <select value={autoClockout} className="form-control" style={{ width: "300px", display: "inline-block" }} onChange={(e) => {
                            this.setEmployer({ maximum_clockout_delay_minutes: e.target.value == 'true' ? 10 : null });
                        }}>
                            <option value={true}>Yes, clock out when the shift ends (talents still can clock out before that time).</option>
                            <option value={false}>No, leave the shift active forever or until the talent clocks out</option>
                        </select>
                        { !autoClockout ? '':
                        <span>
                            , wait
                            <input type="number" style={{width: "100px"}} className="form-control d-inline-block ml-2 mr-2"
                                value={this.state.employer.maximum_clockout_delay_minutes}
                                onChange={(e) => this.setEmployer({ maximum_clockout_delay_minutes: e.target.value, timeclock_warning: true })}
                            />
                            min to auto clock out
                        </span>
                        }
                    </div>
                </div>
                { this.state.employer.timeclock_warning &&
                    <div className="alert alert-warning p-2 mt-3">
                        Apply time clock settings to:
                        <select
                            value={this.state.employer.retroactive}
                            className="form-control w-100" style={{ width: "100px", display: "inline-block" }}
                            onChange={(e) => this.setEmployer({ retroactive: e.target.value === "true" ? true : false })}
                            >
                            <option value={false}>Only new shifts (from now on)</option>
                            <option value={true}>All shifts (including previously created)</option>
                        </select>
                    </div>
                }
                <div className="mt-4 text-right">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            update({ path: 'employers/me', event_name: 'current_employer' }, Employer({ ...this.state.employer, id: undefined }).validate().serialize())
                                .catch(e => Notify.error(e.message || e));
                        }}
                    >Save</button>
                </div>
            </form>
        </div>);
    }
}

export class ManageUsers extends Flux.DashView{

    constructor(){
        super();
        this.state = {
            companyUsers: [],
            currentUser: Session.getPayload().user.profile
        };
    }

    componentDidMount(){

        const users = store.getState('users');
        this.subscribe(store, 'users', (_users) => {
            this.setState({ companyUsers: _users, currentUser: Session.getPayload().user.profile });
        });
        if(users) this.setState({ companyUsers: users, currentUser: Session.getPayload().user.profile });
        else searchMe('users');
    
        this.props.history.listen(() => {
            this.filter();
            this.setState({ firstSearch: false });
        });
    }

    filter(users=null){
        searchMe('users', window.location.search);
    }

    render(){
        const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    <h1>Company Users</h1>
                    {this.state.companyUsers.map((u,i) => (
                        <GenericCard key={i} hover={true}>
                            <Avatar url={u.profile.picture} />
                            <div className="btn-group">
                                { u.profile.employer_role != 'ADMIN' &&
                                    <Button onClick={() => {
                                        if(this.state.currentUser.id === u.profile.id) Notify.error('You cannot delete yourself');
                                        const noti = Notify.info("Are you sure you want to make this person an admin?",(answer) => {
                                            if(answer) update('users', { id: u.profile.id, employer_role: 'ADMIN' });
                                            noti.remove();
                                        });
                                    }}>make admin</Button>
                                }
                                <Button icon="trash" onClick={() => {
                                    if(this.state.currentUser.id === u.profile.id) Notify.error('You cannot delete yourself');
                                    const noti = Notify.info("Are you sure you want to delete this user?",(answer) => {
                                        if(answer) remove('users', u.profile);
                                        noti.remove();
                                    });
                                }}></Button>
                            </div>
                            <p className="mt-2">{u.first_name} {u.last_name} ({u.profile.employer_role})</p>
                        </GenericCard>
                    ))}
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}