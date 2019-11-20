import React from "react";
import PropTypes from 'prop-types';
import ShiftOption from './ShiftOption';
import { components } from 'react-select';

const ShiftOptionSelected = ({ multi=false }) => (props) => {
    const {removeProps, ...rest} = props;
    
    if(!multi) return rest.data != undefined && rest.data.value != 'loading' && rest.data.value.venue ? 
        <components.SingleValue {...props}>
            <ShiftOption {...rest} />
        </components.SingleValue>
        : 
        "Pick a shift from the list";
    else return (<div>
        <components.MultiValueRemove {...removeProps}>
            <span className="delete-btn float-right" onClick={() => removeProps.onClick()}><i className="fas fa-trash-alt"></i></span>
        </components.MultiValueRemove>
        <ShiftOption {...rest} />
    </div>);
};
ShiftOptionSelected.propTypes = {
    removeProps: PropTypes.object
    
};
export default ShiftOptionSelected;

