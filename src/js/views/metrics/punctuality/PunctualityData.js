import { DummyDataShifts } from "./DummyDataShifts"
import moment from "moment";

// Clock-Ins Data ------------------------------------------------------------------

const ClockInsDataGenerator = () => {

    // Clock-ins array
    let clockIns = [];

    // Sorting the shifts
    DummyDataShifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            if (shift.clockin.length > 0) {
                // Gathering the clock-ins
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

    // Increasing clock-in counters
    clockIns.forEach((shift) => {
        let start1 = moment(shift.starting_at);
        let start2 = moment(shift.started_at);

        let startDiff = moment.duration(start2.diff(start1)).asMinutes();

        if (startDiff >= 15) {
            lateClockins++;
        } else if (startDiff <= -30) {
            earlyClockins++;
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

    // Setting up base array for all objects
    let cleanedClockIns = [];

    // Pushing objects to base array
    cleanedClockIns.push(earlyClockinsObj);
    cleanedClockIns.push(lateClockinsObj);

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
    return pctClockIns
}

// Exporting clock-ins array
export const ClockInsData = ClockInsDataGenerator()


// Clock-Outs Data -----------------------------------------------------------------

const ClockOutsDataGenerator = () => {

    // Clock-outs array
    let clockOuts = [];

    // Sorting the shifts
    DummyDataShifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            if (shift.clockin.length > 0) {
                // Gathering the clock-outs
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
    let forgotClockOut= 0;

    // Increasing clock-out counters
    clockOuts.forEach((shift) => {
        let end1 = moment(shift.ending_at);
        let end2 = moment(shift.ended_at);

        let endDiff = moment.duration(end2.diff(end1)).asMinutes();

        if (endDiff >= 30) {
            lateClockouts++;
        } else if (endDiff <= -30) {
            earlyClockouts++;
        } 
    });

    // Increasing forgotClockOut counter
    clockOuts.forEach((shift) => {
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
    let forgotClockOutObj = {
        description: "Forgotten Clock-Outs",
        qty: forgotClockOut
    };

    // Setting up base array for all objects
    let cleanedClockOuts = [];

    // Pushing objects to base array
    cleanedClockOuts.push(earlyClockoutsObj);
    cleanedClockOuts.push(lateClockoutsObj);
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
    return pctClockOuts
}

// Exporting clock-outs array
export const ClockOutsData = ClockOutsDataGenerator()