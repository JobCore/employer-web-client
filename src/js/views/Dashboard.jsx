import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import {DashboardBox} from '../components/index';
import {store} from '../actions.js';
import Joyride from 'react-joyride';

export default class Home extends Flux.DashView {
    constructor(){
        super();
        this.state = {
            shifts: [],
            runTutorial: false,
            steps: [
                {
                    target: '#draft_shifts',
                    content: 'No one can see your draft shifts, make sure to publish them later',
                    placement: 'right'
                },
                {
                    target: '#create_shift',
                    content: 'Start by creating a new shift',
                    placement: 'right'
                },
                {
                    target: '#invite_talent_to_jobcore',
                    content: 'Of you can also invite people to your pool of talents',
                    placement: 'right'
                }
                // {
                //     target: '#open_shifts',
                //     content: 'Here are the schedule shifts waiting for talents to apply',
                //     placement: 'right',
                // },
                // {
                //     target: '#upcoming_shifts',
                //     content: 'Upcoming means that it\'s full and ready to rumble!',
                //     placement: 'right',
                // },
                // {
                //     target: '#pending_shifts',
                //     content: 'Successfully finished shifts, it\'s payrol time!',
                //     placement: 'right',
                // }
            ]
        };
    }
    componentDidMount(){
        const shifts = store.getState('shifts');
        if(Array.isArray(shifts)) this.setState({shifts});
        this.subscribe(store, 'shifts', (shifts) => {
            if(Array.isArray(shifts)) this.setState({shifts});
        });
        
        this.setState({ runTutorial: true });
    }
    render() {
        const callback = (data) => {
            //const { action, index, type } = data;
        };
        return (
            <div>
                <Joyride continuous
                  steps={this.state.steps}
                  run={this.state.runTutorial}
                  callback={callback}
                />
                <div className="row">
                    <div className="col-8">
                        <h1 className="text-right">Dashboard</h1>
                        <DashboardBox id="draft_shifts" shifts={this.state.shifts.filter(s => s.status == 'DRAFT')} title="Draft Shifts" status="DRAFT" />
                        <DashboardBox id="open_shifts" shifts={this.state.shifts.filter(s => s.status == 'OPEN')} title="Open Shifts" status="OPEN" />
                        <DashboardBox id="upcoming_shifts" shifts={this.state.shifts.filter(s => s.status == 'FILLED')} title="Upcoming Shifts" status="FILLED" />
                        <DashboardBox id="pending_shifts" shifts={this.state.shifts.filter(s => s.status == 'UNPAID')} title="Shifts with pending payments" status="UNPAID" />
                    </div>
                </div>
            </div>
        );
    }
}
