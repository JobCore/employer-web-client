import React, { useEffect, useState } from "react"
import { PieChart } from "../charts"

/**
 * @function
 * @description Creates a pie chart and a table reflecting how many job seekers are in each category of star ratings (1 to 5 stars.)
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires PieChart
 * @param {object} props - Contains an array of all shifts, and an array of all workers.
 */
export const Ratings = (props) => {

    // Use state to hold list of workers
    const [workersList, setWorkersList] = useState([])

    // Receiving the props that contain the list of workers
    const handleProps = async () => {

        // Catching the props when they arrive
        let workersObj = await props

        // Checking length of list before saving it
        if (workersObj.workers.length > 0) {
            // Saving list of workers
            setWorkersList(workersObj.workers)
        } else {
            // Handling error with a message
            console.log("Waiting for props to arrive")
        }
    }

    // Triggering handleProps when props change/arrive
    useEffect(() => {
        handleProps()
    }, [props])

    // Rendering based on length of workersList
    if (workersList.length > 0) {

        // Preparing the list for the chart data ---------------------------------------

        // Array to hold list of ratings
        let ratingsList = []

        // Gathering ratings of each worker
        workersList.forEach((eachWorker) => {
            ratingsList.push(eachWorker.rating)
        })

        // Function to make an array of rating quantities
        const findQuantities = (passedArray) => {

            // Array to hold rating results
            const results = [];

            // Counting how many times each star rating appears
            passedArray?.forEach((item) => {

                // Generating indexes
                const index = results.findIndex((obj) => {
                    return obj["rating"] === item;
                });

                // Using the indexes to count rating instances
                if (index === -1) {
                    results.push({
                        rating: item,
                        qty: 1
                    });

                } else {
                    results[index]["qty"]++;
                }
            });

            // Returning array
            return results;
        };

        // Generating array of rating quantities
        let ratingsQty = findQuantities(ratingsList);

        // Calculating total of all the quantities
        let total = ratingsQty.reduce((s, { qty }) => s + qty, 0);

        // Generating and adding percentages as new properties
        let ratingsPct = ratingsQty.map(({ rating, qty }) => ({
            rating,
            qty,
            pct: ((qty * 100) / total).toFixed(0)
        }));

        // Organizing objects by numerical order of the "rating" properties
        let ratingsFinal = ratingsPct.sort((a, b) => (a.rating - b.rating))

        // Moving the first object ("Unavailable Rating") to the last position of the array
        ratingsFinal.push(ratingsFinal.shift());

        // Generating an object with the totals
        let totalsObj = { rating: "Total Employees", qty: total, pct: "100" }

        // Adding object with totals to the array
        ratingsFinal.push(totalsObj)

        // Adding id's to every object in the array
        ratingsFinal.forEach((item, i) => {
            item.id = i + 1;
        });

        // Preparing the chart data ----------------------------------------------------

        // Colors
        const purple = "#5c00b8";
        const lightTeal = "#00ebeb";
        const darkTeal = "#009e9e";
        const green = "#06ff05";
        const lightPink = "#eb00eb";
        const darkPink = "#b200b2";

        // Taking out the "Totals" from the pie chart view
        let pieData = ratingsFinal.filter((item) => { return item.rating !== "Total Employees" })

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

        // Return ----------------------------------------------------------------------

        return (
            <div className="row d-flex d-inline-flex justify-content-between w-100">
                {/* Left Column Starts */}
                <div className="col">
                    <div className="row d-flex flex-column justify-content-between">
                        {/* Ratings Table Starts */}
                        <div className="col text-center">
                            <h2 className="mb-4">Employee Ratings Table</h2>

                            <table className="table table-bordered border-dark text-center">
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
                                    {ratingsFinal.map((item, i) => {
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
    } else {
        return (
            <h1>Loading</h1>
        )
    }
}