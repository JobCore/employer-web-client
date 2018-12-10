import React from "react";
import { Link } from 'react-router-dom';
import Flux from "@4geeksacademy/react-flux-dash";
import {store, acceptCandidate, rejectCandidate} from '../actions.js';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Select from 'react-select';

import DateTime from 'react-datetime';

import {Notify} from 'bc-react-notifier';
import queryString from 'query-string';
import {ShiftCard, Wizard, Theme, SearchCatalogSelect, Button, ApplicantCard} from '../components/index';
import {DATETIME_FORMAT, NOW} from '../components/utils.js';
import {validator, ValidationError} from '../utils/validation';
import {callback, hasTutorial} from '../utils/tutorial';
import GoogleMapReact from 'google-map-react';
import markerURL from '../../img/marker.png';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import moment from 'moment';
import {GET} from '../utils/api_wrapper';
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
        starting_at: NOW,
        ending_at: NOW,
        pending_invites: [],
        pending_jobcore_invites: [],
        candidates:[],
        allowed_from_list: [],
        allowedFavlists: [],
        allowedTalents: [],
        minimum_allowed_rating: '1',
        venue: '',
        status: 'UNDEFINED',
        withStatus: function(newStatus){
            if(typeof newStatus === 'string') this.status = newStatus;
            else throw new Error('Invalid status '+newStatus);
            
            return this;
        },
        serialize: function(){
            
            const newShift = {
                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
                // starting_at: (moment.isMoment(this.starting_at)) ? this.starting_at.format(DATETIME_FORMAT) : this.starting_at,
                // ending_at: (moment.isMoment(this.ending_at)) ? this.ending_at.format(DATETIME_FORMAT) : this.ending_at,
                allowed_from_list: this.allowedFavlists.map(f => f.value)
            };
            
            return Object.assign(this, newShift);
        },
        unserialize: function(){
            const dataType = typeof this.starting_at;
            //if its already serialized
            if((typeof this.position == 'object') && ['number','string'].indexOf(dataType) == -1) return this;
            const newShift = {
                position: (typeof this.position != 'object') ? store.get('positions', this.position) : this.position,
                venue: (typeof this.venue != 'object') ? store.get('venues', this.venue) : this.venue,
                starting_at: (!moment.isMoment(this.starting_at)) ? moment(this.starting_at) : this.starting_at,
                ending_at: (!moment.isMoment(this.ending_at)) ? moment(this.ending_at) : this.ending_at,
                allowedFavlists: this.allowed_from_list.map(fav => {
                    const list = store.get('favlists', fav.id || fav);
                    return (list) ? {value: list.id, label: list.title} : null;
                }),
                expired: moment(this.ending_at).isBefore(NOW),
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
        get: () => {
            return _shift;
        },
        validate: () => {
            const start = _shift.starting_at;
            const finish = _shift.ending_at;
            
            if(_shift.status == 'CANCELLED') return _shift;
            
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
                pending_jobcore_invites: _shift.pending_jobcore_invites,
                application_restriction: _shift.application_restriction,
                pending_invites: (typeof _shift.pending_invites == 'undefined') ? []:_shift.pending_invites,
                position: _shift.position.id.toString() || _shift.position.toString(),
                maximum_allowed_employees: _shift.maximum_allowed_employees.toString(),
                minimum_hourly_rate: _shift.minimum_hourly_rate.toString(),
                starting_at: _shift.starting_at,
                ending_at: _shift.ending_at,
                status: _shift.status,
                allowedFavlists: _shift.allowedFavlists,
                start_time: (moment.isMoment(_shift.starting_at) ) ? _shift.starting_at : moment(_shift.starting_at.format("MM/DD/YYYY") + ' ' + _shift.starting_at),
                finish_time: (moment.isMoment(_shift.starting_at) ) ? _shift.ending_at : moment(_shift.ending_at.format("MM/DD/YYYY") + ' ' + _shift.ending_at),
                minimum_allowed_rating: _shift.minimum_allowed_rating.toString(),
                venue: _shift.venue.id.toString() || _shift.venue.toString()
            };
            return _formShift;
        }
    };
};

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
                case "positions":
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
                            return parseInt(shift.minimum_hourly_rate, 10) >= filters.minimum_hourly_rate.value;
                        }
                    };
                break;
                case "date":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => {
                            const fdate = moment(filters.starting_at.value);
                            return shift.starting_at.diff(fdate, 'days') == 0;
                        }
                    };
                break;
                default: throw new Error('Invalid filter');
            }
        }
        return filters;
    }
    
    render() {
        const groupedShifts = _.groupBy(this.state.shifts, (s) => s.starting_at.format('MMMM YYYY'));
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
    const htmlApplicants = catalog.applicants.map((apli,i) => (
        <ApplicantCard key={i} applicant={apli} shift={catalog.shift} 
            onAccept={() => acceptCandidate(catalog.shift.id, apli)} 
            onReject={() => rejectCandidate(catalog.shift.id, apli)} 
        />)
    );
    return (<Theme.Consumer>
        {({ bar }) => (<div className="sidebar-applicants">
            <h3>Shift applicants:</h3>
            {
                htmlApplicants.length > 0 ? 
                    htmlApplicants
                :
                    <p>No applicants were found for this shift.</p>
            }
        </div>)}
    </Theme.Consumer>);
};
ShiftApplicants.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  catalog: PropTypes.object, //contains the data needed for the form to load
  context: PropTypes.object //contact any additional data for context purposes
};

/**
 * EditShift
 */
const EditShift = ({ onSave, onCancel, onChange, catalog, formData, error, bar }) => {
    return (
        <form>
            <div className="row">
                <div className="col-12">
                    { formData.hide_warnings === true ? null : (formData.status == 'DRAFT' && !error ) ?
                        <div className="alert alert-warning">This shift is a draft, it has not been published</div>
                        : (formData.status != 'UNDEFINED' && !error) ?
                            <div className="alert alert-success">This shift is published, therefore <strong>it needs to be unpublished</strong> before it can be updated</div>
                            :''
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Looking for</label>
                    <Select
                        value={ catalog.positions.find((pos) => pos.value == formData.position)}
                        onChange={(selection)=>onChange({position: selection.value.toString()})}
                        options={[{label: 'Select a position', value: ''}].concat(catalog.positions)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label>How many?</label>
                    <input type="number" className="form-control" 
                        value={formData.maximum_allowed_employees}
                        onChange={(e)=>onChange({maximum_allowed_employees: e.target.value})} 
                    />
                </div>
                <div className="col-6">
                    <label>Price / hour</label>
                    <input type="number" className="form-control" 
                        value={formData.minimum_hourly_rate}
                        onChange={(e)=>onChange({minimum_hourly_rate: e.target.value})} 
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label>From</label>
                    <DateTime 
                        timeFormat={DATETIME_FORMAT}
                        timeConstraints={{ minutes: { step: 15 }}}
                        value={formData.starting_at}
                        onChange={(value)=>onChange({starting_at: value})}
                    />
                </div>
                <div className="col-6">
                    <label>To</label>
                    <DateTime 
                        className="picker-left"
                        timeFormat={DATETIME_FORMAT}
                        timeConstraints={{ minutes: { step: 15 }}}
                        value={formData.ending_at}
                        onChange={(value)=>onChange({ending_at: value})}
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
                            <label>Search people in JobCore:</label>
                            <SearchCatalogSelect 
                                isMulti={true}
                                value={formData.pending_invites}
                                onChange={(selections)=> {
                                    const invite = selections.find(opt => opt.value == 'invite_talent');
                                    if(invite) bar.show({ 
                                        allowLevels: true,
                                        slug: "invite_talent_to_jobcore", 
                                        onSave: (emp) => onChange({ pending_jobcore_invites: formData.pending_jobcore_invites.concat(emp) })
                                    });
                                    else onChange({ pending_invites: selections });
                                }}
                                searchFunction={(search) => new Promise((resolve, reject) => 
                                    GET('catalog/employees?full_name='+search)
                                        .then(talents => resolve([
                                            { label: `${(talents.length==0) ? 'No one found: ':''}Invite "${search}" to jobcore`, value: 'invite_talent' }
                                        ].concat(talents)))
                                        .catch(error => reject(error))
                                )}
                            />
                        </div>
                    </div>
            }
            {(formData.pending_jobcore_invites.length>0) ?
                <div className="row">
                    <div className="col-12">
                        <p className="m-0 p-0">The following people will be invited to this shift after they accept your invitation to jobcore:</p>
                        {formData.pending_jobcore_invites.map((emp, i) => (
                            <span key={i} className="badge">{emp.first_name} {emp.last_name} <i className="fas fa-trash-alt"></i></span>
                        ))}
                    </div>
                </div> : ''
            }
            <div className="btn-bar">
                { (formData.status == 'DRAFT' || formData.status == 'UNDEFINED') ? 
                    <button type="button" className="btn btn-primary" onClick={() => onSave({status: 'DRAFT'})}>Save as draft</button>:''
                }
                { (formData.status == 'DRAFT') ? 
                    <button type="button" className="btn btn-success" onClick={() => {
                        const noti = Notify.info("Are you sure?",(answer) => {
                            if(answer) onSave({status: 'OPEN'});
                            noti.remove();
                        });
                    }}>Publish</button>
                    : (formData.status != 'UNDEFINED') ?
                        <button type="button" className="btn btn-primary" onClick={() => {
                            const noti = Notify.info("Are you sure you want to unpublish this shift?",(answer) => {
                                if(answer) onSave({status: 'DRAFT'});
                                noti.remove();
                            }, 9999999999999);
                        }}>Unpublish shift</button>
                        :
                        <button type="button" className="btn btn-success" onClick={() => onSave({status: 'OPEN'})}>Save and publish</button>
                }
                { (formData.status != 'UNDEFINED') ?
                    <button type="button" className="btn btn-danger" onClick={() => {
                        const noti = Notify.info("Are you sure you want to cancel this shift?",(answer) => {
                            if(answer) onSave({status: 'CANCELLED'});
                            noti.remove();
                        });
                    }}>Delete</button>:''
                }
            </div>
        </form>
    );
};
EditShift.propTypes = {
    error: PropTypes.string,
    bar: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * ShiftDetails
 */
export const ShiftDetails = (props) => {
    const shift = props.catalog.shifts.find(s => s.id == props.formData.id);
    if(!shift || typeof shift === 'undefined') return <div>Loading shift...</div>;
    return (<Theme.Consumer>
        {({ bar }) => (
            <div>
                <div className="top-bar">
                    <button type="button" className="btn btn-primary btn-sm rounded" onClick={() => props.onChange({ status: 'DRAFT', hide_warnings: true })}>
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <Button 
                        icon="candidates" color="primary" size="small" rounded={true} 
                        onClick={() => bar.show({ slug: "show_shift_applications", data: shift, title: "Shift Applicants", allowLevels: true })}
                        note={shift.candidates.length > 0 ? "The shift has applications that have not been reviwed" : null}
                        notePosition="left"
                    />
                    { shift.expired === true ?
                        <Button icon="dollar" color="primary" notePosition="left" size="small" rounded={true} 
                            note={shift.status !== 'OPEN' ? '': <span>This shift is expired and the payroll has not been processed</span>}
                            onClick={() => bar.show({ slug: "select_timesheet", data: shift, allowLevels: true })} />
                        :''
                    }
                </div>
                { props.formData.status === 'DRAFT' ? <EditShift bar={bar} {...props} /> : <ShowShift bar={bar} shift={shift} /> }
            </div>
        )}
    </Theme.Consumer>);
};
ShiftDetails.propTypes = {
    error: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    shift: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};

const ShowShift = ({ shift, bar}) => {
    const totalCandidates = (Array.isArray(shift.candidates)) ? shift.candidates.length : 0;
    const totalEmployees = (Array.isArray(shift.employees)) ? shift.employees.length : 0;
    const openVacancys = shift.maximum_allowed_employees;
    const startDate = shift.starting_at.format('ll');
    const startTime = shift.starting_at.format('LT');
    const endTime = shift.ending_at.format('LT');
    return (<div className="shift-details">
        <h3>{"Shift details"}</h3>
        {
            (shift.status == 'DRAFT') ? 
                <span href="#" className="badge badge-secondary">D</span> :
                    (openVacancys == totalEmployees) ? 
                        <span href="#" className="badge">{totalEmployees}/{openVacancys}</span> :
                        <span href="#" className="badge badge-danger">{totalEmployees}/{openVacancys}</span>
        }
        <a href="#" className="shift-position">{shift.position.title}</a> @ 
        <a href="#" className="shift-location"> {shift.venue.title}</a> 
        <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
        {
            (typeof shift.price == 'string') ? 
                <span className="shift-price"> ${shift.price}</span>
            :
                <span className="shift-price"> {shift.price.currencySymbol}{shift.price.amount}</span>
        }
    </div>);
};
ShowShift.propTypes = {
    shift: PropTypes.object.isRequired,
    bar: PropTypes.object.isRequired,
};
ShowShift.defaultProps = {
  shift: null,
  bar: null
};


/**
 * RateShift
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
                <label>Address</label>
                <PlacesAutocomplete 
                    value={formData.street_address || ''} 
                    onChange={(value)=>onChange({ street_address: value })}
                    onSelect={(address) => {
                        onChange({ street_address: address });
                        geocodeByAddress(address)
                          .then(results => {
                                const title = address.split(',')[0];
                                console.log(results[0].address_components);
                                const pieces = results[0].address_components;
                                const getPiece = (name) => pieces.find((comp) => typeof comp.types.find(type => type == name) != 'undefined');
                                const country = getPiece('country');
                                const state = getPiece('administrative_area_level_1');
                                const zipcode = getPiece('postal_code');
                                onChange({ title, country: country.long_name, state: state.long_name, zip_code: zipcode.long_name });
                                return getLatLng(results[0]);
                          })
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
            <div className="col-12">
                <label>Location nickname</label>
                <input type="text" className="form-control" 
                    value={formData.title}
                    onChange={(e)=>onChange({title: e.target.value})} 
                />
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
                          lng: -80.1918
                        }}
                        center={{
                          lat: formData.latitude,
                          lng: formData.longitude
                        }}
                        options={createMapOptions}
                        defaultZoom={12}
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