import React, { useState, useEffect } from "react";
import { PieChart } from '../charts';
import { ClockInsDataGenerator, ClockOutsDataGenerator } from "./PunctualityData";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from "moment";

/**
 * @function
 * @description Creates a page with 2 tables and 2 graphs of the clock-in and clock-out trends.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires PieChart
 * @requires ClockInsDataGenerator
 * @requires ClockOutsDataGenerator
 * @param {object} props - Contains an array of all the shifts.
 */
export const Punctuality = (props) => {

    // Putting props into variable
    let shiftProps = props.shifts;

    // Date selected through the DatePicker
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Monday of X week (default: current week)
    const [start, setStart] = useState(
        moment().startOf("isoWeek").format("YYYY-MM-DD")
    );

    // Sunday of X week (default: current week)
    const [end, setEnd] = useState(
        moment().endOf("isoWeek").format("YYYY-MM-DD")
    );

    // Function that filters shifts based on the Monday and Sunday of the selected date --------------------------
    const filterShifts = () => {
        // Array for filtered shifts
        let filteredShifts = [];

        // Keeping shifts that exist within the selected dates
        shiftProps?.forEach((shift) => {
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

        // Returning filtered shifts
        return filteredShifts;
    };

    // UseEffect to update Mondays and Sundays when a new date is selected --------------------------------------

    useEffect(() => {
        // Setting up the new Monday
        let formattedStart = moment(selectedDate)
            .startOf("isoWeek")
            .format("YYYY-MM-DD");

        setStart(formattedStart);

        // Setting up the new Sunday
        let formattedEnd = moment(selectedDate)
            .endOf("isoWeek")
            .format("YYYY-MM-DD");

        setEnd(formattedEnd);
    }, [selectedDate]);

    // Capturing filtered shifts
    let shiftsFiltered = filterShifts();

    // Setting up main data sources
    let ClockInsData = ClockInsDataGenerator(shiftsFiltered);
    let ClockOutsData = ClockOutsDataGenerator(shiftsFiltered);

    // Data for pie charts -------------------------------------------------------------------------------------

    // Colors
    const purple = "#5c00b8";
    const lightTeal = "#00ebeb";
    const darkTeal = "#009e9e";
    const green = "#06ff05";
    const lightPink = "#eb00eb";
    const darkPink = "#b200b2";

    // Clock-Ins ------------------------------------------------------------------------------------------------

    // Taking out the "Totals" from the chart view
    let dataCI = ClockInsData.filter((item) => {
        return item.description !== "Total Clock-Ins";
    });

    // Preparing the data to be passed to the chart component
    const clockInsData = {
        labels: dataCI.map((data) => data.description),
        datasets: [
            {
                label: "Clock-Ins",
                data: dataCI.map((data) => data.qty),
                backgroundColor: [green, lightTeal, darkPink]
            }
        ]
    };

    // Clock-Outs ------------------------------------------------------------------------------------------------

    // Taking out the "Totals" from the chart view
    let dataCO = ClockOutsData.filter((item) => {
        return item.description !== "Total Clock-Outs";
    });

    // Preparing the data to be passed to the chart component
    const clockOutsData = {
        labels: dataCO.map((data) => data.description),
        datasets: [
            {
                label: "Clock-Outs",
                data: dataCO.map((data) => data.qty),
                backgroundColor: [purple, darkTeal, lightTeal, lightPink]
            }
        ]
    };

    // Return ----------------------------------------------------------------------------------------------------

    return (
        <div className="p-0 m-0 d-flex flex-column">
            <div className="row mx-3 mb-4">
                <div className="col p-0 pt-2 d-flex d-inline-flex justify-content-between">
                   {/* Week Announcer */}
                   <div className="p-0 pt-2">
                        <h3 className="m-0">{`Week of ${start} - ${end}`}</h3>
                    </div>

                    {/* Week Selector Text */}
                    <div className="p-0 pt-2 mx-3">
                        <h3 className="m-0 mr-2">Select a day of the desired week: </h3>
                    </div>

                    {/* Week Selector Tool */}
                    <div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                        />
                    </div>
                </div>
            </div>
            <div className="row d-flex d-inline-flex justify-content-between w-100">
                {/* Left Column Starts */}
                <div className="col">
                    <div className="row d-flex flex-column justify-content-between mb-5">
                        {/* Clock-Ins Table Starts */}
                        <div className="col text-center">
                            <h2 className="mb-4">Clock-Ins Table</h2>

                            <table className="table table-bordered border-dark text-center">
                                <thead className="thead-dark">
                                    {/* Table columns */}
                                    <tr>
                                        <th scope="col"><h3 className="m-0">Description</h3></th>
                                        <th scope="col"><h3 className="m-0">Quantity</h3></th>
                                        <th scope="col"><h3 className="m-0">Percentages</h3></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* Mapping the data to diplay it as table rows */}
                                    {ClockInsData.map((item, i) => {
                                        return item.description === "Total Clock-Ins" ? (
                                            <tr key={i} style={{ background: "rgba(107, 107, 107, 0.35)" }}>
                                                <th scope="row"><h3 className="m-0">{item.description}</h3></th>
                                                <td><h3 className="m-0">{item.qty}</h3></td>
                                                <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                            </tr>
                                        ) : (
                                            <tr key={i}>
                                                <th scope="row"><h3 className="m-0">{item.description}</h3></th>
                                                <td><h3 className="m-0">{item.qty}</h3></td>
                                                <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Clock-Ins Table Ends */}
                    </div>

                    <div className="row d-flex flex-column justify-content-between">
                        {/* Clock-Outs Table Starts */}
                        <div className="col text-center">
                            <h2 className="mb-4">Clock-Outs Table</h2>

                            <table className="table table-bordered border-dark text-center">
                                <thead className="thead-dark">
                                    {/* Table columns */}
                                    <tr>
                                        <th scope="col"><h3 className="m-0">Description</h3></th>
                                        <th scope="col"><h3 className="m-0">Quantity</h3></th>
                                        <th scope="col"><h3 className="m-0">Percentages</h3></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* Mapping the data to diplay it as table rows */}
                                    {ClockOutsData.map((item, i) => {
                                        return item.description === "Total Clock-Outs" ? (
                                            <tr key={i} style={{ background: "rgba(107, 107, 107, 0.35)" }}>
                                                <th scope="row"><h3 className="m-0">{item.description}</h3></th>
                                                <td><h3 className="m-0">{item.qty}</h3></td>
                                                <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                            </tr>
                                        ) : (
                                            <tr key={i}>
                                                <th scope="row"><h3 className="m-0">{item.description}</h3></th>
                                                <td><h3 className="m-0">{item.qty}</h3></td>
                                                <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Clock-Outs Table Ends */}
                    </div>
                </div>
                {/* Left Column Ends */}

                {/* Right Column Starts */}
                <div className="col">
                    <div className="row mb-5">
                        {/* Clock-Ins Chart Starts */}
                        <div className="col text-center mb-5">
                            <h2 className="mb-3">Clock-Ins Chart</h2>

                            <div style={{ height: '13.905rem' }}>
                                <PieChart pieData={clockInsData} />
                            </div>
                        </div>
                        {/* Clock-Ins Chart Ends */}
                    </div>

                    <div className="row mt-5">
                        {/* Clock-Outs Chart Starts */}
                        <div className="col text-center">
                            <h2 className="mb-3">Clock-Outs Chart</h2>

                            <div style={{ height: '13.905rem' }}>
                                <PieChart pieData={clockOutsData} />
                            </div>
                        </div>
                        {/* Clock-Outs Chart Ends */}
                    </div>
                </div>
                {/* Right Column Ends */}
            </div>
        </div>
    )
}
