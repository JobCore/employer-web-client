import React from "react";
import PropTypes from 'prop-types';

const ShiftBadge = ({ candidates, maximum_allowed_employees, employees }) => {
    const totalCandidates = (Array.isArray(candidates)) ? candidates.length : 0;
    const totalEmployees = (Array.isArray(employees)) ? employees.length : 0;
    const openVacancys = maximum_allowed_employees - totalEmployees;
    if(status == 'DRAFT') return <span href="#" className="badge badge-secondary">draft</span>;
    else if(openVacancys <= 0) return <span href="#" className="badge">{totalEmployees} filled</span>;
    else return <span href="#" className="badge badge-danger">{totalCandidates}/{openVacancys}</span>;
};
ShiftBadge.propTypes = {
  candidates: PropTypes.array,
  employees: PropTypes.array,
  maximum_allowed_employees: PropTypes.number
};

export default ShiftBadge;