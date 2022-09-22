import React from "react";
import { Employees } from "./Employees/Employees";
import { Hours } from "./Hours/Hours";
import { Shifts } from "./Shifts/Shifts";

export const GeneralStats = () => {

    // Return ----------------------------------------------------------------------------------------------------

    return (
        <>
          <div className="row d-flex flex-column mx-2">
                    {/* Tabs Controller Starts */}
                    <nav>
                        <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-shifts-tab" data-toggle="tab" href="#nav-shifts" role="tab" aria-controls="nav-shifts" aria-selected="true"><h2>Shifts</h2></a>
                            <a className="nav-item nav-link" id="nav-hours-tab" data-toggle="tab" href="#nav-hours" role="tab" aria-controls="nav-hours" aria-selected="false"><h2>Hours</h2></a>
                            <a className="nav-item nav-link" id="nav-employees-tab" data-toggle="tab" href="#nav-employees" role="tab" aria-controls="nav-employees" aria-selected="false"><h2>Employees</h2></a>
                        </div>
                    </nav>
                    {/* Tabs Controller Ends */}

                    {/* Tabs Content Starts */}
                    <div
                        className="tab-content mt-5"
                        id="nav-tabContent"
                    >
                        {/* Shifts Tab Starts */}
                        <div className="tab-pane fade show active" id="nav-shifts" role="tabpanel" aria-labelledby="nav-shifts-tab">
                            <Shifts />
                        </div>
                        {/* Shifts Tab Ends */}

                        {/* Hours Tab Starts */}
                        <div className="tab-pane fade" id="nav-hours" role="tabpanel" aria-labelledby="nav-hours-tab">
                            <Hours />
                        </div>
                        {/* Hours Tab Ends */}

                        {/* Employees Tab Starts */}
                        <div className="tab-pane fade" id="nav-employees" role="tabpanel" aria-labelledby="nav-employees-tab">
                            <Employees />
                        </div>
                        {/* Employees Tab Ends */}
                    </div>
                    {/* Tabs Content Ends */}
                </div>
        </>
    )
}
