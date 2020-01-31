import React from "react";
import { validator, ValidationError } from '../utils/validation';
import PropTypes from 'prop-types';
import Select from 'react-select';

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
export const MakePayment = ({ 
    onSave, 
    onCancel, 
    onChange, 
    catalog, 
    formData, 
    bar, 
    error
 }) => {
        console.log('MakePayment formData: ', formData);
        console.log('MakePayment error: ', error);
        // const payment = formData.pay.payments[0]
        return ( <form>
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
                    <label>Earnings:</label>{` 0.00`}
                </div>
                <div className="col-12">
                    <label>Taxes:</label>{` 0.00`}
                </div>
                <div className="col-12">
                    <label>Amount:</label>{` ${formData.total.total_amount}`}
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Payment methods</label>
                </div>
                <div className="col-12 payment-cell">
                        Check Payment
                </div>
                <div className="col-12 payment-cell">
                        Bank of america 
                </div>
                <div className="col-12 payment-cell">
                        Wells fargo
                </div>
            </div>
            
        </form>);
};

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