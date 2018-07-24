import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import {Session} from '@breathecode/react-session';
import {Notify} from '@breathecode/react-notifier';
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
        GET(entity.slug || entity)
        .then(function(list){
            if(typeof entity.callback == 'function') entity.callback();
            Flux.dispatchEvent(entity.slug || entity, list);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            //console.error(error);
        })
    );
};

export const search = (entity, queryString) => {
    GET(entity, null, queryString)
        .then(function(list){
            if(typeof entity.callback == 'function') entity.callback();
            Flux.dispatchEvent(entity.slug || entity, list);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            //console.error(error);
        });
};

export const create = (entity, data) => POST(entity, data)
    .then(function(data){
        let entities = store.getState(entity);
        if(!entities || !Array.isArray(entities)) entities = [];
        Flux.dispatchEvent(entity, entities.concat([data]));
        Notify.success("The "+entity.substring(0, entity.length - 1)+" was created successfully");
    })
    .catch(function(error) {
        Notify.error(error.message || error);
        //console.error(error);
    });
    
export const update = (entity, data) => {
    PUT(entity, data.id, data)
        .then(function(data){
            let entities = store.getState(entity);
            if(!entities || !Array.isArray(entities)) entities = [];
            Flux.dispatchEvent(entity, entities.concat([data]));
            Notify.success("The "+entity.substring(0, entity.length - 1)+" was updated successfully");
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            //console.error(error);
        });
};

export const rejectCandidate = (shiftId, applicant) => {
    const shifts = store.getState('shifts');
    let shiftData = null;
    const newShifts = shifts.map(shift => {
       
       if(shift.id != shiftId) return shift;
       
        let candidates = [...shift.candidates];
        let employees = [...shift.employees];
    
        // Create arrays with only the employee's ids
        candidates = candidates.filter(candidate => candidate.id != applicant.id);
        employees = candidates.filter(employee => employee.id != applicant.id);
    
        shiftData = {
          employees: employees.map(emp => emp.id),
          candidates: candidates.map(cand => cand.id)
        };
    
        return Object.assign(shift, {
          employees,
          candidates
        });
    });

    if(shiftData){
        PUT('shifts', shiftId, JSON.stringify(shiftData)).then(() => {
            
            Flux.dispatchEvent('shifts', newShifts);
            
            const applicants = store.remove("applicants", applicant.id);
            Flux.dispatchEvent('applicants', applicants);
            
            Notify.success("The candidate was successfully rejected");
        });
    }
    else Notify.error("Shift not found");
};

export const acceptCandidate = (shiftId, applicant) => {
    const shift = store.get('shifts', shiftId);
    if(shift){
        if (shift.status !== 'FILLED' || shift.employees.length < shift.maximum_allowed_employees) {
            let employees = shift.employees.map(emp => emp.id);
            employees.push(applicant.id);
            
            const shiftData = { 
                employees,  
                candidates: shift.candidates.filter(employee => employee.id != applicant.id).map(can => can.id)
            };
            PUT('shifts', shiftId, JSON.stringify(shiftData)).then((data) => {
                
                let newShift = Object.assign({}, shift);
                newShift.employees.push(applicant);
                newShift.candidates = newShift.candidates.filter(can => can.id != applicant.id);
                
                Flux.dispatchEvent('shifts', store.replace("shifts", newShift.id, newShift));
                Notify.success("The candidate was successfully accepted");
            });
        } else {
          Notify.error('This shift is already filled.');
        }
    }
    else Notify.error("Shift not found");
};

class _Store extends Flux.DashStore{
    constructor(){
        super();
        this.addEvent('positions');
        this.addEvent('venues');
        this.addEvent('jobcore-invites');
        this.addEvent('employees');
        this.addEvent('favlists');
        this.addEvent('badges');
        this.addEvent('applicants', (applicants) => {
            return (!applicants || (Object.keys(applicants).length === 0 && applicants.constructor === Object)) ? [] : applicants.map(app => {
                app.shift = store.get('shifts', app.shift.id);
                return app;
            });
        });
        this.addEvent('shifts', (shifts) => {
            
            const newShifts = (!shifts || (Object.keys(shifts).length === 0 && shifts.constructor === Object)) ? [] : shifts.map((shift) => {
                //already transformed

                if(['number','string'].indexOf(typeof shift.date) == -1) return shift;
                
                
                const tempDate = new Date(shift.date).toLocaleDateString("en-US");
                if(typeof shift.position != 'object') shift.position = this.get('positions', shift.position);
                if(typeof shift.venue != 'object') shift.venue = this.get('venues', shift.venue);
                if(!moment.isMoment(shift.start_time)) shift.start_time = moment(tempDate+" "+shift.start_time);
                if(!moment.isMoment(shift.finish_time)) shift.finish_time = moment(tempDate+" "+shift.finish_time);
                if(!moment.isMoment(shift.date)) shift.date = moment(shift.date);
                shift.price = {
                    currency: 'usd',
                    currencySymbol: '$',
                    amount: shift.minimum_hourly_rate,
                    timeframe: 'hr'
                };

                return shift;
            });
            
            const applicants = this.getState('applicants');
            if(!applicants && Session.store.getSession().autenticated) fetchAll(['applicants']);
            
            return newShifts;
        });
    }
    
    get(type, id){
        const entities = this.getState(type);
        if(entities) return entities.find(ent => ent.id == id);
        else return null;
    }
    replace(type, id, item){
        const entities = this.getState(type);
        if(entities) return entities.map(ent => {
            if(ent.id != id) return ent;
            return item;
        });
        else throw new Error("No item found in "+type);
    }
    remove(type, id){
        const entities = this.getState(type);
        if(entities) return entities.filter(ent => {
            return (ent.id != id);
        });
        else throw new Error("No items found in "+entities);
    }
}
export const store = new _Store();