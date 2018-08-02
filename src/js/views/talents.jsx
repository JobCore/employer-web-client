import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, search} from '../actions.js';
import {EmployeeExtendedCard, ShiftOption, Avatar, Stars, Theme} from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';

import {Session} from '@breathecode/react-session';
const user = Session.store.getSession().user;

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getTalentInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {};
    if(!Array.isArray(query.positions)) query.positions = (typeof query.positions == 'undefined') ? [] : [query.positions];
    if(!Array.isArray(query.badges)) query.badges = (typeof query.badges == 'undefined') ? [] : [query.badges];
    return {
        positions: query.positions.map(pId => {
            const position = catalog.positions.find(pos => pos.id = pId);
            return { value: position.id, label: position.title };
        }),
        badges: query.badges.map(bId => {
            const badge = catalog.badges.find(b => b.id = bId);
            return { value: badge.id, label: badge.title };
        })
    };
};

export const Talent = (data) => {
    
    const _defaults = {
        //foo: 'bar',
        serialize: function(){
            
            const newShift = {
                //foo: 'bar'
                favoritelist_set: data.favoriteLists.map(fav => fav.value)
            };
            
            return Object.assign(this, newShift);
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
                favoriteLists: _entity.favoriteLists.map(fav => ({ label: fav.title, value: fav.id }))
            };
            return _formShift;
        },
        filters: () => {
            const _filters = {
                positions: _entity.positions.map( item => item.value ),
                badges: _entity.badges.map( item => item.value )
            };
            for(let key in _entity) if(typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
        }
    };
};

export const ShiftInvite = (data) => {
    
    const _defaults = {
        //foo: 'bar',
        serialize: function(){
            
            const newShift = {
                //foo: 'bar'
                sender: user.id,
                shifts: data.shifts.map(s => s.id || s.value.id)
            };
            
            return Object.assign(this, newShift);
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
                employee: _entity.id
            };
            return _formShift;
        },
        filters: () => {
            const _filters = {
                //positions: _entity.positions.map( item => item.value ),
            };
            for(let key in _entity) if(typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
        }
    };
};

export class ManageTalents extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            employees: []
        };
    }
    
    componentDidMount(){
        
        this.filter();
        this.subscribe(store, 'employees', (employees) => {
            this.setState({ employees });
        });
        
        this.props.history.listen(() => {
            this.filter();
        });
        
    }
    
    filter(employees=null){
        search('employees', window.location.search);
    }
    
    render() {
        const talentHTML = this.state.employees.map((s,i) => (<EmployeeExtendedCard key={i} employee={s} hover={true} />));
        return (<div className="p-5 listcontents">
            <h1>Talent Details</h1>
            {talentHTML}
        </div>);
    }
}

/**
 * AddShift
 */
export const FilterTalents = (props) => {
    
    const positions = props.catalog.positions.map(pos => ({ value: pos.id, label: pos.title }));
    const badges = props.catalog.badges.map(bad => ({ value: bad.id, label: bad.title }));
    return (<form>
        <div className="row">
            <div className="col-12">
                <label>Experience in past positions:</label>
                <Select multi
                    value={props.formData.positions}
                    onChange={(selectedOption)=>props.onChange({positions: selectedOption})} 
                    options={positions}
                >
                </Select>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <label>Badges:</label>
                <Select multi
                    value={props.formData.badges}
                    onChange={(selectedOption)=>props.onChange({badges: selectedOption})} 
                    options={badges}
                >
                </Select>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <label>Minimum start rating</label>
                <select className="form-control" 
                    value={props.formData.rating}
                    onChange={(e)=>props.onChange({rating: e.target.value})} 
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
            <button type="button" className="btn btn-primary" onClick={() => props.onSave()}>Apply Filters</button>
            <button type="button" className="btn btn-secondary" onClick={() => props.onCancel()}>Cancel</button>
        </div>
    </form>);
};
FilterTalents.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * Talent Details
 */
export const TalentDetails = (props) => {
    const employee = props.catalog.employee;
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplication-details">
                <Avatar url={employee.profile.picture} />
                <p>{employee.profile.user.first_name + " " + employee.profile.user.last_name}</p>
                <Stars rating={Number(employee.rating)}  />
                <span>Doing 4 jobs</span>
                <p>$ 13 /hr Minimum Rate</p>
                <p>{employee.profile.bio}</p>
                <div className="btn-bar">
                    <button type="button" className="btn btn-primary" 
                        onClick={() => bar.show({ slug: "invite_talent", data: employee, title: "Invite Talent" })}
                    >Invite</button>
                    <button type="button" className="btn btn-success" 
                        onClick={() => bar.show({ slug: "add_to_favlist", data: employee, title: "Add to favorites" })}
                    >Add to favorites</button>
                    <button type="button" className="btn btn-secondary" onClick={() => bar.close()}>Close</button>
                </div>
            </li>)}
    </Theme.Consumer>);
};
TalentDetails.propTypes = {
  catalog: PropTypes.object.isRequired
};

/**
 * AddShift
 */
export const InviteTalentToShift = (props) => {
    
    const shifts = props.catalog.shifts.filter(s => s.status == 'OPEN').map(item => ({ value: item, label: '' }));
    return (<form>
        <div className="row">
            <div className="col-12">
                <label>Pick your shifts:</label>
                <Select multi className="select-shifts"
                    value={props.formData.shifts}
                    optionRenderer={ShiftOption}
                    onChange={(selectedOption)=>props.onChange({shifts: selectedOption})} 
                    options={shifts}
                    valueRenderer={ShiftOption}
                >
                </Select>
            </div>
        </div>
        <p>Click on invite to invite the talent to your selected shifts</p>
        <div className="btn-bar">
            <button type="button" className="btn btn-primary" onClick={() => props.onSave()}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => props.onCancel()}>Cancel</button>
        </div>
    </form>);
};
InviteTalentToShift.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * ShiftDetails
 */
export const InviteTalentToJobcore = ({ onSave, onCancel, onChange, catalog, formData }) => (<form>
    <div className="row">
        <div className="col-12">
            <label>Talent First Name</label>
            <input type="text" className="form-control"
                onChange={(e)=>onChange({first_name: e.target.value})} 
            />
        </div>
        <div className="col-12">
            <label>Talent Last Name</label>
            <input type="text" className="form-control"
                onChange={(e)=>onChange({last_name: e.target.value})} 
            />
        </div>
        <div className="col-12">
            <label>Talent email</label>
            <input type="email" className="form-control"
                onChange={(e)=>onChange({email: e.target.value})} 
            />
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-success" onClick={() => onSave()}>Send Invite</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);
InviteTalentToJobcore.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};