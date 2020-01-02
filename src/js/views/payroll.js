import React, {useState, useEffect, useContext} from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import { store, search, update, fetchSingle, searchMe, processPendingPayrollPeriods, updatePayments, createPayment } from '../actions.js';
import {GET} from '../utils/api_wrapper';

import DateTime from 'react-datetime';
import moment from 'moment';
import {DATETIME_FORMAT, NOW, TIME_FORMAT} from '../components/utils.js';
import Select from 'react-select';

import {Notify} from 'bc-react-notifier';

import {Shift} from './shifts.js';
import { EmployeeExtendedCard, ShiftOption, ShiftCard, Theme, Button, ShiftOptionSelected, GenericCard, SearchCatalogSelect, Toggle } from '../components/index';
import queryString from 'query-string';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

import GoogleMapReact from 'google-map-react';
import markerURL from '../../img/marker.png';

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
                started_at: this.started_at && !moment.isMoment(this.started_at) ? moment(this.started_at) : this.started_at,
                ended_at: this.ended_at && !moment.isMoment(this.ended_at) ? moment(this.ended_at) : this.ended_at
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
            employer: store.getState('current_employer'),
            payrollPeriods: [],
            payments: [],
            singlePayrollPeriod: null
        };
    }

    componentDidMount(){

        this.subscribe(store, 'current_employer', (employer) => this.setState({ employer }));

        const payrollPeriods = store.getState('payroll-periods');
        this.subscribe(store, 'payroll-periods', (_payrollPeriods) => {
            this.updatePayrollPeriod(_payrollPeriods);
            if(this.props.match.params.period_id) this.getSinglePeriod(this.props.match.params.period_id, _payrollPeriods);
        });
        if(!payrollPeriods && this.props.match.params.period_id) searchMe('payroll-periods');

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
        if(!this.state.employer) return "Loading...";
        else if(!this.state.employer.payroll_configured || !moment.isMoment(this.state.employer.payroll_period_starting_time)){
            return <div className="p-1 listcontents text-center">
                <h3>Please setup your payroll settings first.</h3>
                <Button color="success" onClick={() => this.props.history.push("/payroll-settings")}>Setup Payroll Settings</Button>
            </div>;
        }

        //const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    {(this.state.single_payroll_projection && typeof this.state.single_payroll_projection.employee !== 'undefined') ?
                        <h1>
                            <span id="payroll_header">Payroll for {this.state.single_payroll_projection.employee.user.last_name}, {this.state.single_payroll_projection.employee.user.first_name}</span> {' '}
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
                    { this.state.singlePayrollPeriod && <div>
                        <p className="text-right">
                            { this.state.singlePayrollPeriod.status != "OPEN" ? 
                                <Button className="btn btn-info" onClick={() => this.props.history.push('/payroll/report/'+this.state.singlePayrollPeriod.id)}>Take me to the Payroll Report</Button>
                                :
                                <Button icon="plus" size="small" onClick={() => {
                                    const period = { 
                                        ...this.state.singlePayrollPeriod, 
                                        payments: this.state.singlePayrollPeriod.payments.concat([Payment({ status: "NEW", employee: { id: 'new' } }).defaults()])
                                    };
                                    this.setState({ singlePayrollPeriod: period, payments: this.groupPayments(period) });
                                }}>Add employee to timesheet</Button>
                            }
                        </p>
                        { this.state.singlePayrollPeriod.payments.length == 0 ?
                            <p>No clockins to review for this period</p>
                            :
                            this.state.payments.sort((a,b) => 
                                a.employee.id === "new" ? -1 :
                                    b.employee.id === "new" ? 1 :
                                        a.employee.user.last_name.toLowerCase() > b.employee.user.last_name.toLowerCase() ? 1 : -1
                                ).map(pay => {
                                const total_hours = pay.payments.reduce((total, current) => !isNaN(current.regular_hours) ? total + (parseFloat(current.regular_hours) + parseFloat(current.over_time)) : total, 0);
                                const total_amount = pay.payments.reduce((total, current) => !isNaN(current.total_amount) ? total + parseFloat(current.total_amount) : total, 0);
                                return <table key={pay.employee.id} className="table table-striped payroll-summary">
                                    <thead>
                                        <tr>
                                            <th>
                                                { !pay.employee || pay.employee.id === "new" ?
                                                    <SearchCatalogSelect
                                                        onChange={(selection)=> {
                                                            const _alreadyExists = !Array.isArray(this.state.payments) ? false : this.state.payments.find(p => p.employee.id === selection.value);
                                                            if(_alreadyExists) Notify.error(`${selection.label} is already listed on this timesheet`);
                                                            else GET('employees/'+selection.value)
                                                                .then(emp => {
                                                                    const period = { 
                                                                        ...this.state.singlePayrollPeriod, 
                                                                        payments: this.state.singlePayrollPeriod.payments.map(p => {
                                                                            if(p.employee.id != "new") return p;
                                                                            else return Payment({ status: "NEW", employee: emp }).defaults();
                                                                        })
                                                                    };
                                                                    this.setState({ singlePayrollPeriod: period, payments: this.groupPayments(period) });
                                                                })
                                                                .catch(e => Notify.error(e.message || e));
                                                        }}
                                                        searchFunction={(search) => new Promise((resolve, reject) =>
                                                            GET('catalog/employees?full_name='+search)
                                                                .then(talents => resolve([
                                                                    { label: `${(talents.length==0) ? 'No one found: ':''}Invite "${search}" to jobcore`, value: 'invite_talent_to_jobcore' }
                                                                ].concat(talents)))
                                                                .catch(error => reject(error))
                                                        )}
                                                    />
                                                    :
                                                    <EmployeeExtendedCard
                                                        className="pr-2"
                                                        employee={pay.employee}
                                                        showFavlist={false}
                                                        hoverEffect={false}
                                                        showButtonsOnHover={false}
                                                        onClick={() => null}
                                                    />
                                                }
                                            </th>
                                            <th>In</th>
                                            <th>Out</th>
                                            <th>Total</th>
                                            <th>Break</th>
                                            <th>With <br /> Break</th>
                                            <th>Diff</th>
                                            <th style={{ minWidth: "80px" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { pay.payments.map(p =>
                                            <PaymentRow key={p.id}
                                                payment={p}
                                                period={this.state.singlePayrollPeriod}
                                                employee={pay.employee}
                                                readOnly={p.status !== 'PENDING' && p.status !== 'NEW'}
                                                onApprove={(payment) => {
                                                    p.status !== 'NEW' ?
                                                        updatePayments({
                                                            //serialization for updating the payment
                                                            ...payment,
                                                            status: "APPROVED",
                                                            id: p.id
                                                        }, this.state.singlePayrollPeriod)
                                                    :
                                                        createPayment({
                                                            ...payment,
                                                            status: "APPROVED",
                                                            payroll_period: this.state.singlePayrollPeriod.id
                                                        }, this.state.singlePayrollPeriod);
                                                }}
                                                onUndo={(payment) => updatePayments({ 
                                                    ...payment, 
                                                    status: "PENDING", 
                                                    id: p.id 
                                                }, this.state.singlePayrollPeriod)}
                                                onReject={(payment) => {
                                                    if(p.id === undefined) this.setState({ 
                                                        payments: this.state.payments.map(_pay => {
                                                            if(_pay.employee.id !== pay.employee.id) return _pay;
                                                            else{
                                                                return {
                                                                    ..._pay,
                                                                    payments: _pay.payments.filter(p => p.id != undefined)
                                                                };
                                                            }
                                                        }) 
                                                    });
                                                    else updatePayments({ id: p.id, status: "REJECTED" }, this.state.singlePayrollPeriod);
                                                }}
                                            />
                                        )}
                                        <tr>
                                            <td colSpan={5}>
                                                { this.state.singlePayrollPeriod.status === 'OPEN' && pay.employee.id !== "new" &&
                                                    <Button icon="plus" size="small" onClick={() => this.setState({ payments: this.state.payments.map(_pay => {
                                                        if(_pay.employee.id !== pay.employee.id) return _pay;
                                                        else{
                                                            return {
                                                                ..._pay,
                                                                payments: _pay.payments.concat([Payment({ status: "NEW" }).defaults()])
                                                            };
                                                        }
                                                    })})}>Add new clockin</Button>
                                                }
                                            </td>
                                            <td colSpan={3} className="text-right">
                                                Total: {Math.round(total_hours * 100) / 100} hr
                                                <small className="d-block">${Math.round(total_amount * 100) / 100}</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>;
                            })}
                        <div className="btn-bar text-right">
                            { this.state.singlePayrollPeriod.status === 'OPEN' ?
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    const unapproved = [].concat.apply([], this.state.payments.map(p => p.payments)).find(p => p.status === "PENDING");
                                    if(unapproved) Notify.error("There are still some payments that need to be approved or rejected");
                                    else update('payroll-periods',Object.assign(this.state.singlePayrollPeriod, { status: 'FINALIZED'}))
                                            .catch(e => Notify.error(e.message || e));
                                }}>Finalize Period</button>
                                :
                                <Button className="btn btn-success" onClick={() => this.props.history.push('/payroll/report/'+this.state.singlePayrollPeriod.id)}>Take me to the Payroll Report</Button>
                            }
                        </div>
                    </div>                            
                    }
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}

function createMapOptions(maps) {
  // next props are exposed at maps
  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.RIGHT_CENTER,
      style: maps.ZoomControlStyle.SMALL
    },
    zoomControl: true,
    scaleControl: false,
    fullscreenControl: false,
    mapTypeControl: false
  };
}
const Marker = ({ text }) => (<div><img style={{maxWidth: "25px"}} src={markerURL} /></div>);
Marker.propTypes = {
    text: PropTypes.string
};

const PaymentRow = ({ payment, employee, onApprove, onReject, onUndo, readOnly, period }) => {

    if(!employee || employee.id === "new") return <p className="px-3 py-1">⬆ Search an employee from the list above...</p>;

    const [ clockin, setClockin ] = useState(Clockin(payment.clockin).defaults().unserialize());
    
    const [ shift, setShift ] = useState(Shift(payment.shift).defaults().unserialize());
    const _now = NOW();
    // const shiftRef = useRef(shift);
    // shiftRef.current = shift;

    const [ possibleShifts, setPossibleShifts ] = useState(null);

    const init_breaktime = NOW().startOf('day').add(payment.breaktime_minutes, 'minutes');
    const [ breaktime, setBreaktime ] = useState(init_breaktime);

    const startTime = clockin.shift && clockin.started_at ? clockin.started_at.format('LT') : "-";
    const endTime = clockin.shift && clockin.ended_at ? clockin.ended_at.format('LT') : "_";

    const clockInDuration = !clockin.ended_at ? null : moment.duration(clockin.ended_at.diff(clockin.started_at));
    const clockinHours = !clockInDuration ? 0 : clockin.shift || !readOnly ? Math.round(clockInDuration.asHours() * 100) / 100 : "-";

    const shiftStartTime = shift.starting_at.format('LT');
    const shiftEndTime = shift.ending_at.format('LT');

    const shiftDuration = moment.duration(shift.ending_at.diff(shift.starting_at));
    const plannedHours = Math.round(shiftDuration.asHours() * 100) / 100;

    const clockInDurationAfterBreak = !clockin.ended_at ? null : moment.duration(clockin.ended_at.diff(clockin.started_at)).subtract(breaktime.diff(NOW().startOf('day')));
    const clockInTotalHoursAfterBreak = !clockInDurationAfterBreak ? 0 : Math.round(clockInDurationAfterBreak.asHours() * 100) / 100;

    const diff =  Math.round((clockInTotalHoursAfterBreak - plannedHours) * 100) / 100;
    useEffect(() => {
        if(payment.status === "NEW") 
            GET(`employers/me/shifts?start=${moment(period.starting_at).format('YYYY-MM-DD')}&end=${moment(period.ending_at).format('YYYY-MM-DD')}&employee=${employee.id}`)
                .then(_shifts => {
                    const _posibleShifts = _shifts.map(s => ({ label: '', value: Shift(s).defaults().unserialize() }));
                    console.log(_posibleShifts);
                    setPossibleShifts(_posibleShifts);
                })
                .catch(e => Notify.error(e.message || e));
    }, []);

    return <tr id={"paymemt"+payment.id}>
        {
            payment.status === "NEW" ? 
                <td>
                    <Select className="select-shifts"
                        value={!possibleShifts ? { label: "Loading talent shifts", value: "loading" } : { value: shift }}
                        components={{ Option: ShiftOption, SingleValue: ShiftOptionSelected({ multi: false }) }}
                        onChange={(selectedOption)=> {
                            const _shift = selectedOption.value;
                            if(_shift){
                                setShift(_shift);
                                setClockin({ ...clockin, started_at: _shift.starting_at, ended_at: _shift.ending_at });
                            }
                        }}
                        options={possibleShifts ? possibleShifts : [{ label: "Loading talent shifts", value: "loading" }]}
                    >
                    </Select>
                </td>
            :
                <td>
                    <div className="shift-details">
                        <p className="p-o m-0">
                            <strong className="shift-date">{shift.starting_at.format('ddd, ll')}</strong>
                        </p>
                        <small className="shift-position text-success">{shift.position.title}</small> @
                        <small className="shift-location text-primary"> {shift.venue.title}</small>
                    </div>
                    { <p>
                        {
                            (typeof shift.price == 'string') ?
                                (shift.price === '0.0') ? '': <small className="shift-price text-danger"> ${shift.price}</small>
                            :
                                <small className="shift-price text-danger"> {shift.price.currencySymbol}{shift.price.amount}</small>
                        }{" "}
                        { clockin && <div className="d-inline">
                            <Tooltip placement="right" trigger={['click']} overlay={ 
                                <div style={{ width: "200px", height: "200px"}}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_WEB_KEY }}
                                        defaultCenter={{
                                            lat: 25.7617,
                                            lng: -80.1918
                                        }}
                                        width="100%"
                                        height="100%"
                                        center={{
                                        lat: clockin.latitude_in,
                                        lng: clockin.longitude_in
                                        }}
                                        options={createMapOptions}
                                        defaultZoom={12}
                                    >
                                        <Marker
                                            lat={clockin.latitude_in}
                                            lng={clockin.longitude_in}
                                            text={'Jobcore'}
                                        />
                                    </GoogleMapReact>
                                    <small className="d-block text-center">({clockin.latitude_in},{clockin.longitude_in})</small>
                                </div>
                            }>
                                <small className="pointer"><i className="fas fa-map-marker-alt"></i> In</small>
                            </Tooltip>{" "}
                            <Tooltip placement="right" trigger={['click']} overlay={<small>({clockin.latitude_in},{clockin.longitude_in})</small>}>
                                <small className="pointer"><i className="fas fa-map-marker-alt"></i> Out</small>
                            </Tooltip>
                        </div>}
                    </p>}
                </td>
        }
        <td className="time">
            { readOnly ?
                <p>{startTime}</p>
                :
                <TimePicker
                    showSecond={false}
                    defaultValue={clockin.started_at}
                    format={TIME_FORMAT}
                    onChange={(value) => {
                        if(value){
                            const _c = Object.assign({},clockin,{ started_at: value});
                            setClockin(_c);
                        }
                    }}
                    value={clockin.started_at}
                    use12Hours
                  />
            }
            <small>({shiftStartTime})</small>
        </td>
        <td className="time">
            { readOnly ?
                <p>{endTime}</p>
                :
                <TimePicker
                    className={`${clockin.automatically_closed ? 'border border-danger' : ''}`}
                    showSecond={false}
                    defaultValue={clockin.ended_at}
                    format={TIME_FORMAT}
                    onChange={(d1) => {
                        if(d1){
                            const starting = clockin.started_at;
                            let ended_at = moment(clockin.started_at).set({ hour: d1.get('hour'), minute: d1.get('minute'), second : d1.get('second')});
                            if(starting.isAfter(ended_at)) ended_at = moment(ended_at).add(1, 'days');
                            setClockin(Object.assign({},clockin,{ ended_at }));
                        }
                    }}
                    value={clockin.ended_at}
                    use12Hours
                />
            }
            <small>({shiftEndTime})</small>
            { clockin.automatically_closed &&
                <Tooltip placement="bottom" trigger={['hover']} overlay={<small>Automatically clocked out</small>}>
                    <i className="fas fa-exclamation-triangle text-danger fa-xs"></i>
                </Tooltip>
            }
        </td>
        <td style={{ minWidth: "75px", maxWidth: "75px" }}>
            <p className="mt-1" style={{ marginBottom: "7px" }}>{clockinHours}</p>
            <small className="d-block my-0">(Plan: {plannedHours})</small>
        </td>
        { readOnly ?
            <td>{payment.breaktime_minutes} min</td>
            :
            <td style={{ minWidth: "75px", maxWidth: "75px" }} className="text-center">
                {
                    <TimePicker showSecond={false} minuteStep={1}
                        onChange={(value)=> value && setBreaktime(value)} value={breaktime}
                    />
                }
                <small>hh:mm</small>
            </td>
        }
        <td>{!readOnly ? clockInTotalHoursAfterBreak : parseFloat(payment.regular_hours) + parseFloat(payment.over_time)}</td>
        <td>{clockin.shift || !readOnly ? diff : "-"}</td>
        {readOnly ?
            <td className="text-center">
                { payment.status === "APPROVED" ? <span><i className="fas fa-check-circle"></i><i onClick={() => onUndo(payment)} className="fas fa-undo ml-2 pointer"></i></span>
                    : payment.status === "REJECTED" ? <span><i className="fas fa-times-circle"></i><i onClick={() => onUndo(payment)} className ="fas fa-undo ml-2 pointer"></i></span>
                        : ''
                }
            </td>
            :
            <td className="text-center">
                <Button
                    color="success"
                    size="small"
                    icon="check"
                    onClick={(value) => {
                        if(payment.status === "NEW"){
                            if(shift.id === undefined) Notify.error("You need to specify a shift for all the new clockins");
                            else onApprove({
                                shift: shift,
                                employee: employee,
                                clockin: null,
                                breaktime_minutes: moment.duration(breaktime.diff(NOW().startOf('day'))).minutes(),
                                regular_hours: (plannedHours > clockInTotalHoursAfterBreak || plannedHours === 0) ? clockInTotalHoursAfterBreak : plannedHours,
                                over_time: diff < 0 ? 0 : diff
                            });
                        } 
                        else onApprove({
                            breaktime_minutes: moment.duration(breaktime.diff(NOW().startOf('day'))).minutes(),
                            regular_hours: (plannedHours > clockInTotalHoursAfterBreak || plannedHours === 0) ? clockInTotalHoursAfterBreak : plannedHours,
                            over_time: diff < 0 ? 0 : diff
                        });
                    }}
                />
                <Button
                    className="mt-1"
                    color="danger"
                    size="small"
                    icon={payment.status === "NEW" ? "trash" : "times"}
                    onClick={(value) => onReject({ status: "REJECTED" })}
                />
            </td>
        }
    </tr>;
};
PaymentRow.propTypes = {
    payment: PropTypes.object,
    period: PropTypes.object,
    employee: PropTypes.object,
    readOnly: PropTypes.bool,
    onApprove: PropTypes.func,
    onReject: PropTypes.func,
    onUndo: PropTypes.func,
    shifts: PropTypes.array
};
PaymentRow.defaultProps = {
  shifts: [],
  period: null
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

export const SelectTimesheet = ({ catalog, formData, onChange, onSave, onCancel, history }) => {
    const { bar } = useContext(Theme.Context);
    const employer = store.getState('current_employer');

    if(!employer || !employer.payroll_configured || !moment.isMoment(employer.payroll_period_starting_time)){
        return <div className="text-center">
            <p>Please setup your payroll settings first.</p>
            <Button color="success" onClick={() => history.push("/payroll-settings")}>Setup Payroll Settings</Button>
        </div>;
    }

    let note = null;
    if(formData.periods.length > 0){
        const end = moment(formData.periods[0].ending_at);
        end.add(7,'days');
        if(end.isBefore(NOW())) note = "Payroll was generated until "+end.format('M d');
    }
    return (<div>
        <div className="top-bar">
            <Button
                    icon="sync" color="primary" size="small" rounded={true}
                    onClick={() => processPendingPayrollPeriods().then(_periods => onChange({ periods: formData.periods.concat(_periods)}))}
                    note={note}
                    notePosition="left"
                />

        </div>
        <div className="row">
            <div className="col-12">
                <h2 className="mt-1">Select a timesheet:</h2>
                <ul className="scroll" style={{ maxHeight: "600px", overflowY: "auto", padding: "10px", margin: "-10px" }}>
                    { formData.periods.length > 0 ?
                
                        formData.periods.map(p =>
                            <GenericCard key={p.id}
                                hover={true} className="pr-2"
                                onClick={()=> history.push(`/payroll/period/${p.id}`)}
                            >
                                <div className="avatar text-center pt-1 bg-transparent">
                                    { p.status === "FINALIZED" ? <i className="fas fa-check-circle"></i>
                                        : p.status === "OPEN" ? <i className="far fa-circle"></i>
                                        : ''
                                    }
                                </div>
                                From {moment(p.starting_at).format('MMM DD, YYYY')} to {moment(p.ending_at).format('MMM DD, YYYY')}
                                <p className="my-0"><small className={`badge ${p.payments.length > 0 ? 'badge-secondary' : 'badge-info'}`}>{p.payments.length} Payments</small></p>
                            </GenericCard>
                        )
                        :
                        <div className="col-12 mt-3 text-center">No talents found for this period or shift</div>
                    }
                </ul>
            </div>
        </div>
    </div>);
};
SelectTimesheet.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};

export const SelectShiftPeriod = ({ catalog, formData, onChange, onSave, onCancel, history }) => {
    const {bar} = useContext(Theme.Context);

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
                    onClick={() => null}
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
    </div>);
};
SelectShiftPeriod.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};

export class PayrollReport extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            employer: store.getState('current_employer'),
            payrollPeriods: [],
            payments: [],
            singlePayrollPeriod: null
        };
    }

    componentDidMount(){

        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });

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
        if(!this.state.employer) return "Loading...";
        else if(!this.state.employer.payroll_configured || !moment.isMoment(this.state.employer.payroll_period_starting_time)){
            return <div className="p-1 listcontents text-center">
                <h3>Please setup your payroll settings first.</h3>
                <Button color="success" onClick={() => this.props.history.push("/payroll-settings")}>Setup Payroll Settings</Button>
            </div>;
        }

        //const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({ bar }) => (<span>
                    {(!this.state.singlePayrollPeriod) ? '' :
                        (this.state.singlePayrollPeriod.payments.length > 0) ?
                            <div>
                                <p className="text-right">
                                    <h1 className="float-left">Payments for {this.state.singlePayrollPeriod.label}</h1>
                                    <Button className="btn btn-info" onClick={() => this.props.history.push('/payroll/period/'+this.state.singlePayrollPeriod.id)}>Review Timesheet</Button>
                                </p>
                                { this.state.singlePayrollPeriod.status == "OPEN" &&
                                    <div className="alert alert-warning p-2">This period is still open, <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        this.props.history.push('/payroll/period/'+this.state.singlePayrollPeriod.id);
                                    }}>click here to review it.</a>
                                    </div>
                                }
                                <table className="table table-striped payroll-summary">
                                    <thead>
                                        <tr>
                                            <th scope="col">Staff</th>
                                            <th scope="col">Regular Hrs</th>
                                            <th scope="col">PTO</th>
                                            <th scope="col">Holiday</th>
                                            <th scope="col">Sick</th>
                                            <th scope="col">OT</th>
                                            <th scope="col">DBL</th>
                                            <th scope="col">Total Hrs</th>
                                            <th scope="col">Labor</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.payments.sort((a,b) =>
                                                a.employee.user.last_name.toLowerCase() > b.employee.user.last_name.toLowerCase() ? 1 : -1
                                            ).map(pay => {
                                            const total = pay.payments.filter(p => p.status === 'APPROVED').reduce((incoming, current) => {
                                                return {
                                                    over_time: parseFloat(current.over_time) + parseFloat(incoming.over_time),
                                                    regular_hours: parseFloat(current.regular_hours) + parseFloat(incoming.regular_hours),
                                                    total_amount: parseFloat(current.total_amount) + parseFloat(incoming.total_amount),
                                                    status: current.status == 'PAID' && incoming.status == 'PAID' ? 'PAID' : 'UNPAID'
                                                };
                                            }, { regular_hours: 0, total_amount: 0, over_time: 0, status: 'UNPAID' });
                                            return <tr key={pay.employee.id}>
                                                <td>
                                                    {pay.employee.user.last_name}, {pay.employee.user.first_name}
                                                    <p className="m-0 p-0"><span className="badge">{total.status.toLowerCase()}</span></p>
                                                </td>
                                                <td>{Math.round(total.regular_hours * 100) / 100}</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>{Math.round(total.over_time * 100) / 100}</td>
                                                <td>-</td>
                                                <td>{Math.round((total.regular_hours + total.over_time) * 100) / 100}</td>
                                                <td>${Math.round(total.total_amount * 100) / 100}</td>
                                                <td>
                                                    <Button color="success" size="small" onClick={() => null}>Create payment</Button>
                                                </td>
                                            </tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p>No payments to review for this period</p>
                    }
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}