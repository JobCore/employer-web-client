import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import {DashboardBox} from '../components/DashboardBox';
import {store} from '../actions.js';

export default class Home extends Flux.DashView {
    constructor(){
        super();
        this.state = {
            shifts: []
        };
    }
    componentDidMount(){
        const shifts = store.getState('shifts');
        if(Array.isArray(shifts)) this.setState({shifts});
        this.subscribe(store, 'shifts', (shifts) => {
            if(Array.isArray(shifts)) this.setState({shifts});
        });
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-8">
                        <h1 className="text-right">Dashboard</h1>
                        <DashboardBox shifts={this.state.shifts} title="Draft Shifts" status="DRAFT" />
                        <DashboardBox shifts={this.state.shifts} title="Open Shifts" status="OPEN" />
                        <DashboardBox shifts={this.state.shifts} title="Upcoming Shifts" status="UPCOMING" />
                        <DashboardBox shifts={this.state.shifts} title="Shifts with pending payments" status="UNPAID" />
                    </div>
                </div>
            </div>
        );
    }
}
