import React, {useState} from "react";
import PropTypes from 'prop-types';
import './style.scss';

const icons = {
  favorite: 'icon icon-favorite icon-xs',
  trash: 'fas fa-trash-alt',
  candidates: 'fas fa-users',
  clipboard: 'fas fa-clipboard-list',
  pencil: 'fas fa-pencil-alt',
  dollar: 'fas fa-dollar-sign',
  user_check: 'fas fa-user-check',
  plus: 'fas fa-plus',
  check: 'fas fa-check-circle',
  times: 'fas fa-times-circle',
  clock: 'fas fa-clock',
  backward: 'fas fa-backward',
  forward: 'fas fa-forward'
};

const sizes = {
  medium: '',
  small: 'btn-sm'
};

const Button = ({ color, onClick, propagate, icon, children, className, note, rounded, size, onMouseEnter, onMouseLeave, onFocus, notePosition }) => {
  return (
      <button
        type="button"
        className={"jc-button btn btn-"+color+" "+notePosition+" "+sizes[size]+(note ? ' with-note':'')+(rounded ? ' rounded':'')+" "+className}
        onMouseEnter={(e) => (onMouseEnter) ? onMouseEnter(e):null}
        onMouseLeave={(e) => (onMouseLeave) ? onMouseLeave(e):null}
        onFocus={(e) => (onFocus) ? onFocus(e):null}
        onClick={(e) => {
          if(!propagate) e.stopPropagation();
          onClick(e);
        }}
      >
          { (typeof icons[icon] != 'undefined') ? <i className={icons[icon]}></i>:'' }
          { (children) ? children:'' }
          { note ? <span className={"btn-tooltip "+notePosition}>{note}</span> : '' }
      </button>);
};
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  className: PropTypes.string,
  note: PropTypes.node,
  propagate: PropTypes.bool,
  color: PropTypes.string, //secondary, success, danger, warning
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  icon: PropTypes.string,
  notePosition: PropTypes.string,
  size: PropTypes.string,
  rounded: PropTypes.bool
};
Button.defaultProps = {
  propagate: false,
  rounded: false,
  children: null,
  onMouseEnter: null,
  onMouseLeave: null,
  onFocus: null,
  note: null,
  className: '',
  size: sizes['medium'],
  color: 'secondary',
  notePosition: 'left',
  icon: null
};

export default Button;