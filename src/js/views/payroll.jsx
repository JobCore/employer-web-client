import React, {useState, useEffect} from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import { store, search, update, fetchSingle, searchMe, hook } from '../actions.js';

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

    let _payment = Object.assign(_defaults, data);
    return {
        get: () => {
            return _payment;
        },
        validate: () => {
            const start = _payment.starting_at;
            const finish = _payment.ending_at;

            //if(SHIFT_POSSIBLE_STATUS.indexOf(_shift.status) == -1) throw new Error('Invalid status "'+_shift.status+'" for shift');

            return _payment;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formCheckin = {
                id: _payment.id.toString()
            };
            return _formCheckin;
        }
    };
};

export const Payment = (data) => {

    const _defaults = {
        //employer: null,
        //id: null,
        serialize: function(){

            const newObj = {
                id: this.id,
                regular_hours: this.regular_hours,
                over_time: this.over_time,
                hourly_rate: this.hourly_rate,
                total_amount: this.total_amount,
                status: this.status,
                splited_payment: this.splited_payment,
                payroll_period: (!this.employer || typeof this.employer.id === 'undefined') ? this.employer : this.employer.id,
                employer: (!this.employer || typeof this.employer.id === 'undefined') ? this.employer : this.employer.id,
                employee: (!this.employee || typeof this.employee.id === 'undefined') ? this.employee : this.employee.id,
                shift: (!this.shift || typeof this.shift.id === 'undefined') ? this.shift : this.shift.id,
                clockin: (!this.clockin || typeof this.clockin.id === 'undefined') ? this.clockin : this.clockin.id
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

    let _payment = Object.assign(_defaults, data);
    return {
        get: () => {
            return _payment;
        },
        validate: () => {
            //if(SHIFT_POSSIBLE_STATUS.indexOf(_shift.status) == -1) throw new Error('Invalid status "'+_shift.status+'" for shift');
            return _payment;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _form = {
                id: _payment.id.toString()
            };
            return _form;
        }
    };
};

export class ManagePayroll extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            payrollPeriods: [],
            payments: [],
            singlePayrollPeriod: null
        };
    }

    componentDidMount(){

        const payrollPeriods = store.getState('payroll-periods');
        this.subscribe(store, 'payroll-periods', (_payrollPeriods) => {
            this.updatePayrollPeriod(_payrollPeriods);
            //if(!this.state.singlePayrollPeriod) this.getSinglePeriod(this.props.match.params.period_id, payrollPeriods);
        });
        if(!payrollPeriods){
            searchMe('payroll-periods');
        }
        else{
            this.updatePayrollPeriod(payrollPeriods);
            this.getSinglePeriod(this.props.match.params.period_id, payrollPeriods);

        }

        this.removeHistoryListener = this.props.history.listen((data) => {
            const period = /\/payroll\/period\/(\d+)/gm;
            const periodMatches = period.exec(data.pathname);
            // const search = /\?talent_id=(\d+)/gm;
            // const searchMatches = search.exec(data.search);
            if(periodMatches) this.getSinglePeriod(periodMatches[1]);
        });
    }

    groupPayments(singlePeriod){
        if(!singlePeriod) return null;

        let groupedPayments = {};
        singlePeriod.payments.forEach(pay => {
            if(typeof groupedPayments[pay.employee.id] === 'undefined'){
                groupedPayments[pay.employee.id] = { employee: pay.employee, payments: [] };
            }
            groupedPayments[pay.employee.id].payments.push(pay);
        });

        return Object.values(groupedPayments);
    }

    getSinglePeriod(periodId, payrollPeriods){
        if(typeof periodId !== 'undefined'){
            if(!payrollPeriods) fetchSingle("payroll-periods", periodId);
            else{
                const singlePayrollPeriod = payrollPeriods.find(pp => pp.id == periodId);
                this.setState({ singlePayrollPeriod, payments: this.groupPayments(singlePayrollPeriod) });
            }
        }
    }

    updatePayrollPeriod(payrollPeriods){

        if(payrollPeriods == null) return;

        let singlePayrollPeriod = null;
        if(typeof this.props.match.params.period_id !== 'undefined'){
            singlePayrollPeriod = payrollPeriods.find(pp => pp.id == this.props.match.params.period_id);
        }

        this.setState({ payrollPeriods, singlePayrollPeriod: singlePayrollPeriod || null, payments: this.groupPayments(singlePayrollPeriod)  });
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
                        : this.state.singlePayrollPeriod ?
                            <h2>Period {this.state.singlePayrollPeriod.label}</h2>
                            :
                            <p>Pick a timeframe and employe to review</p>
                    }
                    {(!this.state.singlePayrollPeriod) ? '' :
                        (this.state.singlePayrollPeriod.payments.length > 0) ?
                            <div>
                                {this.state.payments.map(pay =>
                                    <table key={pay.employee.id} className="table table-striped payroll-summary">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <EmployeeExtendedCard
                                                        className="pr-2"
                                                        employee={pay.employee}
                                                        showFavlist={false}
                                                        hoverEffect={false}
                                                        showButtonsOnHover={false}
                                                        onClick={() => null}
                                                    />
                                                </th>
                                                <th>In</th>
                                                <th>Out</th>
                                                <th>Total</th>
                                                <th>Worked</th>
                                                <th>Scheduled</th>
                                                <th>Diff</th>
                                                <th style={{ minWidth: "80px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { pay.payments.map(p =>
                                                <PaymentRow key={p.id}
                                                    payment={p}
                                                    readOnly={p.status !== 'PENDING'}
                                                    onApprove={(payment) => update("payment", {
                                                        //serialization for updating the payment
                                                        status: "APPROVED",
                                                        id: p.id,
                                                        regular_hours: payment.regular_hours,
                                                        over_time: payment.over_time,
                                                        hourly_rate: payment.hourly_rate,
                                                        total_amount: payment.total_amount
                                                    })}
                                                />
                                            )}
                                        </tbody>
                                    </table>
                                )}
                                <div className="btn-bar text-right">
                                    { this.state.singlePayrollPeriod.status === 'OPEN' ?
                                        <button type="button" className="btn btn-primary" onClick={() => update('payroll-periods',Object.assign(this.state.singlePayrollPeriod, { status: 'APPROVED'}))}>Approve Period</button>
                                        : this.state.singlePayrollPeriod.status == 'APPROVED' ?
                                            <button type="button" className="btn btn-primary" onClick={() => update('payroll-periods',Object.assign(this.state.singlePayrollPeriod, { status: 'PAID'}))}> Mark as PAID</button>
                                            : this.state.singlePayrollPeriod.status
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

const PaymentRow = ({ payment, onApprove, readOnly }) => {

    const [ clockin, setClockin ] = useState(Clockin(payment.clockin).defaults().unserialize());

    useEffect(() => {
        // check for updates on the payments
    }, []);

    const shift = Shift(payment.shift).defaults().unserialize();

    const startTime = clockin.started_at.format('LT');
    const endTime = clockin.ended_at.format('LT');

    const duration = moment.duration(clockin.ended_at.diff(clockin.started_at));
    const hours = Math.round(duration.asHours() * 100) / 100;

    const shiftStartTime = shift.starting_at.format('LT');
    const shiftEndTime = shift.ending_at.format('LT');

    const shiftDuration = moment.duration(shift.ending_at.diff(shift.starting_at));
    const shiftTotalHours = Math.round(shiftDuration.asHours() * 100) / 100;

    const diff =  Math.round((shiftTotalHours - hours) * 100) / 100;
    return <tr>
        <td><ShiftCard className="p-0 pl-2" shift={shift} /></td>
        <td className="time">
            { readOnly ?
                <p>{startTime}</p>
                :
                <TimePicker
                    showSecond={false}
                    defaultValue={clockin.started_at}
                    format={TIME_FORMAT}
                    onChange={(value) => {
                        const _c = Object.assign({},clockin,{ started_at: value});
                        setClockin(_c);
                    }}
                    value={clockin.started_at}
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
                    onChange={(value) => setClockin(Object.assign({},clockin,{ ended_at: value}))}
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
        <td>
            {readOnly ?
                payment.status === "APPROVED" && <i className="fas fa-check-circle"></i>
                :
                <Button
                    color="success"
                    size="small"
                    onClick={(value) => onApprove({
                        regular_hours: hours > shiftTotalHours ? shiftTotalHours : hours,
                        over_time: diff < 0 ? 0 : diff
                    })}
                >Approve</Button>
            }
        </td>
    </tr>;
};
PaymentRow.propTypes = {
    payment: PropTypes.object,
    readOnly: PropTypes.bool,
    onApprove: PropTypes.func
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
    {({bar}) => {
        let note = null;
        if(formData.periods.length > 0){
            const end = moment(formData.periods[0].ending_at);
            end.add(7,'days');
            if(end.isBefore(NOW())) note = "Payroll was generated until "+end.format('MM dd');
        }
        return (<div>
            <div className="top-bar">
                <Button
                        icon="sync" color="primary" size="small" rounded={true}
                        onClick={() => hook('generate_periods').then(() => searchMe('payroll-periods'))}
                        note={note}
                        notePosition="left"
                    />

            </div>
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
                            onChange={(selectedOption)=> searchMe("payment", `?period=${selectedOption.id}`).then((payments) => {
                                onChange({ selectedPayments: payments, selectedPeriod: selectedOption });
                                history.push(`/payroll/period/${selectedOption.id}`);
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
        </div>);}}
</Theme.Consumer>);
SelectTimesheet.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};