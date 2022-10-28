import React from "react";
import { JobSeekers } from "./JobSeekers/JobSeekers";
import { Hours } from "./Hours/Hours";
import { Shifts } from "./Shifts/Shifts";

/**
 * @function
 * @description Creates a page with 3 tabs that show metrics about Shifts, Punctuality, and Hours.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires Hours
 * @requires Shifts
 * @requires JobSeekers
 * @param {object} props - Contains an array of all shifts, and an array of all the workers.
 */
export const GeneralStats = (props) => {

    // Setting up main data sources
    let workers = props.workers
    let shifts = props.shifts

    // Return ----------------------------------------------------------------------------------------------------

    return (
        <div className="row d-flex flex-column mx-2">
            {/* Tabs Controller Starts */}
            <nav>
                <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                    <a className="nav-item nav-link active" id="nav-shifts-tab" data-toggle="tab" href="#nav-shifts" role="tab" aria-controls="nav-shifts" aria-selected="true"><h2>Shifts</h2></a>
                    <a className="nav-item nav-link" id="nav-hours-tab" data-toggle="tab" href="#nav-hours" role="tab" aria-controls="nav-hours" aria-selected="false"><h2>Hours</h2></a>
                    <a className="nav-item nav-link" id="nav-job-seekers-tab" data-toggle="tab" href="#nav-job-seekers" role="tab" aria-controls="nav-job-seekers" aria-selected="false"><h2>Job Seekers</h2></a>
                </div>
            </nav>
            {/* Tabs Controller Ends */}

            {/* Tabs Content Starts */}
            <div
                className="tab-content mt-5"
                id="nav-tabContent"
            >
                {/* Shifts Tab Starts */}
                <div className="tab-pane fade show active" id="nav-shifts" role="tabpanel" aria-labelledby="nav-shifts-tab">
                    <Shifts shifts={shifts} />
                </div>
                {/* Shifts Tab Ends */}

                {/* Hours Tab Starts */}
                <div className="tab-pane fade" id="nav-hours" role="tabpanel" aria-labelledby="nav-hours-tab">
                    <Hours shifts={shifts} />
                </div>
                {/* Hours Tab Ends */}

                {/* Job Seekers Tab Starts */}
                <div className="tab-pane fade" id="nav-job-seekers" role="tabpanel" aria-labelledby="nav-job-seekers-tab">
                    <JobSeekers shifts={shifts} workers={workers} />
                </div>
                {/* Job Seekers Tab Ends */}
            </div>
            {/* Tabs Content Ends */}
        </div>
    )
}
