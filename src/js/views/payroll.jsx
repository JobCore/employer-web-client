import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import { store, search, fillPayrollBlocks, updatePayroll, fetchSingle, searchMe } from '../actions.js';

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

export const PayrollPeriod = (data) => {

    const _defaults = {
        employer: null,
        id: null,
        length: 0,
        length_type: "DAYS",
        payments: [],
        starting_at: null,
        status: null,
        serialize: function(){

            const newObj = {
                employer: (!this.employer || typeof this.employer.id === 'undefined') ? this.employer : this.employer.id
            };

            return Object.assign(this, newObj);
        },
        unserialize: function(){
            const newObject = {
                //shift: (typeof this.shift != 'object') ? store.get('shift', this.shift) : Shift(this.shift).defaults().unserialize(),
            };

            return Object.assign(this, newObject);
        }

    };

    let _period = Object.assign(_defaults, data);
    return {
        get: () => {
            return _period;
        },
        validate: () => {
            const start = _period.starting_at;
            const finish = _period.ending_at;

            //if(SHIFT_POSSIBLE_STATUS.indexOf(_shift.status) == -1) throw new Error('Invalid status "'+_shift.status+'" for shift');

            return _period;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formCheckin = {
                id: _period.id.toString()
            };
            return _formCheckin;
        }
    };
};

export class ManagePayroll extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            payrollPeriods: [],
            singlePayrollPeriod: null
        };
    }

    componentDidMount(){

        const payrollPeriods = store.getState('payroll-periods');
        this.subscribe(store, 'payroll-periods', (_payrollPeriods) => {
            this.updatePayrollPeriod(_payrollPeriods);
            this.getSinglePeriod(this.props.match.params.period_id, payrollPeriods);
        });
        if(!payrollPeriods){
            searchMe('payroll-periods');
        }
        else{
            this.updatePayrollPeriod(payrollPeriods);
            this.getSinglePeriod(this.props.match.params.period_id, payrollPeriods);

        }

        this.removeHistoryListener = this.props.history.listen((data) => {
            this.getSinglePeriod(this.props.match.params.period_id);
        });
    }

    getSinglePeriod(periodId, payrollPeriods){
        if(typeof periodId !== 'undefined'){
            if(!payrollPeriods) fetchSingle("payroll-periods", periodId);
            else{
                const singlePayrollPeriod = payrollPeriods.find(pp => pp.id == periodId);
                this.setState({ singlePayrollPeriod });
            }
        }
    }

    updatePayrollPeriod(payrollPeriods){

        if(payrollPeriods == null) return;

        let singlePayrollPeriod = null;
        if(typeof this.props.match.params.period_id !== 'undefined'){
            singlePayrollPeriod = payrollPeriods.find(pp => pp.id == this.props.match.params.period_id);
        }

        this.setState({ payrollPeriods, singlePayrollPeriod: singlePayrollPeriod || null  });
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
                    {(!this.state.singlePayrollPeriod) ? '' :
                        (this.state.singlePayrollPeriod.payments.length > 0) ?
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
                                        {this.state.singlePayrollPeriod.payments.map((p, i) => (
                                            <ClockinRow key={i}
                                                payment={p}
                                                readOnly={p.status !== 'PENDING'}
                                                onChange={(clockin) => null}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                <div className="btn-bar">
                                    { !this.state.singlePayrollPeriod.status == 'APPROVED' ?
                                        <button type="button" className="btn btn-primary" onClick={() => updatePayroll(Object.assign(this.state.single_payroll_projection, { status: 'APPROVED'}))}>Approve</button>
                                        : !this.state.singlePayrollPeriod.status == 'PAID' ?
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

const ClockinRow = ({ payment, onChange, readOnly }) => {
    const clockin = Clockin(payment.clockin).defaults().unserialize();
    const shift = Shift(payment.clockin).defaults().unserialize();
    const startDate = clockin.started_at.format('MM/DD');
    const startTime = clockin.started_at.format('LT');
    const endTime = clockin.ended_at.format('LT');

    const duration = moment.duration(clockin.ended_at.diff(clockin.started_at));
    const hours = Math.round(duration.asHours() * 100) / 100;

    const shiftStartTime = shift.starting_at.format('LT');
    const shiftEndTime = shift.ending_at.format('LT');

    const shiftDuration = moment.duration(shift.ending_at.diff(shift.starting_at));
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
    payment: PropTypes.object,
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

export const SelectTimesheet = ({ catalog, formData, onChange, onSave, onCancel, history }) => (<Theme.Consumer>
    {({bar}) => (<div>
        <div className="row">
            <div className="col-12">
                <div>
                    <h2 className="mt-1">Select a payment period:</h2>
                    <Select className="select-shifts" isMulti={false}
                        value={{
                            value: null,
                            label: `Select a payment period`
                        }}
                        defaultValue={{
                            value: null,
                            label: `Select a payment period`
                        }}
                        components={{ Option: ShiftOption, SingleValue: ShiftOption }}
                        onChange={(selectedOption)=> fetchSingle("payroll-periods", selectedOption.id).then((period) => {
                            onChange({ selectedPayments: period.payments, selectedPeriod: period });
                        })}
                        options={[{
                            value: null,
                            label: `Select a payment period`
                        }].concat(formData.periods)}
                    />
                </div>
            </div>
            {(formData && typeof formData.selectedPayments != 'undefined' && formData.selectedPayments.length > 0) ?
                <div className="col-12 mt-3">
                    <ul>
                        {formData.selectedPayments.map((payment,i) => {
                            return (<EmployeeExtendedCard
                                    key={i}
                                    employee={payment.employee}
                                    showFavlist={false}
                                    showButtonsOnHover={false}
                                    onClick={() => {
                                        bar.show({
                                            to: `/payroll/period/${formData.selectedPeriod.id}?`+queryString.stringify({
                                                talent_id: payment.employee.id
                                            })
                                        });
                                    }}
                                >
                                {
                                    (payment.status === "PENDING") ?
                                        <span> pending <i className="fas fa-exclamation-triangle mr-2"></i></span>
                                        :
                                        (payment.status === "PAID") ?
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
    history: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};