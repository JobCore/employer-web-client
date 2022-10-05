import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import { Session } from "bc-react-session";

import { Queue } from "./queue/Queue";
import { Punctuality } from "./punctuality/Punctuality";
import { Ratings } from "./ratings/Ratings";
import { GeneralStats } from "./general-stats/GeneralStats";

import { store, search } from "../../actions";

/**
 * @description Creates the view for Metrics page, which renders 4 tabs with different components being called inside each one.
 * @since 09.28.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires Punctuality
 * @requires Ratings
 * @requires GeneralStats
 * @requires Queue
 * @requires store
 * @requires search
 * @requires Session
 * @requries Flux
 */
export class Metrics extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            // Queue Data ----------------------------------------------------------------------------------------------------------------------------

            // Variables for the Workers' List
            employees: [], // This will hold all the shifts.
            DocStatus: "", //This is needed to check the verification status of employees.
            empStatus: "unverified", //This is needed to filter out unverified employees.

            // Variables for the Shifts' List
            allShifts: [], // This will hold all the shifts.
            session: Session.get(), // This is needed to crate a user/employer session.
            calendarLoading: true, // This is needed to fill up the list of shifts, not sure how.
        };

        // This updates the state values
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    // Generating the list of shifts and the list of employees ---------------------------------------------------------------------------------------

    componentDidMount() {
        // Processes for the Shifts' List (Not sure how they work)
        const shifts = store.getState("shifts");

        this.subscribe(store, "shifts", (_shifts) => {
            this.setState({ allShifts: _shifts, calendarLoading: false });
        });

        // Processes for the Workers' List (Not sure how they work)
        this.filter();

        this.subscribe(store, "employees", (employees) => {
            if (Array.isArray(employees) && employees.length !== 0)
                this.setState({ employees });
        });

        this.handleStatusChange
    }

    // Processes for the Workers' List (Not sure how they work)
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
        let verifiedEmpList = this.state.employees.filter((employees) => employees.employment_verification_status === "APPROVED")

        // List of all shifts
        let listOfShifts = this.state.allShifts;

        // ---------------------------------------------
        // Filtering expired shifts
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
                            <GeneralStats workers={verifiedEmpList} shifts={listOfShifts} />
                        </div>
                        {/* General Stats Tab Ends */}

                        {/* Punctuality Tab Starts */}
                        <div className="tab-pane fade" id="nav-punctuality" role="tabpanel" aria-labelledby="nav-punctuality-tab">
                            <Punctuality shifts={listOfShifts} />
                        </div>
                        {/* Punctuality Tab Ends */}

                        {/* Ratings Tab Starts */}
                        <div className="tab-pane fade" id="nav-ratings" role="tabpanel" aria-labelledby="nav-ratings-tab">
                            <Ratings workers={verifiedEmpList} />
                        </div>
                        {/* Ratings Tab Ends */}

                        {/* Queue Tab Starts */}
                        <div className="tab-pane fade" id="nav-queue" role="tabpanel" aria-labelledby="nav-queue-tab">
                            <Queue workers={verifiedEmpList} shifts={listOfShifts} />
                        </div>
                        {/* Queue Tab Ends */}
                    </div>
                    {/* Tabs Content Ends */}
                </div>
            </div>
        );
    }
}