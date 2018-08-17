import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {AcceptReject, Avatar, Stars, Theme} from '../components/index';
import {store, rejectCandidate, acceptCandidate} from '../actions.js';
import queryString from 'query-string';
import {TIME_FORMAT, DATE_FORMAT, NOW} from '../components/utils.js';
import moment from 'moment';
import Joyride from 'react-joyride';
//gets the querystring and creats a formData object to be used when opening the rightbar
export const getApplicantInitialFilters = () => {
    return {};
};

export class ManageApplicants extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            applicants: [],
            runTutorial: false,
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
            <Joyride continuous
              steps={this.state.steps}
              run={this.state.runTutorial}
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
    const startDate = props.shift.date.format('ll');
    const startTime = props.shift.start_time.format('LT');
    const endTime = props.shift.finish_time.format('LT');
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplicantcard"
                    onClick={() => bar.show({ slug: "show_single_applicant", data: props.applicant.employee, title: "Application Details" })}
                >
                <Avatar url={props.applicant.employee.profile.picture} />
                <AcceptReject
                    onAccept={() => acceptCandidate(props.shift.id, props.applicant.employee)} 
                    onReject={() => rejectCandidate(props.shift.id, props.applicant.employee)} 
                />
                <p>
                    <a href="#" className="shift-position">{props.applicant.employee.profile.user.first_name + " " + props.applicant.employee.profile.user.last_name} </a>
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
                <Avatar url={applicant.profile.picture} />
                <p>{applicant.profile.user.first_name + " " + applicant.profile.user.last_name}</p>
                <Stars rating={Number(applicant.rating)}  />
                <span>Doing 4 jobs</span>
                <p>$ 13 /hr Minimum Rate</p>
                <p>{applicant.profile.bio}</p>
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
 * AddShift
 */
export const FilterApplicants = ({onSave, onCancel, onChange, catalog}) => (<form>
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
                <option value={'OPEN'}>OPEN</option>
                <option value={'UPCOMING'}>UPCOMING</option>
            </select>
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-primary" onClick={() => onSave()}>Apply Filters</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);
FilterApplicants.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  catalog: PropTypes.object //contains the data needed for the form to load
};