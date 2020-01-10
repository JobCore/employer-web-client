import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, searchMe, remove} from '../actions.js';
import { GenericCard, Theme, Button } from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';

import {validator, ValidationError} from '../utils/validation';

import {Notify} from 'bc-react-notifier';

import GoogleMapReact from 'google-map-react';
import markerURL from '../../img/marker.png';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';

const ENTITIY_NAME = 'venues';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getTalentInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {};
    if(!Array.isArray(query.positions)) query.positions = (typeof query.positions == 'undefined') ? [] : [query.positions];
    if(!Array.isArray(query.badges)) query.badges = (typeof query.badges == 'undefined') ? [] : [query.badges];
    return {
        positions: query.positions.map(pId => catalog.positions.find(pos => pos.value == pId)),
        badges: query.badges.map(bId => catalog.badges.find(b => b.value == bId)),
        rating: catalog.stars.find(rate => rate.value == query.rating)
    };
};

export const Location = (data) => {

    const _defaults = {
        id: '',
        title: '',
        street_address: '',
        country: '',
        latitude: 25.7617,
        longitude: 80.1918,
        state: '',
        zip_code: '',
        serialize: function(){

            const newLocation = {
                latitude: this.latitude.toFixed(6),
                longitude: this.longitude.toFixed(6)
//                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
            };

            return Object.assign(this, newLocation);
        }
    };

    let _location = Object.assign(_defaults, data);
    return {
        validate: () => {
            if(validator.isEmpty(_location.title)) throw new ValidationError('The location title cannot be empty');
            if(validator.isEmpty(_location.street_address)) throw new ValidationError('The location address cannot be empty');
            if(validator.isEmpty(_location.country)) throw new ValidationError('The location country cannot be empty');
            if(validator.isEmpty(_location.state)) throw new ValidationError('The location state cannot be empty');
            if(validator.isEmpty(_location.zip_code)) throw new ValidationError('The location zip_code cannot be empty');
            return _location;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formShift = {
                id: _location.id.toString(),
                title: _location.title,
                street_address: _location.street_address,
                latitude: parseFloat(_location.latitude),
                longitude: parseFloat(_location.longitude),
                country: _location.country,
                state: _location.state,
                date: _location.zip_code
            };
            return _formShift;
        }
    };
};

export class ManageLocations extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            locations: []
        };
    }

    componentDidMount(){

        this.filter();
        this.subscribe(store, ENTITIY_NAME, (locations) => {
            this.setState({ locations });
        });

        this.props.history.listen(() => {
            this.filter();
            this.setState({ firstSearch: false });
        });
    }

    filter(locations=null){
        searchMe(ENTITIY_NAME, window.location.search);
    }

    render() {
        if(this.state.firstSearch) return <p>Search for any location</p>;
        const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    <h1><span id="talent_search_header">Location Search</span></h1>
                    {this.state.locations.map((l,i) => (
                        <GenericCard key={i} hover={true} onClick={() => bar.show({ slug: "update_location", data: l, allowLevels })}>
                            <div className="btn-group">
                                <Button icon="pencil" onClick={() => bar.show({ slug: "update_location", data: l, allowLevels })}></Button>
                                <Button icon="trash" onClick={() => {
                                    const noti = Notify.info("Are you sure you want to delete this location?",(answer) => {
                                        if(answer) remove('venues', l);
                                        noti.remove();
                                    });
                                }}></Button>
                            </div>
                            <p className="mt-2">{l.title}</p>
                        </GenericCard>
                    ))}
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}

/**
 * AddShift
 */
export const FilterLocations = (props) => {
    return (<form>
        <div className="row">
            <div className="col-6">
                <label>First Name:</label>
                <input className="form-control"
                    value={props.formData.first_name}
                    onChange={(e)=>props.onChange({ first_name: e.target.value })}
                />
            </div>
            <div className="col-6">
                <label>Last Name:</label>
                <input className="form-control"
                    value={props.formData.last_name}
                    onChange={(e)=>props.onChange({ last_name: e.target.value })}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <label>Experience in past positions:</label>
                <Select isMulti
                    value={props.formData.positions}
                    onChange={(selectedOption)=>props.onChange({positions: selectedOption})}
                    options={props.catalog.positions}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <label>Badges:</label>
                <Select isMulti
                    value={props.formData.badges}
                    onChange={(selectedOption)=>props.onChange({badges: selectedOption})}
                    options={props.catalog.badges}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <label>Minimum start rating</label>
                <Select
                    value={props.formData.rating}
                    onChange={(opt)=>props.onChange({rating: opt})}
                    options={props.catalog.stars}
                />
            </div>
        </div>
        <div className="btn-bar">
            <Button color="primary" onClick={() => props.onSave()}>Apply Filters</Button>
            <Button color="secondary" onClick={() => props.onSave(false)}>Clear Filters</Button>
        </div>
    </form>);
};
FilterLocations.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * Add a Location
 */
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
export const AddOrEditLocation = ({onSave, onCancel, onChange, catalog, formData}) => (<Theme.Consumer>
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
                        bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_WEB_KEY }}
                        defaultCenter={{
                          lat: 25.7617,
                          lng: -80.1918
                        }}
                        width="100%"
                        height="100%"
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
AddOrEditLocation.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};