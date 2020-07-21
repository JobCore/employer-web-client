import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

const Stars = ({ rating , jobCount, className, onClick, noRatingLabel}) => {
    const whole = Math.floor(rating);
    var decimalPart = rating - whole;
    let lis = [];
    for(let i = 0; i < whole; i++) lis.push(<i key={i} className="fas fa-star"></i>);
    return (<div className={`starrating ${className} ${onClick ? "clickable":""}`}>
        {
            (lis.length > 0) ? lis : <small>{noRatingLabel ? noRatingLabel  : 'No rating available '}</small>
        }
        {
            (decimalPart > 0) ? <i className="fas fa-star-half"></i> : ''
        }
        { jobCount !== null &&
            <small className="jobs" onClick={() => onClick()}> in {jobCount} jobs</small>
        }
    </div>);
};
Stars.propTypes = {
  rating: PropTypes.number.isRequired,
  className: PropTypes.string,
  jobCount: PropTypes.number,
  onClick: PropTypes.func,
  noRatingLabel: PropTypes.string
};
Stars.defaultProps = {
  className: '',
  onClick: null,
  jobCount: null,
  noRatingLabel: null
};

export default Stars;