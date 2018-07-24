import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

/**
 * @render react
 * @name AcceptReject
 * @description Ideal to accept or reject candidates/invites for shifts
 * @example
 *  <AcceptReject
 *      onAccept={() => acceptCandidate(props.shift.id, props.applicant)} 
 *      onReject={() => rejectCandidate(props.shift.id, props.applicant)} 
 *  />
 */
const AcceptReject = (props) => {
    return (<div className={"accept-reject "+props.className}>
        <button className="btn btn-danger" onClick={() => props.onReject()}>
            <i className="fas fa-times-circle"></i>
            {(props.showLabels) ? <label>Reject</label> : ''}
        </button>
        <button className="btn btn-success"onClick={() => props.onAccept()}>
            <i className="fas fa-check-circle"></i>
            {(props.showLabels) ? <label>Accept</label> : ''}
        </button>
    </div>);
};
AcceptReject.propTypes = {
  className: PropTypes.string,
  showLabels: PropTypes.bool,
  onReject: PropTypes.func,
  onAccept: PropTypes.func
};
AcceptReject.defaultProps = {
  className: '',
  showLabels: false
};

export default AcceptReject;