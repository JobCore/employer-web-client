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
 */
export const QueueData = (props) => {

    // Setting up my variables --------------------------------
    const worker = props.worker;
    const shifts = props.shifts;

    // Worker Shifts ------------------------------------------
    const workerShifts = [];

    shifts.forEach((shift) => {
        shift.employees.forEach((employee) => {
            if (employee === worker.id) {
                workerShifts.push(shift);
            }
        });
    });

    // Worker Clock-ins ---------------------------------------
    let workerClockIns = [];

    workerShifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            if (clockIn.employee === worker.id) {
                workerClockIns.push(clockIn);
            }
        });
    });

    // Scheduled Hours ---------------------------------------
    let scheduledHours = [];

    workerShifts.forEach((shift) => {
        let start = moment(shift.starting_at);
        let end = moment(shift.ending_at);

        let diff = moment.duration(end.diff(start)).asHours();

        scheduledHours.push({
            id: shift.id,
            scheduled_hours: diff
        });
    });

    let totalScheduledHours = scheduledHours.reduce((acc, obj) => {
        return acc + obj.scheduled_hours;
    }, 0);

    let totalScheduledHoursF = totalScheduledHours.toFixed(2)

    // Worked Hours ----------------------------------------
    let workedHours = [];

    workerClockIns.forEach((shift) => {
        let start = moment(shift.started_at);
        let end = moment(shift.ended_at);

        let diff = moment.duration(end.diff(start)).asHours();

        workedHours.push({
            id: shift.id,
            worked_hours: diff
        });
    });

    let totalWorkedHours = workedHours.reduce((acc, obj) => {
        return acc + obj.worked_hours;
    }, 0);

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