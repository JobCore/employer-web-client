import './style.scss';
import React from 'react';
import ShiftCard from '../shift-card';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

const DashboardBox = ({shifts, title, status, id}) => {
    const shiftsHTML = (!Array.isArray(shifts)) ? [] : shifts.map((s,i) => (<ShiftCard key={i} shift={s} clickForDetails={true} />));
    return (<div className="dashboard_box">
        <div className="row header no-gutters">
            <div className="col-5">
                <h2 id={id} className="header-title">{title}</h2>
            </div>
            <div className="col-7">
                <span className="bar mt-2"></span>
            </div>
        </div>
        <div className="row">
            <div className="col-10 content scroll">
                <ul>
                    { (shiftsHTML.length == 0) ? 
                        <li>You have not shifts with status {status}</li>
                        :
                        shiftsHTML
                    }
                </ul>
            </div>
            <div className="col-2 text-center">
                <p>{title}</p>
                <p className="kpi">{shiftsHTML.length}</p>
                <Link className="btn btn-success" to={"/shifts?status="+status}>View all</Link>
            </div>
        </div>
    </div>);
};

DashboardBox.propTypes = {
    status: PropTypes.string.isRequired,
    id: PropTypes.string,
    shifts: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
};
// Specifies the default values for props:
DashboardBox.defaultProps = {
  id: ''
};
export default DashboardBox;