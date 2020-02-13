import React, { useState, useEffect, useContext } from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import { store, search, update, fetchSingle, searchMe, processPendingPayrollPeriods, updatePayments, createPayment, fetchAllMe, fetchTemporal, remove, create } from '../actions.js';
import { GET } from '../utils/api_wrapper';


import DateTime from 'react-datetime';
import moment from 'moment';
import { DATETIME_FORMAT, TIME_FORMAT, NOW, TODAY, haversineDistance } from '../components/utils.js';
import Select from 'react-select';

import { Notify } from 'bc-react-notifier';

import { Shift, EditOrAddShift } from './shifts.js';
import { Employer } from './profile.js';
import { ManageLocations, AddOrEditLocation, Location } from './locations.js';
import { EmployeeExtendedCard, ShiftOption, ShiftCard, DeductionExtendedCard, Theme, Button, ShiftOptionSelected, GenericCard, SearchCatalogSelect, Avatar, Toggle, Wizard, StarRating, ListCard } from '../components/index';
import queryString from 'query-string';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

import GoogleMapReact from 'google-map-react';
import markerURL from '../../img/marker.png';

import JobCoreLogo from '../../img/logo.png';
import { Page, Image, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

import TextareaAutosize from 'react-textarea-autosize';

import { Redirect } from 'react-router-dom';

export class PaymentsReport extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            employer: {
                picture: "",
            },
            paymentReport: {
                id: 1,
                period: 1,
                status: "OPEN",
                starting_at: new Date(),
                ending_at: new Date(),
                    payments: [
                        {
                            employee: {
                                id: 1,
                                first_name: "esteban",
                                last_name: "contreras"
                            },
                            amount: 3435,
                            deductions: 22,
                            paymentMethod: "Wells fargo",
                            date: new Date(),
                        },
                        {
                            employee: {
                                id: 2,
                                first_name: "esteban",
                                last_name: "contreras"
                            },
                            amount: 3435,
                            deductions: 22,
                            paymentMethod: "Wells fargo",
                            date: new Date(),
                        }
                    ],
            }
        };
    }

    render() {

        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({ bar }) => (<span>
                    {(!this.state.paymentReport) ? '' :
                        (this.state.paymentReport.payments.length > 0) ?
                            <div>
                                <p className="text-right">
                                    <h2>Payments for period {this.state.paymentReport.period}</h2>
                                </p>
                                <div className="row mb-4 text-right">
                                    <div className="col">

                                        <Button size="small" onClick={() => this.props.history.push('/payroll/period/' + this.state.paymentReport.period)}>Review Timesheet</Button>
                                    </div>
                                </div>
                                {/* {this.state.paymentReport.status == "OPEN" &&
                                    <Redirect from={'/payroll/report/' + this.state.paymentReport.id} to={'/payroll/rating/' + this.state.paymentReport.period} />
                                } */}
                                <table className="table table-striped payroll-summary">
                                    <thead>
                                        <tr>
                                            <th scope="col">Employee</th>
                                            <th scope="col">Payment date</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">deductions</th>
                                            <th scope="col">Payment method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.paymentReport.payments.map(pay => {
                                            return <tr key={pay.employee.id}>
                                                <td>
                                                    {pay.employee.last_name}, {pay.employee.first_name}
                                                    {/* <p className="m-0 p-0"><span className="badge">{pay.status.toLowerCase()}</span></p> */}
                                                </td>
                                                <td>{Math.round(pay.date * 100) / 100}</td>
                                                <td>{pay.amount}</td>
                                                <td>{pay.deductions}</td>
                                                <td>{pay.paymentMethod}</td>
                                            </tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p>No payments to review for this period</p>
                    }
                </span>)}
            </Theme.Consumer>
        </div >);
    }
}

const BORDER_COLOR = '#000000';
const BORDER_STYLE = 'solid';
const COL1_WIDTH = 20;
const COLN_WIDTH = (100 - COL1_WIDTH) / 8;
const styles = StyleSheet.create({
    body: {
        padding: 10
    },

    image: {
        width: "100px",
        height: "20px",
        float: "right"
    },
    image_company: {
        width: "40px",
        height: "25px",
        marginTop: 20
    },
    header: {
        fontSize: "30px",
        fontWeight: "bold"
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: BORDER_STYLE,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol1Header: {
        width: COL1_WIDTH + '%',
        borderStyle: BORDER_STYLE,
        borderColor: BORDER_COLOR,
        borderBottomColor: '#000',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableColHeader: {
        width: COLN_WIDTH + "%",
        borderStyle: BORDER_STYLE,
        fontWeight: 'bold',
        borderColor: BORDER_COLOR,
        borderBottomColor: '#000',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCol1: {
        width: COL1_WIDTH + '%',
        borderStyle: BORDER_STYLE,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCol: {
        width: COLN_WIDTH + "%",
        borderStyle: BORDER_STYLE,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 9,
        fontWeight: 'bold'
    },
    tableCell: {
        margin: 5,
        fontSize: 9
    }
});