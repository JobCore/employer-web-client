import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import JobCoreLogo from '../../../img/logo.png';
import { Page, Image, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const BORDER_COLOR = '#000000';
const BORDER_STYLE = 'solid';
const COL1_WIDTH = 10;
const COLN_WIDTH = (100 - COL1_WIDTH) / 11;

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
        flexDirection: "row",
        textAlign: 'center'
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
        borderTopWidth: 0,
        textAlign: 'center'
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

const PayrollPeriodReport = ({ period, employer, payments }) => {
    return <Document>
        <Page orientation={"landscape"} style={styles.body}>
            <View style={styles.section}>
                <Image src={JobCoreLogo} style={styles.image} />
            </View>
            {employer.picture ? (
                <View style={styles.section}>
                    <Image src={employer.picture} style={styles.image_company} />
                </View>
            ) : null}


            <View style={{ color: 'black', marginTop: 15, marginBottom: 15, fontSize: 15 }}>
                <Text>{moment(period.starting_at).format('MMMM D') + " - " + moment(period.ending_at).format('LL')}</Text>
            </View>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={styles.tableCol1Header}>
                        <Text style={styles.tableCellHeader}>STAFF</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>REG</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>OT</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>TOTAL HRS</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>RATE PAY</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>EARNINGS</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>FED WITHHOLDING</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>SS EMPLOYEE</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>SS COMPANY</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>MED EMPLOYEE</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>MED COMPANY</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>NET AMOUNT</Text>
                    </View>
                </View>

                {payments.sort((a, b) =>
                    a.employee.last_name.toLowerCase() > b.employee.last_name.toLowerCase() ? 1 : -1
                ).map(pay => {
                    return <View key={pay.employee.id} style={styles.tableRow}>
                        <View style={styles.tableCol1}>
                            <Text style={styles.tableCell}>{pay.employee.last_name}, {pay.employee.first_name}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{(parseFloat(pay.regular_hours) + parseFloat(pay.over_time) < 40 ? parseFloat(pay.regular_hours) + parseFloat(pay.over_time) : 40).toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{parseFloat(pay.regular_hours) + parseFloat(pay.over_time) > 40 ? (parseFloat(pay.regular_hours) + parseFloat(pay.over_time)- 40).toFixed(2) : '-'}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{(parseFloat(pay.regular_hours) + parseFloat(pay.over_time)).toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{(Math.round((pay.earnings/(Math.round((Number(pay.regular_hours) + Number(pay.over_time)) * 100)/100)) * 2) / 2).toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{pay.earnings && parseFloat(pay.earnings).toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableCol}>                                      
                            <Text style={styles.tableCell}>{pay.deduction_list.find(e => e.name == "Federal Withholding").amount > 0 ? "-" + pay.deduction_list.find(e => e.name == "Federal Withholding").amount: 0}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{"-" + pay.deduction_list.find(e => e.name == "Social Security").amount}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{"-" + pay.deduction_list.find(e => e.name == "Medicare").amount}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{"-" + pay.deduction_list.find(e => e.name == "Social Security").amount}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{"-" + pay.deduction_list.find(e => e.name == "Medicare").amount}</Text>
                        </View>

                        {/* <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>${pay.deductions && parseFloat(pay.deductions).toFixed(2)}</Text>
                        </View> */}
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>${pay.amount && parseFloat(pay.amount).toFixed(2)}</Text>
                        </View>
                    </View>;
                })}
            </View>
        </Page>
    </Document>;
};
PayrollPeriodReport.propTypes = {
    period: PropTypes.object,
    employer: PropTypes.object,
    payments: PropTypes.array
};


export default PayrollPeriodReport;
