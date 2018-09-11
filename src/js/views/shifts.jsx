import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import {store} from '../actions.js';
import {ApplicantCard} from './applicants';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Select from 'react-select';
import {Notify} from 'bc-react-notifier';
import queryString from 'query-string';
import {ShiftCard, Wizard, Theme} from '../components/index';
import {TIME_FORMAT, DATE_FORMAT, NOW} from '../components/utils.js';
import {validator, ValidationError} from '../utils/validation';
import {callback, hasTutorial} from '../utils/tutorial';
import GoogleMapReact from 'google-map-react';
import markerURL from '../../img/marker.png';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
const SHIFT_POSSIBLE_STATUS = ['UNDEFINED','DRAFT','OPEN','CANCELLED'];

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getShiftInitialFilters = () => {
    return {};
};

export const Shift = (data) => {
    
    const _defaults = {
        position: '',
        maximum_allowed_employees: '1',
        application_restriction: 'ANYONE',
        minimum_hourly_rate: '8',
        date: NOW,
        candidates:[],
        start_time: NOW,
        finish_time: NOW,
        allowed_from_list: [],
        allowedFavlists: [],
        allowedTalents: [],
        minimum_allowed_rating: '1',
        venue: '',
        status: 'UNDEFINED',
        serialize: function(){
            
            const newShift = {
                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
                date: (moment.isMoment(this.date)) ? this.date.format(DATE_FORMAT) : this.date,
                start_time: (moment.isMoment(this.start_time)) ? this.start_time.format(TIME_FORMAT) : this.start_time,
                finish_time: (moment.isMoment(this.finish_time)) ? this.finish_time.format(TIME_FORMAT) : this.finish_time,
                allowed_from_list: this.allowedFavlists.map(f => f.value)
            };
            
            return Object.assign(this, newShift);
        },
        unserialize: function(){
            const dataType = typeof this.date;
            //if its already serialized
            if(['number','string'].indexOf(dataType) == -1) return this;
            
            const tempDate = new Date(this.date).toLocaleDateString("en-US");
            const newShift = {
                position: (typeof this.position != 'object') ? store.get('positions', this.position) : this.position,
                venue: (typeof this.venue != 'object') ? store.get('venues', this.venue) : this.venue,
                start_time: (!moment.isMoment(this.start_time)) ? moment(tempDate+" "+this.start_time) : this.start_time,
                finish_time: (!moment.isMoment(this.finish_time)) ? moment(tempDate+" "+this.finish_time) : this.finish_time,
                date: (!moment.isMoment(this.date)) ? moment(this.date) : this.date,
                allowedFavlists: this.allowed_from_list.map(fav => {
                    const list = store.get('favlists', fav.id || fav);
                    return (list) ? {value: list.id, label: list.title} : null;
                }),
                price: {
                    currency: 'usd',
                    currencySymbol: '$',
                    amount: this.minimum_hourly_rate,
                    timeframe: 'hr'
                }
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
            if(!start.isValid() || start.isBefore(NOW)) throw new ValidationError('The shift date has to be greater than today');
            if(!finish.isValid() || finish.isBefore(start)) throw new ValidationError('The shift ending time has to be grater than the starting time');
            if(!validator.isInt(_shift.venue, { min: 1 })) throw new ValidationError('The shift is missing a venue');
            if(SHIFT_POSSIBLE_STATUS.indexOf(_shift.status) == -1) throw new Error('Invalid status "'+_shift.status+'" for shift');
            
            return _shift;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formShift = {
                id: _shift.id.toString(),
                application_restriction: _shift.application_restriction,
                position: _shift.position.id.toString() || _shift.position.toString(),
                maximum_allowed_employees: _shift.maximum_allowed_employees.toString(),
                minimum_hourly_rate: _shift.minimum_hourly_rate.toString(),
                date: _shift.date,
                status: _shift.status,
                allowedFavlists: _shift.allowedFavlists,
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
            shifts: [],
            runTutorial: hasTutorial(),
            steps: [
                {
                    target: '#shift-details-header',
                    content: 'Here you can see your entire list of shifts',
                    placement: 'right'
                },
                {
                    target: '#create_shift',
                    content: 'You can also create new shifts',
                    placement: 'left'
                },
                {
                    target: '#filter_shift',
                    content: 'Or filter them for better browsing',
                    placement: 'left'
                }
            ]
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
        this.setState({ runTutorial: true });
        
    }
    
    filterShifts(shifts=null){
        let filters = this.getFilters();
        if(!shifts) shifts = store.getState('shifts');
        if(shifts){
            this.setState({
                shifts: shifts.filter((shift) => {
                    if(shift.status == 'CANCELLED') return false;
                    
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
        const groupedShifts = _.groupBy(this.state.shifts, (s) => s.date.format('MMMM YYYY'));
        const shiftsHTML = [];
        for(let date in groupedShifts){
            shiftsHTML.push(<div key={date} className="date-group">
                <p className="date-group-label">{date}</p>
                <div>
                    {groupedShifts[date].map((s,i) => (<ShiftCard key={i} shift={s} showStatus={true} hoverEffect={true} />))}
                </div>
            </div>);
            
        }
        return (<div className="p-1 listcontents">
            <Wizard continuous
              steps={this.state.steps}
              run={this.state.runTutorial}
              callback={callback}
            />
            <h1 className="float-left"><span id="shift-details-header">Shift Details</span></h1>
            {shiftsHTML}
        </div>);
    }
}


/**
 * FilterShifts
 */
export const FilterShifts = ({onSave, onCancel, onChange, catalog}) => (<form>
    <div className="row">
        <div className="col">
            <label>Looking for</label>
            <Select 
                onChange={(selection)=>onChange({position: selection.value.toString()})}
                options={catalog.positions}
            />
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
            <label>Location</label>
            <Select
                onChange={(selection)=>onChange({venue: selection.value.toString()})}
                options={catalog.venues}
            />
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>Status</label>
            <Select
                onChange={(selection)=>onChange({status: selection.value.toString()})}
                options={catalog.shiftStatus}
            />
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-primary" onClick={() => onSave()}>Apply Filters</button>
        <button type="button" className="btn btn-secondary" onClick={() => onSave(false)}>Clear Filters</button>
    </div>
</form>);
FilterShifts.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * ShiftApplicants
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
    </div>);
};
ShiftApplicants.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  catalog: PropTypes.object, //contains the data needed for the form to load
  context: PropTypes.object //contact any additional data for context purposes
};

/**
 * ShiftDetails
 */
export const ShiftDetails = ({onSave, onCancel, onChange, catalog, formData}) => (<Theme.Consumer>
    {({bar}) => (<form>
        <div className="row">
            <div className="col-12">
                { (formData.status == 'DRAFT' || formData.status == 'UNDEFINED') ?
                    <div className="alert alert-warning">This shift is a draft, it has not been published</div>
                    :
                    <div className="alert alert-success">This shift is published, therefore <strong>it needs to be unpublished</strong> before it can be updated</div>
                }
            </div>
        </div>
        <div className="row">
            <div className="col-6">
                <label>Looking for</label>
                <Select
                    value={ catalog.positions.find((pos) => pos.value == formData.position)}
                    onChange={(selection)=>onChange({position: selection.value.toString()})}
                    options={[{label: 'Select a position', value: ''}].concat(catalog.positions)}
                />
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
                    defaultValue={NOW}
                    use12Hours={true}
                    value={formData.finish_time}
                    onChange={(value)=>onChange({finish_time: value})}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <label>Location</label>
                <Select 
                    value={ catalog.venues.find((ven) => ven.value == formData.venue)}
                    options={[{ label: "Add a location", value: 'new_venue', component: AddVenue }].concat(catalog.venues)}
                    onChange={(selection)=> {
                        if(selection.value == 'new_venue') bar.show({ slug: "create_venue", allowLevels: true });
                        else onChange({ venue: selection.value.toString() });
                    }}
                />
            </div>
        </div>
        <div className="row mt-3">
            <div className="col-12">
                <h4>Who can apply to this shift?</h4>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <Select
                    value={ catalog.applicationRestrictions.find((a) => a.value == formData.application_restriction)}
                    onChange={(selection)=>onChange({application_restriction: selection.value.toString()})} 
                    options={catalog.applicationRestrictions}
                />
            </div>
        </div>
        {
            (formData.application_restriction == "FAVORITES") ? 
                <div className="row">
                    <div className="col-12">
                        <label>From these favorite lists</label>
                        <Select isMulti
                            value={formData.allowedFavlists}
                            onChange={(opt)=> onChange({allowedFavlists: opt})} 
                            options={catalog.favlists}
                        >
                        </Select>
                    </div>
                </div>
            : (formData.application_restriction == "ANYONE") ?
                <div className="row mt-3">
                    <div className="col-5">
                        <label className="mt-2">Minimum rating</label>
                    </div>
                    <div className="col-7">
                        <Select
                            value={ catalog.stars.find((s) => s.value == formData.minimum_allowed_rating)}
                            onChange={(selection)=>onChange({minimum_allowed_rating: selection.value})}
                            options={catalog.stars}
                        />
                    </div>
                </div>
            :
                <div className="row">
                    <div className="col-12">
                        <label>Search and pick from your favorites:</label>
                        <Select multi className="select-employee"
                            value={formData.specificPeople}
                            onChange={(selection) => onChange({ specificPeople: selection})} 
                            options={catalog.favoriteEmployees}
                        >
                        </Select>
                    </div>
                </div>
        }
        <div className="btn-bar">
            { (formData.status == 'DRAFT' || formData.status == 'UNDEFINED') ? 
                <button type="button" className="btn btn-success" onClick={() => onSave({status: 'DRAFT'})}>Save as draft</button>:''
            }
            { (formData.status == 'DRAFT') ? 
                <button type="button" className="btn btn-primary" onClick={() => {
                    const noti = Notify.info("Are you sure?",(answer) => {
                        if(answer) onSave({status: 'OPEN'});
                        noti.remove();
                    });
                }}>Publish</button>
                : (formData.status != 'UNDEFINED') ?
                    <button type="button" className="btn btn-primary" onClick={() => {
                        const noti = Notify.info("Are you sure?",(answer) => {
                            if(answer) onSave({status: 'DRAFT'});
                            noti.remove();
                        });
                }}>Unpublish shift</button>:''
            }
            { (formData.status != 'UNDEFINED') ?
                <button type="button" className="btn btn-danger" onClick={() => {
                    const noti = Notify.info("Are you sure you want to cancel this shift?",(answer) => {
                        if(answer) onSave({status: 'CANCELLED'});
                        noti.remove();
                    });
                }}>Cancel shift</button>:''
            }
        </div>
    </form>)}
</Theme.Consumer>);
ShiftDetails.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};


/**
 * ShiftDetails
 */
export const RateShift = () => (<div className="p-5 listcontents">
    <div className="row">
        <div className="col-12">
            <h4>Venue name</h4>
        </div>
    </div>
</div>);
RateShift.propTypes = {
};

/**
 * Add a Location
 */
const Marker = ({ text }) => (<div><img style={{maxWidth: "25px"}} src={markerURL} /></div>);
Marker.propTypes = {
    text: PropTypes.string
};
export const AddVenue = ({onSave, onCancel, onChange, catalog, formData}) => (<Theme.Consumer>
    {({bar}) => (<div>
        <div className="row">
            <div className="col-12">
                <label>Venue name</label>
                <input type="text" className="form-control" 
                    value={formData.title}
                    onChange={(e)=>onChange({title: e.target.value})} 
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <label>Address</label>
                <PlacesAutocomplete 
                    value={formData.street_address || ''} 
                    onChange={(value)=>onChange({ street_address: value })}
                    onSelect={(address)=>{
                        onChange({ street_address: address });
                        geocodeByAddress(address)
                          .then(results => getLatLng(results[0]))
                          .then(coord => onChange({ latitude: coord.lat, longitude: coord.lng }))
                          .catch(error => Notify.error('There was an error obtaining the location coordinates'));
                    }}
                >
                    {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
                        <div className="autocomplete-root">
                            <input {...getInputProps()} className="form-control" />
                            <div className="autocomplete-dropdown-container bg-white">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion,i) => (
                                    <div key={i} {...getSuggestionItemProps(suggestion)} className="p-2">
                                        <span>{suggestion.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
            </div>
        </div>
        <div className="row">
            <div className="col-6 pr-0">
                <label>Location</label>
                <div className="location-map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_KEY }}
                        defaultCenter={{
                          lat: 25.7617,
                          lng: 80.1918
                        }}
                        center={{
                          lat: formData.latitude,
                          lng: formData.longitude
                        }}
                        defaultZoom={11}
                    >
                        <Marker
                            lat={formData.latitude}
                            lng={formData.longitude}
                            text={'Jobcore'}
                        />
                    </GoogleMapReact>
                </div>
            </div>
            <div className="col-6">
                <label>Country</label>
                <input type="text" className="form-control" 
                    value={formData.country}
                    onChange={(e)=>onChange({country: e.target.value})} 
                />
                <label>State</label>
                <input type="text" className="form-control" 
                    value={formData.state}
                    onChange={(e)=>onChange({state: e.target.value})} 
                />
                <label>Zip</label>
                <input type="number" className="form-control" 
                    value={formData.zip_code}
                    onChange={(e)=>onChange({zip_code: e.target.value})} 
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="btn-bar">
                    <button type="button" className="btn btn-success" onClick={() => onSave()}>Save</button>
                    <button type="button" className="btn btn-default" onClick={() => bar.close()}>Cancel</button>
                </div>
            </div>
        </div>
    </div>)}
</Theme.Consumer>);
AddVenue.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};