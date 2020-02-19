import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import JobCoreLogo from '../../../img/logo.png';
import { Page, Image, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

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

const PayrollPeriodReport = ({ period, employer, payments }) => {
    const taxesMagicNumber = 0;
    return <Document>
        {/* <Page style={styles.page}> */}
        <Page style={styles.body}>
            <View style={styles.section}>
                <Image source={JobCoreLogo} style={styles.image} />
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

                {payments.sort((a, b) =>
                    a.employee.user.last_name.toLowerCase() > b.employee.user.last_name.toLowerCase() ? 1 : -1
                ).map(pay => {
                    const total = pay.payments.filter(p => p.status === 'APPROVED').reduce((incoming, current) => {
                        return {
                            over_time: parseFloat(current.over_time) + parseFloat(incoming.over_time),
                            regular_hours: parseFloat(current.regular_hours) + parseFloat(incoming.regular_hours),
                            total_amount: parseFloat(current.total_amount) + parseFloat(incoming.total_amount),
                            taxes: taxesMagicNumber,
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
    </Document>;
};
PayrollPeriodReport.propTypes = {
    period: PropTypes.object,
    employer: PropTypes.object,
    payments: PropTypes.array
};


export default PayrollPeriodReport;