import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, search} from '../actions.js';
import { GenericCard, Avatar, Stars, Theme, Button } from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';

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
        //foo: 'bar',
        serialize: function(){
            
            const newLocation = {
                //foo: 'bar'
            };
            
            return Object.assign(this, newLocation);
        }
    };
    
    let _entity = Object.assign(_defaults, data);
    return {
        validate: () => {
            
            return _entity;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formShift = {
                id: _entity.id,
                //favoriteLists: _entity.favoriteLists.map(fav => ({ label: fav.title, value: fav.id }))
            };
            return _formShift;
        },
        filters: () => {
            const _filters = {
                //positions: _entity.positions.map( item => item.value ),
                //rating: (typeof _entity.rating == 'object') ? _entity.rating.value : undefined,
                //badges: _entity.badges.map( item => item.value )
            };
            for(let key in _entity) if(typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
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
        search(ENTITIY_NAME, window.location.search);
    }
    
    render() {
        if(this.state.firstSearch) return <p>Search for any location</p>;
        const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    <h1><span id="talent_search_header">Location Search</span></h1>
                    {this.state.locations.map((l,i) => (
                        <GenericCard key={i} onClick={() => bar.show({ slug: "show_single_location", data: l, allowLevels })}>
                            <p>{l.title}</p>
                            <div className="btn-bar">
                                <Button icon="pencil" onClick={() => null}><label>Edit</label></Button>
                                <Button icon="trash" onClick={() => bar.show({ slug: "delete_location", data: l, allowLevels })}><label>Delete</label></Button>
                            </div>
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
 * Talent Details
 */
export const LocationDetails = (props) => {
    const employee = props.catalog.employee;
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplication-details">
                <Avatar url={process.env.API_HOST+employee.user.profile.picture} />
                <p>{typeof employee.fullName == 'function' ? employee.fullName() : employee.first_name + ' ' + employee.last_name}</p>
                <div>
                    <Stars className="float-left" rating={Number(employee.rating)} jobCount={employee.job_count}  />
                </div>
                <p>$ {employee.minimum_hourly_rate} /hr Minimum Rate</p>
                <p>{employee.user.profile.bio}</p>
                <div className="btn-bar">
                    <Button color="primary" onClick={() => bar.show({ slug: "invite_talent", data: employee, allowLevels:true })}>Invite to shift</Button>
                    <Button color="success" onClick={() => bar.show({ slug: "add_to_favlist", data: employee, allowLevels:true })}>Add to favorites</Button>
                </div>
            </li>)}
    </Theme.Consumer>);
};
LocationDetails.propTypes = {
  catalog: PropTypes.object.isRequired
};