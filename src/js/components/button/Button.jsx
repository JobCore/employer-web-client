import React, {useState} from "react";
import PropTypes from 'prop-types';
import './style.scss';

const icons = {
  favorite: 'icon icon-favorite',
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
  sync: 'fas fa-sync',
  backward: 'fas fa-backward',
  forward: 'fas fa-forward',
  envelope: "fas fa-envelope",
  stopwatch: "fas fa-stopwatch"
};

const sizes = {
  medium: { btn: 'btn-md', icon: 'icon-sm' },
  small: { btn: 'btn-sm', icon: 'icon-xs' }
};

const Button = ({ color, onClick, propagate, icon, children, className, note, rounded, size, onMouseEnter, onMouseLeave, onFocus, notePosition, withAlert }) => {
  return (
      <button
        type="button"
        className={"jc-button btn btn-"+color+" "+notePosition+" "+sizes[size].btn+(withAlert ? ' with-note':'')+(rounded ? ' rounded':'')+" "+className}
        onMouseEnter={(e) => (onMouseEnter) ? onMouseEnter(e):null}
        onMouseLeave={(e) => (onMouseLeave) ? onMouseLeave(e):null}
        onFocus={(e) => (onFocus) ? onFocus(e):null}
        onClick={(e) => {
          if(!propagate) e.stopPropagation();
          onClick(e);
        }}
      >
          { (typeof icons[icon] != 'undefined') ? <i className={`${icons[icon]} ${sizes[size].icon}`}></i>:'' }
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
  withAlert: PropTypes.bool,
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
  size: "medium",
  color: 'secondary',
  notePosition: 'left',
  icon: null
};

export default Button;