import moment from "moment"
import { DummyDataShifts } from "./DummyDataShifts"
//import { DummyDataWorkers } from "./DummyDataWorkers"

const HoursDataGenerator = () => {

  // First array
  let completeList = [];

  // Gathering both clock-ins and clock-outs
  DummyDataShifts.forEach((shift) => {
    shift.clockin.forEach((clockIn) => {
      if (shift.clockin.length > 0) {
        completeList.push({
          starting_at: shift.starting_at,
          started_at: clockIn.started_at,
          ending_at: shift.ending_at,
          ended_at: clockIn.ended_at
        });
      }
    });
  });

  // Adding all the scheduled hours from each shift
  let scheduledHours = completeList.reduce(
    (total, { starting_at, ending_at }) =>
      total +
      moment.duration(moment(ending_at).diff(moment(starting_at))).asHours(),
    0
  );

  // Formatting scheduled hours
  let scheduledHoursFormatted = (Math.round(scheduledHours * 4) / 4).toFixed(0);

  // Adding all the worked hours from each shift
  let workedHours = completeList.reduce(
    (total, { started_at, ended_at }) =>
      total +
      moment.duration(moment(ended_at).diff(moment(started_at))).asHours(),
    0
  );

  // Formatting worked hours
  let workedHoursFormatted = (Math.round(workedHours * 4) / 4).toFixed(0);

  // THIS IS A PLACEHOLDER, we double the hours worked to mimic available hours
  let availableHours = (workedHoursFormatted * 2).toString()

  // Creating object for worked hours
  let workedHoursObj = {
    description: "Hours Worked",
    qty: workedHoursFormatted
  };

  // Calculating extra worked hours
  let extraHours = workedHoursFormatted - scheduledHoursFormatted;

  // Creating object for extra worked hours
  let extraHoursObj = {
    description: "Extra Hours Worked",
    qty: extraHours
  };

  // Creating object for long breaks
  let longBreaksObj = {
    description: "Long Breaks",
    qty: "10"
  };

  // Generate semi-final list
  let semiFinalList = [];

  // Adding object of worked hours to semi-final list
  semiFinalList.push(workedHoursObj);
  semiFinalList.push(extraHoursObj);
  semiFinalList.push(longBreaksObj);

  // Generating final array with percentages as new properties
  let finalList = semiFinalList.map(({ description, qty }) => ({
    description,
    qty,
    pct: ((qty * 100) / availableHours).toFixed(0)
  }));

  // Generating object of available hours
  let availableHoursObj = {
    description: "Available Hours",
    qty: availableHours,
    pct: "100"
  };

  // Adding object of available hours to final list
  finalList.push(availableHoursObj);

  finalList.forEach((item, i) => {
    item.id = i + 1;
  });

  // Returning the final array
  return finalList
}

// Exporting the final array
export const HoursData = HoursDataGenerator()