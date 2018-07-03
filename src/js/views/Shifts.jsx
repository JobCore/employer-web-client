import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';

class ManageShift extends Flux.View {
    render() {
        return (
            <div className="p-5">
                <h1>Shift Details</h1>
            </div>
        );
    }
}

export const AddShift = ({onSave, onCancel, onChange, catalog}) => (<form>
    <div className="row">
        <div className="col">
            <label>Looking for</label>
            <select className="form-control" onChange={(e)=>onChange({position: e.target.value})} >
                <option>Select a position</option>
                {
                    catalog.map((pos)=>(<option value={pos.id}>{pos.title}</option>))
                }
            </select>
        </div>
        <div className="col">
            <label>How many?</label>
            <input type="number" className="form-control" onChange={(e)=>onChange({maximum_allowed_employees: e.target.value})} />
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>Price / hour</label>
            <input type="number" className="form-control" onChange={(e)=>onChange({minimum_hourly_rate: e.target.value})} />
        </div>
        <div className="col">
            <label>Date</label>
            <input type="date" className="form-control" onChange={(e)=>onChange({date: e.target.value})} />
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>From</label>
            <select className="form-control" onChange={(e)=>onChange({start_time: e.target.value})} >
                <option>1pm</option>
                <option>2pm</option>
                <option>3pm</option>
                <option>4pm</option>
            </select>
        </div>
        <div className="col">
            <label>To</label>
            <select className="form-control" onChange={(e)=>onChange({finish_time: e.target.value})} >
                <option>1pm</option>
                <option>2pm</option>
                <option>3pm</option>
                <option>4pm</option>
            </select>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>Venue</label>
            <select className="form-control" onChange={(e)=>onChange({venue: e.target.value})} >
                <option>1pm</option>
                <option>2pm</option>
                <option>3pm</option>
                <option>4pm</option>
            </select>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <label>Minimum start rating</label>
            <select className="form-control" onChange={(e)=>onChange({minimum_allowed_rating: e.target.value})} >
                <option>1 star</option>
                <option>2 star</option>
                <option>3 star</option>
                <option>4 star</option>
                <option>5 star</option>
            </select>
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-primary" onClick={() => onSave({status: 'draft'})}>Save as draft</button>
        <button type="button" className="btn btn-success" onClick={() => onSave({status: 'published'})}>Publish</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);

AddShift.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  catalog: PropTypes.object //contains the data needed for the form to load
};