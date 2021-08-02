import React from "react";
import PropTypes from 'prop-types';

const ShiftBadge = ({ candidates, maximum_allowed_employees, employees }) => {
    const totalCandidates = (Array.isArray(candidates)) ? candidates.length : 0;
    const totalEmployees = (Array.isArray(employees)) ? employees.length : 0;
    const openVacancys = maximum_allowed_employees - totalEmployees;
    if(status == 'DRAFT') return <span className="badge badge-secondary">Draft</span>;
    else if(openVacancys <= 0) return <span className="badge" style={{background: "#5cb85c"}}>{totalEmployees} Filled</span>;
    else return <span className="badge badge-danger">{totalCandidates}/{openVacancys}</span>;
};
ShiftBadge.propTypes = {
  candidates: PropTypes.array,
  employees: PropTypes.array,
  maximum_allowed_employees: PropTypes.number
};

export default ShiftBadge;