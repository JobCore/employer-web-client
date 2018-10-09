import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import Select from 'react-select';
import {AcceptReject, Avatar, Stars, Theme, Wizard} from '../components/index';
import {store, rejectCandidate, acceptCandidate} from '../actions.js';
import queryString from 'query-string';
import {TIME_FORMAT, DATE_FORMAT, NOW} from '../components/utils.js';
import moment from 'moment';
import {callback, hasTutorial} from '../utils/tutorial';
//gets the querystring and creats a formData object to be used when opening the rightbar
export const getApplicationsInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {};
    if(!Array.isArray(query.positions)) query.positions = (typeof query.positions == 'undefined') ? [] : [query.positions];
    if(!Array.isArray(query.venues)) query.venues = (typeof query.venues == 'undefined') ? [] : [query.venues];
    return {
        positions: query.positions.map(pId => catalog.positions.find(pos => pos.value == pId)),
        venues: query.venues.map(bId => catalog.venues.find(b => b.value == bId))
    };
};

export const Application = (data) => {
    
    const _defaults = {
        //foo: 'bar',
        serialize: function(){
            
            const newEntity = {
                //foo: 'bar'
                // favoritelist_set: data.favoriteLists.map(fav => fav.value)
            };
            
            return Object.assign(this, newEntity);
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
            // const _formShift = {
            //     id: _entity.id,
            //     favoriteLists: _entity.favoriteLists.map(fav => ({ label: fav.title, value: fav.id }))
            // };
            // return _formShift;
        },
        filters: () => {
            const _filters = {
                positions: _entity.positions.map( item => item.value ),
                //rating: (typeof _entity.rating == 'object') ? _entity.rating.value : undefined,
                venues: _entity.venues.map( item => item.value )
            };
            for(let key in _entity) if(typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
        }
    };
};

export class ManageApplicantions extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            applicants: [],
            runTutorial: hasTutorial(),
            steps: [
                {
                    target: '#applicant_details_header',
                    content: 'Here is everyone that has applied to your shifts but you haven\'t accepted or rejected',
                    placement: 'right'
                },
                {
                    target: '#filter_applicants',
                    content: 'You can also filter this list of applicants by any desired criteria',
                    placement: 'left'
                }
            ]
        };
    }
    
    componentDidMount(){
        
        this.filter();
        this.subscribe(store, 'applicants', (applicants) => {
            this.filter(applicants);
        });
        
        this.props.history.listen(() => {
            this.filter();
        });
        this.setState({ runTutorial: true });
        
    }
    
    filter(applicants=null){
        let filters = this.getFilters();
        if(!applicants) applicants = store.getState('applicants');
        if(applicants){
            this.setState({
                applicants: applicants.filter((applicant) => {
                    for(let f in filters){
                        const matches = filters[f].matches(applicant);
                        if(!matches) return false;
                    }
                            
                    return true;
                }).sort((applicant) => moment().diff(applicant.created_at, 'minutes'))
            });
        }
        else this.setState({applicant: []});
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
        const applicansHTML = this.state.applicants.map((a,i) => (<ApplicantExtendedCard key={i} applicant={a} shift={a.shift} hover={true} />));
        return (<div className="p-1 listcontents">
            <Wizard continuous
              steps={this.state.steps}
              run={this.state.runTutorial}
              callback={callback}
            />
            <h1><span id="applicant_details_header">Applicant Details</span></h1>
            {
                (applicansHTML.length == 0) ?
                    <p>No applicants were found for this shift.</p>
                :
                    applicansHTML
            }
        </div>);
    }
}

/**
 * Applican Card
 */
export const ApplicantCard = (props) => {
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplicantcard">
                <Avatar url={props.applicant.profile.picture} />
                <AcceptReject
                    onAccept={() => acceptCandidate(props.shift.id, props.applicant)} 
                    onReject={() => rejectCandidate(props.shift.id, props.applicant)} 
                />
                <a href="#" className="shift-position">{props.applicant.profile.user.first_name + " " + props.applicant.profile.user.last_name}</a>
                <Stars rating={Number(props.applicant.rating)}  />
            </li>)}
    </Theme.Consumer>);
};
ApplicantCard.propTypes = {
  applicant: PropTypes.object.isRequired,
  shift: PropTypes.object.isRequired
};

/**
 * Applican Card
 */
export const ApplicantExtendedCard = (props) => {
    const startDate = props.shift.starting_at.format('ll');
    const startTime = props.shift.starting_at.format('LT');
    const endTime = props.shift.ending_at.format('LT');
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplicantcard"
                    onClick={() => bar.show({ slug: "show_single_applicant", data: props.applicant.employee, title: "Application Details" })}
                >
                <Avatar url={props.applicant.employee.user.profile.picture} />
                <AcceptReject
                    onAccept={() => acceptCandidate(props.shift.id, props.applicant.employee)} 
                    onReject={() => rejectCandidate(props.shift.id, props.applicant.employee)} 
                />
                <p>
                    <a href="#" className="shift-position">{props.applicant.employee.user.first_name + " " + props.applicant.employee.user.last_name} </a>
                    is applying for the {props.shift.position.title} position
                    at the <a href="#" className="shift-location"> {props.shift.venue.title}</a> 
                    <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                    {
                        (typeof props.shift.price == 'string') ? 
                            <span className="shift-price"> ${props.shift.price}/hr.</span>
                        :
                            <span className="shift-price"> {props.shift.price.currencySymbol}{props.shift.price.amount}/{props.shift.price.timeframe}.</span>
                    }
                </p>
                <Stars rating={Number(props.applicant.employee.rating)}  />
            </li>)}
    </Theme.Consumer>);
};
ApplicantExtendedCard.propTypes = {
  applicant: PropTypes.object.isRequired,
  shift: PropTypes.object.isRequired
};


/**
 * Application Details
 */
export const ApplicationDetails = (props) => {
    const applicant = props.catalog.applicant;
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplication-details">
                <Avatar url={applicant.user.profile.picture} />
                <p>{applicant.user.first_name + " " + applicant.user.last_name}</p>
                <Stars rating={Number(applicant.rating)}  />
                <span>Doing 4 jobs</span>
                <p>$ 13 /hr Minimum Rate</p>
                <p>{applicant.user.profile.bio}</p>
                <AcceptReject
                    showLabels={true}
                    onAccept={() => acceptCandidate(applicant.shift.id, applicant)} 
                    onReject={() => rejectCandidate(applicant.shift.id, applicant)} 
                />
            </li>)}
    </Theme.Consumer>);
};
ApplicationDetails.propTypes = {
  catalog: PropTypes.object.isRequired
};


/**
 * Filter Applications
 */
export const FilterApplications = ({onSave, onCancel, onChange, catalog, formData}) => (<form>
    <div className="row">
        <div className="col">
            <label>Looking for</label>
            <Select isMulti
                value={formData.positions}
                options={catalog.positions}
                onChange={(selection) => onChange({ positions: selection })}
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
            <label>Venue</label>
            <Select isMulti
                value={formData.venues}
                options={catalog.venues}
                onChange={(selection) => onChange({ venues: selection })}
            />
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-primary" onClick={() => onSave()}>Apply Filters</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);
FilterApplications.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object, //contains the data needed for the form to load
  catalog: PropTypes.object //contains the data needed for the form to load
};