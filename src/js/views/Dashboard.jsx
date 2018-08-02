import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import {DashboardBox} from '../components/index';
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
                        <DashboardBox shifts={this.state.shifts.filter(s => s.status == 'DRAFT')} title="Draft Shifts" status="DRAFT" />
                        <DashboardBox shifts={this.state.shifts.filter(s => s.status == 'OPEN')} title="Open Shifts" status="PUBLISHED" />
                        <DashboardBox shifts={this.state.shifts.filter(s => s.status == 'FILLED')} title="Upcoming Shifts" status="FILLED" />
                        <DashboardBox shifts={this.state.shifts.filter(s => s.status == 'UNPAID')} title="Shifts with pending payments" status="UNPAID" />
                    </div>
                </div>
            </div>
        );
    }
}
