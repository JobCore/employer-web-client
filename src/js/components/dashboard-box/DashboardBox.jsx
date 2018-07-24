import './style.scss';
import React from 'react';
import {ShiftCard} from '../index';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

const DashboardBox = ({shifts, title, status}) => {
    const shiftsHTML = shifts.map((s,i) => (<ShiftCard key={i} shift={s} />));
    return (<div className="dashboard_box">
        <div className="row header">
            <div className="col-4 text-center">
                <button className="btn btn-primary btn-lg">{title}</button>
            </div>
            <div className="col-8">
                <span className="bar mt-2"></span>
            </div>
        </div>
        <div className="row">
            <div className="col-10 content">
                <ul>{shiftsHTML}</ul>
            </div>
            <div className="col-2 text-center">
                <p>{title}</p>
                <p className="kpi">6</p>
                <Link className="btn btn-success" to={"/shifts?status="+status}>View all</Link>
            </div>
        </div>
    </div>);
};

DashboardBox.propTypes = {
    status: PropTypes.string.isRequired,
    shifts: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
};
export default DashboardBox;