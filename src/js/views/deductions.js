import React from "react";
import { validator, ValidationError } from '../utils/validation';
import PropTypes from 'prop-types';

export const Deduction = (data = {}) => {

    const _defaults = {
        id: null,
        name: '',
        value: null,
        description: '',
        type: 'PERCENTAGE',
        lock: false,
        serialize: function () {

            const newDeduction = {
            };

            return Object.assign(this, newDeduction);
        }
    };

    let _deduction = Object.assign(_defaults, data);
    return {
        validate: () => {
            if (validator.isEmpty(_deduction.name)) throw new ValidationError('The deduction name cannot be empty');
            if (!_deduction.value) throw new ValidationError('Deduction cannot be empty');
            if (validator.isEmpty(_deduction.description)) throw new ValidationError('The deduction description cannot be empty');
            return _deduction;
        },
        defaults: () => {
            return _defaults;
        }
    };
};
/**
 * Create deduction
 */
export const CreateDeduction = ({ 
    onSave, 
    onCancel, 
    onChange, 
    catalog, 
    formData, 
    bar, 
    error
 }) => {
        return ( <form>
            <div className="row">
                <div className="col-6">
                    <label>Name:</label>
                    <input className="form-control"
                        value={formData.name}
                        onChange={(e)=> onChange({ name: e.target.value })}
                    />
                </div>
                <div className="col-6">
                    <label>Deduction</label>
                    <input type="number" className="form-control"
                        value={formData.value}
                        onChange={(e)=> onChange({value: Number(e.target.value)})}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Description:</label>
                    <input className="form-control"
                        value={formData.description}
                        onChange={(e)=> onChange({ description: e.target.value })}
                    />
                </div>
            </div>
            {/* <div className="row">
                <div className="col-1" style={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                    <input type="checkbox"
                        style={{ marginRight: "6px" }}
                        checked={formData.lock}
                        onChange={(e)=> onChange({ lock: e.target.checked})}
                    />
                    <label>Lock </label>
                </div>
            </div> */}
            <div className="btn-bar">
                <button 
                type="button"
                className="btn btn-success" 
                onClick={() => onSave({
                    name: formData.name,
                    value: formData.value,
                    type: 'PERCENTAGE',
                    description: formData.description
                })}
                >
                    Create
                </button>
            </div>
        </form>);
};

CreateDeduction.propTypes = {
    error: PropTypes.string,
    action: PropTypes.string,
    bar: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};
/**
 * Edit deduction
 */
export const UpdateDeduction = ({
    onSave, 
    onCancel, 
    onChange, 
    catalog, 
    formData, 
    bar, 
    error
 }) => {
        return ( <form>
            <div className="row">
                <div className="col-6">
                    <label>Name:</label>
                    <input className="form-control"
                        value={formData.name}
                        onChange={(e)=> onChange({ name: e.target.value })}
                    />
                </div>
                <div className="col-6">
                    <label>Deduction</label>
                    <input type="number" className="form-control"
                        value={formData.value}
                        onChange={(e)=> onChange({ value: Number(e.target.value)})}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Description:</label>
                    <input className="form-control"
                        value={formData.description}
                        onChange={(e)=> onChange({ description: e.target.value })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-1" style={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                    <input 
                        type="checkbox"
                        style={{ marginRight: "6px" }}
                        checked={formData.lock}
                        onChange={(e)=> onChange({ lock: e.target.checked})}
                    />
                    <label>Lock </label>
                </div>
            </div>
            <div className="btn-bar">
                <button 
                type="button"
                className="btn btn-success" 
                onClick={() => onSave({
                    id: formData.id,
                    name: formData.name,
                    value: formData.value,
                    lock: formData.lock,
                    type: 'PERCENTAGE',
                    description: formData.description
                })}
                >
                    Save
                </button>
            </div>
        </form>);
};

UpdateDeduction.propTypes = {
    error: PropTypes.string,
    action: PropTypes.string,
    bar: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};