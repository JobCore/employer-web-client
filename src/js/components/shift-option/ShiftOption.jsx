import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

const ShiftOption = ({data, isDisabled, innerProps}) => {
    if(isDisabled) return null;
    const startDate = data.value.date.format('ll');
    const startTime = data.value.start_time.format('LT');
    const endTime = data.value.finish_time.format('LT');
    return (<div className="shift-option" {...innerProps}>
        <a href="#" className="shift-position">{data.value.position.title}</a> @ 
        <a href="#" className="shift-location"> {data.value.venue.title}</a> 
        <span className="shift-date"> {startDate}</span>
        <span className="shift-time"> from {startTime} to {endTime}</span>
    </div>);
};
ShiftOption.propTypes = {
    isDisabled: PropTypes.bool,
	data: PropTypes.object,
	innerProps: PropTypes.object.isRequired
};
export default ShiftOption;