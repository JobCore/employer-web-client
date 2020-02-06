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

        state = {
            paymentInfo: ""
        };

    componentDidMount(){
        this.fetchPatmentInfo();
    }

    fetchPatmentInfo = async () => {
        try {
            const response = await GET(`employers/me/employee-payment-list/${this.props.formData.periodId}`);

            this.setState({ paymentInfo: response });
            console.log("response: ", response);
        } catch(error) {
            Notify.error(error.message || error);

        }
    }

    makePayment = async (
        employeePaymentId, 
        paymentType, 
        employer_bank_account_id, employee_bank_account_id
        ) => {
        const data = {
            payment_type: paymentType,
            payment_data: {
                employer_bank_account_id: employer_bank_account_id,
                employee_bank_account_id: employee_bank_account_id
            }
        };

        try{
            const response = await POST(`employers/me/employee-payment/${employeePaymentId}`, data);
            console.log("makepayment response: ", response);
            searchMe('payroll-periods')
            Promise.resolve(response);
        }catch(error){
            Promise.reject(error);
        }
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
         const { paymentInfo } = this.state;
         const employerBankAccounts = paymentInfo.employer ? paymentInfo.employer.bank_accounts : null;
        console.log('MakePayment formData: ', formData);
        console.log('MakePayment error: ', error);
        console.log('MakePayment paymentInfo: ', paymentInfo);
        const taxesMagicNumber = 3.00;
        return (
        <>
            {paymentInfo
        ? <form>
            <div className="row">
                <div className="col-12">
                    <label>Employee:</label>{` ${formData.pay.employee.user.last_name}, ${formData.pay.employee.user.first_name}`}
                    {/* <p className="m-0 p-0"><span className="badge">{formData.total.status.toLowerCase()}</span></p> */}
                </div>
                <div className="col-12">
                    <label>Regular hours:</label>{` ${formData.total.regular_hours}`}
                </div>
                <div className="col-12">
                    <label>Over time:</label>{` ${formData.total.over_time}`}
                </div>
                <div className="col-12">
                    <label>Earnings:</label>{` ${formData.total.total_amount - taxesMagicNumber}`}
                </div>
                <div className="col-12">
                    <label>Taxes:</label>{` ${taxesMagicNumber}`}
                </div>
                <div className="col-12">
                    <label>Amount:</label>{` ${formData.total.total_amount}`}
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Payment methods</label>
                </div>
                {paymentInfo.employee && paymentInfo.employee.bank_accounts
                ? <>
                    <div className="col-12 payment-cell">
                        <Button
                            style={{ width: '200px' }}
                            color="success"
                            size="small"
                            onClick={() => null}>
                            Check payment
                        </Button>
                    </div>
                    {employerBankAccounts.length > 0
                        ? employerBankAccounts.map((bankaccount, i) =>
                            <div className="col-12 payment-cell" key={i}>
                                <Button
                                    style={{ width: '200px' }}
                                    color="success"
                                    size="small"
                                    onClick={() => {
                                        console.log("entrose");
                                        const noti = Notify.info("Are you sure to pay ?", async (answer) => {
                                            if(answer){
                                                try{
                                                    await this.makePayment(
                                                        paymentInfo.employer.id, 
                                                        "FAKE", 
                                                        bankaccount.id, 
                                                        paymentInfo.employee.bank_accounts[0].id
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
                    : <label>Employer dont have any bank accounts</label>}
                </>
                : <label>Employee dont have any bank accounts</label>}
            </div>
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