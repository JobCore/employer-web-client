import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import { store, search, fillPayrollBlocks, updatePayroll } from '../actions.js';

import DateTime from 'react-datetime';
import moment from 'moment';
import {DATETIME_FORMAT, NOW, TIME_FORMAT} from '../components/utils.js';
import Select from 'react-select';

import {Shift} from './shifts.jsx';
import { EmployeeExtendedCard, ShiftOption, ShiftCard, Theme, Button } from '../components/index';
import queryString from 'query-string';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const ENTITIY_NAME = 'payroll';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getPayrollInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {
        starting_at: NOW(),
        ending_at: new Date().setDate(NOW().getDate() - 7)
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
        started_at: NOW(),
        ended_at: NOW(),
        latitude: [],
        longitude: [],
        status: 'PENDING',
        serialize: function(){
            
            const newObj = {
                shift: (!this.shift || typeof this.shift.id === 'undefined') ? this.shift : this.shift.id,
                employee: (!this.employee || typeof this.employee.id === 'undefined') ? this.employee : this.employee.id
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
                id: _checkin.id.toString()
            };
            return _formCheckin;
        }
    };
};

export class ManagePayroll extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            single_payroll_projection: []
        };
    }
    
    componentDidMount(){
        
        this.setState({ single_payroll_projection: store.getState('payment_period') });
        this.subscribe(store, 'single_payroll_projection', (single_payroll_projection) => {
            this.setState({ single_payroll_projection });
        });
        
    }
    
    
    render() {
        //const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    {(this.state.single_payroll_projection && typeof this.state.single_payroll_projection.employee !== 'undefined') ?
                        <h1>
                            <span id="payroll_header">Payroll for {this.state.single_payroll_projection.employee.user.first_name} {this.state.single_payroll_projection.employee.user.last_name}</span> {' '}
                            {
                                (this.state.single_payroll_projection.paid) ?
                                    <i className="fas fa-dollar-sign"></i>
                                    : (this.state.single_payroll_projection.approved) ?
                                        <i className="fas fa-check-circle mr-2"></i>
                                        :''
                            }
                        </h1>
                        :
                        <p>Pick a timeframe and employe to review</p>
                    }
                    {(!this.state.single_payroll_projection || !Array.isArray(this.state.single_payroll_projection.clockins)) ? '' :
                        (this.state.single_payroll_projection.clockins.length > 0) ?
                            <div>
                                <table className="table table-striped payroll-summary">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Details</th>
                                            <th>In</th>
                                            <th>Out</th>
                                            <th>Total</th>
                                            <th>Worked</th>
                                            <th>Scheduled</th>
                                            <th>Diff</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.single_payroll_projection.clockins.map((c, i) => (
                                            <ClockinRow key={i} 
                                                clockin={c} 
                                                readOnly={c.status !== 'PENDING'}
                                                shift={c.shift} 
                                                onChange={(clockin) => this.setState({ 
                                                    single_payroll_projection: Object.assign(this.state.single_payroll_projection, { 
                                                        clockins: this.state.single_payroll_projection.clockins.map((c) => (c.id == clockin.id) ? clockin : c)
                                                    })}
                                                )}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                <div className="btn-bar">
                                    { !this.state.single_payroll_projection.approved ? 
                                        <button type="button" className="btn btn-primary" onClick={() => updatePayroll(Object.assign(this.state.single_payroll_projection, { status: 'APPROVED'}))}>Approve</button>
                                        : !this.state.single_payroll_projection.paid ? 
                                            <button type="button" className="btn btn-primary" onClick={() => updatePayroll(Object.assign(this.state.single_payroll_projection, { status: 'PAID'}))}> Mark as PAID</button>
                                            :''
                                    }
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

const ClockinRow = ({ clockin, shift, onChange, readOnly }) => {
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
        <td>
            {!readOnly ? 
                <input type="checkbox" 
                    checked={clockin.selected} 
                    onClick={(value) => onChange(Object.assign(clockin,{ selected: !clockin.selected }))}
                />:''
            }
        </td>
        <td><ShiftCard className="p-0" shift={shift} /></td>
        <td className="time">
            { readOnly ? 
                <p>{startTime}</p>
                :
                <TimePicker
                    showSecond={false}
                    defaultValue={clockin.started_at}
                    format={TIME_FORMAT}
                    onChange={(value) => onChange(Object.assign(clockin,{ started_at: value}))}
                    use12Hours
                    inputReadOnly
                  />
            }
            <small>({shiftStartTime})</small>
        </td>
        <td className="time">
            { readOnly ? 
                <p>{endTime}</p>
                :
                <TimePicker
                    showSecond={false}
                    defaultValue={clockin.ended_at}
                    format={TIME_FORMAT}
                    onChange={(value) => onChange(Object.assign(clockin,{ ended_at: value}))}
                    use12Hours
                    inputReadOnly
                  />
            }
            <small>({shiftEndTime})</small>
        </td>
        <td>{hours}</td>
        <td>{hours}</td>
        <td>{shiftTotalHours}</td>
        <td>{diff}</td>
    </tr>;
};
ClockinRow.propTypes = {
    shift: PropTypes.object,
    clockin: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
};

/**
 * SelectTimesheet
 */
 
const filterClockins = (formChanges, formData, onChange) => {
    onChange(Object.assign(formChanges, {employees: [], loading: true }));
    
    const query = queryString.stringify({
        starting_at: formChanges.starting_at ? formChanges.starting_at.format('YYYY-MM-DD') : null,
        ending_at: formChanges.ending_at ? formChanges.ending_at.format('YYYY-MM-DD') : null,
        shift: formData.shift ? formData.shift.id || formData.shift.id : ''
    });
    search(ENTITIY_NAME, '?'+query).then((data) => 
        onChange({employees: data, loading: false })
    );
};

const payrollPeriods = (() => {
    let end = moment().subtract(360, "days").startOf('week');
    let payrollPeriods = [];
    while(moment().isAfter(end)){
        const start = end.clone();
        end = end.clone().add(7,"days");
        payrollPeriods.push({
            value: {
                starting_at: start,
                ending_at: end
            },
            label: `From ${start.format('MMM Do YY')} to ${end.format('MMM Do YY')}`
        });
    }
    return payrollPeriods;
})();
 
export const SelectTimesheet = ({ catalog, formData, onChange, onSave, onCancel }) => (<Theme.Consumer>
    {({bar}) => (<div>
        <div className="row">
            <div className="col-12">
                <h2>{"Search for employee clockins:"}</h2>
                <Select className="select-shifts" isMulti={false}
                    value={ formData.shift ? { value: formData.shift, label: (formData.shift == 'time-period') ? 'Specify a time period' : '' } : null }
                    defaultValue={ formData.shift ? { value: formData.shift, label: (formData.shift == 'time-period') ? 'Specify a time period' : '' } : null }
                    components={{ Option: ShiftOption, SingleValue: ShiftOption }}
                    onChange={(selectedOption)=> filterClockins({ shift: Array.isArray(selectedOption) && selectedOption.length==0 ? null : selectedOption.value }, formData, onChange)}
                    options={[{ value: 'time-period', label: 'Specify a Payroll Period' }].concat(catalog.shifts.filter(s => !['COMPLETED', 'DRAFT', 'CANCELLED'].includes(s.status)).map(item => ({ value: item, label: '' })))}
                />
                { formData.shift !== 'time-period' ? '': <div>
                    <strong className="mt-1">Searching for this date range:</strong>
                    <Select className="select-shifts" isMulti={false}
                        value={{
                            value: {
                                starting_at: formData.starting_at,
                                ending_at: formData.ending_at
                            },
                            label: `From ${formData.starting_at.format('MMM Do Y')} to ${formData.ending_at.format('MMM Do Y')}`
                        }}
                        defaultValue={payrollPeriods[0]}
                        components={{ Option: ShiftOption, SingleValue: ShiftOption }}
                        onChange={(selectedOption)=> filterClockins({
                            starting_at: selectedOption.value.starting_at,
                            ending_at: selectedOption.value.ending_at
                        }, formData, onChange)}
                        options={payrollPeriods}
                    />
                    {/*
                    <div className="row pl-3 pr-3">
                        <div className="col-6 p-0">
                            <DateTime 
                                timeFormat={false}
                                value={formData.starting_at}
                                onChange={(value)=> filterClockins({starting_at: value}, formData, onChange)}
                                placeholder="from"
                                isValidDate={(current) => current.isBefore( formData.ending_at )}
                            />
                        </div>
                        <div className="col-6 p-0">
                            <DateTime 
                                className="picker-left"
                                timeFormat={false}
                                value={formData.ending_at}
                                onChange={(value)=> filterClockins({ending_at: value}, formData, onChange)}
                                placeholder="to"
                                isValidDate={(current) => current.isBefore( moment() ) && current.isAfter( formData.starting_at ) }
                            />
                        </div>
                    </div>
                    */}
                </div>
                }
            </div>
            {(formData && typeof formData.employees != 'undefined' && formData.employees.length > 0) ? 
                <div className="col-12 mt-3">
                    <ul>
                        {formData.employees.map((block,i) => {
                        
                            var approved = true;
                            var paid = true;
                            block.clockins.forEach(b => {
                                if (b.status == 'PENDING'){
                                    approved = false;
                                    paid = false;
                                } 
                                else if (b.status != 'PAID') paid = false;
                            });
                            return (<EmployeeExtendedCard 
                                    key={i} 
                                employee={block.talent} 
                                showFavlist={false}
                                showButtonsOnHover={false}
                                onClick={() => {
                                    fillPayrollBlocks(block);
                                    bar.show({
                                        to: "/payroll?"+queryString.stringify({
                                            starting_at: formData.shift ? '' : formData.starting_at.format('YYYY-MM-DD'),
                                            talent_id: block.talent.id,
                                            shift: formData.shift ? formData.shift.id : ''
                                        })
                                    });
                                }}
                            >
                                {
                                    (!approved) ?
                                        <span> pending <i className="fas fa-exclamation-triangle mr-2"></i></span>
                                        :
                                        (!paid) ?
                                            <span> unpaid <i className="fas fa-dollar-sign mr-2"></i></span>
                                            :
                                            <i className="fas fa-check-circle mr-2"></i>
                                }
                            </EmployeeExtendedCard>);
                        })}
                    </ul>
                </div>
                : (typeof formData.loading !== 'undefined' && formData.loading) ?
                    <div className="col-12 mt-3 text-center">Loading...</div>
                    :
                    <div className="col-12 mt-3 text-center">No talents found for this period or shift</div>
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