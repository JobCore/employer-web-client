import { DummyData } from "./DummyData";

const ShiftsDataGenerator = () => {

    // First array
    let shiftsList = [];

    // Gathering all the existing shifts
    DummyData.forEach((shift) => {
        shiftsList.push({
            status: shift.status,
            clockin: shift.clockin,
            employees: shift.employees
        });
    });

    // Setting up counters
    let open = 0
    let filled = 0
    let completed = 0
    let rejected = 0
    let total = shiftsList.length

    // Adding values to each counter based on certain shift conditions
    shiftsList.forEach((item) => {
        if (item.status === "EXPIRED" && item.clockin.length === 0 && item.employees.length === 0) {
            rejected++
        } else if (item.status === "FILLED") {
            filled++
        } else if (item.status === "COMPLETED") {
            completed++
        } else if (item.status === "OPEN") {
            open++
        }
    })

    // Creating shift objects
    let openShifts = {
        description: "Open Shifts",
        qty: open
    }
    let filledShifts = {
        description: "Filled Shifts",
        qty: filled
    }
    let workedShifts = {
        description: "Worked Shifts",
        qty: completed
    }
    let rejectedShifts = {
        description: "Rejected Shifts",
        qty: rejected
    }

    // Setting up base array for all shift objects
    let cleanedArray = []

    // Pushing shift objects to base array
    cleanedArray.push(openShifts)
    cleanedArray.push(filledShifts)
    cleanedArray.push(workedShifts)
    cleanedArray.push(rejectedShifts)

    // Generating final array with percentages as new properties
    let percentagesArray = cleanedArray.map(({ description, qty }) => ({
        description,
        qty,
        pct: ((qty * 100) / total).toFixed(0)
    }));

    // Generating the object of total shifts
    let totalShifs = {
        description: "Total Shifts Posted",
        qty: total,
        pct: "100"
    }

    // Adding the object of total shifts to the final array
    percentagesArray.push(totalShifs)

    // Adding id's to each object in the final array
    percentagesArray.forEach((item, i) => {
        item.id = i + 1;
    });

    // Returning the final array
    return percentagesArray
};

// Exporting the final array
export const ShiftsData = ShiftsDataGenerator()