import React from "react";
import moment from "moment";
import Avatar from "../../../components/avatar/Avatar";
import { Button, Theme } from "../../../components/index";

// This is needed to render the button "Invite to Shift"
const allowLevels = window.location.search != "";

/**
 * @function
 * @description Creates a table of all employees with their worked/scheduled hours for Queue.js
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires moment
 * @requires Avatar
 * @requires Button
 * @requires Theme
 * @param {object} props - Contains an array of all shifts, and an object with information of a single worker, previously mapped in Queue.js
 */
export const QueueData = (props) => {

    //Assigning props to variables ----------------------------

    // This is a single worker brought from the mapping
    // of all workers back in Queue.js
    const worker = props.worker;

    // These are all the shifts, with different workers
    const shifts = props.shifts;

    // Worker Shifts ------------------------------------------

    // Array to hold shifts from the single worker
    const workerShifts = [];

    // Keeping the shifts whose worker id matches
    // the id of the single worker
    shifts.forEach((shift) => {
        shift.employees.forEach((employee) => {
            if (employee === worker.id) {
                workerShifts.push(shift);
            }
        });
    });

    // Worker Clock-ins ---------------------------------------

    // Array to hold clock-ins from the single worker
    let workerClockIns = [];

    // Keeping the clock-ins whose worker id matches
    // the id of the single worker
    workerShifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            if (clockIn.employee === worker.id) {
                workerClockIns.push(clockIn);
            }
        });
    });

    // Scheduled Hours ---------------------------------------

    // Array to hold scheduled hours from the single worker
    let scheduledHours = [];

    // Calculating the scheduled hours of each shift and
    // passing that data as an object to "scheduledHours"
    workerShifts.forEach((shift) => {
        let start = moment(shift.starting_at);
        let end = moment(shift.ending_at);

        let diff = moment.duration(end.diff(start)).asHours();

        scheduledHours.push({
            id: shift.id,
            scheduled_hours: diff
        });
    });

    // Adding all the scheduled hours to form a total
    let totalScheduledHours = scheduledHours.reduce((accumulator, shift) => {
        return accumulator + shift.scheduled_hours;
    }, 0);

    // Formatting the total to 2 decimal places
    let totalScheduledHoursF = totalScheduledHours.toFixed(2)

    // Worked Hours ----------------------------------------

    // Array to hold worked hours from the single worker
    let workedHours = [];

    // Calculating the worked hours of each shift and
    // passing that data as an object to "workedHours"
    workerClockIns.forEach((shift) => {
        let start = moment(shift.started_at);
        let end = moment(shift.ended_at);

        let diff = moment.duration(end.diff(start)).asHours();

        workedHours.push({
            id: shift.id,
            worked_hours: diff
        });
    });

    // Adding all the worked hours to form a total
    let totalWorkedHours = workedHours.reduce((accumulator, shift) => {
        return accumulator + shift.worked_hours;
    }, 0);

    // Formatting the total to 2 decimal places
    let totalWorkedHoursF = totalWorkedHours.toFixed(2)

    // Return ------------------------------------------------------------------------------------------------------

    return (
        <>
            <Theme.Consumer>
                {({ bar }) => (
                    <div className="row d-flex border d-inline-flex justify-content-between py-4 w-100">
                        {/* Employee Image/Name/Rating Starts */}
                        <div className="col p-0 d-flex justify-content-center">
                            <div className="my-auto mr-2">
                                <Avatar url={worker.user.profile.picture} />
                            </div>
                            <div className="ms-2 text-start my-auto d-flex flex-column">
                                <h5 className="m-0 p-0" align="left">{`${worker.user.first_name} ${worker.user.last_name}`}</h5>
                                <h5 className="m-0 p-0" align="left">{worker.rating == null ? "No rating available" : worker.rating > 1 ? `Rating: ${worker.rating} stars` : `Rating: ${worker.rating} star`}</h5>
                            </div>
                        </div>
                        {/* Employee Image/Name/Rating Ends */}

                        {/* Scheduled Hours Starts */}
                        <div className="col p-0 my-auto d-flex justify-content-center">
                            <h3 className="m-0 p-0">{`Scheduled Hours: ${totalScheduledHoursF}`}</h3>
                        </div>
                        {/* Scheduled Hours Ends */}

                        {/* Worked Hours Starts */}
                        <div className="col p-0 my-auto d-flex justify-content-center">

                            <h3 className="m-0 p-0">{`Worked Hours: ${totalWorkedHoursF}`}</h3>
                        </div>
                        {/* Worked Hours Ends */}

                        {/* Invite Button Starts */}
                        <div className="col p-0 my-auto d-flex justify-content-center">
                            <Button
                                className="btn btn-dark bg-dark"
                                onClick={() =>
                                    bar.show({
                                        slug: "invite_talent_to_shift",
                                        data: worker,
                                        allowLevels,
                                    })
                                }
                            >
                                <h5 className="m-0">Invite to Shift</h5>
                            </Button>
                        </div>
                        {/* Invite Button Ends */}
                    </div>
                )}
            </Theme.Consumer>
        </>
    );
};