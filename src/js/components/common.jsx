import React from "react";
import PropTypes from 'prop-types';

export const Avatar = (props) => {
    return (<div className={"avatar "+props.className}
            style={{backgroundImage: "url("+props.url+")"}}
        ></div>);
};
Avatar.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
};
Avatar.defaultProps = {
  className: '',
  url: 'https://randomuser.me/api/portraits/women/1.jpg'
};

export const StartRating = ({ rating , jobCount}) => {
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
            //<span className="jobs">in 34 jobs</span>
        }
    </div>);
};
StartRating.propTypes = {
  rating: PropTypes.number.isRequired,
  jobCount: PropTypes.number
};