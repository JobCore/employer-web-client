import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

const Stars = ({ rating , jobCount}) => {
    const whole = Math.floor(rating);
    var decimalPart = rating - whole;
    let lis = [];
    for(let i = 0; i < whole; i++) lis.push(<i key={i} className="fas fa-star"></i>);
    return (<div className="starrating">
        {
            (lis.length > 0) ? lis : <small>No rating available</small>
        }
        {
            (decimalPart > 0) ? <i className="fas fa-star-half"></i> : ''
        }
        {
            (jobCount) ? 
                <span className="jobs">in {jobCount} jobs completed</span>
            :
                ''
        }
    </div>);
};
Stars.propTypes = {
  rating: PropTypes.number.isRequired,
  jobCount: PropTypes.number
};

export default Stars;