import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

const ShiftOption = (option) => {
    const startDate = option.value.date.format('ll');
    const startTime = option.value.start_time.format('LT');
    const endTime = option.value.finish_time.format('LT');
    return (<div className="shift-option">
        <a href="#" className="shift-position">{option.value.position.title}</a> @ 
        <a href="#" className="shift-location"> {option.value.venue.title}</a> 
        <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
    </div>);
};
ShiftOption.propTypes = {
	children: PropTypes.node,
	value: PropTypes.object
};
export default ShiftOption;