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
            employer: store.getState('current_employer'),
            payrollPeriods: [],
            payments: [],
            singlePayrollPeriod: null,
        };
    }

    componentDidMount() {

        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });

        const payrollPeriods = store.getState('payroll-periods');
        this.subscribe(store, 'payroll-periods', (_payrollPeriods) => {
            this.updatePayrollPeriod(_payrollPeriods);
            //if(!this.state.singlePayrollPeriod) this.getSinglePeriod(this.props.match.params.period_id, payrollPeriods);
        });
        if (!payrollPeriods) {
            searchMe('payroll-periods');
        }
        else {
            this.updatePayrollPeriod(payrollPeriods);
            this.getSinglePeriod(this.props.match.params.period_id, payrollPeriods);

        }

        this.removeHistoryListener = this.props.history.listen((data) => {
            const period = /\/payroll\/period\/(\d+)/gm;
            const periodMatches = period.exec(data.pathname);
            // const search = /\?talent_id=(\d+)/gm;
            // const searchMatches = search.exec(data.search);
            if (periodMatches) this.getSinglePeriod(periodMatches[1]);
        });
    }

    groupPayments(singlePeriod) {
        if (!singlePeriod) return null;

        let groupedPayments = {};
        singlePeriod.payments.forEach(pay => {
            if (typeof groupedPayments[pay.employee.id] === 'undefined') {
                groupedPayments[pay.employee.id] = { employee: pay.employee, payments: [] };
            }
            groupedPayments[pay.employee.id].payments.push(pay);
        });

        return Object.values(groupedPayments);
    }

    getSinglePeriod(periodId, payrollPeriods) {
        if (typeof periodId !== 'undefined') {
            if (!payrollPeriods) fetchSingle("payroll-periods", periodId);
            else {
                const singlePayrollPeriod = payrollPeriods.find(pp => pp.id == periodId);
                this.setState({ singlePayrollPeriod, payments: this.groupPayments(singlePayrollPeriod) });
            }
        }
    }

    updatePayrollPeriod(payrollPeriods) {

        if (payrollPeriods == null) return;

        let singlePayrollPeriod = null;
        if (typeof this.props.match.params.period_id !== 'undefined') {
            singlePayrollPeriod = payrollPeriods.find(pp => pp.id == this.props.match.params.period_id);
        }

        this.setState({ payrollPeriods, singlePayrollPeriod: singlePayrollPeriod || null, payments: this.groupPayments(singlePayrollPeriod) });
    }


    render() {
        const taxesMagicNumber = 3.00;
        if (!this.state.employer) return "Loading...";
        else if (!this.state.employer.payroll_configured || !moment.isMoment(this.state.employer.payroll_period_starting_time)) {
            return <div className="p-1 listcontents text-center">
                <h3>Please setup your payroll settings first.</h3>
                <Button color="success" onClick={() => this.props.history.push("/payroll/settings")}>Setup Payroll Settings</Button>
            </div>;
        }
        //const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({ bar }) => (<span>
                    {(!this.state.singlePayrollPeriod) ? '' :
                        (this.state.singlePayrollPeriod.payments.length > 0) ?
                            <div>
                                <p className="text-right">
                                    <h2>Payments for {this.state.singlePayrollPeriod.label}</h2>
                                </p>
                                <div className="row mb-4 text-right">
                                    <div className="col">

                                        <Button size="small" onClick={() => this.props.history.push('/payroll/period/' + this.state.singlePayrollPeriod.id)}>Review Timesheet</Button>
                                    </div>
                                    <PDFDownloadLink document={
                                        <Document>
                                            {/* <Page style={styles.page}> */}
                                            <Page style={styles.body}>
                                                <View style={styles.section}>
                                                    <Image source={JobCoreLogo} style={styles.image} />
                                                </View>
                                                {this.state.employer.picture ? (
                                                    <View style={styles.section}>
                                                        <Image src={this.state.employer.picture} style={styles.image_company} />
                                                    </View>
                                                ) : null}


                                                <View style={{ color: 'black', marginTop: 15, marginBottom: 15, fontSize: 15 }}>
                                                    <Text>{moment(this.state.singlePayrollPeriod.starting_at).format('MMMM D') + " - " + moment(this.state.singlePayrollPeriod.ending_at).format('LL')}</Text>
                                                </View>
                                                <View style={styles.table}>
                                                    <View style={styles.tableRow}>
                                                        <View style={styles.tableCol1Header}>
                                                            <Text style={styles.tableCellHeader}>STAFF</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>REGULAR</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>PTO</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>HOLIDAY</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>SICK</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>OT</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>DBL</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>TOTAL</Text>
                                                        </View>
                                                        <View style={styles.tableColHeader}>
                                                            <Text style={styles.tableCellHeader}>LABOR</Text>
                                                        </View>
                                                    </View>

                                                    {this.state.payments.sort((a, b) =>
                                                        a.employee.user.last_name.toLowerCase() > b.employee.user.last_name.toLowerCase() ? 1 : -1
                                                    ).map(pay => {
                                                        const total = pay.payments.filter(p => p.status === 'APPROVED').reduce((incoming, current) => {
                                                            return {
                                                                over_time: parseFloat(current.over_time) + parseFloat(incoming.over_time),
                                                                regular_hours: parseFloat(current.regular_hours) + parseFloat(incoming.regular_hours),
                                                                total_amount: parseFloat(current.total_amount) + parseFloat(incoming.total_amount),
                                                                status: current.status == 'PAID' && incoming.status == 'PAID' ? 'PAID' : 'UNPAID'
                                                            };
                                                        }, { regular_hours: 0, total_amount: 0, over_time: 0, status: 'UNPAID' });
                                                        return <View key={pay.employee.id} style={styles.tableRow}>
                                                            <View style={styles.tableCol1}>
                                                                <Text style={styles.tableCell}>{pay.employee.user.last_name + " " + pay.employee.user.first_name + " - " + total.status.toLowerCase()}</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>{Math.round(total.regular_hours * 100) / 100}</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>-</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>-</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>-</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>{Math.round(total.over_time * 100) / 100}</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>-</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>{total.regular_hours > 40 ? total.regular_hours - 40 : 0}</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                                <Text style={styles.tableCell}>${Math.round(total.total_amount * 100) / 100}</Text>
                                                            </View>
                                                        </View>;
                                                    })}
                                                </View>
                                            </Page>
                                        </Document>
                                    } fileName={"JobCore " + this.state.singlePayrollPeriod.label + ".pdf"}>
                                        {({ blob, url, loading, error }) => (loading ? 'Loading...' : (
                                            <div className="col">
                                                <Button color="success" size="small" >Export to PDF</Button>
                                            </div>
                                        )
                                        )}
                                    </PDFDownloadLink>


                                </div>

                                {this.state.singlePayrollPeriod.status == "OPEN" &&
                                    <Redirect from={'/payroll/report/' + this.state.singlePayrollPeriod.id} to={'/payroll/rating/' + this.state.singlePayrollPeriod.id} />
                                }
                                <table className="table table-striped payroll-summary">
                                    <thead>
                                        <tr>
                                            <th scope="col">Staff</th>
                                            <th scope="col">Regular Hrs</th>
                                            <th scope="col">Over Time</th>
                                            <th scope="col">Earnings</th>
                                            <th scope="col">Taxes</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.payments.sort((a, b) =>
                                            a.employee.user.last_name.toLowerCase() > b.employee.user.last_name.toLowerCase() ? 1 : -1
                                        ).map(pay => {
                                            const total = pay.payments.filter(p => p.status === 'APPROVED').reduce((incoming, current) => {
                                                return {
                                                    over_time: parseFloat(current.over_time) + parseFloat(incoming.over_time),
                                                    regular_hours: parseFloat(current.regular_hours) + parseFloat(incoming.regular_hours),
                                                    total_amount: parseFloat(current.total_amount) + parseFloat(incoming.total_amount),
                                                    status: current.status == 'PAID' && incoming.status == 'PAID' ? 'PAID' : 'UNPAID'
                                                };
                                            }, { regular_hours: 0, total_amount: 0, over_time: 0, status: 'UNPAID' });
                                            return <tr key={pay.employee.id}>
                                                <td>
                                                    {pay.employee.user.last_name}, {pay.employee.user.first_name}
                                                    <p className="m-0 p-0"><span className="badge">{total.status.toLowerCase()}</span></p>
                                                </td>
                                                <td>{Math.round(total.regular_hours * 100) / 100}</td>
                                                <td>{Math.round(total.over_time * 100) / 100}</td>
                                                <td>{total.total_amount - taxesMagicNumber}</td>
                                                <td>{taxesMagicNumber}</td>
                                                <td>{total.total_amount}</td>
                                                <td>
                                                    <Button 
                                                    color="success" 
                                                    size="small" 
                                                    onClick={() => bar.show({ 
                                                        slug: "make_payment", 
                                                        data: {
                                                            pay: pay, 
                                                            total: total,
                                                    } 
                                                    })}>
                                                        Make payment
                                                    </Button>
                                                </td>
                                                {/* <td>{Math.round((total.regular_hours + total.over_time) * 100) / 100}</td>
                                                <td>${Math.round(total.total_amount * 100) / 100}</td> */}
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