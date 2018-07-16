import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, PrivateConsumer} from '../actions.js';
import queryString from 'query-string';

import TimePicker from 'rc-time-picker';
const TIME_FORMAT = 'h:mm a';
import moment from 'moment';
const now = moment().hour(0).minute(0);


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
        let filters = queryString.parse(window.location.search);
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
        return (<div className="p-5">
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
                    <button type="button" className="btn btn-secondary"><i className="icon icon-favorite icon-xs"></i> <label>Detais</label></button>
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
 * ShiftCard
 */
export const ApplicantCard = ({ full_name, avatar_url }) => {
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className="aplicantcard">
                <a href="#" className="shift-position">{full_name}</a>
                <a href="#" className="shift-location"> {avatar_url}</a> 
            </li>)}
    </PrivateConsumer>);
};
ApplicantCard.propTypes = {
  full_name: PropTypes.string.isRequired,
  avatar_url: PropTypes.string.isRequired
};

/**
 * AddShift
 */
export const AddShift = ({onSave, onCancel, onChange, catalog}) => (<form>
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
        <div className="col">
            <label>How many?</label>
            <input type="number" className="form-control" onChange={(e)=>onChange({maximum_allowed_employees: e.target.value})} />
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
export const ShiftApplicants = ({onCancel, onSave, catalog}) => (<div className="sidebar-applicants">
    {catalog.applicants.map((apli,i) => (<ApplicantCard key={i}
        bades={apli.avatar_url} 
        full_name={apli.profile.first_name} 
    />))}
    <div className="btn-bar">
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Close</button>
    </div>
</div>);
ShiftApplicants.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  catalog: PropTypes.object //contains the data needed for the form to load
};
