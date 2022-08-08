import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Background from './Background';
import corner4 from './corner-4.png';
import createMarkup from './createMarkup';

const PlanOptions = (props) => {
  return (
    <Container className='mb-5'>
    <div class="row">
                <div class="col-lg-3 px-3 pt-5 mt-5 d-none d-lg-block">
                    <h2 class="h5 text-uppercase px-3 mb-4 mt-4 pt-3">Features</h2>
                    <ul class="list-unstyled mb-7 pt-1 font-size-5 text-dark">
                        <li class="py-2 px-3 bg-light">Schedule shifts</li>
                        <li class="py-2 px-3 ">Talent search</li>
                        <li class="py-2 px-3 bg-light">Pre approved trusted talents</li>
                        <li class="py-2 px-3">Rate talent</li>
                        <li class="py-2 px-3 bg-light">Invite talent manually</li>
                        <li class="py-2 px-3">Max. active employees / mo.</li>
                        <li class="py-2 px-3 bg-light">Create favorite lists</li>
                        <li class="py-2 px-3">Geo clock in/out report</li>
                        <li class="py-2 px-3 bg-light">Generate payroll reports</li>
                        <li class="py-2 px-3 ">Smart calendar features</li>
                        <li class="py-2 px-3 bg-light ">Manage company users</li>
                        <li class="py-2 px-3">On-line payments</li>
                        <li class="py-2 px-3  bg-light">Pre calculated deductions</li>
                    </ul>
                </div>

                <div class="col-lg-3 px-3 mb-5 mb-lg-0">
                    <div class="card shadow text-center">
                        <div class="card-body">
                            <p class="mb-1 text-secondary">Basic</p>
                            <h3 class="h2"><span class="font-size-4">$</span><span class="price" data-monthly="49.95" data-annual="42.46">49.95</span><sub class="font-size-4 font-weight-light">/mo</sub></h3>
                            <p class="font-size-6 text-muted pb-1">Perfect for small <br/>businesses</p>
                            <ul class="list-unstyled my-5 font-weight-bold font-size-5">
                                <li class="p-2 bg-light" data-label="Schedule shifts">Unlimited</li>
                                <li class="p-2" data-label="Talent search"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Pre approved trusted talents"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2" data-label="Rate talent"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Invite talent manually"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 " data-label="Max. active employees / mo.">40</li>
                                <li class="p-2 bg-light" data-label="Create favorite lists">2</li>
                                <li class="p-2" data-label="Geo clock in/out report"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Generate payroll reports"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                                <li class="p-2" data-label="Smart calendar features"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Manage company users"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                                <li class="p-2" data-label="On-line payments"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Pre calculated deductions"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                            </ul>
                            <div class="d-none d-lg-block">
                                <br/><br/>
                            </div>
                            
                            <a id="noProBtn" onClick={()=> {
                                props.onChangePlan('Basic')
                                }} data-scroll class="btn btn-soft-secondary btn-block px-1 mb-2">Start with Basic</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 px-3 mb-5 mb-lg-0">
                    <div class="card shadow text-center">
                        <div class="card-body">
                            <p class="mb-1 text-secondary">Pro<span class="badge badge-pill badge-secondary py-2 position-absolute top-0 right-0 mt-n3 mr-n4">MOST POPULAR</span></p>
                            <h3 class="h2"><span class="font-size-4">$</span><span class="price" data-monthly="99.95" data-annual="84.96">99.95</span><sub class="font-size-4 font-weight-light">/mo</sub></h3>
                            <p class="font-size-6 text-muted pb-1">Enjoy it with <br/>enhanced features</p>
                            <ul class="list-unstyled my-5 font-weight-bold font-size-5">
                                <li class="p-2 bg-light" data-label="Schedule shifts">Unlimited</li>
                                <li class="p-2" data-label="Talent search"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Pre approved trusted talents"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2" data-label="Rate talent"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Invite talent manually"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 " data-label="Max. active employees / mo.">60</li>
                                <li class="p-2 bg-light" data-label="Create favorite lists">5</li>
                                <li class="p-2" data-label="Geo clock in/out report"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Generate payroll reports"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2" data-label="Smart calendar features"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Manage company users"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                                <li class="p-2" data-label="On-line payments"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Pre calculated deductions"><svg class="fill-gray" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove-bold</title><path d="M22.664,5.578a1.5,1.5,0,0,0,0-2.121L20.543,1.336a1.5,1.5,0,0,0-2.122,0L12.177,7.581a.251.251,0,0,1-.354,0L5.579,1.336a1.5,1.5,0,0,0-2.122,0L1.336,3.457a1.5,1.5,0,0,0,0,2.121l6.245,6.245a.252.252,0,0,1,0,.354L1.336,18.422a1.5,1.5,0,0,0,0,2.121l2.121,2.121a1.5,1.5,0,0,0,2.122,0l6.244-6.245a.251.251,0,0,1,.354,0l6.244,6.245a1.5,1.5,0,0,0,2.122,0l2.121-2.121a1.5,1.5,0,0,0,0-2.121l-6.245-6.245a.252.252,0,0,1,0-.354Z"/></svg></li>
                            </ul>
                            <div class="d-none d-lg-block">
                                <br/><br/>
                            </div>
                            <a id="proBtn" onClick={()=> {
                                props.onChangePlan('Pro')
                                }} data-scroll class="btn btn-secondary btn-block px-1 mb-2">Start with Pro</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 px-3">
                    <div class="card shadow text-center">
                        <div class="card-body">
                            <p class="mb-1 text-secondary">Enterprise</p>
                            <h3 class="h2"><span class="font-size-4">$</span><span class="price" data-monthly="149.95" data-annual="127.46">149.95</span><sub class="font-size-4 font-weight-light">/mo</sub></h3>
                            <p class="font-size-6 text-muted pb-1">Take your business into <br/>the next level</p>
                            <ul class="list-unstyled my-5 font-weight-bold font-size-5">
                                <li class="p-2 bg-light" data-label="Schedule shifts">Unlimited</li>
                                <li class="p-2" data-label="Talent search"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Pre approved trusted talents"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2" data-label="Rate talent"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Invite talent manually"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 " data-label="Max. active employees / mo.">100</li>
                                <li class="p-2 bg-light" data-label="Create favorite lists">Unlimited</li>
                                <li class="p-2" data-label="Geo clock in/out report"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Generate payroll reports"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2" data-label="Smart calendar features"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Manage company users"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2" data-label="On-line payments"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                                <li class="p-2 bg-light" data-label="Pre calculated deductions"><svg width="17" height="17" class="fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M23.146,5.4,20.354,2.6a.5.5,0,0,0-.708,0L7.854,14.4a.5.5,0,0,1-.708,0L4.354,11.6a.5.5,0,0,0-.708,0L.854,14.4a.5.5,0,0,0,0,.707L7.146,21.4a.5.5,0,0,0,.708,0L23.146,6.1A.5.5,0,0,0,23.146,5.4Z"/></svg></li>
                            </ul>
                            <div class="d-none d-lg-block">
                                <br/><br/>
                            </div>
                            
                            <a id="noProBtn" onClick={()=> {
                                props.onChangePlan('Enterprise')
                                }} data-scroll class="btn btn-soft-secondary btn-block px-1 mb-2">Start with Enterprise</a>
                        </div>
                    </div>
                </div>
            </div> 
    </Container>
  )
  
}
    


PlanOptions.propTypes = {
  title: PropTypes.string
};

// PageHeader.defaultProps = { col: { lg: 8 }, image: corner4, titleTag: 'h3' };

export default PlanOptions;
