import React from "react";
import { PieChart } from '../charts';
import { PunctualityData } from "./PunctualityData";

// Colors
const purple = "#5c00b8";
const lightTeal = "#00ebeb";
const darkTeal = "#009e9e";
const green = "#06ff05";
const lightPink = "#eb00eb";
const darkPink = "#b200b2";

export const Punctuality = () => {

    // Data for pie chart -------------------------------------------------------------------------------------

    const punctualityData = {
        labels: PunctualityData.map((data) => data.reason),
        datasets: [{
            label: "Punctuality",
            data: PunctualityData.map((data) => data.qty),
            backgroundColor: [
                purple, darkPink, lightPink,
                green, lightTeal, darkTeal
            ],
        }]
    }

    // Return ----------------------------------------------------------------------------------------------------

    return (
        <div className="row d-flex d-inline-flex justify-content-between w-100">
            {/* Left Column Starts */}
            <div className="col">
                <div className="row d-flex flex-column justify-content-between">
                    {/* Punctuality Table Starts */}
                    <div className="col text-center">
                    <h2 className="mb-4">Punctuality Table</h2>

                        <table className="table table-bordered text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col"><h3 className="m-0">Reason</h3></th>
                                    <th scope="col"><h3 className="m-0">Quantity</h3></th>
                                </tr>
                            </thead>

                            <tbody>
                            {PunctualityData.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <th scope="row"><h3 className="m-0">{item.reason}</h3></th>
                                            <td><h3 className="m-0">{item.qty}</h3></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Punctuality Table Ends */}
                </div>
            </div>
            {/* Left Column Ends */}

            {/* Right Column Starts */}
            <div className="col">
                <div className="row">
                    {/* Punctuality Chart Starts */}
                    <div className="col text-center">
                        <h2 className="mb-3">Punctuality Chart</h2>

                        <div style={{ height: '28.85rem' }}>
                            <PieChart pieData={punctualityData} />
                        </div>
                    </div>
                    {/* Punctuality Chart Ends */}
                </div>
            </div>
            {/* Right Column Ends */}
        </div>
    )
}
