import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, create} from '../actions.js';
import {Avatar, Stars, Theme, Modal} from '../components/index';
import queryString from 'query-string';
import Select from 'react-select';
import moment from 'moment';

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
                case "rating":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => {
                            if(!filters.rating.value) return true;
                            if(isNaN(filters.rating.value)) return true;
                            return parseInt(shift.rating) >= filters.rating.value;
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
        return (<div className="p-1 listcontents">
            <h1>Your favorites</h1>
            {talentHTML}
        </div>);
    }
}


/**
 * Applican Card
 */
export const EmployeeExtendedCard = (props) => {
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplicantcard"
                    onClick={() => bar.show({ slug: "show_single_applicant", data: {}, title: "Application Details" })}
                >
                <Avatar url={props.employee.profile.picture} />
                <a href="#">{props.employee.profile.user.first_name + " " + props.employee.profile.user.last_name}</a>
                <Stars rating={Number(props.employee.rating)}  />
            </li>)}
    </Theme.Consumer>);
};
EmployeeExtendedCard.propTypes = {
  employee: PropTypes.object.isRequired
};

/**
 * Add To Favorite List
 */
export const AddTalentToFavlist = (props) => {
    
    const favlists = props.catalog.favlists.map(item => ({ value: item.id, label: item.title }));
    return (<form>
        <div className="row">
            <div className="col-12">
                <label>Pick your favorite lists:</label>
                <Select multi className="select-favlists"
                    value={props.formData.favoriteLists}
                    onChange={(selectedOption) => props.onChange({favoriteLists: selectedOption})} 
                    options={favlists.concat([{ value: 'new_favlist', label: "Add to new list" }])}
                >
                </Select>
            </div>
        </div>
        <p>Click on invite add the talent to your favorite lists</p>
        <div className="btn-bar">
            <button type="button" className="btn btn-primary" onClick={() => props.onSave()}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => props.onCancel()}>Cancel</button>
        </div>
    </form>);
};
AddTalentToFavlist.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

export class AddFavlist extends React.Component{
    constructor(){
        super();
        this.state = { listName: '' };
    }
    render(){
        return (<Modal>
            <h1>Please speficy the name of your new favorite list</h1>
            <input type="text" value={this.state.listName} onChange={(e)=> this.setState({listName: e.target.value})} />
            <p>
                <button className="btn btn-light" onClick={() => this.props.onConfirm(false)}>Cancel</button>
                <button className="btn btn-success ml-2" onClick={() => create('favlists', { title: this.state.listName }).then(() => this.props.onConfirm(true))}>
                    Confirm
                </button>
            </p>
        </Modal>);
    }
}
AddFavlist.propTypes = {
  onConfirm: PropTypes.func
};