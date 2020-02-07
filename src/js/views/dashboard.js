import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import { DashboardBox, Wizard, Theme, Button, ShiftBadge } from '../components/index';
import { store, fetchAllMe, searchMe } from '../actions.js';
import { callback, hasTutorial } from '../utils/tutorial';
import { GET } from '../utils/api_wrapper.js';
import { NOW } from '../components/utils.js';
import { Session } from 'bc-react-session';
import moment from 'moment';
import { CalendarView } from "../components/calendar/index.js";

export default class Home extends Flux.DashView {
    constructor() {
        super();

        this.state = {
            shifts: [],
            session: Session.get(),
            runTutorial: hasTutorial(),
            start: moment().subtract(1, 'weeks'),
            end: moment().add(1, 'weeks'),
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
    componentDidMount() {

        this.subscribe(store, 'shifts', (shifts) => {
            if (Array.isArray(shifts)) this.setState({ shifts });
        });

        searchMe(`shifts`, `?end=${this.state.end.format('YYYY-MM-DD')}&start=${this.state.start.format('YYYY-MM-DD')}`);
    }

    render() {
        return (
            <Theme.Consumer>
                {({ bar }) =>
                    <div>
                        <Wizard continuous
                            steps={this.state.steps}
                            run={this.state.runTutorial && this.state.session.active}
                            callback={callback}
                        />
                        <div className="row">
                            <div className="col-8">
                                <CalendarView
                                    viewMode={"day"}
                                    className="mb-2"
                                    allowResize={false}
                                    yAxisWidth={0}
                                    blockHoverIcon={false}
                                    ToolbarComponent={({ setCurrentDate, currentDate }) => <div className="text-right" style={{ position: "absolute", right: 0 }}>
                                        {<Button size="small" onClick={() => {
                                            const newEndDate = moment(currentDate).add(-1, 'days');
                                            if (newEndDate.isBefore(this.state.start)) {
                                                searchMe(`shifts`, `?end=${this.state.end.format('YYYY-MM-DD')}&start=${moment(this.state.start).subtract(1, 'weeks').format('YYYY-MM-DD')}`).then((newShifts) => {
                                                    this.setState({
                                                        state: newShifts,
                                                        start: moment(this.state.start).subtract(1, 'weeks')
                                                    });
                                                }

                                                );
                                            }
                                            setCurrentDate(moment(currentDate).add(-1, 'day'));
                                        }}>{'<<'}</Button>}
                                        {<Button size="small" onClick={() => {
                                            const newEndDate = moment(currentDate).add(1, 'days');
                                            if (this.state.end.isBefore(newEndDate)) {
                                                searchMe(`shifts`, `?end=${moment(this.state.end).add(1, 'weeks').format('YYYY-MM-DD')}&start=${this.state.start.format('YYYY-MM-DD')}`).then((newShifts) => {
                                                    this.setState({
                                                        state: newShifts,
                                                        end: moment(this.state.end).add(1, 'weeks')
                                                    });
                                                }

                                                );
                                            }
                                            setCurrentDate(moment(currentDate).add(1, 'day'));
                                        }}>{'>>'}</Button>}
                                        <Button size="small" onClick={() => this.props.history.push('./calendar#start=' + moment(currentDate).add(-1, 'month').format('YYYY-MM-DD') + '&end=' + moment(currentDate).add(2, 'month').format('YYYY-MM-DD'))}>Go to calendar</Button>
                                    </div>
                                    }
                                    eventBoxStyles={{
                                        background: "#c3f0f5"
                                    }}
                                    dayBlockStyles={{
                                        backgroundColor: "rgba(255,255,255,0.3)",
                                        borderRight: "1px solid #e3e3e3",
                                        borderBottom: "1px solid #e3e3e3"
                                    }}
                                    onClick={e => e.data &&
                                        bar.show({
                                            slug: "shift_details", data: {
                                                ...e.data,
                                                starting_at: e.start,
                                                ending_at: e.end
                                            }
                                        })
                                    }
                                    events={{
                                        today: this.state.shifts.map(s => {
                                            return ({
                                                start: moment(s.starting_at),
                                                end: moment(s.ending_at),
                                                label: <span><ShiftBadge {...s} /> {s.position.title} - {s.venue.title}</span>,
                                                data: s

                                            }
                                            );
                                        })

                                    }}
                                />
                                <DashboardBox id="draft_shifts"
                                    status="DRAFT"
                                    title="Draft Shifts"
                                    fetchData={() => GET(`employers/me/shifts?status=DRAFT&envelope=true&limit=10`)}
                                    defaultShifts={this.state.shifts.filter(s => s.status == 'DRAFT')}
                                />
                                <DashboardBox id="open_shifts"
                                    status="OPEN"
                                    title="Open Shifts"
                                    fetchData={() => GET(`employers/me/shifts?status=OPEN&envelope=true&limit=10`)}
                                    defaultShifts={this.state.shifts.filter(s => s.status == 'OPEN')}
                                />
                                <DashboardBox id="upcoming_shifts"
                                    title="Filled Shifts"
                                    status="FILLED"
                                    fetchData={() => GET(`employers/me/shifts?status=FILLED&envelope=true&limit=10`)}
                                    defaultShifts={this.state.shifts.filter(s => s.status != 'DRAFT' && s.maximum_allowed_employees == s.employees.length && moment(s.ending_at).isAfter(NOW()))}
                                />
                                <DashboardBox id="expired_shifts"
                                    status="EXPIRED"
                                    title="Completed Shifts"
                                    fetchData={() => GET(`employers/me/shifts?status=EXPIRED&envelope=true&limit=10`)}
                                    defaultShifts={this.state.shifts.filter(s => !['DRAFT', 'COMPLETED', 'CANCELLED'].includes(s.status) && moment(s.ending_at).isBefore(NOW()))}
                                />
                                <DashboardBox id="completed_shifts"
                                    status="COMPLETED"
                                    title="Paid Shifts"
                                    fetchData={() => GET(`employers/me/shifts?status=COMPLETED&envelope=true&limit=10`)}
                                    defaultShifts={this.state.shifts.filter(s => s.status == 'COMPLETED' && moment(s.ending_at).isBefore(NOW()))}
                                />
                            </div>
                        </div>
                    </div>
                }
            </Theme.Consumer>
        );
    }
}
