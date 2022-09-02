//import react into the bundle
import React from 'react';
import ReactDOM from 'react-dom';
import './utils/icons';
import '../styles/index.scss';
import packg from '../../package.json';
import {Session} from 'bc-react-session';
import queryString from 'query-string';
import { autoLogin } from './actions.js';

//import your own components
import Layout from './Layout.js';
import Gleap from 'gleap';

// Please make sure to call this method only once!
Gleap.initialize("JfJX8cFIxkXfbTISZxKaWOfnYKYPtp1A");
    
  

            


console.info(`JobCore: Employer v${packg.version}, ENVIRONMENT=${process.env.ENVIRONMENT}`);

const app = document.querySelector('#app');
let query = queryString.parse(window.location.search);

//if token comes in the URL we have to login with that token;
if(typeof query.token != 'undefined') 
    autoLogin(query.token)
        .then(() => { ReactDOM.render(<Layout />,app); })
        .catch(() => { ReactDOM.render(<div className="alert alert-danger text-center">Invalid Credentials</div>,app); });

//else normal rendering
else ReactDOM.render(<Layout />,app);