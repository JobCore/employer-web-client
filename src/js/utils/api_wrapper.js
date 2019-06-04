/* global localStorage, fetch */
import {logout} from '../actions';
import log from './log';
import {Session} from 'bc-react-session';
import { setLoading } from '../components/load-bar/LoadBar.jsx';

const rootAPIendpoint = process.env.API_HOST+'/api';

let HEADERS = {
  'Content-Type': 'application/json'
};

// TODO: implemente a queue for requests and status, also avoid calling the same request twice
let PendingReq = {
  _requests: [],
  add: function(req){
    this._requests.push(req);
    setLoading(true);
  },
  remove: function(req){
    this._requests = this._requests.filter(r => r !== req);
    if(this._requests.length == 0){
      setLoading(false);
    }
  }
};

const getToken = () => {
  if (Session) {
    const payload = Session.getPayload();
    const token = payload.access_token;
    return token;
  }
  return null;
};

const appendCompany = (data) => {
  if (Session && data) {
    const payload = Session.getPayload();
    data.employer = payload.user.profile.employer;
    return data;
  }
};

/* AVAILABLE MODELS
  - badges
  - employees
  - employers
  - favlists
  - positions
  - profiles
  - shifts
  - venues
  - oauth/token (generate token)
  - tokenuser (get user data from local saved token)
*/

/**
 * Fetch JSON from API through GET method
 * @param {string} model Model data to be fetched. **Must be plural**
 * @returns {data}
 */
export const GET = async (endpoint, queryString = null, extraHeaders = {}) => {
  let url = `${rootAPIendpoint}/${endpoint}`;
  if(queryString) url += queryString;

  HEADERS['Authorization'] = `JWT ${getToken()}`;
  const REQ = {
    method: 'GET',
    headers: Object.assign(HEADERS,extraHeaders)
  };

  const req = new Promise((resolve, reject) => fetch(url, REQ)
    .then((resp) => processResp(resp, req))
    .then(data => resolve(data))
    .catch(err => {
      processFailure(err, req);
      reject(err);
    })
  );
  PendingReq.add(req);
  return req;
};

export const POST = (endpoint, postData, extraHeaders = {}) => {

  if(['user/register', 'login', 'user/password/reset'].indexOf(endpoint) == -1){
    HEADERS['Authorization'] = `JWT ${getToken()}`;
    postData = appendCompany(postData);
  }
  const REQ = {
    method: 'POST',
    headers: Object.assign(HEADERS,extraHeaders),
    body: JSON.stringify(postData)
  };

  const req = new Promise((resolve, reject) => fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => processResp(resp, req))
    .then(data => resolve(data))
    .catch(err => {
      processFailure(err, req);
      reject(err);
    })
  );
  PendingReq.add(req);
  return req;
};

export const PUT = (endpoint, putData, extraHeaders = {}) => {

  if(['register', 'login'].indexOf(endpoint) == -1){
    HEADERS['Authorization'] = `JWT ${getToken()}`;
  }
  const REQ = {
    method: 'PUT',
    headers: Object.assign(HEADERS,extraHeaders),
    body: JSON.stringify(putData)
  };

  const req = new Promise((resolve, reject) => fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => processResp(resp, req))
    .then(data => resolve(data))
    .catch(err => {
      processFailure(err, req);
      reject(err);
    })
  );
  PendingReq.add(req);
  return req;
};

export const DELETE = (endpoint, extraHeaders = {}) => {

  HEADERS['Authorization'] = `JWT ${getToken()}`;

  const REQ = {
    method: 'DELETE',
    headers: Object.assign(HEADERS,extraHeaders)
  };

  const req = new Promise((resolve, reject) => fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => processResp(resp, req))
    .then(data => resolve(data))
    .catch(err => {
      processFailure(err, req);
      reject(err);
    })
  );
  PendingReq.add(req);
  return req;
};

const processResp = function(resp, req=null){
  PendingReq.remove(req);
  if(resp.ok){
    if(resp.status == 204) return new Promise((resolve, reject) => resolve(true));
    else return resp.json();
  }
  else return new Promise(function(resolve, reject){
    if(resp.status == 400) parseError(resp).catch((errorMsg) => reject(errorMsg));
    else if(resp.status == 404) reject(new Error('Not found'));
    else if(resp.status == 503){
      logout();
      reject(new Error('The JobCore API seems to be unavailable'));
    }
    else if(resp.status == 401){
      logout();
      reject(new Error('You are not authorized for this action'));
    }
    else if(resp.status >= 500 && resp.status < 600){
      resp.json().then(err => reject(new Error(err.detail)))
        .catch((errorMsg) => reject(new Error('Something bad happened while completing your request! Please try again later.')));
    }
    else reject(new Error('Something went wrong'));
  });
};

const processFailure = function(err, req=null){
  PendingReq.remove(req);
  log.error(err);
};

const parseError = (error) => new Promise(function(resolve, reject){
  const errorPromise = error.json();
  errorPromise.then(json => {
    let errorMsg = '';
    for(let type in json){
        if(Array.isArray(json[type])) errorMsg += json[type].join(',');
        else errorMsg += json[type];
    }
    reject(errorMsg);
  })
  .catch(error => {
    reject(error);
  });
});