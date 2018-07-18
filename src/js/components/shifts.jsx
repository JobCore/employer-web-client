import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, PrivateConsumer, rejectCandidate, acceptCandidate} from '../actions.js';
import {ApplicantCard} from './applicants';
import queryString from 'query-string';
import {validator, ValidationError} from '../utils/validation';

import TimePicker from 'rc-time-picker';
const TIME_FORMAT = 'h:mm a';
const DATE_FORMAT = 'YYYY-MM-DD';
import moment from 'moment';
const now = moment().hour(0).minute(0);

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getShiftInitialFilters = () => {
    return {};
};

export const Shift = (data) => {
    
    const _defaults = {
        position: '',
        maximum_allowed_employees: '0',
        minimum_hourly_rate: '0',
        date: now,
        start_time: '12:00 am',
        finish_time: '12:00 am',
        minimum_allowed_rating: '1',
        venue: '',
        serialize: function(){
            
            const newShift = {
                date: (moment.isMoment(this.date)) ? this.date.format(DATE_FORMAT) : this.date,
                start_time: (moment.isMoment(this.start_time)) ? this.start_time.format(TIME_FORMAT) : this.start_time,
                finish_time: (moment.isMoment(this.finish_time)) ? this.finish_time.format(TIME_FORMAT) : this.finish_time
            };
            
            return Object.assign(this, newShift);
        }
    };
    
    let _shift = Object.assign(_defaults, data);
    return {
        validate: () => {
            const startTime = (moment.isMoment(_shift.start_time)) ? _shift.start_time.format(TIME_FORMAT) : _shift.start_time;
            const finish_time = (moment.isMoment(_shift.finish_time)) ? _shift.finish_time.format(TIME_FORMAT) : _shift.finish_time;
            const date = (moment.isMoment(_shift.date)) ? _shift.date.format(DATE_FORMAT) : _shift.date;
            const start = moment(date + ' ' + startTime, TIME_FORMAT + ' ' + TIME_FORMAT);
            const finish = moment(date + ' ' + finish_time, TIME_FORMAT + ' ' + TIME_FORMAT);
            if(!validator.isInt(_shift.position, { min: 1 })) throw new ValidationError('The shift is missing a position');
            if(!validator.isInt(_shift.maximum_allowed_employees, { min: 1, max: 25 })) throw new ValidationError('The shift needs to employ at least 1 talent and no more than 25');
            if(!validator.isFloat(_shift.minimum_hourly_rate, { min: 7 })) throw new ValidationError('The minimum allowed hourly rate is $7');
            if(!start.isValid() || start.isBefore(now)) throw new ValidationError('The shift date has to be greater than today');
            if(!finish.isValid() || finish.isBefore(start)) throw new ValidationError('The shift ending time has to be grater than the starting time');
            if(!validator.isInt(_shift.venue, { min: 1 })) throw new ValidationError('The shift is missing a venue');
            
            return _shift;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formShift = {
                id: _shift.id.toString(),
                position: _shift.position.id.toString() || _shift.position.toString(),
                maximum_allowed_employees: _shift.maximum_allowed_employees.toString(),
                minimum_hourly_rate: _shift.minimum_hourly_rate.toString(),
                date: _shift.date,
                start_time: (moment.isMoment(_shift.start_time) ) ? _shift.start_time : moment(_shift.date.format("MM/DD/YYYY") + ' ' + _shift.start_time),
                finish_time: (moment.isMoment(_shift.finish_time) ) ? _shift.finish_time : moment(_shift.date.format("MM/DD/YYYY") + ' ' + _shift.finish_time),
                minimum_allowed_rating: _shift.minimum_allowed_rating.toString(),
                venue: _shift.venue.id.toString() || _shift.venue.toString()
            };
            return _formShift;
        }
    };
};


export class ManageShifts extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            shifts: []
        };
    }
    
    componentDidMount(){
        
        this.filterShifts();
        this.subscribe(store, 'shifts', (shifts) => {
            this.filterShifts(shifts);
        });
        
        this.props.history.listen(() => {
            this.filterShifts();
        });
        
    }
    
    filterShifts(shifts=null){
        let filters = this.getFilters();
        if(!shifts) shifts = store.getState('shifts');
        if(shifts){
            this.setState({
                shifts: shifts.filter((shift) => {
                    for(let f in filters){
                        const matches = filters[f].matches(shift);
                        if(!matches) return false;
                    }
                            
                    return true;
                }).sort((shift) => moment().diff(shift.start_time, 'minutes'))
            });
        }
        else this.setState({shifts: []});
    }
    
    getFilters(){
        let filters = queryString.parse(window.location.search, {arrayFormat: 'index'});
        for(let f in filters){
            switch(f){
                case "status":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => shift.status == filters.status.value
                    };
                break;
                case "position":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => {
                            if(!filters.position.value) return true;
                            if(isNaN(filters.position.value)) return true;
                            return shift.position.id == filters.position.value;
                        }
                    };
                break;
                case "venue":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => {
                            if(!filters.venue.value) return true;
                            if(isNaN(filters.venue.value)) return true;
                            return shift.venue.id == filters.venue.value;
                        }
                    };
                break;
                case "minimum_hourly_rate":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => {
                            if(!filters.minimum_hourly_rate.value) return true;
                            if(isNaN(filters.minimum_hourly_rate.value)) return true;
                            return parseInt(shift.minimum_hourly_rate) >= filters.minimum_hourly_rate.value;
                        }
                    };
                break;
                case "date":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => {
                            const fdate = moment(filters.date.value);
                            return shift.date.diff(fdate, 'days') == 0;
                        }
                    };
                break;
            }
        }
        return filters;
    }
    
    render() {
        const shiftsHTML = this.state.shifts.map((s,i) => (<ShiftCard key={i} shift={s} hover={true} />));
        return (<div className="p-5 listcontents">
            <h1>Shift Details</h1>
            {shiftsHTML}
        </div>);
    }
}

/**
 * ShiftCard
 */
export const ShiftCard = (props) => {
    const startDate = props.shift.date.format('ll');
    const startTime = props.shift.start_time.format('LT');
    const endTime = props.shift.finish_time.format('LT');
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className={`shiftcard ${(props.hover) ? 'shiftcard-hover':''}`}>
                <a href="#" className="shift-position">{props.shift.position.title}</a> @ 
                <a href="#" className="shift-location"> {props.shift.venue.title}</a> 
                <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                {
                    (typeof props.shift.price == 'string') ? 
                        <span className="shift-price"> ${props.shift.price}/hr.</span>
                    :
                        <span className="shift-price"> {props.shift.price.currencySymbol}{props.shift.price.amount}/{props.shift.price.timeframe}.</span>
                }
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary"
                        onClick={() => bar.show({ slug: "show_shift_applicants", data: props.shift, title: "Shift Applicants" })}
                    ><i className="icon icon-favorite icon-xs"></i> <label>Applicants</label></button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => bar.show({ slug: "update_shift", data: props.shift, title: "Shift Details" })}
                    ><i className="icon icon-favorite icon-xs"></i> <label>Detais</label></button>
                </div>
            </li>)}
    </PrivateConsumer>);
};
ShiftCard.propTypes = {
    shift: PropTypes.object.isRequired,
    hover: PropTypes.bool.isRequired
};
ShiftCard.defaultProps = {
  hover: false
};

/**
 * ShiftDetails
 */
export const ShiftDetails = ({onSave, onCancel, onChange, catalog, formData}) => (<form>
    <div className="row">
        <div className="col-6">
            <label>Looking for</label>
            <select className="form-control"
                value={formData.position}
                onChange={(e)=>onChange({position: e.target.value})} >
                <option>Select a position</option>
                {
                    catalog.positions.map((pos,i)=>(<option key={i} value={pos.id}>{pos.title}</option>))
                }
            </select>
        </div>
        <div className="col-6">
            <label>How many?</label>
            <input type="number" className="form-control" 
                value={formData.maximum_allowed_employees}
                onChange={(e)=>onChange({maximum_allowed_employees: e.target.value})} 
            />
        </div>
    </div>
    <div className="row">
        <div className="col-6">
            <label>Price / hour</label>
            <input type="number" className="form-control" 
                value={formData.minimum_hourly_rate}
                onChange={(e)=>onChange({minimum_hourly_rate: e.target.value})} 
            />
        </div>
        <div className="col-6">
            <label>Date</label>
            <input type="date" className="form-control" 
                value={(typeof formData.date != 'undefined') ? formData.date.format(DATE_FORMAT) : ''}
                onChange={(e)=>onChange({date: moment(e.target.value)})} 
            />
        </div>
    </div>
    <div className="row">
        <div className="col-6">
            <label>From</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                use12Hours={true}
                value={formData.start_time}
                onChange={(value)=>onChange({start_time: value})}
            />
        </div>
        <div className="col-6">
            <label>To</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                defaultValue={now}
                use12Hours={true}
                value={formData.finish_time}
                onChange={(value)=>onChange({finish_time: value})}
            />
        </div>
    </div>
    <div className="row">
        <div className="col-12">
            <label>Venue</label>
            <select className="form-control" 
                value={formData.venue}
                onChange={(e)=>onChange({venue: e.target.value})} 
            >
                <option value={null}>Select a venue</option>
                {
                    catalog.venues.map((ven,i)=>(<option key={i} value={ven.id}>{ven.title}</option>))
                }
            </select>
        </div>
    </div>
    <div className="row">
        <div className="col-12">
            <label>Minimum start rating</label>
            <select className="form-control" 
                value={formData.minimum_allowed_rating}
                onChange={(e)=>onChange({minimum_allowed_rating: e.target.value})} 
            >
                <option value={1}>1 star</option>
                <option value={2}>2 star</option>
                <option value={3}>3 star</option>
                <option value={4}>4 star</option>
                <option value={5}>5 star</option>
            </select>
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-success" onClick={() => onSave()}>Save</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);
ShiftDetails.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * AddShift
 */
export const AddShift = ({onSave, onCancel, onChange, catalog}) => (<form>
    <div className="row">
        <div className="col-6">
            <label>Looking for</label>
            <select className="form-control" onChange={(e)=>onChange({position: e.target.value})} >
                <option>Select a position</option>
                {
                    catalog.positions.map((pos,i)=>(<option key={i} value={pos.id}>{pos.title}</option>))
                }
            </select>
        </div>
        <div className="col-6">
            <label>How many?</label>
            <input type="number" className="form-control" onChange={(e)=>onChange({maximum_allowed_employees: e.target.value})} />
        </div>
    </div>
    <div className="row">
        <div className="col-6">
            <label>Price / hour</label>
            <input type="number" className="form-control" onChange={(e)=>onChange({minimum_hourly_rate: e.target.value})} />
        </div>
        <div className="col-6">
            <label>Date</label>
            <input type="date" className="form-control" onChange={(e)=>onChange({date: e.target.value})} />
        </div>
    </div>
    <div className="row">
        <div className="col-6">
            <label>From</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                defaultValue={now}
                use12Hours={true}
                onChange={(value)=>onChange({start_time: value.format(TIME_FORMAT)})}
            />
        </div>
        <div className="col-6">
            <label className="d-block">To</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                defaultValue={now}
                use12Hours={true}
                onChange={(value)=>onChange({finish_time: value.format(TIME_FORMAT)})}
            />
        </div>
    </div>
    <div className="row">
        <div className="col-12">
            <label>Venue</label>
            <select className="form-control" onChange={(e)=>onChange({venue: e.target.value})} >
                <option value={null}>Select a venue</option>
                {
                    catalog.venues.map((ven,i)=>(<option key={i} value={ven.id}>{ven.title}</option>))
                }
            </select>
        </div>
    </div>
    <div className="row">
        <div className="col-12">
            <label>Minimum start rating</label>
            <select className="form-control" onChange={(e)=>onChange({minimum_allowed_rating: e.target.value})} >
                <option value={1}>1 star</option>
                <option value={2}>2 star</option>
                <option value={3}>3 star</option>
                <option value={4}>4 star</option>
                <option value={5}>5 star</option>
            </select>
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-primary" onClick={() => onSave({status: 'draft'})}>Save as draft</button>
        <button type="button" className="btn btn-success" onClick={() => onSave({status: 'published'})}>Publish</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);
AddShift.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * AddShift
 */
export const FilterShifts = ({onSave, onCancel, onChange, catalog}) => (<form>
    <div className="row">
        <div className="col">
            <label>Looking for</label>
            <select className="form-control" onChange={(e)=>onChange({position: e.target.value})} >
                <option>Select a position</option>
                {
                    catalog.positions.map((pos,i)=>(<option key={i} value={pos.id}>{pos.title}</option>))
                }
            </select>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>Price / hour</label>
            <input type="number" className="form-control" onChange={(e)=>onChange({minimum_hourly_rate: e.target.value})} />
        </div>
        <div className="col">
            <label>Date</label>
            <input type="date" className="form-control" onChange={(e)=>onChange({date: e.target.value})} />
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>From</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                defaultValue={now}
                use12Hours={true}
                onChange={(value)=>onChange({start_time: value.format(TIME_FORMAT)})}
            />
        </div>
        <div className="col">
            <label>To</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                defaultValue={now}
                use12Hours={true}
                onChange={(value)=>onChange({finish_time: value.format(TIME_FORMAT)})}
            />
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>Venue</label>
            <select className="form-control" onChange={(e)=>onChange({venue: e.target.value})} >
                <option value={null}>Select a venue</option>
                {
                    catalog.venues.map((ven,i)=>(<option key={i} value={ven.id}>{ven.title}</option>))
                }
            </select>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>Status</label>
            <select className="form-control" onChange={(e)=>onChange({status: e.target.value})} >
                <option value={null}>Select a status</option>
                <option value={'DRAFT'}>DRAFT</option>
                <option value={'PUBLISHED'}>PUBLISHED</option>
                <option value={'UPCOMING'}>UPCOMING</option>
            </select>
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-primary" onClick={() => onSave()}>Apply Filters</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);
FilterShifts.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * AddShift
 */
export const ShiftApplicants = ({onCancel, onSave, catalog}) => {
    const htmlApplicants = catalog.applicants.map((apli,i) => (<ApplicantCard key={i} applicant={apli} shift={catalog.shift} />));
    
    return (<div className="sidebar-applicants">
        {
            htmlApplicants.length > 0 ? 
                htmlApplicants
            :
                <p>No applicants were found for this shift.</p>
        }
        <div className="btn-bar">
            <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Close</button>
        </div>
    </div>);
};
ShiftApplicants.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  catalog: PropTypes.object, //contains the data needed for the form to load
  context: PropTypes.object //contact any additional data for context purposes
};
