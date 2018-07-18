import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, PrivateConsumer, search} from '../actions.js';
import {Avatar, StartRating} from './common';
import Select from 'react-select';
import queryString from 'query-string';
import TimePicker from 'rc-time-picker';
const TIME_FORMAT = 'h:mm a';
import moment from 'moment';
const now = moment().hour(0).minute(0);

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
                //foo: _entity.bar
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
 * Applican Card
 */
export const EmployeeExtendedCard = (props) => {
    const badgesHTML = props.employee.badges.map((b, i) => (<span key={i} className="badge">{b.title}</span>));
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className="aplicantcard aplicantcard-hover">
                <Avatar url={props.employee.profile.picture} />
                <a href="#"><b>{props.employee.profile.user.first_name + " " + props.employee.profile.user.last_name}</b></a>
                <StartRating rating={Number(props.employee.rating)} jobCount={props.employee.positions.length}  />
                <p href="#">{badgesHTML}</p>
                
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary"
                        onClick={() => bar.show({ slug: "show_single_talent", data: props.employee, title: "Talent Details" })}
                    ><i className="icon icon-favorite icon-xs"></i> <label>Detals</label></button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => bar.show({ slug: "invite_talent", data: props.employee, title: "Invite Talent" })}
                    ><i className="icon icon-favorite icon-xs"></i> <label>Invite</label></button>
                </div>
            </li>)}
    </PrivateConsumer>);
};
EmployeeExtendedCard.propTypes = {
  employee: PropTypes.object.isRequired
};

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
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className="aplication-details">
                <Avatar url={employee.profile.picture} />
                <p>{employee.profile.user.first_name + " " + employee.profile.user.last_name}</p>
                <StartRating rating={Number(employee.rating)}  />
                <span>Doing 4 jobs</span>
                <p>$ 13 /hr Minimum Rate</p>
                <p>{employee.profile.bio}</p>
                <div className="btn-bar">
                    <button type="button" className="btn btn-primary" 
                        onClick={() => bar.show({ slug: "invite_talent", data: employee, title: "Invite Talent" })}
                    >Invite</button>
                    <button type="button" className="btn btn-success" 
                        onClick={() => bar.show({ slug: "add_to_favorites", data: employee, title: "Add to favorites" })}
                    >Add to favorites</button>
                    <button type="button" className="btn btn-secondary" onClick={() => bar.close()}>Close</button>
                </div>
            </li>)}
    </PrivateConsumer>);
};
TalentDetails.propTypes = {
  catalog: PropTypes.object.isRequired
};



const ShiftOption = (option) => {
    const startDate = option.value.date.format('ll');
    const startTime = option.value.start_time.format('LT');
    const endTime = option.value.finish_time.format('LT');
    return (<div className="Select-value shift-option">
        <a href="#" className="shift-position">{option.value.position.title}</a> @ 
        <a href="#" className="shift-location"> {option.value.venue.title}</a> 
        <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
    </div>);
};
ShiftOption.propTypes = {
	children: PropTypes.node,
	value: PropTypes.object
};

/**
 * AddShift
 */
export const InviteTalent = (props) => {
    
    const shifts = props.catalog.shifts.map(item => ({ value: item, label: '' }));
    return (<form>
        <div className="row">
            <div className="col-12">
                <label>Select the shifts you want to invite the talent to:</label>
                <Select multi
                    value={props.formData.shifts}
                    optionRenderer={ShiftOption}
                    onChange={(selectedOption)=>props.onChange({shifts: selectedOption})} 
                    options={shifts}
                    valueRenderer={ShiftOption}
                >
                </Select>
            </div>
        </div>
        <div className="btn-bar">
            <button type="button" className="btn btn-primary" onClick={() => props.onSave()}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => props.onCancel()}>Cancel</button>
        </div>
    </form>);
};
InviteTalent.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};