import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import {Session} from './utils/session';
import {Notify} from './utils/notifier';
import moment from 'moment';
import {POST, GET, PUT} from './utils/api_wrapper';

export const login = (email, password) => {
    POST('login', {
      username_or_email: email,
      password: password
    })
    .then(function(data){
        Session.actions.login({ user: data.user, access_token: data.token });
    })
    .catch(function(error) {
        Notify.error(error.message || error);
        //console.error(error);
    });
};

export const signup = (email, password, company) => {
    POST('register', {
      email: email,
      type: 'employer',
      employer: 1,
      username: email,
      password: password
    })
    .then(function(data){
        window.location.href="/login";
    })
    .catch(function(error) {
        Notify.error(error.message || error);
        //console.error(error);
    });
};

export const logout = () => {
      Session.actions.logout();
};

export const fetchAll = (entities) => {
    entities.forEach((entity) =>
        GET(entity)
        .then(function(list){
            Flux.dispatchEvent(entity, list);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            //console.error(error);
        })
    );
};

export const add = (entity, data) => POST(entity, data)
    .then(function(data){
        let entities = store.getState(entity);
        if(!entities || !Array.isArray(entities)) entities = [];
        Flux.dispatchEvent(entity, entities.concat([data]));
    })
    .catch(function(error) {
        Notify.error(error.message || error);
        //console.error(error);
    });

class _Store extends Flux.DashStore{
    constructor(){
        super();
        this.addEvent('positions');
        this.addEvent('venues');
        this.addEvent('shifts', (shifts) => {
            return (!shifts || (Object.keys(shifts).length === 0 && shifts.constructor === Object)) ? [] : shifts.map((shift) => {
                //already transformed
                if(['number','string'].indexOf(typeof shift.date) == -1) return shift;
                
                const tempDate = new Date(shift.date).toLocaleDateString("en-US");
                if(typeof shift.position != 'object') shift.position = this.get('positions', shift.position);
                if(typeof shift.venue != 'object') shift.venue = this.get('venues', shift.venue);
                shift.start_time = moment(tempDate+" "+shift.start_time);
                shift.finish_time = moment(tempDate+" "+shift.finish_time);
                shift.date = moment(shift.date);
                shift.price = {
                    currency: 'usd',
                    currencySymbol: '$',
                    amount: shift.minimum_hourly_rate,
                    timeframe: 'hr'
                };
                return shift;
            });
        });
    }
    
    get(type, id){
        const entities = this.getState(type);
        if(entities) return entities.find(ent => ent.id == id);
        else return null;
    }
}
export const store = new _Store();


const _Context = React.createContext({
  bar: {}
});
export const PrivateProvider = _Context.Provider; 
export const PrivateConsumer = _Context.Consumer; 