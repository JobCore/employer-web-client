import React, { useState, useContext, useEffect } from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, searchMe, remove} from '../actions.js';
import { GenericCard, Theme, Button, SearchCatalogSelect, Avatar } from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';
import { Session } from 'bc-react-session';

import {validator, ValidationError} from '../utils/validation';

import {Notify} from 'bc-react-notifier';

import GoogleMapReact from 'google-map-react';
import markerURL from '../../img/marker.png';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';

import { GET } from '../utils/api_wrapper';

const ENTITIY_NAME = 'payrates';

//gets the querystring and creats a formData object to be used when opening the rightbar

export const Payrate = (data) => {

    const _defaults = {
        id: '',
        position: '',
        employer: Session.getPayload().user.profile.employer,
        hourly_rate: 0.00,
        employee: '',
        employee_user: {},

        serialize: function(){

            const newPayrate = {};
            return Object.assign(this, newPayrate);
        }
    };

    let _payrate = Object.assign(_defaults, data);
    return {
        validate: () => {
         
            return _payrate;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formShift = {
                id: _payrate.id,
                employee: _payrate.employee,
                employer: _payrate.employer,
                position: _payrate.position,
                employee_user: _payrate.employee_user,
                hourly_rate: parseFloat(_payrate.hourly_rate)
            };
            return _formShift;
        }
    };
};

export class ManagePayrates extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            payrates: []
            
        };
    }

    componentDidMount(){

        this.filter();
        const positions = store.getState('positions');

        if(!positions){
            this.subscribe(store, 'positions', (positions) => {
                this.setState({ positions });
            });
        }else this.setState({ positions });

        this.subscribe(store, ENTITIY_NAME, (payrates) => {
            console.log(payrates);
            this.setState({ payrates });
        });

        this.props.history.listen(() => {
            this.filter();
            this.setState({ firstSearch: false });
        });
    }

    filter(payrate=null){
        searchMe(ENTITIY_NAME, window.location.search);
    }

    render() {
        if(this.state.firstSearch) return <p>Search for any payrate</p>;
        const allowLevels = (window.location.search != '');
        console.log(this.state);
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
                    <h1><span id="talent_search_header">Payrates</span></h1>
                    {this.state.payrates.length == 0 ? "There are no payrates at the moment, you can add payrates by clicking the create payrate button" : null}
                    {this.state.payrates.map((l,i) => (
                        <GenericCard key={i} hover={true} onClick={() => bar.show({ slug: "update_payrate", data: l, allowLevels })}>
                            <div className="btn-group mt-2">
                                <Button icon="pencil" onClick={() => bar.show({ slug: "update_payrate", data: l, allowLevels })}></Button>
                                <Button icon="trash" onClick={() => {
                                    const noti = Notify.info("Are you sure you want to delete this payrate?",(answer) => {
                                        if(answer) remove('payrates', l);
                                        noti.remove();
                                    });
                                }}></Button>
                            </div>
                     
                        
                            <Avatar url={l.employee.picture} className="mt-2"/>
                            <div className="row">
                                <div className="col">
                                    <a href="#"><b>{l.employee.first_name + ' ' + l.employee.last_name}</b></a>
                                    {Array.isArray(this.state.positions) && !l.position.title ? (
                                        <p className="mt-2">{this.state.positions.find(item => item.value == l.position).label + " - " + "$" +  + l.hourly_rate + "/hr"}</p>
                                        ):(
                                            <p className="mt-2">{l.position.title + " - " + "$" + l.hourly_rate + "/hr"}</p>
                                        )}
                                </div>


                            </div>
                        </GenericCard>
                    ))}
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}



export const AddOrEditPayrate = ({ onSave, onCancel, onChange, catalog, formData }) => {
    const { bar } = useContext(Theme.Context);

    if(catalog.positions.find((pos) => pos.value == formData.position.id || pos.value == formData.position))formData['position'] = catalog.positions.find((pos) => pos.value == formData.position.id || pos.value == formData.position).value.toString();
    
    if(formData.employee){
        if(formData.employee.first_name && formData.employee.last_name && formData.employee.employee)
        formData.employee = {"label": formData.employee.first_name + " " + formData.employee.last_name, "value": formData.employee.employee};
    }
    console.log(formData);
    return(
        <form>
            <div className="row">
                <div className="col-12">
                    <label>Position</label>
                    <Select
                        value={catalog.positions.find((a) => a.value == formData.position)}
                        onChange={(selection) => onChange({ position: selection.value })}
                        options={catalog.positions}
                    />
                </div>
                <div className="col-12">
                    <label>JobCore Employee:</label>
                    <SearchCatalogSelect
                        isMulti={false}
                        value={formData.employee}
                        onChange={(selections) => {
                        onChange({ employee: selections });
                        }}
                        searchFunction={(search) => new Promise((resolve, reject) =>
                            GET('catalog/employees?full_name=' + search)
                                .then(talents => resolve([
                                    { label: `${(talents.length == 0) ? 'No one found: ' : ''}Invite "${search}" to jobcore`, value: 'invite_talent_to_jobcore' }
                                ].concat(talents)))
                                .catch(error => reject(error))
                        )}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Hourly Rate</label>
                    <input type="number" className="form-control"
                        value={formData.hourly_rate}
                        onChange={(e)=>onChange({hourly_rate: parseFloat(e.target.value)})}
                    />
                </div>
            </div>
        
            <div className="row">
                <div className="col-12">
                    <div className="btn-bar">
                        <button type="button" className="btn btn-success" onClick={() => onSave()}>Save</button>
                        <button type="button" className="btn btn-default" onClick={() => bar.close()}>Cancel</button>
                    </div>
                </div>
            </div>
        </form>       
    );
};

AddOrEditPayrate.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};