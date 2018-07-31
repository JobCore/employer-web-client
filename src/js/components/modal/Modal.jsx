import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

const Modal = (props) => {
    return (<div className={"bc-modal "+props.className}>
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                {props.children}
            </div>
        </div>
    </div>);
};
Modal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string
};
Modal.defaultProps = {
  className: ''
};

export default Modal;