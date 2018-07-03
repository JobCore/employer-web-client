import firebase from 'firebase';
import Flux from '@4geeksacademy/react-flux-dash';
import {Session} from './utils/session';
import {POST, GET, PUT} from './utils/api_wrapper';

export const login = (email, password) => {
    POST('login', {
      email: email,
      password: password,
    })
    .then(function(user){
        Session.actions.login({ user, access_token: user.token });
    })
    .catch(function(error) {
        console.error(error);
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
            console.error(error);
        })
    );
};

export const add = (entity, data) => POST(entity, data)
    .then(function(user){
        Flux.dispatchEvent(entity, data);
    })
    .catch(function(error) {
        console.error(error);
    });

class _Store extends Flux.DashStore{
    constructor(){
        super();
        this.addEvent('shifts');
        this.addEvent('positions');
    }
}
export const store = new _Store();