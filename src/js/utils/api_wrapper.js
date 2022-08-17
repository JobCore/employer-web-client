/* global localStorage, fetch */
import { logout } from '../actions';
import log from './log';
import { Session } from 'bc-react-session';
import { setLoading } from '../components/load-bar/LoadBar.jsx';
// import { getCookie } from '../csrftoken';
import Cookies from 'js-cookie'


const rootAPIendpoint = process.env.API_HOST + '/api';

let HEADERS = {
  'Content-Type': 'application/json'
};

// TODO: implemente a queue for requests and status, also avoid calling the same request twice
let PendingReq = {
  _requests: [],
  add: function (req) {
    this._requests.push(req);
    setLoading(true);
  },
  remove: function (req) {
    this._requests = this._requests.filter(r => r !== req);
    if (this._requests.length == 0) {
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
    data.employer = payload.user.profile.employer.id || payload.user.profile.employer;
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
  console.log("GET###")
  console.log("endpoint###", endpoint)
  console.log("url###", url)
  if (queryString) url += queryString;

  HEADERS['Authorization'] = `JWT ${getToken()}`;
  const REQ = {
    method: 'GET',
    headers: Object.assign(HEADERS, extraHeaders)
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
  console.log("POST###")
  if (['user/register', 'login', 'user/password/reset','employers/me/jobcore-invites'].indexOf(endpoint) == -1) {
    HEADERS['Authorization'] = `JWT ${getToken()}`;
    postData = appendCompany(postData);
  }
  
  const REQ = {
    method: 'POST',
    headers: Object.assign(HEADERS, extraHeaders),
    body: JSON.stringify(postData),
    // mode: 'no-cors'
  };

  const req = new Promise((resolve, reject) => fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => processResp(resp, req))
    .then(data => resolve(data))
    .catch(err => {
      processFailure(err, req);
      reject(err);
    })
  );

//   const req = new Promise((resolve, reject) => {
//     const loadData = async () => {
//       const res = await fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
//       const data = await res.json();
//     }
//     loadData();
// });

  PendingReq.add(req);
  return req;
};
// function getCookie(name) {
//   let cookieValue = null;

//   if (document.cookie && document.cookie !== '') {
//       const cookies = document.cookie.split(';');
//       for (let i = 0; i < cookies.length; i++) {
//           const cookie = cookies[i].trim();

//           // Does this cookie string begin with the name we want?
//           if (cookie.substring(0, name.length + 1) === (name + '=')) {
//               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

//               break;
//           }
//       }
//   }

//   return cookieValue;
// }
// var csrftoken = getCookie('csrftoken');
// var headers = new Headers();
// headers.append('X-CSRFToken', csrftoken);
export const POSTcsrf = (endpoint, postData, extraHeaders = {}) => {
  console.log("POST###")
  // Cookies.get('csrftoken')
  // console.log("postData###", postData)
  Cookies.set('stripetoken', postData.id)
  if (['user/register', 'login', 'user/password/reset','employers/me/jobcore-invites'].indexOf(endpoint) == -1) {
    HEADERS['Authorization']  = `JWT ${getToken()}`,`X-CSRFToken ${Cookies.get('stripetoken')}`
    postData = appendCompany(postData);
  }

  const REQ = {
    method: 'POST',
    headers: Object.assign(HEADERS, extraHeaders),
    body: JSON.stringify(postData),
    // mode: 'no-cors'
  };
  console.log("REQ###", REQ)
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

export const POSTcsrf2 = (endpoint, postData, extraHeaders = {}) => {
  console.log("POST###")
  // Cookies.get('csrftoken')
  // console.log("postData###", postData)
  // Cookies.set('stripetoken', postData.id)
  if (['user/register', 'login', 'user/password/reset','employers/me/jobcore-invites'].indexOf(endpoint) == -1) {
    HEADERS['Authorization']  = `JWT ${getToken()}`,`X-CSRFToken ${Cookies.get('stripetoken')}`
    postData = appendCompany(postData);
  }

  const REQ = {
    method: 'POST',
    headers: Object.assign(HEADERS, extraHeaders),
    body: JSON.stringify(postData),
    // mode: 'no-cors'
  };
  console.log("REQ###", REQ)
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

// fetch('/api/upload', {
//     method: 'POST',
//     body: payload,
//     headers: headers,
//     credentials: 'include'
// }).  
export const PUTFiles = (endpoint, files) => {
  console.log("PUTfiles###")
  const headers = {
    'Authorization': `JWT ${getToken()}`
  };

  var fetchBody = new FormData();
  for (const file of files) fetchBody.append('image', file, file.name);

  const REQ = {
    headers,
    method: 'PUT',
    body: fetchBody
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
  console.log("PUT###")
  if (['register', 'login','user/password/reset'].indexOf(endpoint) == -1) {
    HEADERS['Authorization'] = `JWT ${getToken()}`;
  }
  const REQ = {
    method: 'PUT',
    headers: Object.assign(HEADERS, extraHeaders),
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
  console.log("DELETE###")
  HEADERS['Authorization'] = `JWT ${getToken()}`;

  const REQ = {
    method: 'DELETE',
    headers: Object.assign(HEADERS, extraHeaders)
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

const processResp = function (resp, req = null) {
  console.log(resp)
  PendingReq.remove(req);
  if (resp.ok) {
    if (resp.status == 204) return new Promise((resolve, reject) => resolve(true));
    else return resp.json();
  }
  else return new Promise(function (resolve, reject) {
    if (resp.status == 400) parseError(resp).catch((errorMsg) => reject(errorMsg));
    else if (resp.status == 404) reject(new Error('Not found'));
    else if (resp.status == 503) {
      logout();
      reject(new Error('The JobCore API seems to be unavailable'));
    }
    else if (resp.status == 401) {
      logout();
      reject(new Error('You are not authorized for this action'));
    }
    else if (resp.status >= 500 && resp.status < 600) {
      resp.json().then(err => reject(new Error(err.detail)))
        .catch((errorMsg) => reject(new Error('Something bad happened while completing your request! Please try again later.')));
    }
    else reject(new Error('Something went wrong'));
  });
};

const processFailure = function (err, req = null) {
  PendingReq.remove(req);
  log.error(err);
};

const parseError = (error) => new Promise(function (resolve, reject) {
  const errorPromise = error.json();
  errorPromise.then(json => {
    let errorMsg = '';
    for (let type in json) {
      if (Array.isArray(json[type])) errorMsg += json[type].join(',');
      else if (typeof json[type] === 'object' && json[type] !== null) errorMsg += Object.values(json[type]).join(',');
      else errorMsg += json[type];
    }
    reject(errorMsg);
  })
    .catch(error => {
      reject(error);
    });
});