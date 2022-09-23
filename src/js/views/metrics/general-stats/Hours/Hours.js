import React from "react";
import { PieChart } from "../../charts";
import { HoursData } from "./HoursData";

// Colors
const purple = "#5c00b8";
const lightTeal = "#00ebeb";
const darkTeal = "#009e9e";
const lightPink = "#eb00eb";
const darkPink = "#b200b2";

export const Hours = () => {

    // Data for pie chart -------------------------------------------------------------------------------------

    const hoursData = {
        labels: HoursData.map((data) => data.description),
        datasets: [{
            label: "Hours",
            data: HoursData.map((data) => data.qty),
            backgroundColor: [
                purple, darkPink, lightPink, lightTeal, darkTeal
            ],
        }]
    }

    // Return ----------------------------------------------------------------------------------------------------

    return (
        <div className="row d-flex d-inline-flex justify-content-between w-100">
            {/* Left Column Starts */}
            <div className="col">
                <div className="row d-flex flex-column justify-content-between">
                    {/* Hours Table Starts */}
                    <div className="col text-center">
                        <h2 className="mb-4">Hours Table</h2>

                        <table className="table table-bordered text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col"><h3 className="m-0">Description</h3></th>
                                    <th scope="col"><h3 className="m-0">Quantity</h3></th>
                                    <th scope="col"><h3 className="m-0">Percentages</h3></th>
                                </tr>
                            </thead>

                            <tbody>
                            {HoursData.map((item, i) => {
                                    return item.description === "Available Hours" ? (
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
                    {/* Hours Table Ends */}
                </div>
            </div>
            {/* Left Column Ends */}

            {/* Right Column Starts */}
            <div className="col">
                <div className="row">
                    {/* Hours Chart Starts*/}
                    <div className="col text-center">
                        <h2 className="mb-3">Hours Chart</h2>

                        <div style={{ height: '16rem' }} className="mx-auto">
                            <PieChart pieData={hoursData} />
                        </div>
                    </div>
                    {/* Hours Chart Ends*/}
                </div>
            </div>
            {/* Right Column Ends */}
        </div>
    )
}
