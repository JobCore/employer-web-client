import React from "react";
import { PieChart } from '../charts';
import { ClockInsData, ClockOutsData } from "./PunctualityData";

// Colors
const purple = "#5c00b8";
const lightTeal = "#00ebeb";
const darkTeal = "#009e9e";
const green = "#06ff05";
const lightPink = "#eb00eb";
const darkPink = "#b200b2";

/**
 * @function
 * @description Creates a page with 2 tables and 2 graphs of all the clock-in and clock-out trends.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires PieChart
 * @requires ClockInsData
 * @requires ClockOutsData
 */
export const Punctuality = () => {
    // Data for pie charts -------------------------------------------------------------------------------------

    // Clock-Ins

    // Taking out the "Totals" from the chart view
    let dataCI = ClockInsData.filter((item) => {
        return item.description !== "Total Clock-Ins";
    }); // Taking out the "Totals" from the chart view

    // Preparing data to be passed to the chart component
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

    // Clock-Outs

    // Taking out the "Totals" from the chart view
    let dataCO = ClockOutsData.filter((item) => {
        return item.description !== "Total Clock-Outs";
    });

    // Preparing data to be passed to the chart component
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
        <div className="row d-flex d-inline-flex justify-content-between w-100">
            {/* Left Column Starts */}
            <div className="col">
                <div className="row d-flex flex-column justify-content-between mb-5">
                    {/* Clock-Ins Table Starts */}
                    <div className="col text-center">
                        <h2 className="mb-4">Clock-Ins Table</h2>

                        <table className="table table-bordered text-center">
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

                        <table className="table table-bordered text-center">
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
    )
}
