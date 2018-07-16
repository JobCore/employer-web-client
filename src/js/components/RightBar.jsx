import React from 'react';
import PropTypes from 'prop-types';
import {add} from '../actions';
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';

class RightBar extends React.Component {
    
    constructor(){
        super();
        this.state = {
            formData: {}
        };
    }

    onSave(){
        switch (this.props.option.slug) {
            case 'create_shift':
                add('shifts', this.state.formData);
            break;
            case 'filter_shift':{
                const stringified = queryString.stringify(this.state.formData);
                this.props.history.push('/shifts?'+stringified);
            }
            break;
            default: throw new Error("Missing logic onSave() for "+this.props.option.slug);
        }
    }

    onChange(incoming){
        const data = Object.assign(this.state.formData, incoming);
        this.setState({formData: data});
    }

    render(){
        const View = this.props.component;
        return (<div className="right-bar">
            <h1>{this.props.option.title}</h1>
            <View 
                catalog={this.props.catalog}
                onSave={(data)=> this.onSave(data)} 
                onCancel={(incoming)=>this.props.onClose(incoming)} 
                onChange={(incoming)=>this.onChange(incoming)} 
            />
        </div>);
    }
}

RightBar.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequire,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  option: PropTypes.object.isRequired,
  catalog:PropTypes.object
};
export default withRouter(RightBar);