import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import {DashboardBox, Wizard } from '../components/index';
import {store} from '../actions.js';
import {callback, hasTutorial} from '../utils/tutorial';
export default class Home extends Flux.DashView {
    constructor(){
        super();
        this.state = {
            shifts: [],
            runTutorial: hasTutorial(),
            steps: [
                {
                    target: '#create_shift',
                    content: 'Start by creating a new shift',
                    placement: 'right'
                },
                {
                    target: '#invite_talent_to_jobcore',
                    content: 'Or you can also invite people to your pool of talents',
                    placement: 'right'
                },
                {
                    target: '#draft_shifts',
                    content: 'Finally, you can see your current shifts grouped by status: Drafts, Open (Receiving applicants), Upcoming and Pending to process payment.',
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
        return (
            <div>
                <Wizard continuous
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
                        <DashboardBox id="pending_shifts" shifts={this.state.shifts.filter(s => s.status == 'UNPAID')} title="Pending for payments" status="UNPAID" />
                    </div>
                </div>
            </div>
        );
    }
}
