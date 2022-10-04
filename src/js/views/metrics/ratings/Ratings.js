import React from "react";
import { PieChart } from '../charts';
import { RatingsData } from "./RatingsData";

// Colors
const purple = "#5c00b8";
const lightTeal = "#00ebeb";
const darkTeal = "#009e9e";
const green = "#06ff05";
const lightPink = "#eb00eb";
const darkPink = "#b200b2";

/**
 * @function
 * @description Creates a view of the number of ratings per worker.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires PieChart
 * @requires RatingsData
 * @returns A table and a chart displaying the ratings data
 */
export const Ratings = () => {

    // Data for pie chart -------------------------------------------------------------------------------------

    // Taking out the "Totals" from the chart view
    let pieData = RatingsData.filter((item) => { return item.rating !== "Total Employees" })

    // Preparing data to be passed to the chart component
    const ratingsData = {
        labels: pieData.map((data) => { return data.rating === null ? "Unavailable Rating" : ` ${data.rating} Star Employees` }),
        datasets: [{
            label: "Employee Ratings",
            data: pieData.map((data) => data.qty),
            backgroundColor: [
                green, darkTeal, lightPink,
                purple, lightTeal, darkPink
            ],
        }]
    }

    // Return ----------------------------------------------------------------------------------------------------

    return (
        <div className="row d-flex d-inline-flex justify-content-between w-100">
            {/* Left Column Starts */}
            <div className="col">
                <div className="row d-flex flex-column justify-content-between">
                    {/* Ratings Table Starts */}
                    <div className="col text-center">
                        <h2 className="mb-4">Employee Ratings Table</h2>

                        <table className="table table-bordered text-center">
                            <thead className="thead-dark">
                                {/* Table columns */}
                                <tr>
                                    <th scope="col"><h3 className="m-0">Star Rating</h3></th>
                                    <th scope="col"><h3 className="m-0">Quantity</h3></th>
                                    <th scope="col"><h3 className="m-0">Percentages</h3></th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Mapping the data to diplay it as table rows */}
                                {RatingsData.map((item, i) => {
                                    return item.rating === null ? (
                                        <tr key={i}>
                                            <th scope="row"><h3 className="m-0">Unavailable Rating</h3></th>
                                            <td><h3 className="m-0">{item.qty}</h3></td>
                                            <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                        </tr>
                                    ) : item.rating === "Total Employees" ? (
                                        <tr key={i} style={{ background: "rgba(107, 107, 107, 0.35)" }}>
                                            <th scope="row"><h3 className="m-0">{item.rating}</h3></th>
                                            <td><h3 className="m-0">{item.qty}</h3></td>
                                            <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                        </tr>
                                    ) : (
                                        <tr key={i}>
                                            <th scope="row"><h3 className="m-0">{`${item.rating} Star Employees`}</h3></th>
                                            <td><h3 className="m-0">{item.qty}</h3></td>
                                            <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Ratings Table Ends */}
                </div>
            </div>
            {/* Left Column Ends */}

            {/* Right Column Starts */}
            <div className="col">
                <div className="row">
                    {/* Ratings Chart Starts */}
                    <div className="col text-center">
                        <h2 className="mb-3">Employee Ratings Chart</h2>

                        <div style={{ height: '26.05rem' }}>
                            <PieChart pieData={ratingsData} />
                        </div>
                    </div>
                    {/* Ratings Chart Ends */}
                </div>
            </div>
            {/* Right Column Ends */}
        </div>
    )
}
