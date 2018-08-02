import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import {Session} from '@breathecode/react-session';
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
    .then(function(incomingShift){
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
        .then(function(incomingShift){
            let entities = store.replaceMerged(entity, data.id, data);
            Flux.dispatchEvent(entity, entities);
            Notify.success("The "+entity.substring(0, entity.length - 1)+" was updated successfully");
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            //console.error(error);
        });
};

export const rejectCandidate = (shiftId, applicant) => {
    const shift = store.get('shifts', shiftId);
    if(shift){
        const newCandidates = shift.candidates.filter(candidate => candidate.id != applicant.id);
        const updatedShift = {
          candidates: newCandidates.map(cand => cand.id)
        };
        console.log(updatedShift);
        PUT('shifts', shiftId, updatedShift).then(() => {
            
            Flux.dispatchEvent('shifts', store.replaceMerged("shifts", shiftId, {
              candidates: newCandidates
            }));
            Flux.dispatchEvent('applicants', store.remove("applicants", applicant.id));
            
            Notify.success("The candidate was successfully rejected");
        });
    }
    else Notify.error("Shift not found");
};

export const acceptCandidate = (shiftId, applicant) => {
    const shift = store.get('shifts', shiftId);
    if(shift){
        if (shift.status !== 'FILLED' || shift.employees.length < shift.maximum_allowed_employees) {
            
            const newEmployees = shift.employees.concat([applicant]);
            const newCandidates = shift.candidates.filter(employee => employee.id != applicant.id);
            const shiftData = { 
                employees: newEmployees.map(emp => emp.id),  
                candidates: newCandidates.map(can => can.id)
            };
            PUT('shifts', shiftId, shiftData).then((data) => {
                
                Flux.dispatchEvent('applicants', store.filter("applicants", (item) => (item.shift.id != shiftId || item.employee.id != applicant.id)));
                Flux.dispatchEvent('shifts', store.replaceMerged("shifts", shiftId.id, {
                    employees: newEmployees,
                    candidates: newCandidates
                }));
                Notify.success("The candidate was successfully accepted");
                
            });
        } else {
          Notify.error('This shift is already filled.');
        }
    }
    else Notify.error("Shift not found");
};

export const updateTalentList = (action, employeeId, listId) => {
    const favoriteList = store.get("favlists", listId);
    if(favoriteList){
        
        let employeeIdsArr = favoriteList.employees.map(employee => employee.id);
    
        if (action === 'add') {
          employeeIdsArr.push(employeeId);
        } else {
          employeeIdsArr = employeeIdsArr.filter((id) => id != employeeId);
        }
        PUT('favlists', listId, { employees: employeeIdsArr }).then((updatedFavlist) => {
            Flux.dispatchEvent('favlists', store.replace("favlists", updatedFavlist.id, updatedFavlist));
            Notify.success("The talent was successfully added to the favorite list");
        });
    }
    else{
        Notify.error("Favorite list not found");
    }
};

class _Store extends Flux.DashStore{
    constructor(){
        super();
        this.addEvent('positions');
        this.addEvent('venues');
        this.addEvent('shiftinvites');
        this.addEvent('jobcore-invites');
        this.addEvent('employees', (employees) => {
            
            if(!Array.isArray(employees)) return [];
            
            const session = Session.store.getSession();
            return employees.map((em) => {
                if(typeof session.user.profile.employer != 'undefined'){
                    if(typeof em.favoriteLists =='undefined') em.favoriteLists = em.favoritelist_set.filter(fav => fav.employer == session.user.profile.employer);
                    else{
                        em.favoriteLists = em.favoritelist_set.map(fav => store.get('favlists', fav.id || fav));
                    }
                }
                return em;
            });
        });
        this.addEvent('favlists');
        this.addEvent('badges');
        this.addEvent('applicants', (applicants) => {
            return (!applicants || (Object.keys(applicants).length === 0 && applicants.constructor === Object)) ? [] : applicants.map(app => {
                const shift = store.get('shifts', app.shift.id);
                if(shift) app.shift = shift;
                return app;
            });
        });
        this.addEvent('shifts', (shifts) => {
            
            const newShifts = (!shifts || (Object.keys(shifts).length === 0 && shifts.constructor === Object)) ? [] : shifts.map((shift) => {
                //already transformed

                const dataType = typeof shift.date;
                // TODO: there is an issue with the transformation
                if(['number','string'].indexOf(dataType) == -1) return shift;
                
                
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
                shift.allowedFavlists = shift.allowed_from_list.map(fav => {
                    const list = store.get('favlists', fav.id || fav);
                    return {value: list.id, label: list.title};
                });

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
    add(type, item){
        const entities = this.getState(type);
        if(item) return entities.concat([item]);
        //else return entities;
        else throw new Error('Trying to add a null item into '+type);
    }
    replace(type, id, item){
        const entities = this.getState(type).concat([]);
        if(entities) return entities.map(ent => {
            if(ent.id != id) return ent;
            return item;
        });
        else throw new Error("No item found in "+type);
    }
    replaceMerged(type, id, item){
        const entities = this.getState(type).concat([]);
        if(entities) return entities.map(ent => {
            if(ent.id != id) return ent;
            return Object.assign(ent, item);
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
    filter(type, callback){
        const entities = this.getState(type);
        if(entities) return entities.filter(callback);
        else throw new Error("No items found in "+entities);
    }
}
export const store = new _Store();