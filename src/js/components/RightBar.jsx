import React from 'react';
import PropTypes from 'prop-types';
import {create, update} from '../actions';
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import {Shift} from '../components/shifts';
import {Talent} from '../components/talents';
import {ValidationError} from '../utils/validation';

class RightBar extends React.Component {
    
    constructor(){
        super();
        this.state = {
            formData: {},
            catalog: null,
            error: null
        };
    }

    onSave(){
        this.setState({ error: null });
        try{
            switch (this.props.option.slug) {
                case 'create_shift':
                    create('shifts', Shift(this.state.formData).validate().serialize());
                    this.props.onClose();
                break;
                case 'update_shift':
                    update('shifts', Shift(this.state.formData).validate().serialize());
                    this.props.onClose();
                break;
                case 'filter_shift':{
                        const stringified = queryString.stringify(this.state.formData);
                        this.props.history.push('/shifts?'+stringified);
                    }
                break;
                case 'filter_talent':{
                        const stringified = queryString.stringify(Talent(this.state.formData).filters());
                        this.props.history.push('/talents?'+stringified);
                    }
                break;
                default: throw new Error("Missing logic onSave() for "+this.props.option.slug);
            }
        }
        catch(error){
            if(error instanceof ValidationError || error.validation){
                this.setState({error: error.message});
            }
            else throw error;
        }
            
    }
    
    componentDidMount(){
        if(this.props.formData) this.setState({ formData: this.props.formData });
    }
    
    onChange(incoming){
        const data = Object.assign(this.state.formData, incoming);
        this.setState({ formData: data });
    }
    
    render(){
        const View = this.props.component;
        
        
        return (<div className="right-bar">
            <h1>{this.props.option.title}</h1>
            {
                (this.state.error) ? <div className="alert alert-danger">{this.state.error}</div> : ''
            }
            <View 
                catalog={this.props.catalog}
                formData={this.state.formData}
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
  formData:  PropTypes.object,
  catalog:PropTypes.object
};
RightBar.defaultProps = {
  formData: null
};
export default withRouter(RightBar);