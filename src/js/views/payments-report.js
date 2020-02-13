import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import moment from 'moment';
import Select from 'react-select';
import { Theme, Button } from '../components/index';
import { StyleSheet } from '@react-pdf/renderer';
export class PaymentsReport extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            period: 1,
            periods: [
                { label: "period 1", value: 1 },
                { label: "period 2", value: 2 },
                { label: "period 3", value: 3 },
            ],
            date: moment(),
            paymentReport: {
                id: 1,
                period: 1,
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
                            date: moment().format('YYYY-MM-DD'),
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
                            date: moment().format('YYYY-MM-DD'),
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
                                    <h2>Payments report for period {this.state.paymentReport.period}</h2>
                                </p>
                                <div className="row mb-4 text-right">
                                    <div className="col" style={{alignItems: 'flex-end', display: 'flex', flexDirection: 'column'}}>
                                        <label>Filter by date</label>
                                        <input style={{width: 200}} type="date" className="form-control" onChange={(e) => this.setState({ date: e.target.value })} />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col">
                                        <label>Periods</label>
                                        <Select isMulti
                                            value={this.state.period}
                                            options={this.state.periods}
                                            onChange={(selection) => this.setState({ period: selection })}
                                        />
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
                                                <td>{pay.date}</td>
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