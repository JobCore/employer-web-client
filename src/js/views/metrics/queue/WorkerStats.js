import React from "react";
import moment from "moment";
import Avatar from "../../../components/avatar/Avatar";
import { Button, Theme } from "../../../components/index";

// This is needed to render the button "Invite to Shift"
const allowLevels = window.location.search != "";

export const WorkerStats = (props) => {
    
    // Setting up my variables ---------------------------------------------------------------------------------

    const worker = props.worker;
    const shifts = props.shifts;

    // Scheduled Hours -----------------------------------------------------------------------------------------

    // Filtering scheduled Shifts
    const workerShiftsScheduled = [];

    shifts.forEach((shift) => {
        shift.employees.forEach((employee) => {
            if (employee === worker.id) {
                workerShiftsScheduled.push(shift);
            }
        });
    });

    // Calculating total scheduled hours
    let scheduledHours = workerShiftsScheduled.reduce(
        (total, { starting_at, ending_at }) =>
            total +
            moment.duration(moment(ending_at).diff(moment(starting_at))).asHours(),
        0
    );

    let scheduledHoursFormatted = (Math.round(scheduledHours * 4) / 4).toFixed(2);

    // Worked Hours ------------------------------------------------------------------------------------------------

    // Filtering worked Shifts
    const workerShiftsClockedIn = [];

    workerShiftsScheduled.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            if (shift.clockin.length > 0) {
                workerShiftsClockedIn.push(clockIn);
            }
        });
    });

    // Calculating total worked hours
    let workedHours = workerShiftsClockedIn.reduce(
        (total, { started_at, ended_at }) =>
            total +
            moment.duration(moment(ended_at).diff(moment(started_at))).asHours(),
        0
    );

    let workedHoursFormatted = (Math.round(workedHours * 4) / 4).toFixed(2);

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
                                <h5 className="m-0 p-0" align="left">{worker.rating == null ?  "No rating available" : worker.rating > 1 ? `Rating: ${worker.rating} stars` : `Rating: ${worker.rating} star`}</h5>
                            </div>
                        </div>
                        {/* Employee Image/Name/Rating Ends */}

                        {/* Scheduled Hours Starts */}
                        <div className="col p-0 my-auto d-flex justify-content-center">
                            <h3 className="m-0 p-0">{`Scheduled Hours: ${scheduledHoursFormatted}`}</h3>
                        </div>
                        {/* Scheduled Hours Ends */}

                        {/* Worked Hours Starts */}
                        <div className="col p-0 my-auto d-flex justify-content-center">

                            <h3 className="m-0 p-0">{`Worked Hours: ${workedHoursFormatted}`}</h3>
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