import React, {useState} from "react";
import PropTypes from 'prop-types';
import './style.scss'; 

const Toggle = ({ onClick, className }) => {
    return (                                                    
        <label className="toggle"
            onClick={(e) => onClick(e)}
        >
            <input type="checkbox" />
            <span className="slider round"></span>
        </label>
    );
};
Toggle.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};
Toggle.defaultProps = {
  className: '',
};

export default Toggle;