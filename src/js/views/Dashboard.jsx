import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import {DashboardBox, Wizard } from '../components/index';
import {store} from '../actions.js';
import {callback, hasTutorial} from '../utils/tutorial';
import {Session} from 'bc-react-session';

export default class Home extends Flux.DashView {
    constructor(){
        super();
        
        this.state = {
            shifts: [],
            session: Session.get(),
            runTutorial: hasTutorial(),
            steps: [
                {
                    content: <h2>Welcome to the tour!</h2>,
                    placement: "center",
                    disableBeacon: true,
                    styles: {
                        options: {
                        zIndex: 10000
                        }
                    },
                    locale: { skip: "Skip tutorial" },
                    target: "body"
                },
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
            ]
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
                <Wizard continuous
                  steps={this.state.steps}
                  run={this.state.runTutorial && this.state.session.active}
                  callback={callback}
                />
                <div className="row">
                    <div className="col-8">
                        <h1 className="text-right">Dashboard</h1>
                        <DashboardBox id="draft_shifts" 
                            status="DRAFT" 
                            title="Draft Shifts"
                            shifts={this.state.shifts.filter(s => s.status == 'DRAFT').sort((a,b) => (new Date(b.starting_at) - new Date(a.starting_at)))}
                        />
                        <DashboardBox id="open_shifts" 
                            status="OPEN" 
                            title="Open Shifts" 
                            shifts={this.state.shifts.filter(s => s.status == 'OPEN' && s.maximum_allowed_employees > s.employees.length).sort((a,b) => (new Date(b.starting_at) - new Date(a.starting_at)))} 
                        />
                        <DashboardBox id="upcoming_shifts" 
                            title="Upcoming Shifts" 
                            status="FILLED" 
                            shifts={this.state.shifts.filter(s => (s.status == 'OPEN' && s.maximum_allowed_employees == s.employees.length)).sort((a,b) => (new Date(b.starting_at) - new Date(a.starting_at)))} 
                        />
                        <DashboardBox id="pending_shifts" shifts={this.state.shifts.filter(s => s.status == 'UNPAID')} title="Pending for payments" status="UNPAID" />
                    </div>
                </div>
            </div>
        );
    }
}
