import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './style.scss';
import TimePicker from 'rc-time-picker';
import {TIME_FORMAT, DATE_FORMAT, NOW} from '../utils';
/**
 * ShiftDetails
 */
export const ShiftDetails = ({onSave, onCancel, onChange, catalog, formData}) => (<form>
    <div className="row">
        <div className="col-6">
            <label>Looking for</label>
            <select className="form-control"
                value={formData.position}
                onChange={(e)=>onChange({position: e.target.value})} >
                <option>Select a position</option>
                {
                    catalog.positions.map((pos,i)=>(<option key={i} value={pos.id}>{pos.title}</option>))
                }
            </select>
        </div>
        <div className="col-6">
            <label>How many?</label>
            <input type="number" className="form-control" 
                value={formData.maximum_allowed_employees}
                onChange={(e)=>onChange({maximum_allowed_employees: e.target.value})} 
            />
        </div>
    </div>
    <div className="row">
        <div className="col-6">
            <label>Price / hour</label>
            <input type="number" className="form-control" 
                value={formData.minimum_hourly_rate}
                onChange={(e)=>onChange({minimum_hourly_rate: e.target.value})} 
            />
        </div>
        <div className="col-6">
            <label>Date</label>
            <input type="date" className="form-control" 
                value={(typeof formData.date != 'undefined') ? formData.date.format(DATE_FORMAT) : ''}
                onChange={(e)=>onChange({date: moment(e.target.value)})} 
            />
        </div>
    </div>
    <div className="row">
        <div className="col-6">
            <label>From</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                use12Hours={true}
                value={formData.start_time}
                onChange={(value)=>onChange({start_time: value})}
            />
        </div>
        <div className="col-6">
            <label>To</label>
            <TimePicker 
                format={TIME_FORMAT}
                showSecond={false}
                minuteStep={15}
                defaultValue={NOW}
                use12Hours={true}
                value={formData.finish_time}
                onChange={(value)=>onChange({finish_time: value})}
            />
        </div>
    </div>
    <div className="row">
        <div className="col-12">
            <label>Venue</label>
            <select className="form-control" 
                value={formData.venue}
                onChange={(e)=>onChange({venue: e.target.value})} 
            >
                <option value={null}>Select a venue</option>
                {
                    catalog.venues.map((ven,i)=>(<option key={i} value={ven.id}>{ven.title}</option>))
                }
            </select>
        </div>
    </div>
    <div className="row">
        <div className="col-12">
            <label>Minimum start rating</label>
            <select className="form-control" 
                value={formData.minimum_allowed_rating}
                onChange={(e)=>onChange({minimum_allowed_rating: e.target.value})} 
            >
                <option value={1}>1 star</option>
                <option value={2}>2 star</option>
                <option value={3}>3 star</option>
                <option value={4}>4 star</option>
                <option value={5}>5 star</option>
            </select>
        </div>
    </div>
    <div className="btn-bar">
        <button type="button" className="btn btn-success" onClick={() => onSave()}>Save</button>
        <button type="button" className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
    </div>
</form>);
ShiftDetails.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};
export default ShiftDetails;