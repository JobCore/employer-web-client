import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

const Stars = ({ rating , jobCount, className, onClick}) => {
    const whole = Math.floor(rating);
    var decimalPart = rating - whole;
    let lis = [];
    for(let i = 0; i < whole; i++) lis.push(<i key={i} className="fas fa-star"></i>);
    return (<div className={`starrating ${className} ${onClick ? "clickable":""}`}>
        {
            (lis.length > 0) ? lis : <small>No rating available</small>
        }
        {
            (decimalPart > 0) ? <i className="fas fa-star-half"></i> : ''
        }
        {
            (jobCount && jobCount.length>0) ?
                <span className="jobs">in {jobCount} jobs completed</span>
            :
                ''
        }
    </div>);
};
Stars.propTypes = {
  rating: PropTypes.number.isRequired,
  className: '',
  jobCount: PropTypes.number,
  onClick: PropTypes.func
};
Stars.defaultProps = {
  className: '',
  onClick: null
};

export default Stars;