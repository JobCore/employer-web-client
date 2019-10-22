import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import {Session} from 'bc-react-session';
import {Notify} from 'bc-react-notifier';
import {Shift} from './views/shifts';
import {Talent} from './views/talents';
import {Rating} from './views/ratings';
import {Clockin, PayrollPeriod} from './views/payroll';
import moment from 'moment';
import {POST, GET, PUT, DELETE, PUTFiles} from './utils/api_wrapper';
import log from './utils/log';
import WEngine from "./utils/write_engine.js";
import qs from "query-string";

const Models = {
    "shifts": Shift,
    "ratings": Rating,
    "payroll-periods": PayrollPeriod,
    "talents": Talent,
    "employees": Talent
};

export const login = (email, password, keep, history) => new Promise((resolve, reject) => POST('login', {
      username_or_email: email,
      password: password,
      exp_days: keep ? 30 : 1
    })
    .then(function(data){
        if(!data.user.profile.employer){
            Notify.error("Only employers are allowed to login into this application");
            reject("Only employers are allowed to login into this application");
        }
        else if(!data.user.is_active){
            Notify.error("Your account seems to be innactive, contact support for any further details");
            reject("Your account seems to be innactive, contact support for any further details");
        }
        else{
            Session.start({ payload: {
                user: data.user, access_token: data.token
            }});
            history.push('/');
            resolve();
        }
    })
    .catch(function(error) {
        reject(error.message || error);
        Notify.error(error.message || error);
        log.error(error);
    })
);

export const signup = (formData, history) => new Promise((resolve, reject) => POST('user/register', {
      email: formData.email,
      account_type: formData.account_type,
      employer: formData.company,
      token: formData.token || '',
      username: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password
    })
    .then(function(data){
        Notify.success("You have signed up successfully, proceed to log in");
        history.push(`/login?type=${formData.account_type}`);
        resolve();
    })
    .catch(function(error) {
        reject(error.message || error);
        Notify.error(error.message || error);
        log.error(error);
    })
);

export const remind = (email) => new Promise((resolve, reject) => POST('user/password/reset', {
      email: email
    })
    .then(function(data){
        resolve();
        Notify.success("Check your email!");
    })
    .catch(function(error) {
        Notify.error(error.message || error);
        reject(error.message || error);
        log.error(error);
    })
);


export const resendValidationLink = (email) => new Promise((resolve, reject) => POST('user/email/validate/send/'+email, {
      email: email
    })
    .then(function(data){
        resolve();
        Notify.success("We have sent you a validation link, check your email!");
    })
    .catch(function(error) {
        Notify.error(error.message || error);
        reject(error.message || error);
        log.error(error);
    })
);

export const logout = () => {
    Session.destroy();
};

export const fetchAll = (entities) => new Promise((resolve, reject) => {
    let requests = [];
    const checkPromiseResolution = () => {
            const hasPending = requests.find(r => r.pending == true);
            if(!hasPending){
                const hasError = requests.find(r => r.error == true);
                if(hasError) reject();
                else resolve();
            }
        };

    entities.forEach((entity) => {
        const currentRequest = { entity: entity.slug || entity, pending: true, error: false};
        requests.push(currentRequest);

        GET(entity.slug || entity)
        .then(function(list){
            if(typeof entity.callback == 'function') entity.callback();
            Flux.dispatchEvent(entity.slug || entity, list);

            currentRequest.pending = false;
            checkPromiseResolution();
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);

            currentRequest.pending = false;
            currentRequest.error = true;
            checkPromiseResolution();
        });
    });
});

export const fetchAllMe = (entities) => new Promise((resolve, reject) => {
    let requests = [];
    const checkPromiseResolution = () => {
            const hasPending = requests.find(r => r.pending == true);
            if(!hasPending){
                const hasError = requests.find(r => r.error == true);
                if(hasError) reject();
                else resolve();
            }
        };

    entities.forEach((entity) => {
        const currentRequest = { entity: entity.slug || entity, pending: true, error: false};
        requests.push(currentRequest);

        GET('employers/me/'+(entity.slug || entity))
        .then(function(list){
            if(typeof entity.callback == 'function') entity.callback();
            Flux.dispatchEvent(entity.slug || entity, list);

            currentRequest.pending = false;
            checkPromiseResolution();
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);

            currentRequest.pending = false;
            currentRequest.error = true;
            checkPromiseResolution();
        });
    });
});

export const fetchSingle = (entity, id) =>  new Promise((resolve, reject) => {
    const _entity = entity.slug || entity;
    GET(entity.url || 'employers/me/'+_entity+'/'+id)
        .then(function(data){
            const cachedEntity = WEngine.get(_entity, id);
            if(cachedEntity) data = Object.assign(data, cachedEntity);
            Flux.dispatchEvent(_entity, store.replaceMerged(_entity, data.id, Models[_entity](data).defaults().unserialize()));
            resolve(data);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
            reject();
        });
});

export const hook = (hookName) =>  new Promise((resolve, reject) => {
    const payload = Session.getPayload();
    const params = { employer: payload.user.profile.employer };
    GET(`hook/${hookName}?${qs.stringify(params)}`)
        .then(function(data){
            resolve(data);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
            reject();
        });
});

export const fetchTemporal = (url, event_name, callback=null) => {
    GET(url)
        .then(function(data){
            if(typeof callback == 'function') callback();
            Flux.dispatchEvent(event_name, data);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
        });
};

export const search = (entity, queryString=null) => new Promise((accept, reject) =>
    GET(entity, queryString)
        .then(function(list){
            if(typeof entity.callback == 'function') entity.callback();
            Flux.dispatchEvent(entity.slug || entity, list);
            accept(list);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
            reject(error);
        })
);
export const searchMe = (entity, queryString) => new Promise((accept, reject) =>
    GET('employers/me/'+entity, queryString)
        .then(function(list){
            if(typeof entity.callback == 'function') entity.callback();
            Flux.dispatchEvent(entity.slug || entity, list);
            accept(list);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
            reject(error);
        })
);

export const create = (entity, data, status='live') => POST('employers/me/'+(entity.url || entity), data)
    .then(function(incoming){
        let entities = store.getState(entity.slug || entity);
        if(!entities || !Array.isArray(entities)) entities = [];

        if(!Array.isArray(incoming)){
            Flux.dispatchEvent(entity.slug || entity, entities.concat([{ ...data, id: incoming.id }]));
        }
        else{
            const newShifts = incoming.map(inc => Object.assign({ ...data, id: inc.id }));
            Flux.dispatchEvent(entity.slug || entity, entities.concat(newShifts));
        }
        Notify.success("The "+(entity.slug || entity).substring(0, (entity.slug || entity).length - 1)+" was created successfully");
    })
    .catch(function(error) {
        Notify.error(error.message || error);
        log.error(error);
    });

export const update = (entity, data, mode=WEngine.modes.LIVE) => new Promise((resolve, reject) => {
    let path = (typeof entity == 'string') ? `employers/me/${entity}/${data.id}` : entity.path + (typeof data.id !== 'undefined' ? `/${data.id }`:'');
    const event_name = (typeof entity == 'string') ? entity : entity.event_name;

    if(mode === WEngine.modes.POSPONED) path += "?posponed=true";
    PUT(path, data)
        .then(function(incomingObject){

            if(mode === WEngine.modes.POSPONED)
                WEngine.add({ entity: event_name, method: 'PUT', data, id: data.id });
            else
                Notify.success("The "+event_name+" was updated successfully");

            let entities = store.replaceMerged(event_name, data.id, data);
            Flux.dispatchEvent(event_name, entities);
            resolve(data);
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
            reject(error);
        });
});

export const updateProfileImage = (file) => PUTFiles('employers/me/image', [file])
        .then(function(incomingObject){
            const payload = Session.getPayload();
            const user = Object.assign(payload.user, { profile: incomingObject });
            Session.setPayload({ user });
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
        });

export const updateProfile = (data) => {
    PUT(`profiles/${data.id}`, data)
        .then(function(incomingObject){
            const payload = Session.getPayload();
            const user = Object.assign(payload.user, { profile: incomingObject });
            Session.setPayload({ user });
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
        });
};

export const remove = (entity, data) => {
    const path = (typeof entity == 'string') ? `employers/me/${entity}/${data.id}` : `${entity.path}/${data.id}`;
    const event_name = (typeof entity == 'string') ? entity : entity.event_name;
    DELETE(path)
        .then(function(incomingObject){
            let entities = store.remove(event_name, data.id);
            Flux.dispatchEvent(event_name, entities);

            const name = path.split('/');
            Notify.success("The "+name[0].substring(0, name[0].length - 1)+" was deleted successfully");
        })
        .catch(function(error) {
            Notify.error(error.message || error);
            log.error(error);
        });
};

export const rejectCandidate = (shiftId, applicant) => {
    const shift = store.get('shifts', shiftId);
    if(shift){
        const newCandidates = shift.candidates.filter(candidate => candidate.id != applicant.id);
        const updatedShift = {
          candidates: newCandidates.map(cand => cand.id)
        };
        PUT(`employers/me/shifts/${shiftId}/candidates`, updatedShift).then(() => {

            Flux.dispatchEvent('shifts', store.replaceMerged("shifts", shiftId, {
              candidates: newCandidates
            }));
            Flux.dispatchEvent('applicants', store.remove("applicants", applicant.id));

            Notify.success("The candidate was successfully rejected");
        });
    }
    else Notify.error("Shift not found");
};

export const deleteShiftEmployee = (shiftId, employee) => {
    const shift = store.get('shifts', shiftId);
    if(shift){
        const newEmployees = shift.employees.filter(emp => emp.id != employee.id);
        const updatedShift = {
          employees: newEmployees.map(emp => emp.id)
        };
        PUT(`employers/me/shifts/${shiftId}/employees`, updatedShift).then(() => {

            Flux.dispatchEvent('shifts', store.replaceMerged("shifts", shiftId, {
              employees: newEmployees
            }));

            Notify.success("The employee was successfully deleted");
        });
    }
    else Notify.error("Shift not found");
};

export const acceptCandidate = (shiftId, applicant) => new Promise((accept, reject) => {
    const shift = store.get('shifts', shiftId);
    if(shift){
        if (shift.status === 'OPEN' || shift.employees.length < shift.maximum_allowed_employees) {

            const newEmployees = shift.employees.concat([applicant]);
            const newCandidates = shift.candidates.filter(c => Number.isInteger(c) ? c !== applicant.id : c.id !== applicant.id);
            const shiftData = {
                employees: newEmployees.map(emp => Number.isInteger(emp) ? emp : emp.id),
                candidates: newCandidates.map(can => Number.isInteger(can) ? can : can.id)
            };
            PUT(`employers/me/shifts/${shiftId}/candidates`, shiftData).then((data) => {

                const applications = store.getState("applications");
                if(applications) Flux.dispatchEvent('applications', store.filter("applications", (item) => (item.shift.id != shiftId || item.employee.id != applicant.id)));
                Flux.dispatchEvent('shifts', store.replaceMerged("shifts", shiftId, {
                    employees: newEmployees,
                    candidates: newCandidates
                }));
                Notify.success("The candidate was successfully accepted");
                accept();
            });
        } else {
          Notify.error('This shift is already filled.');
          reject();
        }
    }
    else{
        Notify.error("Shift not found");
        reject();
    }
});

export const updateTalentList = (action, employee, listId) => {
    const favoriteList = store.get("favlists", listId);
    return new Promise((resolve, reject) => {
        if(favoriteList){
            let employeeIdsArr = favoriteList.employees.map(employee => employee.id || employee);
            if (action === 'add') {
              employeeIdsArr.push(employee.id || employee);
            }
            else if (action === 'delete') {
              employeeIdsArr = employeeIdsArr.filter((id) => id != (employee.id || employee));
            }
            PUT('employers/me/favlists/'+listId, { employees: employeeIdsArr }).then((updatedFavlist) => {
                Flux.dispatchEvent('favlists', store.replaceMerged("favlists", listId, {
                    employees: updatedFavlist.employees
                }));
                Notify.success(`The talent was successfully ${(action == 'add') ? 'added' : 'removed'}`);
                resolve(updatedFavlist);
            })
            .catch(error => {
                Notify.error(error.message || error);
                log.error(error);
                reject(error);
            });
        }
        else{
            Notify.error("Favorite list not found");
            reject();
        }
    });
};

// export const updatePayments = (payments) => new Promise((resolve, reject) => {

//     const newPayments = payments.map(c => {
//         c.status = payroll.status;
//         return Clockin(c).defaults().serialize();
//     });

//     return PUT(`employees/${payroll.talent.id}/payroll`, newPayroll.filter(c => c.selected === true))
//     .then(function(data){
//         resolve();
//         Notify.success("The Payroll has been updated successfully");
//         Flux.dispatchEvent('single_payroll_detail', newPayroll);
//     })
//     .catch(function(error) {
//         reject(error.message || error);
//         Notify.error(error.message || error);
//         log.error(error);
//     });
// });

export const http = { GET };

class _Store extends Flux.DashStore{
    constructor(){
        super();
        this.addEvent('positions');
        this.addEvent('venues');
        this.addEvent('invites');
        this.addEvent('payment');
        this.addEvent('jobcore-invites');
        this.addEvent('ratings');
        this.addEvent('employees', (employees) => {
            if(!Array.isArray(employees)) return [];
            return employees.filter(em => em.user.profile).map(em => Talent(em).defaults().unserialize());
        });
        this.addEvent('favlists');
        this.addEvent('badges');

        this.addEvent('applications', (applicants) => {
            return (!applicants || (Object.keys(applicants).length === 0 && applicants.constructor === Object)) ? [] : applicants.map(app => {
                app.shift = Shift(app.shift).defaults().unserialize();
                return app;
            });
        });
        this.addEvent('shifts', (shifts) => {

            const newShifts = (!shifts || (Object.keys(shifts).length === 0 && shifts.constructor === Object)) ? [] : shifts.filter(s => s.status !== 'CANCELLED').map((shift) => {
                //already transformed
                return Shift(shift).defaults().unserialize();
            });

            const applicants = this.getState('applications');
            if(!applicants && Session.get().isValid) fetchAllMe(['applications']);

            return newShifts;
        });

        // Payroll related data
        this.addEvent('payroll-periods', (period) => {
            return (!period || (Object.keys(period).length === 0 && period.constructor === Object)) ? [{ label: "Loading payment periods...", value: null}] : period.map(p => {
                p.label = `From ${p.starting_at.substring(5,10)} to ${p.ending_at.substring(5,10)} (${p.payments.length} Payments)`;
                return p;
            });
        });

        //temporal storage (for temporal views, information that is read only)
        this.addEvent('current_employer', employer => {
            employer.payroll_period_starting_time = moment.isMoment(employer.payroll_period_starting_time) ? employer.payroll_period_starting_time : moment(employer.payroll_period_starting_time);
            return employer;
        });
        this.addEvent('single_payroll_detail', (payroll) => {

            const clockins = payroll.clockins;
            let approved = true;
            let paid = true;
            payroll.clockins = (!clockins || (Object.keys(clockins).length === 0 && clockins.constructor === Object)) ? [] : clockins.map((clockin) => {
                //already transformed
                if (clockin.status == 'PENDING'){
                    approved = false;
                    paid = false;
                }
                else if (clockin.status != 'PAID') paid = false;

                return Clockin(clockin).defaults().unserialize();
            });

            if(typeof payroll.talent != 'undefined') payroll.talent.paymentsApproved = approved;
            if(typeof payroll.talent != 'undefined') payroll.talent.paymentsPaid = paid;
            payroll.approved = approved;
            payroll.paid = paid;
            return payroll;
        });
    }

    get(type, id){
        const entities = this.getState(type);
        if(entities) return entities.find(ent => ent.id == parseInt(id, 10));
        else return null;
    }
    add(type, item){
        const entities = this.getState(type);
        if(item) return entities.concat([item]);
        //else return entities;
        else throw new Error('Trying to add a null item into '+type);
    }
    replace(type, id, item){
        const entities = this.getState(type);
        if(!entities) throw new Error("No item found in "+type);

        if(Array.isArray(entities)){
            return entities.concat([]).map(ent => {
                if(ent.id != parseInt(id, 10)) return ent;
                return item;
            });
        }
        else return item;
    }
    replaceMerged(type, id, item){
        const entities = this.getState(type);
        if(!entities) throw new Error("No item found in "+type);
        if(Array.isArray(entities)){
            const result = entities.concat([]).map(ent => {
                if(ent.id != parseInt(id, 10)) return ent;
                return Object.assign(ent, item);
            });
            return result;
        }
        else{
            return Object.assign(entities, item);
        }
    }
    remove(type, id){
        const entities = this.getState(type);
        if(entities) return entities.filter(ent => {
            return (ent.id != parseInt(id, 10));
        });
        else throw new Error("No items found in "+entities);
    }
    filter(type, callback){
        const entities = this.getState(type);
        if(entities) return entities.filter(callback);
        else throw new Error("No items found in entity type: "+type);
    }
}
export const store = new _Store();