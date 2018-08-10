/* global localStorage, fetch */
import {logout} from '../actions';
import {Session} from '@breathecode/react-session';
import {ValidationError} from '../utils/validation';

const rootAPIendpoint = process.env.apiHost+'/api';

let HEADERS = {
  'Content-Type': 'application/json'
};

const getToken = () => {
  if (Session) {
    const token = Session.store.getSession().access_token;
    return token;
  }
  return null;
};

const appendCompany = (data) => {
  if (Session && data) {
    data.employer = Session.store.getSession().user.profile.employer;
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
  
  const response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `JWT ${getToken()}`
    })
  }).catch(err => {
    throw new Error(`Could not GET models from API due to -> ${err}`);
  });
  const data = await response.json();
  if (data.detail) {
    logout();
    return 0;
  }
  return data;
};

export const POST = (endpoint, postData, extraHeaders = {}) => {
  
  if(['register', 'login'].indexOf(endpoint) == -1){
    HEADERS['Authorization'] = `JWT ${getToken()}`;
    postData = appendCompany(postData);
  } 
  const REQ = {
    method: 'POST',
    headers: Object.assign(HEADERS,extraHeaders),
    body: JSON.stringify(postData)
  };
  
  const response = fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => {
      if(resp.status >= 200 && resp.status < 300){
        const data = resp.json();
        return data;
      }
      else if(resp.status == 400) throw new ValidationError('Invalid parameters for '+endpoint);
      else if(resp.status == 401) logout();
      else{
        throw new Error("There has been an error");
      }
      
    })
    .catch(err => {
      throw new Error(`Could not POST model to API due to -> ${err.message || err}`);
    });
  // if (data.detail) {
  //   logout();
  //   return 0;
  // }
  return response;
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
  
  const response = fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => {
        if(resp.status == 400) throw new Error('Bad Request');
        if(resp.status == 401) logout();
        const data = resp.json();
        return data;
    })
    .then((data) => {
      if (data.detail) {
        logout();
        return 0;
      }
      return data;
    })
    .catch(err => {
      throw new Error(`Could not UPDATE model on API due to -> ${err}`);
    });
  
  return response;
};

export const PATCH = async (endpoint, putData, extraHeaders = {}) => {
  const response = await fetch(`${rootAPIendpoint}/${endpoint}`, {
    method: 'PATCH',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `JWT ${getToken()}`
    }),
    body: putData
  }).catch(err => {
    throw new Error(`Could not UPDATE model on API due to -> ${err}`);
  });
  const data = await response.json();
  if (data.detail) {
    logout();
    return 0;
  }
  return data;
};

export const DELETE = async (endpoint, extraHeaders = {}) => {
  await fetch(`${rootAPIendpoint}/${endpoint}`, {
    method: 'DELETE',
    headers: new Headers({
      ...HEADERS,
      extraHeaders
    })
  }).catch(err => {
    throw new Error(`Could not GET models from API due to -> ${err}`);
  });
};