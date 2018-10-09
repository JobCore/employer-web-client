import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import {store, fetchSingle, update} from '../actions.js';
import {TIME_FORMAT, DATE_FORMAT, NOW} from '../components/utils.js';
import {Session} from 'bc-react-session';
import {validator, ValidationError} from '../utils/validation';

export const Employer = (data) => {
    
    const _defaults = {
        title: '',
        website: '',
        bio: '',
        response_time: 'not yet calculated',
        rating: 'not yet calculated',
        serialize: function(){
            
            const newShift = {
//                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
            };
            
            return Object.assign(this, newShift);
        }
    };
    
    let _employer = Object.assign(_defaults, data);
    return {
        validate: () => {
            if(validator.isEmpty(_employer.bio)) throw new ValidationError('The company bio cannot be empty');
            if(validator.isEmpty(_employer.title)) throw new ValidationError('The company name cannot be empty');
            if(validator.isEmpty(_employer.website)) throw new ValidationError('The company website cannot be empty');
            return _employer;
        },
        defaults: () => {
            return _defaults;
        }
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
                latitude: _location.latitude,
                longitude: _location.longitude,
                country: _location.country,
                state: _location.state,
                date: _location.zip_code
            };
            return _formShift;
        }
    };
};

export class Profile extends Flux.DashView {
    
    constructor(){
        super();
        this.state = {
            employer: {
                title: '',
                website: '',
                bio: '',
                response_time: 'not yet calculated',
                rating: 'not yet calculated'
            }
        };
    }
    
    setEmployer(newEmployer){
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }
    
    componentDidMount(){
        
        const payload = Session.getPayload();
        fetchSingle('employers', payload.user.profile.employer, 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });
        
    }
    
    render() {
        return (<div className="p-1 listcontents">
            <h1><span id="company_details">Company Details</span></h1>
            <form>
                <div className="row mt-2">
                    <div className="col-6">
                        <label>Response Time</label>
                        <p>You answer applications within <span className="text-success">{this.state.employer.response_time} min.</span></p>
                    </div>
                    <div className="col-6">
                        <label>Rating</label>
                        <p>Talents rated you with <span className="text-success">{this.state.employer.rating} points.</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label>Company Name</label>
                        <input type="text" className="form-control" value={this.state.employer.title} 
                            onChange={(e) => this.setEmployer({ title: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <label>Website</label>
                        <input type="text" className="form-control" value={this.state.employer.website}
                            onChange={(e) => this.setEmployer({ website: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <label>Bio</label>
                        <input type="text" className="form-control" value={this.state.employer.bio} 
                            onChange={(e) => this.setEmployer({ bio: e.target.value })}
                        />
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => update({path: 'employers', event_name: 'current_employer'}, Employer(this.state.employer).validate().serialize())}
                    >Save</button>
                </div>
            </form>
        </div>);
    }
}