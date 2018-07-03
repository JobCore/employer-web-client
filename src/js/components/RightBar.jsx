import React from 'react';
import PropTypes from 'prop-types';
import {add} from '../actions';

export class RightBar extends React.Component {
    
    constructor(){
        super();
        this.state = {
            formData: null
        };
    }

    onSave(){
        add('shift', this.formData);
    }

    onChange(incoming){
        const data = Object.assign(this.state.formData, incoming);
        this.setState({formData: data});
    }

    render(){
        const View = this.props.component;
        return (<div className="right-bar">
            <h1>{'Add shift'}</h1>
            <View 
                onSave={(data)=> this.onSave(data)} 
                onCancel={()=>this.props.onClose()} 
                onChange={()=>this.onChange()} 
            />
        </div>);
    }
}

RightBar.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  onClose: PropTypes.func.isRequired
};