import moment from "moment"
import { DummyDataShifts } from "./DummyDataShifts"
//import { DummyDataWorkers } from "./DummyDataWorkers"

const HoursDataGenerator = () => {

    // First array
    let clockInsList = [];

    // Gathering the clock-ins of all the shifts
    DummyDataShifts.forEach((shift) => {
      shift.clockin.forEach((clockIn) => {
        if (shift.clockin.length > 0) {
          clockInsList.push({
            start: clockIn.started_at,
            end: clockIn.ended_at
          });
        }
      });
    });
  
    // Adding all the hours worked from each shift
    let hoursWorked = clockInsList.reduce(
      (total, { start, end }) =>
        total + moment.duration(moment(end).diff(moment(start))).asHours(),
      0
    );
  
    // Formatting hours worked
    let hoursWorkedFormatted = (Math.round(hoursWorked * 4) / 4).toFixed(0);
  
    // THIS IS A PLACEHOLDER, we double the hours worked to mimic available hours
    let availableHours = (hoursWorkedFormatted * 2).toString()
  
    // Generate object of worked hours
    let workedHoursObj = {
      id: 1,
      description: "Hours Worked",
      qty: hoursWorkedFormatted
    };
  
    // Generate semi-final list
    let semiFinalList = [];
  
    // Adding object of worked hours to semi-final list
    semiFinalList.push(workedHoursObj);
  
    // Generating final array with percentages as new properties
    let finalList = semiFinalList.map(({ id, description, qty }) => ({
      id,
      description,
      qty,
      pct: ((qty * 100) / availableHours).toFixed(0)
    }));
  
    // Generating object of available hours
    let availableHoursObj = {
      id: 2,
      description: "Available Hours",
      qty: availableHours,
      pct: "100"
    };
  
    // Adding object of available hours to final list
    finalList.push(availableHoursObj);

    // Returning the final array
    return finalList
}

// Exporting the final array
export const HoursData = HoursDataGenerator()