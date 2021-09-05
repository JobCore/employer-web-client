import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import moment from 'moment';
import Select from 'react-select';
import { Theme } from '../components/index';
import { StyleSheet } from '@react-pdf/renderer';
import { store, getDeductionsReport, searchMe } from "../actions";
import arrowDown from "../../img/icons/arrow_down.svg";
import arrowUp from "../../img/icons/arrow_up.svg";
import SVG from 'react-svg-inline';
export class DeductionsReport extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            period: null,
            start_date: null,
            end_date: null,
            payrollPeriods: store.getState('payroll-periods'),
            deductionsReport: []
        };
    }

    componentDidMount = () => {
        this.subscribe(store, 'deductions-reports', (deductionsReport) => {
            this.setState({ deductionsReport });
        });
        this.subscribe(store, 'payroll-periods', (payrollPeriods) => {
            this.setState({ payrollPeriods });
        });
        this.getDeductions();
        searchMe(`payroll-periods`);
    }
    
    getDeductions = () => {
        const endDate = this.state.end_date ? moment(this.state.end_date).format('YYYY-MM-DD') : null;
        const startDate = this.state.start_date ? moment(this.state.start_date).format('YYYY-MM-DD') : null;
        return getDeductionsReport(this.state.period, startDate, endDate);
    };

    render() {
        const { payrollPeriods, deductionsReport } = this.state;
        const options = payrollPeriods && payrollPeriods.length > 0
        ? [
            {label: "All", value: null},
            ...payrollPeriods.filter(e => e.payments.length > 0).map((period) => {
                return { label: "From " + moment(period.starting_at).format('MMM DD, YYYY') + " to "  + moment(period.ending_at).format('MMM DD, YYYY') , value: period.id };
            })
        ] 
        : [];

        return (<div className="p-1 listcontents" style={{maxWidth: "1100px"}}>
            <Theme.Consumer>
                {({ bar }) => (<span>
                    <div>
                        <p className="text-left">
                            <h2>Deductions reports</h2>
                        </p>
                        <div className="row mb-4">
                            <div className="col-4">
                                <label>Periods</label>
                                <Select
                                    options={options}
                                    onChange={(selection) => this.setState({ period: selection.value }, () => this.getDeductions())}
                                />
                            </div>
                            <div className="col-3">
                                <label>From</label>
                                <input style={{width: 200}} type="date" className="form-control" onChange={(e) => this.setState({ start_date: e.target.value }, () => this.getDeductions())} />
                            </div>
                            <div className="col-3">
                                <label>To</label>
                                <input style={{width: 200}} type="date" className="form-control" onChange={(e) => this.setState({ end_date: e.target.value }, () => this.getDeductions())} />
                            </div>
                        </div>
                    </div>
                    {deductionsReport && 
                    payrollPeriods && 
                    deductionsReport.length > 0 && 
                    payrollPeriods.length > 0
                        ? <div>
                            <table className="table table-striped payroll-summary">
                                <thead>
                                    <tr>
                                        <th scope="col">Employee</th>
                                        <th scope="col">Payment date</th>
                                        <th scope="col">Deductions</th>
                                        <th scope="col">Gross Earnings</th>
                                        <th scope="col">Deductions Amount</th>
                                        <th scope="col">Net Earnings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deductionsReport.sort( (left, right) => {
                                        return moment.utc(right.payment_date).diff(moment.utc(left.payment_date));
                                    }).map((deduction, i) => {
                                        const array = !this.state[`deduction${i}`] 
                                        ? deduction.deduction_list.slice(0, 3) 
                                        : deduction.deduction_list;
                                        // const icon = !this.state[`deduction${i}`] 
                                        // ? arrowDown
                                        // : arrowUp;
                                        return <tr key={i}>
                                            <td>
                                                {deduction.employee}
                                                {/* <p className="m-0 p-0"><span className="badge">{deduction.status.toLowerCase()}</span></p> */}
                                            </td>
                                            <td>{deduction.payment_date}</td>
                                            <td>
                                                <div>
                                                    {deduction.deduction_list && deduction.deduction_list.length > 0 
                                                ? array.map((deduction, i) => {
                                                    return (
                                                        <p className="m-0" key={i}>{deduction.name}:{` ${deduction.amount}`}</p>
                                                    );
                                                }
                                                )
                                            : 'No deductions'}
                                                    {/* <div style={{ textAlign: 'center' }}>
                                                        <SVG className="deduction-svg" width="24px" svg={icon} onClick={() => this.setState({ [`deduction${i}`]: !this.state[`deduction${i}`] })} />
                                                    </div> */}
                                                </div>
                                            </td>
                                            <td>{"$" + deduction.earnings}</td>
                                            <td>{"-$" +  deduction.deduction_amount}</td>
                                            <td>{"$" + Math.floor((deduction.earnings - deduction.deduction_amount)*100)/100}</td>
                                        </tr>;
                                    })}
                                </tbody>
                            </table>
                        </div>
                            : <p>No deductions reports to review for this period</p>
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