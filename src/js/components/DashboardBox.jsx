import React from 'react';
import {ShiftCard} from './ShiftComponents.jsx';
import PropTypes from 'prop-types';

export const DashboardBox = ({shifts}) => {
    const shiftsHTML = shifts.map((s,i) => (<ShiftCard key={i} position={s.position} location={s.location} price={s.price} start={s.start} end={s.end} />));
    return (<div className="dashboard_box">
        <div className="row header">
            <div className="col-4 text-center">
                <button className="btn btn-primary btn-lg">Create Shifts</button>
            </div>
            <div className="col-8">
                <span className="bar mt-2"></span>
            </div>
        </div>
        <div className="row">
            <div className="col-9 content">
                <ul>{shiftsHTML}</ul>
            </div>
            <div className="col-3 text-center">
                <p>Unpublished shifts</p>
                <p className="kpi">6</p>
                <button className="btn btn-success">Publish all</button>
            </div>
        </div>
    </div>);
};

DashboardBox.propTypes = {
  shifts: PropTypes.array.isRequired
};