import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from "moment";

import { WorkerStats } from "./WorkerStats";
import { Button } from "../../../components/index";
import { DummyDataShifts } from "./DummyDataShifts";
import { DummyDataWorkers } from "./DummyDataWorkers";


export const Queue = (props) => {

  // Setting up my variables ---------------------------------------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [start, setStart] = useState(
    moment().startOf("isoWeek").format("YYYY-MM-DD")
  );
  const [end, setEnd] = useState(
    moment().endOf("isoWeek").format("YYYY-MM-DD")
  );

  //const allShifts = props.shifts;
  const allShifts = DummyDataShifts;

  //const workers = props.workers;
  const workers = DummyDataWorkers

  // Function that filters shifts based on the Monday and Sunday of the selected date --------------------------

  const filterShifts = () => {
    let filteredShifts = [];

    allShifts.forEach((shift) => {
      let shiftStart = moment(shift.starting_at).format("YYYY-MM-DD");
      let shiftEnd = moment(shift.ending_at).format("YYYY-MM-DD");

      if (
        shiftStart >= start &&
        shiftStart <= end &&
        shiftEnd >= start &&
        shiftEnd <= end
      ) {
        filteredShifts.push(shift);
      }
    });

    return filteredShifts;
  };

  // UseEffect to update Mondays and Sundays when a new date is selected --------------------------------------

  useEffect(() => {
    let formattedStart = moment(selectedDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");

    setStart(formattedStart);

    let formattedEnd = moment(selectedDate)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");

    setEnd(formattedEnd);
  }, [selectedDate]);

  // Return ----------------------------------------------------------------------------------------------------

  return (
    <div className="row d-flex flex-column justify-content-center mx-auto w-100">
      <h2 className="mx-auto">Table of Employee Hours</h2>
      {/* Top Column Starts */}
      <div className="col d-flex d-inline-flex justify-content-center my-4 p-3 px-4" style={{ background: "rgba(107, 107, 107, 0.15)" }}>
        {/* Controls for the Week Starts */}
        {/* Col 1 */}
        <div className="col-4 p-0 pt-2">
          <h3 className="m-0">{`Week of ${start} - ${end}`}</h3>
        </div>

        {/* Col 2 */}
        <div className="col-4 p-0 pt-2 d-flex d-inline-flex justify-content-center">
          <div className="mr-3">
            <h3 className="m-0">Select a day of the desired week: </h3>
          </div>

          <div>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>
        </div>

        {/* Col 3 */}
        <div className="col-4 p-0 d-flex justify-content-end">
          <div>
            <Button className="btn btn-dark bg-dark mr-3" onClick={() => alert("No functionality yet")}>
              <h6 className="m-0">Placeholder 1</h6>
            </Button>
          </div>

          <div>
            <Button className="btn btn-dark bg-dark" onClick={() => alert("No functionality yet")}>
              <h6 className="m-0">Placeholder 2</h6>
            </Button>
          </div>
        </div>
        {/* Controls for the Week Ends */}
      </div>
      {/* Top Column Ends */}

      {/* Bottom Column Starts */}
      {/* Table of Employees Starts */}
      <div className="col rounded mt-2 m-0 p-0 text-center mx-auto">
        {workers?.map((singleWorker, i) => {
          return (
            <WorkerStats
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