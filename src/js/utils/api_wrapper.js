/* global localStorage, fetch */
import {logout} from '../actions';
import {Session} from '@breathecode/react-session';
import {Notify} from '@breathecode/react-notifier';
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
export const GET = async (model, id = null, queryString = null, extraHeaders = {}) => {
  let url = `${rootAPIendpoint}/${model}/`;
  if(id) url += id;
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

export const POST = (model, postData, extraHeaders = {}) => {
  
  if(['register', 'login'].indexOf(model) == -1){
    HEADERS['Authorization'] = `JWT ${getToken()}`;
    postData = appendCompany(postData);
  } 
  const REQ = {
    method: 'POST',
    headers: Object.assign(HEADERS,extraHeaders),
    body: JSON.stringify(postData)
  };
  
  const response = fetch(`${rootAPIendpoint}/${model}/`, REQ)
    .then((resp) => {
      if(resp.status == 400) throw new ValidationError('Invalid parameters for create '+model.substring(0, model.length - 1));
      if(resp.status == 401) logout();
      const data = resp.json();
      return data;
    })
    .catch(err => {
      throw new Error(`Could not POST model to API due to -> ${err}`);
    });
  // if (data.detail) {
  //   logout();
  //   return 0;
  // }
  return response;
};

export const PUT = (model, id, putData, extraHeaders = {}) => {
  const response = fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'PUT',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `JWT ${getToken()}`
    }),
    body: JSON.stringify(putData)
  })
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

export const PATCH = async (model, id, putData, extraHeaders = {}) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
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

export const DELETE = async (model, id = '', extraHeaders = {}) => {
  await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'DELETE',
    headers: new Headers({
      ...HEADERS,
      extraHeaders
    })
  }).catch(err => {
    throw new Error(`Could not GET models from API due to -> ${err}`);
  });
};