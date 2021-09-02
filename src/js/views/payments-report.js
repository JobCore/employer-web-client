import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import moment from 'moment';
import Select from 'react-select';
import { Theme } from '../components/index';
import { StyleSheet } from '@react-pdf/renderer';
import { store, getPaymentsReport, searchMe } from "../actions";
export class PaymentsReport extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            period: null,
            start_date: null,
            end_date: null,
            payrollPeriods: store.getState('payroll-periods'),
            paymentReport: []
        };
    }

    componentDidMount = () => {
        this.subscribe(store, 'payments-reports', (paymentReport) => {
            this.setState({ paymentReport });
        });
        this.subscribe(store, 'payroll-periods', (payrollPeriods) => {
            this.setState({ payrollPeriods });
        });
        this.getPayments();
        searchMe(`payroll-periods`, '?payments=True');
    }
    
    getPayments = () => {
        const endDate = this.state.end_date ? moment(this.state.end_date).format('YYYY-MM-DD') : null;
        const startDate = this.state.start_date ? moment(this.state.start_date).format('YYYY-MM-DD') : null;
        return getPaymentsReport(this.state.period, startDate, endDate);
    };

    render() {
        const { payrollPeriods, paymentReport } = this.state;
        const options = payrollPeriods && payrollPeriods.length > 0
        ? [
            { label: "All", value: null },
            ...payrollPeriods.map((period) => {
                return { label: "From " + moment(period.starting_at).format('MMM DD, YYYY') + " to "  + moment(period.ending_at).format('MMM DD, YYYY') , value: period.id };
            })
        ] 
        : [];

        console.log('payment reports', paymentReport);
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({ bar }) => (<span>
                    <div>
                        <p className="text-right">
                            <h2>Payments reports</h2>
                        </p>
                        <div className="row mb-4">
                            <div className="col-6">
                                <label>Periods</label>
                                <Select
                                    options={options}
                                    onChange={(selection) => this.setState({ period: selection.value }, () => this.getPayments())}
                                />
                            </div>
                            <div className="col-3">
                                <label>From</label>
                                <input style={{width: 200}} type="date" className="form-control" onChange={(e) => this.setState({ start_date: e.target.value }, () => this.getPayments())} />
                            </div>
                            <div className="col-3">
                                <label>To</label>
                                <input style={{width: 200}} type="date" className="form-control" onChange={(e) => this.setState({ end_date: e.target.value }, () => this.getPayments())} />
                            </div>
                        </div>
                    </div>
                    {paymentReport && 
                    payrollPeriods &&
                    paymentReport.length > 0 &&
                    payrollPeriods.length > 0
                        ? <div>
                            <table className="table table-striped payroll-summary">
                                <thead>
                                    <tr>
                                        <th scope="col">Employee</th>
                                        <th scope="col">Payment date</th>
                                        <th scope="col">Gross Earnings</th>
                                        <th scope="col">Deductions</th>
                                        <th scope="col">Net Earnings</th>
                                        <th scope="col">Payment method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentReport.map((pay, i) => {
                                        return <tr key={i}>
                                            <td>
                                                {pay.employee}
                                                {/* <p className="m-0 p-0"><span className="badge">{pay.status.toLowerCase()}</span></p> */}
                                            </td>
                                            <td>{pay.payment_date}</td>
                                            <td>{"$" + pay.earnings}</td>
                                            <td>{"-$" + pay.deductions}</td>
                                            <td>{"$" + pay.amount}</td>
                                            <td>{pay.payment_source || "CHECK"}</td>
                                        </tr>;
                                    })}
                                </tbody>
                            </table>
                        </div>
                            : <p>No payments reports to review for this period</p>
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