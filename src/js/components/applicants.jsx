import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {Avatar, StartRating} from './common';
import {store, PrivateConsumer, rejectCandidate, acceptCandidate} from '../actions.js';
import queryString from 'query-string';

import TimePicker from 'rc-time-picker';
const TIME_FORMAT = 'h:mm a';
import moment from 'moment';
const now = moment().hour(0).minute(0);


export class ManageApplicants extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            applicants: []
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
        const applicansHTML = this.state.applicants.map((s,i) => (<ApplicantExtendedCard key={i} applicant={s} hover={true} />));
        return (<div className="p-5 listcontents">
            <h1>Applicant Details</h1>
            {
                (applicansHTML.length == 0) ?
                    <p>No applicants were found for this shift.</p>
                :
                    applicansHTML
            }
        </div>);
    }
}

const AcceptReject = (props) => {
    return (<div className={"accept-reject "+props.className}>
        <button className="btn btn-danger" onClick={() => props.onReject()}>
            <i className="fas fa-times-circle"></i>
            {(props.showLabels) ? <label>Reject</label> : ''}
        </button>
        <button className="btn btn-success"onClick={() => props.onAccept()}>
            <i className="fas fa-check-circle"></i>
            {(props.showLabels) ? <label>Accept</label> : ''}
        </button>
    </div>);
};
AcceptReject.propTypes = {
  className: PropTypes.string,
  showLabels: PropTypes.bool,
  onReject: PropTypes.func,
  onAccept: PropTypes.func,
};
AcceptReject.defaultProps = {
  className: '',
  showLabels: false
};

/**
 * Applican Card
 */
export const ApplicantCard = (props) => {
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className="aplicantcard">
                <Avatar url={props.applicant.profile.picture} />
                <AcceptReject
                    onAccept={() => acceptCandidate(props.applicant.shift.id, props.applicant)} 
                    onReject={() => rejectCandidate(props.applicant.shift.id, props.applicant)} 
                />
                <a href="#" className="shift-position">{props.applicant.profile.user.first_name + " " + props.applicant.profile.user.last_name}</a>
                <StartRating rating={Number(props.applicant.rating)}  />
            </li>)}
    </PrivateConsumer>);
};
ApplicantCard.propTypes = {
  applicant: PropTypes.object.isRequired,
  shift: PropTypes.object.isRequired
};

/**
 * Applican Card
 */
export const ApplicantExtendedCard = (props) => {
    const startDate = props.applicant.shift.date.format('ll');
    const startTime = props.applicant.shift.start_time.format('LT');
    const endTime = props.applicant.shift.finish_time.format('LT');
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className="aplicantcard"
                    onClick={() => bar.show({ slug: "show_single_applicant", data: props.applicant.employee, title: "Application Details" })}
                >
                <Avatar url={props.applicant.employee.profile.picture} />
                <AcceptReject
                    onAccept={() => acceptCandidate(props.applicant.shift.id, props.applicant.employee)} 
                    onReject={() => rejectCandidate(props.applicant.shift.id, props.applicant.employee)} 
                />
                <p>
                    <a href="#" className="shift-position">{props.applicant.employee.profile.user.first_name + " " + props.applicant.employee.profile.user.last_name} </a>
                    is applying for the {props.applicant.shift.position.title} position
                    at the <a href="#" className="shift-location"> {props.applicant.shift.venue.title}</a> 
                    <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                    {
                        (typeof props.applicant.shift.price == 'string') ? 
                            <span className="shift-price"> ${props.applicant.shift.price}/hr.</span>
                        :
                            <span className="shift-price"> {props.applicant.shift.price.currencySymbol}{props.applicant.shift.price.amount}/{props.applicant.shift.price.timeframe}.</span>
                    }
                </p>
                <StartRating rating={Number(props.applicant.employee.rating)}  />
            </li>)}
    </PrivateConsumer>);
};
ApplicantExtendedCard.propTypes = {
  applicant: PropTypes.object.isRequired
};


/**
 * Application Details
 */
/**
 * Applican Card
 */
export const ApplicationDetails = (props) => {
    const applicant = props.catalog.applicant;
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className="aplication-details">
                <Avatar url={applicant.profile.picture} />
                <p>{applicant.profile.user.first_name + " " + applicant.profile.user.last_name}</p>
                <StartRating rating={Number(applicant.rating)}  />
                <span>Doing 4 jobs</span>
                <p>$ 13 /hr Minimum Rate</p>
                <p>{applicant.profile.bio}</p>
                <AcceptReject
                    showLabels={true}
                    onAccept={() => acceptCandidate(applicant.shift.id, applicant)} 
                    onReject={() => rejectCandidate(applicant.shift.id, applicant)} 
                />
                <button className="btn btn-secondary" onClick={() => bar.close()}>Cancel</button>
            </li>)}
    </PrivateConsumer>);
};
ApplicationDetails.propTypes = {
  catalog: PropTypes.object.isRequired
};