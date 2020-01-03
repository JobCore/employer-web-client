import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import { store, fetchTemporal, update, updateProfileImage } from '../actions.js';
import { TIME_FORMAT, DATETIME_FORMAT, DATE_FORMAT, NOW } from '../components/utils.js';
import { validator, ValidationError } from '../utils/validation';
import Dropzone from 'react-dropzone';
import DateTime from 'react-datetime';
import moment from 'moment';
import { Button } from '../components/index';
import { DeductionExtendedCard, Theme } from '../components/index';
import PropTypes from 'prop-types';
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

export class Profile extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            employer: Employer().defaults(),
            deductions: [
                {
                    name: "deduction name",
                    deduction: 1,
                    active: true
                },
                {
                    name: "deduction name",
                    deduction: 2,
                    active: false
                },
                {
                    name: "deduction name",
                    deduction: 3,
                    active: true
                },
                {
                    name: "deduction name",
                    deduction: 4,
                    active: false
                },
                {
                    name: "deduction name",
                    deduction: 5,
                    active: true
                },
            ],
        };
    }

    setEmployer(newEmployer) {
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }

    componentDidMount() {

        fetchTemporal('employers/me', 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });

    }

    handleOnSuccess(token, metadata) {
        console.log('token: ', token);
        console.log('metadata: ', metadata);
        // send token to client server
    }

    handleOnExit() {
        // handle the case when your user exits Link
    }

    createDeduction = (data) => {
    console.log("createDeduction data: ", data);
    }
    editDeduction = (data) => {
    console.log("editDeduction data: ", data);
    }
    render() {
        const allowLevels = (window.location.search != '');
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
                        {!this.state.editingImage ?
                            <div className="company-logo" style={{ backgroundImage: `url(${this.state.employer.picture})` }}>
                                <Button color="primary" size="small" onClick={() => this.setState({ editingImage: true })} icon="pencil" />
                            </div>
                            :
                            <div>
                                <Dropzone onDrop={acceptedFiles => this.setState({ uploadCompanyLogo: acceptedFiles[0] })}>
                                    {({ getRootProps, getInputProps }) => (
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
                                    {this.state.deductions.map((deduction, i) => (
                                        <DeductionExtendedCard
                                            key={i}
                                            deduction={deduction}
                                            hover={true}
                                            onEditClick={() => bar.show({ slug: "show_create_deduction", data: {action: "edit", barFunction: this.editDeduction, ...deduction} })}>
                                            {/* <Button icon="favorite" onClick={() => bar.show({ slug: "add_to_favlist", data: s, allowLevels })}><label>Favorites</label></Button> */}
                                            {/* <Button icon="favorite" onClick={() => bar.show({ slug: "invite_talent_to_shift", data: s, allowLevels })}><label>Invite</label></Button> */}
                                        </DeductionExtendedCard>
                                    ))}
                                </span>)}
                            </Theme.Consumer>
                        </div>
                        <Theme.Consumer>
                            {({ bar }) => (
                                <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: "10px" }}
                        onClick={() => bar.show({ slug: "show_create_deduction", data: { name: "", active: false, deduction: "", action: "create", barFunction: this.createDeduction} })}
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

export class PayrollSettings extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            employer: Employer().defaults()
        };
    }

    setEmployer(newEmployer) {
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }

    componentDidMount() {

        fetchTemporal('employers/me', 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });

    }

    render() {
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

/**
 * Create deduction
 */
export const CreateDeduction = ({ onSave, onCancel, onChange, catalog, formData, error, bar }) => {
    // const creationMode = isNaN(props.formData.id);
    // const shift = props.catalog.shifts.find(s => s.id == props.formData.id);
    // if(!creationMode && (!shift || typeof shift === 'undefined')) return <div>Loading shift...</div>;
    return ( <form>
        <div className="row">
            <div className="col-6">
                <label>Name:</label>
                <input className="form-control"
                    value={formData.name}
                    onChange={(e)=> onChange({ name: e.target.value })}
                />
            </div>
            <div className="col-6">
                <label>Deduction</label>
                <input type="number" className="form-control"
                    value={formData.deduction}
                    onChange={(e)=> onChange({deduction: e.target.value})}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-1" style={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                <input type="checkbox"
                    placeholder="Active"
                    style={{ marginRight: "6px" }}
                    checked={formData.active}
                    onChange={(e)=> onChange({ active: e.target.checked})}
                />
                <label>Active </label>
            </div>
        </div>
        <div className="btn-bar">
            <button 
            type="button" 
            className="btn btn-success" 
            onClick={() => formData.barFunction(formData)}
            >
                {formData.action === "edit" ? "Save" : "Create"}
            </button>
        </div>
    </form>);
};

CreateDeduction.propTypes = {
    error: PropTypes.string,
    action: PropTypes.string,
    bar: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};