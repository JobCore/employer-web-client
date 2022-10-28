import React, { useState, useEffect } from "react";
import { QueueData } from "./QueueData";
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import DatePicker from "react-multi-date-picker";
import moment from "moment";

/**
 * @function
 * @description Creates a page with a DatePicker and table of all employees with their worked/scheduled hours.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires QueueData
 * @param {object} props - Contains an array of all shifts, and an array of all workers.
 */
export const Queue = (props) => {

  /* Variables ---------------------------------------------------  */

  /* Putting props into variables */
  let shiftProps = props.shifts;
  let workerProps = props.workers;

  /* Start of given time period */
  const [start, setStart] = useState(moment().format("MM-DD-YYYY"));

  /* End of given time period */
  const [end, setEnd] = useState(moment().format("MM-DD-YYYY"));

  /* Variables to store selected time period */
  const [period, setPeriod] = useState();

  /* Variables to store selected dates */
  const [day, setDay] = useState(new Date());
  const [week, setWeek] = useState([
    new Date(),
    new Date()
  ])
  const [month, setMonth] = useState(new Date());
  const [year, setYear] = useState(new Date());

  /* Variables to store date defaults*/
  const [defaultDay, setDefaultDay] = useState(new Date().toLocaleDateString());
  const [defaultWeek, setDefaultWeek] = useState(
    new Date().toLocaleDateString()
  );

  const [defaultMonth, setDefaultMonth] = useState(
    new Date().toLocaleDateString("en-us", { month: "long", year: "numeric" })
  );

  const [defaultYear, setDefaultYear] = useState(new Date().getFullYear());

  /* Handlers ---------------------------------------------------  */

  /* Day Handler */
  const handleDay = (day) => {
    setDay(day);
    setDefaultDay(day);
  };

  /* Week Handler */
  const handleWeek = (week) => {
    setWeek(week);
    setDefaultWeek(week);
  };

  /* Month Handler */
  const handleMonth = (month) => {
    setMonth(month);
    setDefaultMonth(month);
  };

  /* Year Handler */
  const handleYear = (year) => {
    setYear(year);
    setDefaultYear(year);
  };

  /* Calculate start and end of day */
  const startEndOfDay = () => {
    // Transforming day value into string
    let dayAsString = defaultDay.toString();

    // Replacing "/" with "-"
    const search = "/";
    const replaceWith = "-";
    const dayFormatted = dayAsString.split(search).join(replaceWith);

    // Setting start and end
    setStart(dayFormatted);
    setEnd(dayFormatted);
  };

  /* Calculate start and end of week */
  const startEndOfWeek = () => {
    // Transforming week value into string
    let weekAsString = defaultWeek.toString();

    let weeks = weekAsString.split(",");

    let endOfWeekPlaceholder = moment().isoWeekday(7).format("MM-DD-YYYY");

    if (weeks.length === 1) {
      weeks.push(endOfWeekPlaceholder);
    }

    // Replacing "/" with "-"
    const search = "/";
    const replaceWith = "-";
    const weekStart = weeks[0].split(search).join(replaceWith);
    const weekEnd = weeks[1].split(search).join(replaceWith);

    let weekStartF = moment(weekEnd).isoWeekday(1).format("MM-DD-YYYY");
    let weekEndF = moment(weekEnd).isoWeekday(7).format("MM-DD-YYYY");

    // Setting start and end
    setStart(weekStartF);
    setEnd(weekEndF);
  };

  /* Calculate start and end of month */
  const startEndOfMonth = () => {
    // Transforming month value into string
    let monthAsString = defaultMonth.toString();

    // Listing all months by number
    const months = [
      { name: "January", number: "01" },
      { name: "February", number: "02" },
      { name: "March", number: "03" },
      { name: "April", number: "04" },
      { name: "May", number: "05" },
      { name: "June", number: "06" },
      { name: "July", number: "07" },
      { name: "August", number: "08" },
      { name: "September", number: "09" },
      { name: "October", number: "10" },
      { name: "November", number: "11" },
      { name: "December", number: "12" }
    ];

    // Determining year (number) of month value
    let yearOfMonth = monthAsString.slice(-4);

    // Determining month (number) of month value
    let monthOfMonth = "";

    months.forEach((eachMonth) => {
      if (monthAsString.includes(eachMonth.name)) {
        monthOfMonth += eachMonth.number;
      }
    });

    // Completing start of month
    let completeMonthStart = `${yearOfMonth}-${monthOfMonth}-01`;

    // Setting up start
    let startOfMonth = moment(completeMonthStart)
      .startOf("month")
      .format("MM-DD-YYYY");
    setStart(startOfMonth);

    // Setting up end
    let endOfMonth = moment(startOfMonth).endOf("month").format("MM-DD-YYYY");
    setEnd(endOfMonth);
  };

  /* Calculate start and end of year */
  const startEndOfYear = () => {
    // Transforming year value into string
    let yearAsString = defaultYear.toString()

    // Calculating start and end
    let startOfYear = moment(`01-01-${yearAsString}`).format("MM-DD-YYYY")
    let endOfYear = moment(`12-31-${yearAsString}`).format("MM-DD-YYYY")

    // Setting up start and end
    setStart(startOfYear)
    setEnd(endOfYear)
  };

  /* 
    Variables with the current start and end values
    of day, week month, and year
  */
  let currentDay = moment().format("MM-DD-YYYY");
  let currentWeekStart = moment().isoWeekday(1).format("MM-DD-YYYY");
  let currentWeekEnd = moment().isoWeekday(7).format("MM-DD-YYYY");
  let currentMonthStart = moment().startOf("month").format("MM-DD-YYYY");
  let currentMonthEnd = moment().endOf("month").format("MM-DD-YYYY");
  let currentYearStart = moment().startOf("year").format("MM-DD-YYYY");
  let currentYearEnd = moment().endOf("year").format("MM-DD-YYYY");

  /*
    UseEffect for the first render of
    the page
  */
  useEffect(() => {
    setPeriod("Day");
    setStart(currentDay);
    setEnd(currentDay);
  }, []);

  /* 
    Use effects that get triggered
    when the period value changes
  */
  useEffect(() => {
    if (period === "Day") {
      setStart(currentDay);
      setEnd(currentDay);
    } else if (period === "Week") {
      setStart(currentWeekStart);
      setEnd(currentWeekEnd);
    } else if (period === "Month") {
      setStart(currentMonthStart);
      setEnd(currentMonthEnd);
    } else if (period === "Year") {
      setStart(currentYearStart);
      setEnd(currentYearEnd);
    } else {
      null;
    }
  }, [period]);

  /* 
    Use effects that get triggered
    when the default values change
  */
  useEffect(() => {
    startEndOfDay();
  }, [defaultDay]);

  useEffect(() => {
    startEndOfWeek();
  }, [defaultWeek]);

  useEffect(() => {
    startEndOfMonth();
  }, [defaultMonth]);

  useEffect(() => {
    startEndOfYear();
  }, [defaultYear]);

  /* 
    Function that filters shifts based on the 
    start and end of the selected date 
  */
  const filterShifts = () => {

    // Array for filtered shifts
    let filteredShifts = [];

    // Keeping shifts that exist within the selected dates
    shiftProps?.forEach((shift) => {
      let shiftStart = moment(shift.starting_at).format("MM-DD-YYYY");
      let shiftEnd = moment(shift.ending_at).format("MM-DD-YYYY");

      let shiftYear = shiftStart.slice(-4);
      let startAndEndYear = start.slice(-4);

      if (shiftYear === startAndEndYear) {
        if (
          shiftStart >= start &&
          shiftStart <= end &&
          shiftEnd >= start &&
          shiftEnd <= end
        ) {
          filteredShifts.push(shift);
        }
      }
    });

    // Returning filtered shifts
    return filteredShifts;
  };

  // Return ----------------------------------------------------------------------------------------------------

  return (
    <div className="row d-flex flex-column justify-content-center mx-auto w-100">
      <h2 className="mx-auto">Table of Employee Hours</h2>
      {/* Top Column Starts */}
      <div className="col d-flex d-inline-flex justify-content-between my-4 p-3 px-4" style={{ background: "rgba(107, 107, 107, 0.15)" }}>
        {/* Time period Announcer */}
        <div className="p-0 pt-1 text-start">
          <h3 className="m-0">Start: {start}</h3>
          <h3 className="m-0">End: {end}</h3>
        </div>

        {/* Dropdown */}
        <div className="p-0 pt-1 text-start">
          <div className="dropdown">
            <button
              style={{ background: "#000000" }}
              className="btn btn-dark px-3 py-2"
              type="button"
              id="dropdownMenu2"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <h5 className="m-0">
                Select Period
                <i
                  className="fa fa-caret-down ml-2"
                  style={{ color: "white" }}
                />
              </h5>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setPeriod("Day")}
              >
                Day
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setPeriod("Week")}
              >
                Week
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setPeriod("Month")}
              >
                Month
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setPeriod("Year")}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        <div className="p-0 d-flex d-inline-flex justify-content-between text-end">
          {/* DatePicker Conditional Rendering Starts */}
          <>
            {period === "Day" ? (
              <div>
                <div className="mb-2">
                  <h3>{`${period}: ${defaultDay}`}</h3>
                </div>

                <DatePicker
                  plugins={[weekends()]}
                  value={day}
                  onChange={handleDay}
                  format="MM-DD-YYYY"
                />
              </div>
            ) : period === "Week" ? (
              <div>
                <div className="mb-2">
                  <h3>{`${period}: ${defaultWeek}`}</h3>
                </div>

                <DatePicker
                  plugins={[weekends()]}
                  value={week}
                  onChange={handleWeek}
                  weekPicker
                  format="MM-DD-YYYY"
                />
              </div>
            ) : period === "Month" ? (
              <div>
                <div className="mb-2">
                  <h3>{`${period}: ${defaultMonth}`}</h3>
                </div>

                <DatePicker
                  plugins={[weekends()]}
                  value={month}
                  onChange={handleMonth}
                  onlyMonthPicker
                  format="MMMM YYYY"
                />
              </div>
            ) : period === "Year" ? (
              <div>
                <div className="mb-2">
                  <h3>{`${period}: ${defaultYear}`}</h3>
                </div>

                <DatePicker
                  plugins={[weekends()]}
                  value={year}
                  onChange={handleYear}
                  onlyYearPicker
                />
              </div>
            ) : null}
          </>
          {/* DatePicker Conditional Rendering Ends */}
        </div>
      </div>
      {/* Top Column Ends */}

      {/* Bottom Column Starts */}
      {/* Table of Employees Starts */}
      <div className="col rounded mt-2 m-0 p-0 text-center mx-auto">
        {workerProps?.map((singleWorker, i) => {
          return (
            <QueueData
              key={i}
              worker={singleWorker}
              shifts={filterShifts()}
            />)
        })}
      </div>
      {/* Table of Employees Ends */}
      {/* Bottom Column Ends */}
    </div>
  );
}