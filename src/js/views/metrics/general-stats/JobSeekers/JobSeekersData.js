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
 * @param {object} props - Contains an array of all the shifts, and also an array of all the workers.
 */
export const JobSeekersDataGenerator = (shiftsProp, workersProp) => {

    // Assigning props to variables
    let shifts = shiftsProp
    let workers = workersProp

    // Array for all clock-ins
    let clockInsList = []

    // Gathering the clock-ins of all the shifts
    shifts.forEach((shift) => {
        shift.clockin.forEach((clockIn) => {
            // Keeping all clockins array with at
            // least one object inside
            if (shift.clockin.length > 0) {
                clockInsList.push(clockIn);
            }
        })
    })

    // Array for all recent clock-ins
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

    // Gethering all worker ids from recent clock-ins
    recentClockIns.forEach((clockIn) => {
        workerIDs.push(clockIn.employee)
    })

    // Filtering out repeated worker ids
    let filteredWorkerIDs = [...new Set(workerIDs)];

    // Calculating total, active, and inactive workers
    let totalWorkers = workers.length
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

// New Job Seekers Data ------------------------------------------------------------------

/**
 * @function
 * @description Takes in list a of job seekers and generates data of new job seekers for JobSeekers.js.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires moment
 * @param {object} props - Contains an array of all the shifts, and also an array of all the workers.
 */
export const NewJobSeekersDataGenerator = (props) => {

    // Assigning props to variable
    // Here we only need the array of workers
    let workers = props

    // Array for new workers
    let newWorkersList = []

    // Adding workers to 'newWorkersList' based on their creation date
    workers.forEach((worker) => {
        let creation_date = moment(worker.created_at).format("YYYY-MM-DD");

        if (creation_date > fourWeeksBack && creation_date < now) {
            newWorkersList.push(worker)
        }
    })

    // Setting up some variables for the objects
    let totalWorkers = workers.length
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