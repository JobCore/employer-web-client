import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, search} from '../actions.js';
import {callback, hasTutorial} from '../utils/tutorial';
import {EmployeeExtendedCard, Avatar, Stars, Theme, Button, Wizard} from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';
import {Session} from 'bc-react-session';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getRatingInitialFilters = (catalog) => {
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

export const Rating = (data) => {

    const session = Session.getPayload();
    const _defaults = {
        //foo: 'bar',
        serialize: function(){

            const newRating = {
                //foo: 'bar'
            };

            return Object.assign(this, newRating);
        },
        unserialize: function(){
            //this.fullName = function() { return (this.user.first_name.length>0) ? this.user.first_name + ' ' + this.user.last_name : 'No name specified'; };

            return this;
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
            const _formRating = {
                //id: _entity.id,
            };
            return _formRating;
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

export class ManageRating extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            ratings: [],
            runTutorial: hasTutorial(),
            steps: [
                {
                    target: '#talent_search_header',
                    content: 'In this page you can search our entire talent network',
                    placement: 'right'
                },
                {
                    target: '#filter_talent',
                    content: 'Start by filtering by name, experience, badges or minium star rating',
                    placement: 'left'
                }
            ]
        };
    }

    componentDidMount(){

        this.filter();
        this.subscribe(store, 'ratings', (employees) => {
            this.setState({ employees });
        });

        this.props.history.listen(() => {
            this.filter();
            this.setState({ firstSearch: false });
        });
        this.setState({ runTutorial: true });
    }

    filter(employees=null){
        search('employees', window.location.search);
    }

    render() {
        if(this.state.firstSearch) return <p>Please search for an employee</p>;
        const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    <Wizard continuous
                      steps={this.state.steps}
                      run={this.state.runTutorial}
                      callback={callback}
                    />
                    <h1><span id="talent_search_header">Talent Search</span></h1>
                    {this.state.employees.map((s,i) => (
                        <EmployeeExtendedCard key={i} employee={s} hover={true}
                            onClick={() => bar.show({ slug: "show_single_talent", data: s, allowLevels })}>
                            <Button icon="favorite" onClick={() => bar.show({ slug: "add_to_favlist", data: s, allowLevels })}><label>Favorites</label></Button>
                            <Button icon="favorite" onClick={() => bar.show({ slug: "invite_talent_to_shift", data: s, allowLevels })}><label>Invite</label></Button>
                        </EmployeeExtendedCard>
                    ))}
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}

/**
 * AddShift
 */
export const FilterTalents = (props) => {
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

                <Avatar url={employee.user.profile.picture} />
                <p>{typeof employee.fullName == 'function' ? employee.fullName() : employee.first_name + ' ' + employee.last_name}</p>
                <div>
                    <Stars className="float-left" rating={Number(employee.rating)} jobCount={employee.job_count}  />
                </div>
                <p>$ {employee.minimum_hourly_rate} /hr minimum expected rate</p>
                <p>{employee.user.profile.bio}</p>
                <div className="btn-bar">
                    <Button color="primary" onClick={() => bar.show({ slug: "invite_talent_to_shift", data: employee, allowLevels:true })}>Invite to shift</Button>
                    <Button color="success" onClick={() => bar.show({ slug: "add_to_favlist", data: employee, allowLevels:true })}>Add to favorites</Button>
                </div>
            </li>)}
    </Theme.Consumer>);
};
TalentDetails.propTypes = {
  catalog: PropTypes.object.isRequired
};