import moment from "moment";

// Clock-Ins Data ------------------------------------------------------------------

/**
 * @function
 * @description Generates array of objects with clock-in trends for Punctuality.js.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires moment
 * @param {object} props - Contains an array of all the shifts.
 */
export const ClockInsDataGenerator = (props) => {

    // Assigning props to variables
    let shifts = props

    // Array for the clock-ins
    let clockIns = [];

    // Sorting the shifts
    shifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            // Keeping all clockins array with at
            // least one object inside
            if (shift.clockin.length > 0) {
                // Formatting each object to keep
                // both the scheduled clock-in and 
                // the actual "registered" clock-in.
                clockIns.push({
                    starting_at: shift.starting_at,
                    started_at: clockIn.started_at
                });
            }
        });
    });

    // Setting up counters
    let earlyClockins = 0;
    let lateClockins = 0;
    let onTimeClockins = 0;

    // Increasing counters based on clock-in times
    clockIns.forEach((shift) => {
        let start1 = moment(shift.starting_at);
        let start2 = moment(shift.started_at);

        let startDiff = moment.duration(start2.diff(start1)).asMinutes();

        if (startDiff >= 15) {
            lateClockins++;
        } else if (startDiff <= -30) {
            earlyClockins++;
        } else {
            onTimeClockins++;
        }
    });

    // Creating clock-in objects
    let earlyClockinsObj = {
        description: "Early Clock-Ins",
        qty: earlyClockins
    };
    let lateClockinsObj = {
        description: "Late Clock-Ins",
        qty: lateClockins
    };
    let onTimeClockinsObj = {
        description: "On Time Clock-Ins",
        qty: onTimeClockins
    };

    // Setting up base array for all objects
    let cleanedClockIns = [];

    // Pushing objects to base array
    cleanedClockIns.push(earlyClockinsObj);
    cleanedClockIns.push(lateClockinsObj);
    cleanedClockIns.push(onTimeClockinsObj);

    // Setting up totals
    let totalClockIns = clockIns.length;

    // Generating percentages as new properties
    let pctClockIns = cleanedClockIns.map(({ description, qty }) => ({
        description,
        qty,
        pct: ((qty * 100) / totalClockIns).toFixed(0)
    }));

    // Setting up object for totals
    let totalClockInsObj = {
        description: "Total Clock-Ins",
        qty: totalClockIns,
        pct: "100"
    };

    // Adding totals to the array with percentages
    pctClockIns.push(totalClockInsObj);

    // Addind IDs to each object
    pctClockIns.forEach((item, i) => {
        item.id = i + 1;
    });

    // Returning clock-ins array
    return pctClockIns;
};

// Clock-Outs Data -----------------------------------------------------------------

/**
 * @function
 * @description Generates array of objects with clock-out trends for Punctuality.js.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires moment
 * @param {object} props - Contains an array of all the shifts.
 */
export const ClockOutsDataGenerator = (props) => {

    // Assigning props to variables
    let shifts = props

    // Array for the clock-outs
    let clockOuts = [];

    // Sorting the shifts
    shifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            // Keeping all clockins array with at
            // least one object inside
            if (shift.clockin.length > 0) {
                // Formatting each object to keep
                // both the scheduled clock-out, the 
                // actual "registered" clock-out, and
                // whether it closed automatically or not.
                clockOuts.push({
                    ending_at: shift.ending_at,
                    ended_at: clockIn.ended_at,
                    automatically_closed: clockIn.automatically_closed
                });
            }
        });
    });

    // Setting up counters
    let earlyClockouts = 0;
    let lateClockouts = 0;
    let onTimeClockouts = 0;
    let forgotClockOut = 0;

    // Increasing counters based on clock-out times
    clockOuts.forEach((shift) => {
        let end1 = moment(shift.ending_at);
        let end2 = moment(shift.ended_at);

        let endDiff = moment.duration(end2.diff(end1)).asMinutes();

        if (endDiff >= 30) {
            lateClockouts++;
        } else if (endDiff <= -30) {
            earlyClockouts++;
        } else {
            onTimeClockouts++;
        }
    });

    // Increasing the "forgotClockOut" counter only
    clockOuts.forEach((shift) => {
        // Note: When a shif get automatically closed, it means
        // that the worker forgot to clock-out.
        if (shift.automatically_closed === true) {
            forgotClockOut++;
        }
    });

    // Creating clock-out objects
    let earlyClockoutsObj = {
        description: "Early Clock-Outs",
        qty: earlyClockouts
    };
    let lateClockoutsObj = {
        description: "Late Clock-Outs",
        qty: lateClockouts
    };
    let onTimeClockoutsObj = {
        description: "On Time Clock-Outs",
        qty: onTimeClockouts
    };
    let forgotClockOutObj = {
        description: "Forgotten Clock-Outs",
        qty: forgotClockOut
    };

    // Setting up base array for all objects
    let cleanedClockOuts = [];

    // Pushing objects to base array
    cleanedClockOuts.push(earlyClockoutsObj);
    cleanedClockOuts.push(lateClockoutsObj);
    cleanedClockOuts.push(onTimeClockoutsObj);
    cleanedClockOuts.push(forgotClockOutObj);

    // Setting up totals
    let totalClockOuts = clockOuts.length;

    // Generating percentages as new properties
    let pctClockOuts = cleanedClockOuts.map(({ description, qty }) => ({
        description,
        qty,
        pct: ((qty * 100) / totalClockOuts).toFixed(0)
    }));

    // Setting up object for totals
    let totalClockOutsObj = {
        description: "Total Clock-Outs",
        qty: totalClockOuts,
        pct: "100"
    };

    // Adding totals to the array with percentages
    pctClockOuts.push(totalClockOutsObj);

    // Addind IDs to each object
    pctClockOuts.forEach((item, i) => {
        item.id = i + 1;
    });

    // Returning clock-outs array
    return pctClockOuts;
};