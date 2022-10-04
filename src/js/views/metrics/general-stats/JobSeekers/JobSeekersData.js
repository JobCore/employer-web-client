import { DummyDataShifts } from "./DummyDataShifts"
import { DummyDataWorkers, DummyDataNewWorkers } from "./DummyDataWorkers"
import moment from "moment";

// Today
const now = moment().format("YYYY-MM-DD")

// Today, four weeks in the past
const fourWeeksBack = moment().subtract(4, 'weeks').format("YYYY-MM-DD")


// Job Seekers Data ------------------------------------------------------------------

/**
 * @function
 * @description Takes in list a of shifts and job seekers and generates data of inactive/active job seekers for JobSeekers.js.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires moment
 * @requires DummyDataShifts
 * @requires DummyDataWorkers
 * @returns Array of objects
 */
const JobSeekersDataGenerator = () => {

    // Array for all clock-ins
    let clockInsList = []

    // Gathering the clock-ins of all the shifts
    DummyDataShifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            if (shift.clockin.length > 0) {
                clockInsList.push(clockIn);
            }
        })
    })

    // Array for all clock-ins
    let recentClockIns = []

    // Filtering out clock-ins that happened longer than 4 weeks ago
    clockInsList.forEach((clockIn) => {
        let clockInStart = moment(clockIn.started_at).format("YYYY-MM-DD");

        if (clockInStart > fourWeeksBack && clockInStart < now) {
            recentClockIns.push(clockIn)
        }
    })

    // Array for worker ids
    let workerIDs = []

    // Gethering worker ids from recent clock-ins
    recentClockIns.forEach((clockIn) => {
        workerIDs.push(clockIn.employee)
    })

    // Filtering out repeated worker ids
    let filteredWorkerIDs = [...new Set(workerIDs)];

    // Calculating total, active, and inactive workers
    let totalWorkers = DummyDataWorkers.length
    let totalActiveWorkers = filteredWorkerIDs.length
    let totalInactiveWorkers = totalWorkers - totalActiveWorkers

    // Setting up objects for the semi-final array
    let activeWorkers = {
        id: 1,
        description: "Active Job Seekers",
        qty: totalActiveWorkers
    }
    let inactiveWorkers = {
        id: 2,
        description: "Inactive Job Seekers",
        qty: totalInactiveWorkers
    }

    // Creating the semi-final array
    let semiFinalList = []

    // Adding objects to the semi-final array
    semiFinalList.push(activeWorkers)
    semiFinalList.push(inactiveWorkers)

    // Generating final array with percentages as new properties
    let finalList = semiFinalList.map(({ id, description, qty }) => ({
        id,
        description,
        qty,
        pct: ((qty * 100) / totalWorkers).toFixed(0)
    }));

    // Generating the object of total workers
    let totalJobSeekers = {
        id: 3,
        description: "Total Job Seekers",
        qty: totalWorkers,
        pct: "100"
    }

    // Adding the object of total workers to the final array
    finalList.push(totalJobSeekers)

    // Returning the final array
    return finalList
}

// Exporting the final array
export const JobSeekersData = JobSeekersDataGenerator()

// Job Seekers Data ------------------------------------------------------------------

/**
 * @function
 * @description Takes in list a of job seekers and generates data of new job seekers for JobSeekers.js.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires moment
 * @requires DummyDataNewWorkers
 * @returns Array of objects
 */
const NewJobSeekersDataGenerator = () => {

    // Array for new workers
    let newWorkersList = []

    // Adding workers to 'newWorkersList'
    DummyDataNewWorkers.forEach((worker) => {
        let creation_date = moment(worker.created_at).format("YYYY-MM-DD");

        if (creation_date > fourWeeksBack && creation_date < now) {
            newWorkersList.push(worker)
        }
    })

    let totalWorkers = DummyDataNewWorkers.length
    let totalNewWorkers = newWorkersList.length

    // Setting up objects for the semi-final array
    let newWorkers = {
        id: 0,
        description: "New Job Seekers",
        qty: totalNewWorkers
    }

    // Creating the semi-final array
    let semiFinalList = []

    // Adding objects to the semi-final array
    semiFinalList.push(newWorkers)

    // Generating final array with percentages as new properties
    let finalList = semiFinalList.map(({ id, description, qty }) => ({
        id,
        description,
        qty,
        pct: ((qty * 100) / totalWorkers).toFixed(0)
    }));

    // Generating the object of total workers
    let totalJobSeekers = {
        id: 1,
        description: "Total Job Seekers",
        qty: totalWorkers,
        pct: "100"
    }

    // Adding the object of total workers to the final array
    finalList.push(totalJobSeekers)

    // Returning the final array
    return finalList
}

// Exporting the final array
export const NewJobSeekersData = NewJobSeekersDataGenerator()