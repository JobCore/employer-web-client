import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, PrivateConsumer} from '../actions.js';
import {Avatar, StartRating} from './common';
import queryString from 'query-string';

import TimePicker from 'rc-time-picker';
const TIME_FORMAT = 'h:mm a';
import moment from 'moment';
const now = moment().hour(0).minute(0);


export class ManageFavorites extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            employees: []
        };
    }
    
    componentDidMount(){
        
        this.filter();
        this.subscribe(store, 'employees', (employees) => {
            this.filter(employees);
        });
        
        this.props.history.listen(() => {
            this.filter();
        });
        
    }
    
    filter(employees=null){
        let filters = this.getFilters();
        if(!employees) employees = store.getState('employees');
        if(employees){
            this.setState({
                employees: employees.filter((applicant) => {
                    for(let f in filters){
                        const matches = filters[f].matches(applicant);
                        if(!matches) return false;
                    }
                            
                    return true;
                }).sort((employee) => moment().diff(employee.created_at, 'minutes'))
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
    return (<PrivateConsumer>
        {({bar}) => 
            (<li className="aplicantcard"
                    onClick={() => bar.show({ slug: "show_single_applicant", data: {}, title: "Application Details" })}
                >
                <Avatar url={props.employee.profile.picture} />
                <a href="#">{props.employee.profile.user.first_name + " " + props.employee.profile.user.last_name}</a>
                <StartRating rating={Number(props.employee.rating)}  />
            </li>)}
    </PrivateConsumer>);
};
EmployeeExtendedCard.propTypes = {
  employee: PropTypes.object.isRequired
};