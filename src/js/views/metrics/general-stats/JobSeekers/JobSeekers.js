import React, { useEffect, useState } from "react";
import { PieChart, BarChart } from '../../charts';
import { JobSeekersDataGenerator, NewJobSeekersDataGenerator } from "./JobSeekersData";

/**
 * @function
 * @description Creates a page with 2 graphs and 2 charts showing trends on active, inactive, and new job seekers.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires PieChart
 * @requires BarChart
 * @requires NewJobSeekersDataGenerator
 * @requires JobSeekersDataGenerator
 * @param {object} props - Contains an array of all the shifts, and also an array of all the workers.
 */
export const JobSeekers = (props) => {

    // Use state to hold list of workers and list of shifts
    const [workersList, setWorkersList] = useState([])
    const [shifsList, setShiftsList] = useState([])

    // Receiving the props that contain the lists we need
    const handleProps = async () => {

        // Catching the props when they arrive
        let propsObj = await props

        // Checking length of lists before save them
        if (propsObj.workers.length > 0) {
            // Saving list of workers
            setWorkersList(propsObj.workers)
            // Saving list of shifts
            setShiftsList(propsObj.shifts)
        } else {
            // Handling error with a message
            console.log("Waiting for props to arrive")
        }
    }

    // Triggering handleProps when props change/arrive
    useEffect(() => {
        handleProps()
    }, [props])

    if (workersList.length > 0) {

        // Setting up main data sources
        let JobSeekersData = JobSeekersDataGenerator(shifsList, workersList)
        let NewJobSeekersData = NewJobSeekersDataGenerator(workersList)
        
        // Colors
        const purple = "#5c00b8";
        const lightPink = "#eb00eb";
        const darkTeal = "#009e9e";
        const green = "#06ff05";

        // Data for pie chart -------------------------------------------------------------------------------------

        // Taking out the "Totals" from the chart view
        let pieData = JobSeekersData.filter((item) => { return item.description !== "Total Job Seekers" }) // Taking out the "Totals" from the chart view

        // Preparing data to be passed to the chart component
        const jobSeekersData = {
            labels: pieData.map((data) => data.description),
            datasets: [{
                label: "Job Seekers",
                data: pieData.map((data) => data.qty),
                backgroundColor: [
                    purple, lightPink
                ],
            }]
        }

        // Data for bar chart -------------------------------------------------------------------------------------

        // Preparing data to be passed to the chart component
        const newJobSeekersData = {
            labels: NewJobSeekersData.map((data) => data.description),
            datasets: [{
                label: "New Job Seekers",
                data: NewJobSeekersData.map((data) => data.qty),
                backgroundColor: [
                    darkTeal, green
                ],
            }]
        }

        // Return ----------------------------------------------------------------------------------------------------

        return (
            <div className="row d-flex d-inline-flex justify-content-between w-100">
                {/* Left Column Starts */}
                <div className="col">
                    <div className="row d-flex flex-column justify-content-between mb-5">
                        {/* Job Seekers Table Starts */}
                        <div className="col text-center">
                            <h2 className="mb-4">Job Seekers Table</h2>

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
                                    {JobSeekersData.map((item, i) => {
                                        return item.description === "Total Job Seekers" ? (
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
                        {/* Job Seekers Table Ends */}
                    </div>

                    <div className="row d-flex flex-column justify-content-between mb-5">
                        {/* New Job Seekers Table Starts */}
                        <div className="col text-center">
                            <h2 className="mb-4">New Job Seekers Table</h2>

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
                                    {NewJobSeekersData.map((item, i) => {
                                        return item.description === "Total Job Seekers" ? (
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
                        {/* New Job Seekers Table Ends */}
                    </div>
                </div>
                {/* Left Column Ends */}

                {/* Right Column Starts */}
                <div className="col">
                    <div className="row">
                        {/* Job Seekers Chart Starts*/}
                        <div className="col text-center mb-5">
                            <h2 className="mb-3">Job Seekers Chart</h2>

                            <div style={{ height: '13.90rem' }} className="mx-auto">
                                <PieChart pieData={jobSeekersData} />
                            </div>
                        </div>
                        {/* Job Seekers Chart Ends*/}
                    </div>

                    <div className="row">
                        {/* New Job Seekers Chart Starts*/}
                        <div className="col text-center">
                            <h2 className="mb-3">New Job Seekers Chart</h2>

                            <div style={{ height: '13.90rem' }} className="mx-auto">
                                <BarChart barData={newJobSeekersData} />
                            </div>
                        </div>
                        {/* New Job Seekers Chart Ends*/}
                    </div>
                </div>
                {/* Right Column Ends */}
            </div>
        )
    } else {
        return (
            <h1>Loading</h1>
        )
    }
}