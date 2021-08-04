import React from "react";
import Loader from 'react-loader-spinner';
import Flux from "@4geeksacademy/react-flux-dash";
import { Button } from '../index';

class CustomModal extends Flux.DashView {

    state = {
        loading: false
    }
    render(){
        const { onConfirm, title } = this.props;
        return(
            <div>
                <h1>{title}</h1>
                {this.state.loading
                ? <Loader
                type="ThreeDots"
                color="#000000"
                height={100}
                width={100}
                />
            : <div style={{ marginTop: 20 }}>
                <Button onClick={()=> onConfirm(false)} style={{ marginRight: 10 }}>Cancel</Button>
                <button type="button" className="btn btn-success" onClick={()=> this.setState({ loading: true }, () => onConfirm(true))}>Confirm</button>
            </div>}
                
            </div>
        );
    }
}

export default CustomModal;