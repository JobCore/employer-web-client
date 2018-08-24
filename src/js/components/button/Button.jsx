import React from "react";
import PropTypes from 'prop-types';

const icons = {
  favorite: 'icon icon-favorite icon-xs',
  trash: 'fas fa-trash-alt'
};

const Button = ({ color, onClick, propagate, icon, children, className }) => (
    <button 
      type="button" 
      className={"btn btn-"+color+" "+className}
      onClick={(e) => {
        if(!propagate) e.stopPropagation();
        onClick();
      }}
    >
        { (typeof icons[icon] != 'undefined') ? <i className={icons[icon]}></i>:'' }
        { (children) ? children:'' }
    </button>);
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  propagate: PropTypes.bool,
  color: PropTypes.string, //secondary, success, danger, warning
  children: PropTypes.obj,
  icon: PropTypes.string
};
Button.defaultProps = {
  propagate: false,
  children: null,
  className: '',
  color: 'secondary',
  icon: null
};
export default Button;