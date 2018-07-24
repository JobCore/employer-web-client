//import react into the bundle
import React from 'react';
import ReactDOM from 'react-dom';
import './utils/icons';
import '../styles/index.scss';

//import your own components
import Layout from './Layout.jsx';

//render your react application
ReactDOM.render(
    <Layout />,
    document.querySelector('#app')
);