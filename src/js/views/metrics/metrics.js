import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import { Session } from "bc-react-session";

import { Queue } from "./queue/Queue";
import { Punctuality } from "./punctuality/Punctuality";
import { Ratings } from "./ratings/Ratings";
import { GeneralStats } from "./general-stats/GeneralStats";

import { store, search } from "../../actions";


export class Metrics extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            // Queue Data ----------------------------------------------------------------------------------------------------------------------------

            // Workers
            DocStatus: "",
            empStatus: "unverified",
            employees: [],

            // Shifts
            allShifts: [],
            session: Session.get(),
            calendarLoading: true,
        };

        // This updates the state values
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    // Generating the list of shifts and the list of employees ---------------------------------------------------------------------------------------

    componentDidMount() {
        // Shifts
        const shifts = store.getState("shifts");

        this.subscribe(store, "shifts", (_shifts) => {
            this.setState({ allShifts: _shifts, calendarLoading: false });
        });

        // Workers
        this.filter();

        this.subscribe(store, "employees", (employees) => {
            if (Array.isArray(employees) && employees.length !== 0)
                this.setState({ employees });
        });

        this.handleStatusChange
    }

    // Workers
    componentWillUnmount() {
        this.handleStatusChange
    }

    handleStatusChange() {
        this.setState({ DocStatus: props.catalog.employee.employment_verification_status });
    }

    filter(url) {
        let queries = window.location.search;

        if (queries) queries = "&" + queries.substring(1);

        if (url && url.length > 50) {
            const page = url.split("employees")[1];

            if (page) {
                search(`employees`, `${page + queries}`).then((data) => {
                    this.setState({
                        employees: data.results,
                    });
                });

            } else null;

        } else {
            search(`employees`, `?envelope=true&limit=50${queries}`).then((data) => {
                this.setState({
                    employees: data.results,
                });
            });
        }
    }

    // Render ---------------------------------------------------------------------------------------------------------------------------------------

    render() {
        // List of workers with verified documents
        const verifiedEmpList = this.state.employees.filter((employees) => employees.employment_verification_status === "APPROVED")

        // List of all shifts
        const listOfShifts = this.state.allShifts;

        // ---------------------------------------------
        // Filtering expired lists
        // let listOfShifts =
        //     (Array.isArray(shifts) &&
        //         shifts.length > 0 &&
        //         shifts.filter(
        //             (e) => e.status !== "EXPIRED"
        //         )) ||
        //     [];
        // ---------------------------------------------

        // Return -----------------------------------------------------------------------------------------------------------------------------------

        return (
            <div>
                {/* Title of the Page*/}
                <div className="mx-3 mb-3">
                    <h1>Metrics</h1>
                </div>

                <div className="row d-flex flex-column mx-3">
                    {/* Tabs Controller Starts */}
                    <nav>
                        <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-general-stats-tab" data-toggle="tab" href="#nav-general-stats" role="tab" aria-controls="nav-general-stats" aria-selected="true"><h2>General Stats</h2></a>
                            <a className="nav-item nav-link" id="nav-punctuality-tab" data-toggle="tab" href="#nav-punctuality" role="tab" aria-controls="nav-punctuality" aria-selected="false"><h2>Punctuality</h2></a>
                            <a className="nav-item nav-link" id="nav-ratings-tab" data-toggle="tab" href="#nav-ratings" role="tab" aria-controls="nav-ratings" aria-selected="false"><h2>Ratings</h2></a>
                            <a className="nav-item nav-link" id="nav-queue-tab" data-toggle="tab" href="#nav-queue" role="tab" aria-controls="nav-queue" aria-selected="false"><h2>Queue</h2></a>
                        </div>
                    </nav>
                    {/* Tabs Controller Ends */}

                    {/* Tabs Content Starts */}
                    <div
                        className="tab-content mt-5"
                        id="nav-tabContent"
                    >
                        {/* General Stats Tab Starts */}
                        <div className="tab-pane fade show active" id="nav-general-stats" role="tabpanel" aria-labelledby="nav-general-stats-tab">
                            <GeneralStats />
                        </div>
                        {/* General Stats Tab Ends */}

                        {/* Punctuality Tab Starts */}
                        <div className="tab-pane fade" id="nav-punctuality" role="tabpanel" aria-labelledby="nav-punctuality-tab">
                            <Punctuality />
                        </div>
                        {/* Punctuality Tab Ends */}

                        {/* Ratings Tab Starts */}
                        <div className="tab-pane fade" id="nav-ratings" role="tabpanel" aria-labelledby="nav-ratings-tab">
                            <Ratings />
                        </div>
                        {/* Ratings Tab Ends */}

                        {/* Queue Tab Starts */}
                        <div className="tab-pane fade" id="nav-queue" role="tabpanel" aria-labelledby="nav-queue-tab">
                            <Queue shifts={listOfShifts} workers={verifiedEmpList} />
                        </div>
                        {/* Queue Tab Ends */}
                    </div>
                    {/* Tabs Content Ends */}
                </div>
            </div>
        );
    }
}