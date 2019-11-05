//import react into the bundle
import React from 'react';
import ReactDOM from 'react-dom';
import './utils/icons';
import '../styles/index.scss';
import packg from '../../package.json';

//import your own components
import Layout from './Layout.js';

console.info(`JobCore: Employer v${packg.version}, DEBUG=${process.env.DEBUG}`);

//render your react application
ReactDOM.render(
    <Layout />,
    document.querySelector('#app')
);