import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import logoURL from '../../img/logo.svg';
import {DashboardBox} from '../components/DashboardBox';
import {store} from '../actions.js';

const logoStyles = {
    backgroundImage: `url(${logoURL})`
};

export default class Home extends Flux.DashView {
    constructor(){
        super();
        this.state = {
            shifts: []
        };
    }
    componentDidMount(){
        this.subscribe(store, 'shifts', (shifts) => {
            if(Array.isArray(shifts)) this.setState({shifts});
        });
    }
    render() {
        const Logo = () => (<span className="svg_img" style={logoStyles} />);
        
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <Logo />
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <h1 className="text-right">Dashboard</h1>
                        <DashboardBox shifts={this.state.shifts} />
                        <DashboardBox shifts={this.state.shifts} />
                        <DashboardBox shifts={this.state.shifts} />
                        <DashboardBox shifts={this.state.shifts} />
                    </div>
                </div>
            </div>
        );
    }
}
