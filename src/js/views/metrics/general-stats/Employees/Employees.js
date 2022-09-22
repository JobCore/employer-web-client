import React from "react";
import { PieChart } from '../../charts';
import { EmployeesData } from "./EmployeesData";

// Colors
const purple = "#5c00b8";
const lightPink = "#eb00eb";

export const Employees = () => {

    // Data for pie chart -------------------------------------------------------------------------------------

    let pieData = EmployeesData.filter((item) => { return item.description !== "Total Employees" })

    const employeesData = {
        labels: pieData.map((data) => data.description),
        datasets: [{
            label: "Employees",
            data: pieData.map((data) => data.qty),
            backgroundColor: [
                purple, lightPink
            ],
        }]
    }

    // Return ----------------------------------------------------------------------------------------------------

    return (
        <div className="row d-flex d-inline-flex justify-content-between mb-4 w-100">
            {/* Left Column Starts */}
            <div className="col">
                <div className="row d-flex flex-column justify-content-between">
                    {/* Employees Table Starts */}
                    <div className="col text-center">
                        <h2 className="mb-4">Employees Table</h2>

                        <table className="table table-bordered text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col"><h3 className="m-0">Description</h3></th>
                                    <th scope="col"><h3 className="m-0">Quantity</h3></th>
                                    <th scope="col"><h3 className="m-0">Percentages</h3></th>
                                </tr>
                            </thead>

                            <tbody>
                                {EmployeesData.map((item, i) => {
                                    return item.description === "Total Employees" ? (
                                        <tr key={i} style={{ background: "rgba(107, 107, 107, 0.35)" }}>
                                            <th scope="row"><h3 className="m-0">{item.description}</h3></th>
                                            <td><h3 className="m-0">{item.qty}</h3></td>
                                            <td><h3 className="m-0">{`${item.pct}%`}</h3></td>
                                        </tr>
                                    ) :
                                        (
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
                    {/* Employees Table Ends */}
                </div>
            </div>
            {/* Left Column Ends */}

            {/* Right Column Starts */}
            <div className="col">
                <div className="row">
                    {/* Employees Chart Starts*/}
                    <div className="col text-center">
                        <h2 className="mb-3">Employees Chart</h2>

                        <div style={{ height: '13.90rem' }} className="mx-auto">
                            <PieChart pieData={employeesData} />
                        </div>
                    </div>
                    {/* Employees Chart Ends*/}
                </div>
            </div>
            {/* Right Column Ends */}
        </div>
    )
}
