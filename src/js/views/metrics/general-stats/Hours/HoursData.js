import moment from "moment";

/**
 * @function
 * @description Takes in list a of shifts and generates data of all the hours trends for Hours.js.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires moment
 * @param {object} props - Contains an array of all the shifts.
 */
export const HoursDataGenerator = (props) => {

  // Assigning props to variable
  let shifts = props
  
  // 1st - Separation of shifts ----------------------------------------------------------

  // Array for shifts with multiple clock-ins
  let multipleClockIns = [];

  // Array for single clock-ins made by single workers
  let singleClockInSingleWorker = [];

  // Gathering both clock-ins and clock-outs in a formatted 
  // way to keep at the useful data handy at all times.
  shifts.forEach((shift) => {
    if (shift.clockin.length > 1) {
      multipleClockIns.push({
        starting_at: shift.starting_at,
        ending_at: shift.ending_at,
        clockin: shift.clockin,
        id: shift.id,
        employees: shift.employees
      });
    } else if (shift.clockin.length === 1) {
      shift.clockin.forEach((clockIn) => {
        singleClockInSingleWorker.push({
          id: shift.id,
          starting_at: shift.starting_at,
          ending_at: shift.ending_at,
          started_at: clockIn.started_at,
          ended_at: clockIn.ended_at
        });
      });
    }
  });

  // Setting up arrays for shifts with multiple
  // clock-ins but different amount of workers
  let multipleClockInsMultipleWorkers = [];
  let multipleClockInsSingleWorker = [];

  // Separating shifts based on the number of workers present
  multipleClockIns.forEach((shift) => {
    if (shift.employees.length > 1) {
      // Adding shifts to 'multipleClockInsMultipleWorkers'
      multipleClockInsMultipleWorkers.push(shift.clockin);
    } else if (shift.employees.length === 1) {
      // Adding shifts to 'multipleClockInsSingleWorker'
      multipleClockInsSingleWorker.push(shift.clockin);
    }
  });

  // Array of multiple clock-ins with multiple workers, but organized
  let MCIMWOrganized = [];

  // Adding shifts to 'MCIMWOrganized'
  multipleClockInsMultipleWorkers.forEach((shift) => {
    // Unifying shifts that have the same worker
    let newObj = shift.reduce((obj, value) => {
      let key = value.employee;
      if (obj[key] == null) obj[key] = [];

      obj[key].push(value);
      return obj;
    }, []);

    newObj.forEach((shift) => {
      MCIMWOrganized.push(shift);
    });
  });

  // Array for the polished version of 'multipleClockInsMultipleWorkers'
  let MCIMWPolished = [];

  // Array for single clock-ins made by single workers
  // inside shifts with multiple workers present
  let singleClockinsMultipleWorkers = [];

  // Separating shifts of multiple workers based on
  // how many clock-ins each worker has
  MCIMWOrganized.forEach((shift) => {
    if (shift.length === 1) {
      shift.forEach((clockIn) => {
        singleClockinsMultipleWorkers.push(clockIn);
      });
    } else if (shift.length > 1) {
      MCIMWPolished.push(shift);
    }
  });

  // Array for polished version of 'singleClockinsMultipleWorkers'
  let SCIMWPolished = [];

  // Adding shifts to 'SCIMWPolished' in a formatted 
  // way to keep at the useful data handy at all times.
  shifts.forEach((originalShift) => {
    singleClockinsMultipleWorkers.forEach((filteredShift) => {
      if (originalShift.id === filteredShift.shift) {
        SCIMWPolished.push({
          id: originalShift.id,
          started_at: filteredShift.started_at,
          ended_at: filteredShift.ended_at,
          starting_at: originalShift.starting_at,
          ending_at: originalShift.ending_at
        });
      }
    });
  });

  // Combining all shifts with single clock-ins. These will not have break times.
  let singleClockInsCombined = [...singleClockInSingleWorker, ...SCIMWPolished];

  // Combining all shifts with multiple clock-ins. These will have break times.
  let multipleClockInsCombined = [
    ...multipleClockInsSingleWorker,
    ...MCIMWPolished
  ];

  // 2nd - Calculation of Hours and Minutes ----------------------------------------------

  // Calculating scheduled hours of all single clock-in shifts ---------------------------

  let SCICScheduledHours = singleClockInsCombined.reduce(
    (total, { starting_at, ending_at }) =>
      total +
      moment.duration(moment(ending_at).diff(moment(starting_at))).asHours(),
    0
  );

  // Total scheduled hours
  let SCICScheduledHoursF = parseInt(
    (Math.round(SCICScheduledHours * 4) / 4).toFixed(0),
    10
  );

  // Calculating worked hours of all single clock-in shifts ------------------------------

  let SCICWorkedHours = singleClockInsCombined.reduce(
    (total, { started_at, ended_at }) =>
      total +
      moment.duration(moment(ended_at).diff(moment(started_at))).asHours(),
    0
  );

  // Total worked hours
  let SCICWorkedHoursF = parseInt(
    (Math.round(SCICWorkedHours * 4) / 4).toFixed(0),
    10
  );

  // Extra worked hours
  let extraWorkedHoursSingleClockIns = SCICWorkedHoursF - SCICScheduledHoursF;

  // Calculating scheduled hours of all multiple clock-in shifts -------------------------

  // Array for scheduled minutes
  let MCICScheduledMinutes = [];

  // Adding shifts to 'MCICScheduledMinutes'
  multipleClockInsCombined.forEach((shift) => {
    let shiftStart = moment(shift[0].started_at);
    let shiftEnd = moment(shift[shift.length - 1].ended_at);
    let id = shift[0].shift;
    let diff = moment.duration(shiftEnd.diff(shiftStart)).asMinutes();

    MCICScheduledMinutes.push({
      id: id,
      employee: shift[0].employee,
      scheduled_mins: diff
    });
  });

  // Total scheduled minutes
  let TotalMCICScheduledMinutes = MCICScheduledMinutes.reduce((acc, obj) => {
    return acc + obj.scheduled_mins;
  }, 0);

  // Total scheduled hours
  let MCICScheduledHours =
    Math.floor(TotalMCICScheduledMinutes / 60) + SCICScheduledHoursF;

  // Calculating worked hours of all multiple clock-in shifts ----------------------------

  // Array for worked minutes
  let MCICWorkedMinutes = [];

  // Adding shifts to 'MCICWorkedMinutes'
  multipleClockInsCombined.forEach((shift) => {
    shift.forEach((clockIn) => {
      let start = moment(clockIn.started_at);
      let end = moment(clockIn.ended_at);
      let id = clockIn.shift;

      let diff = moment.duration(end.diff(start)).asMinutes();

      MCICWorkedMinutes.push({
        id: id,
        employee: clockIn.employee,
        worked_mins: diff
      });
    });
  });

  // Polished version of 'MCICWorkedMinutes'
  let MCICWorkedMinutesPolished = MCICWorkedMinutes.reduce(
    (result, { id, employee, worked_mins }) => {
      let temp = result.find((o) => {
        return o.id === id && o.employee === employee;
      });
      if (!temp) {
        result.push({ id, employee, worked_mins });
      } else {
        temp.worked_mins += worked_mins;
      }
      return result;
    },
    []
  );

  // Total worked minutes
  let TotalMCICWorkedMinutes = MCICWorkedMinutesPolished.reduce((acc, obj) => {
    return acc + obj.worked_mins;
  }, 0);

  // Total worked hours
  let MCICWorkedHours =
    Math.floor(TotalMCICWorkedMinutes / 60) + SCICWorkedHoursF;

  // Extra worked hours
  let extraWorkedHoursMultipleClockIns = MCICWorkedHours - MCICScheduledHours;

  // Extra calculations -----------------------------------------------------------------

  // Array for the break times
  let breakTimes = [];

  // Calculating break times of every shift
  MCICScheduledMinutes.forEach((scheduledShift) => {
    MCICWorkedMinutesPolished.forEach((workedShift) => {
      if (
        scheduledShift.id === workedShift.id &&
        scheduledShift.employee === workedShift.employee
      ) {
        let scheduled = scheduledShift.scheduled_mins;
        let worked = workedShift.worked_mins;

        let diff = scheduled - worked;

        breakTimes.push({
          id: scheduledShift.id,
          break_mins: diff
        });
      }
    });
  });

  // Array for long breaks
  let longBreaks = [];

  // Adding shifts to 'longBreaks'
  breakTimes.forEach((shift) => {
    if (shift.break_mins > 30) {
      longBreaks.push(shift);
    }
  });

  // Calculating worked hours
  let workedHours = MCICWorkedHours + SCICWorkedHoursF;

  // Calculating scheduled hours
  let scheduledHours = MCICScheduledHours + SCICScheduledHoursF;

  // Calculating extra worked hours
  let extraWorkedHours =
    extraWorkedHoursSingleClockIns + extraWorkedHoursMultipleClockIns;

  // Setting up conditional rendering of extra worked hours
  let qtyOfExtraWorkedHours = () => {
    if (extraWorkedHours > 0) {
      return extraWorkedHours;
    } else {
      return 0;
    }
  };

  // 3rd - Setting up objects -----------------------------------------------------------

  // THIS IS A PLACEHOLDER, this number should be
  // the total hours available of all employees
  let availableHours = 300;

  // Creating object for scheduled hours
  let scheduledHoursObj = {
    description: "Scheduled Hours",
    qty: scheduledHours
  };

  // Creating object for worked hours
  let workedHoursObj = {
    description: "Worked Hours",
    qty: workedHours
  };

  // Creating object for extra worked hours
  let extraWorkedHoursObj = {
    description: "Extra Worked Hours",
    qty: qtyOfExtraWorkedHours()
  };

  // Creating object for long breaks
  let longBreaksObj = {
    description: "Long Breaks",
    qty: `${longBreaks.length}`
  };

  // Generate semi-final list
  let semiFinalList = [];

  // Adding objects to semi-final list
  semiFinalList.push(scheduledHoursObj);
  semiFinalList.push(workedHoursObj);
  semiFinalList.push(extraWorkedHoursObj);
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

  // Adding IDs to each object in the array
  finalList.forEach((item, i) => {
    item.id = i + 1;
  });

  // Returning the final array
  return finalList;
};