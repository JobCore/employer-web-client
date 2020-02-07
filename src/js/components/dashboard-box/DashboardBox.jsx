import './style.scss';
import React, { useState, useEffect } from 'react';
import ShiftCard from '../shift-card';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

const statusLabel = {
    "EXPIRED": "completed",
    "COMPLETED": "paid",
    "FILLED": "filled",
    "OPEN": "open",
    "DRAFT": "draft"
};
const DashboardBox = ({ defaultShifts, title, status, id, fetchData }) => {
    const [ collapsed, setCollapsed ] = useState(true);
    const [ shifts, setShifts ] = useState(defaultShifts);

    useEffect(() => {
        if(fetchData) fetchData().then((data) => setShifts(data));
    }, []);
    const shiftList = shifts.results;
    const shiftsHTML = (!Array.isArray(shiftList)) ? [] : shiftList.map((s,i) => (<ShiftCard key={i} shift={s} clickForDetails={true} showStatus={true} />));
    return (<div className="dashboard_box collapsable">
        <div className="row header no-gutters">
            <div className="col-6" onClick={() => setCollapsed(!collapsed)}>
                <h2 id={id} className="header-title">
                    <span className="badge badge-light float-right">{shifts.count ? shifts.count : 0}</span>
                    {title}
                </h2>
            </div>
            <div className="col-6">
                <span className="bar mt-2"></span>
            </div>
        </div>
        <div className={`row ${collapsed ? 'hidden':''}`}>
            <div className="col-10 content scroll">
                <ul>
                    { (shifts.count == 0) ?
                        <li>You have no {statusLabel[status]} shifts</li>
                        :
                        shiftsHTML
                    }
                </ul>
            </div>
            <div className="col-2 text-center">
                <p>{title}</p>
                <p className="kpi">{shifts.count ? shifts.count : 0}</p>
                <Link className="btn btn-success" to={"/shifts?status="+status}>View all</Link>
            </div>
        </div>
    </div>);
};

DashboardBox.propTypes = {
    status: PropTypes.string.isRequired,
    id: PropTypes.string,
    defaultShifts: PropTypes.array,
    title: PropTypes.string.isRequired,
    fetchData: PropTypes.func
};
// Specifies the default values for props:
DashboardBox.defaultProps = {
  id: '',
  defaultShifts: [],
  fetchData: null
};
export default DashboardBox;