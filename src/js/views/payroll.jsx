import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import { store, search, fillPayrollBlocks, updatePayroll } from '../actions.js';

import DateTime from 'react-datetime';
import moment from 'moment';
import {DATETIME_FORMAT, NOW, TIME_FORMAT} from '../components/utils.js';

import {Shift} from './shifts.jsx';
import { EmployeeExtendedCard, ShiftCard, Stars, Theme, Button } from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const ENTITIY_NAME = 'payroll';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getPayrollInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {
        starting_at: NOW,
        ending_at: new Date().setDate(NOW.getDate() - 7)
    };
    return {
        starting_at: query.starting_at,
        ending_at: query.ending_at
    };
};

export const Clockin = (data) => {
    
    const _defaults = {
        author: null,
        employee: null,
        shift: null,
        started_at: NOW,
        ended_at: NOW,
        latitude: [],
        longitude: [],
        status: 'PENDING',
        serialize: function(){
            
            const newObj = {
            };
            
            return Object.assign(this, newObj);
        },
        unserialize: function(){
            const dataType = typeof this.started_at;
            //if its already serialized
            if((typeof this.shift == 'object') && ['number','string'].indexOf(dataType) == -1) return this;
            
            const newObject = {
                shift: (typeof this.shift != 'object') ? store.get('shift', this.shift) : Shift(this.shift).defaults().unserialize(),
                employee: (typeof this.employee != 'object') ? store.get('employees', this.employee) : this.employee,
                started_at: (!moment.isMoment(this.started_at)) ? moment(this.started_at) : this.started_at,
                ended_at: (!moment.isMoment(this.ended_at)) ? moment(this.ended_at) : this.ended_at
            };
            
            return Object.assign(this, newObject);
        }
        
    };
    
    let _checkin = Object.assign(_defaults, data);
    return {
        get: () => {
            return _checkin;
        },
        validate: () => {
            const start = _checkin.stared_at;
            const finish = _checkin.ended_at;
            
            //if(SHIFT_POSSIBLE_STATUS.indexOf(_shift.status) == -1) throw new Error('Invalid status "'+_shift.status+'" for shift');
            
            return _checkin;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formCheckin = {
                id: _checkin.id.toString(),
            };
            return _formCheckin;
        }
    };
};

export class ManagePayroll extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            single_payroll_detail: []
        };
    }
    
    componentDidMount(){
        
        this.subscribe(store, 'single_payroll_detail', (single_payroll_detail) => {
            this.setState({ single_payroll_detail });
        });
        
    }
    
    
    render() {
        const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    {(typeof this.state.single_payroll_detail.talent !== 'undefined') ?
                        <h1><span id="payroll_header">Payroll for {this.state.single_payroll_detail.talent.user.first_name} {this.state.single_payroll_detail.talent.user.last_name}</span></h1>
                        :
                        <p>Pick a timeframe and employe to review</p>
                    }
                    {(!Array.isArray(this.state.single_payroll_detail.clockins)) ? '' :
                        (this.state.single_payroll_detail.clockins.length > 0) ?
                            <div>
                                <table className="table table-striped payroll-summary">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>In</th>
                                            <th>Out</th>
                                            <th>Total</th>
                                            <th>Details</th>
                                            <th>Worked</th>
                                            <th>Scheduled</th>
                                            <th>Diff</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.single_payroll_detail.clockins.map((c, i) => (
                                            <ClockinRow key={i} 
                                                clockin={c} 
                                                shift={c.shift} 
                                                onChange={(clockin) => this.setState({ 
                                                    single_payroll_detail: Object.assign(this.state.single_payroll_detail, { 
                                                        clockins: this.state.single_payroll_detail.clockins.map((c) => (c.id == clockin.id) ? clockin : c)
                                                    })}
                                                )}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                <div className="btn-bar">
                                    <button type="button" className="btn btn-primary" onClick={() => updatePayroll(this.state.single_payroll_detail)}>Approve</button>
                                </div>
                            </div>
                            :
                            <p>No clockins to review for this period</p>
                    }
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}

const ClockinRow = ({ clockin, shift, onChange }) => {
    const startDate = clockin.started_at.format('MM/DD');
    const startTime = clockin.started_at.format('LT');
    const endTime = clockin.ended_at.format('LT');
    
    const duration = moment.duration(clockin.ended_at.diff(clockin.started_at));
    const hours = Math.round(duration.asHours() * 100) / 100;
    
    const shiftStartTime = clockin.shift.starting_at.format('LT');
    const shiftEndTime = clockin.shift.ending_at.format('LT');
    
    const shiftDuration = moment.duration(clockin.shift.ending_at.diff(clockin.shift.starting_at));
    const shiftTotalHours = Math.round(shiftDuration.asHours() * 100) / 100;
    
    const diff =  Math.round((shiftTotalHours - hours) * 100) / 100;
    
    const clockinTime = 0;
    const clockoutTime = 0;
    return <tr>
        <td>{startDate}</td>
        <td className="time">
            <TimePicker
                showSecond={false}
                defaultValue={clockin.started_at}
                format={TIME_FORMAT}
                onChange={(value) => onChange(Object.assign(clockin,{ started_at: value}))}
                use12Hours
                inputReadOnly
              />
            <small>({shiftStartTime})</small>
        </td>
        <td className="time">
            <TimePicker
                showSecond={false}
                defaultValue={clockin.ended_at}
                format={TIME_FORMAT}
                onChange={(value) => onChange(Object.assign(clockin,{ ended_at: value}))}
                use12Hours
                inputReadOnly
              />
            <small>({shiftEndTime})</small>
        </td>
        <td>{hours}</td>
        <td>{shift.position.title} at {shift.venue.title}</td>
        <td>{hours}</td>
        <td>{shiftTotalHours}</td>
        <td>{diff}</td>
    </tr>;
};
ClockinRow.propTypes = {
    shift: PropTypes.object,
    clockin: PropTypes.object,
    onChange: PropTypes.func
};

/**
 * SelectTimesheet
 */
export const SelectTimesheet = ({ catalog, formData, onChange, onSave, onCancel }) => (<Theme.Consumer>
    {({bar}) => (<div>
        <div className="row">
            <div className="col bg-dark ml-1 pt3 pb-3">
                <h3>Select a time period:</h3>
                <div className="row">
                    <div className="col-4 pr-0">
                        <DateTime 
                            timeFormat={false}
                            value={formData.starting_at}
                            onChange={(value)=>onChange({starting_at: value})}
                            placeholder="from"
                        />
                    </div>
                    <div className="col-4 pr-0 pl-0">
                        <DateTime 
                            className="picker-left"
                            timeFormat={false}
                            value={formData.ending_at}
                            onChange={(value)=>onChange({ending_at: value})}
                            placeholder="to"
                        />
                    </div>
                    <div className="col-4 pl-0">
                        <button className="btn btn-primary" 
                            onClick={() => search(ENTITIY_NAME, window.location.search).then((data) => 
                                bar.show({ slug: "filter_timesheet", data: Object.assign({employees: data}, formData) })
                            )}
                        >Apply</button>
                    </div>
                </div>
            </div>
            {(formData && typeof formData.employees != 'undefined' && formData.employees.length > 0) ? 
                <div className="col-12 mt-3">
                    <ul>
                        {formData.employees.map((em,i) => (
                            <EmployeeExtendedCard 
                                key={i} 
                                employee={em.talent} 
                                hover={false} 
                                showFavlist={false}
                                onClick={() => fillPayrollBlocks(em)}
                            />
                        ))}
                    </ul>
                </div>
                :
                <div className="col-12 mt-3">No talents found for this period</div>
            }
        </div>
    </div>)}
</Theme.Consumer>);
SelectTimesheet.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};