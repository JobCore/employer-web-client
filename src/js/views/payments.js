import React from "react";
import { validator, ValidationError } from '../utils/validation';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button } from '../components/index';
import Flux from "@4geeksacademy/react-flux-dash";
import { GET, POST } from "../utils/api_wrapper";
import { Notify } from 'bc-react-notifier';
import { searchMe } from "../actions";
export const Payment = (data = {}) => {

    const _defaults = {
        pay: null,
        total: null,
        serialize: function () {

            const newDeduction = {
            };

            return Object.assign(this, newDeduction);
        }
    };

    let _payment = Object.assign(_defaults, data);
    return {
        validate: () => {
            // if (validator.isEmpty(_payment.name)) throw new ValidationError('The deduction name cannot be empty');
            // if (!_payment.value) throw new ValidationError('Deduction cannot be empty');
            // if (validator.isEmpty(_payment.description)) throw new ValidationError('The deduction description cannot be empty');
            // if (!_payment.type) throw new ValidationError('The deduction type cannot be empty');
            return _payment;
        },
        defaults: () => {
            return _defaults;
        }
    };
};

/**
 * Make Payment
 */
export class MakePayment extends Flux.DashView {

    makePayment = async (
        employeePaymentId, 
        paymentType, 
        employer_bank_account_id, 
        employee_bank_account_id
        ) => {
        const data = {
            payment_type: paymentType,
            payment_data: paymentType === "CHECK" ? null : {
                employer_bank_account_id: employer_bank_account_id,
                employee_bank_account_id: employee_bank_account_id
            }
        };

        try{
            const response = await POST(`employers/me/employee-payment/${employeePaymentId}`, data);
            console.log("makepayment response: ", response);
            searchMe('payroll-periods');
            Promise.resolve(response);
        }catch(error){
            Notify.error(error.message || error);
            Promise.reject(error);
        }
        // this.setState({ ispaid: true });
    }

    render() {
        const { 
            onSave, 
            onCancel, 
            onChange, 
            catalog, 
            formData, 
            bar, 
            error
         } = this.props;
         const { pay, paymentInfo } = formData;
         const employerBankAccounts = paymentInfo && paymentInfo.employer ? paymentInfo.employer.bank_accounts : null;
        console.log('MakePayment pay: ', pay);
        console.log('MakePayment error: ', error);
        console.log('MakePayment paymentInfo: ', paymentInfo);
        return (
        <>
            {paymentInfo && pay
        ? <form>
            <div className="row mt-3">
                <div className="col-12">
                    <h4>{`Payment to `}{` ${pay.employee.last_name}, ${pay.employee.first_name}`}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Employee:</label>{` ${pay.employee.last_name}, ${pay.employee.first_name}`}
                    {/* <p className="m-0 p-0"><span className="badge">{formData.total.status.toLowerCase()}</span></p> */}
                </div>
                <div className="col-12">
                    <label>Regular hours:</label>{` ${pay.regular_hours}`}
                </div>
                <div className="col-12">
                    <label>Over time:</label>{` ${pay.over_time}`}
                </div>
                <div className="col-12">
                    <label>Earnings:</label>{` ${pay.earnings}`}
                </div>
                <div className="col-12">
                    <label>Taxes:</label>{` ${pay.deductions}`}
                </div>
                <div className="col-12">
                    <label>Amount:</label>{` ${pay.amount}`}
                </div>
            </div>
            {!pay.paid
                    ? <div className="row">
                        <div className="col-12">
                            <label>Payment methods</label>
                        </div>
                        {paymentInfo.payments[0] && paymentInfo.payments[0].employee.bank_accounts
                            ? <>
                                <div className="col-12 payment-cell">
                                    <Button
                                        style={{ width: '200px' }}
                                        color="success"
                                        size="small"
                                        onClick={() => {
                                            const noti = Notify.info("Are you sure to pay ?", async (answer) => {
                                                if(answer){
                                                    try{
                                                        await this.makePayment(
                                                            pay.id, 
                                                            "CHECK", 
                                                            "", 
                                                            ""
                                                            );
                                                        noti.remove();
                                                    }catch(error){
                                                        Notify.error(error.message || error);
                                                    }
                                                } else{
                                                    noti.remove();
                                                }
                                            });
                                        }}>
                                        Check payment
                                    </Button>
                                </div>
                                {employerBankAccounts && employerBankAccounts.length > 0
                                    ? employerBankAccounts.map((bankaccount, i) =>
                                        <div className="col-12 payment-cell" key={i}>
                                            <Button
                                                style={{ width: '200px' }}
                                                color="success"
                                                size="small"
                                                onClick={() => {
                                                    const noti = Notify.info("Are you sure to pay ?", async (answer) => {
                                                        if(answer){
                                                            try{
                                                                await this.makePayment(
                                                                    pay.id, 
                                                                    "FAKE", 
                                                                    bankaccount.id, 
                                                                    paymentInfo.payments[0].employee.bank_accounts[0].id
                                                                    );
                                                                noti.remove();
                                                            }catch(error){
                                                                Notify.error(error.message || error);
                                                            }
                                                        } else{
                                                            noti.remove();
                                                        }
                                        
                                                    });
                                                }}
                                                >
                                                {`${bankaccount.institution_name} ${bankaccount.name}`}
                                            </Button>
                                        </div>
                                    )
                                : <div className="col-12"><label>Employer dont have any bank accounts</label></div>}
                        </>
                        : <div className="col-12"><label>Employee dont have any bank accounts</label></div>}
                    </div>
        : <div className="row">
            <div className="col-12">
                <label>Status:</label>{` Paid`}
            </div>
        </div>
        }
        </form>
    : null}
    </>
        );
    }
}

MakePayment.propTypes = {
    error: PropTypes.string,
    action: PropTypes.string,
    bar: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};