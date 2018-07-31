import React from 'react';
import PropTypes from 'prop-types';
import {Theme} from '../index';
import './style.scss';
/**
 * ShiftCard
 */
const ShiftCard = (props) => {
    const totalCandidates = (Array.isArray(props.shift.candidates)) ? props.shift.candidates.length : 0;
    const openVacancys = props.shift.maximum_allowed_employees;
    const startDate = props.shift.date.format('ll');
    const startTime = props.shift.start_time.format('LT');
    const endTime = props.shift.finish_time.format('LT');
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className={`shiftcard ${(props.hover) ? 'shiftcard-hover':''}`}>
                <div className="shift-details">
                    {
                        (props.shift.status == 'DRAFT') ? 
                            <span href="#" className="badge badge-secondary">D</span> :
                                (openVacancys == totalCandidates) ? 
                                    <span href="#" className="badge">{totalCandidates}/{openVacancys}</span> :
                                    <span href="#" className="badge badge-danger">{totalCandidates}/{openVacancys}</span>
                    }
                    <a href="#" className="shift-position">{props.shift.position.title}</a> @ 
                    <a href="#" className="shift-location"> {props.shift.venue.title}</a> 
                    <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                    {
                        (typeof props.shift.price == 'string') ? 
                            <span className="shift-price"> ${props.shift.price}/hr.</span>
                        :
                            <span className="shift-price"> {props.shift.price.currencySymbol}{props.shift.price.amount}/{props.shift.price.timeframe}.</span>
                    }
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-secondary"
                            onClick={() => bar.show({ slug: "show_shift_applicants", data: props.shift, title: "Shift Applicants" })}
                        ><i className="icon icon-favorite icon-xs"></i> <label>Applicants</label></button>
                        <button type="button" className="btn btn-secondary"
                            onClick={() => bar.show({ slug: "update_shift", data: props.shift, title: "Shift Details" })}
                        ><i className="icon icon-favorite icon-xs"></i> <label>Detais</label></button>
                    </div>
                </div>
            </li>)}
    </Theme.Consumer>);
};
ShiftCard.propTypes = {
    shift: PropTypes.object.isRequired,
    hover: PropTypes.bool.isRequired
};
ShiftCard.defaultProps = {
  hover: false
};
export default ShiftCard;