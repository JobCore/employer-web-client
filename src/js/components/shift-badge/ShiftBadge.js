import React from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

const ShiftBadge = ({ candidates, maximum_allowed_employees, employees, clockin, starting_at }) => {
    const totalCandidates = (Array.isArray(candidates)) ? candidates.length : 0;
    const totalEmployees = (Array.isArray(employees)) ? employees.length : 0;
    const openVacancys = maximum_allowed_employees - totalEmployees;
    const didNotClockin = (Array.isArray(clockin) && clockin.length > 0) ? false : true;


    if(status == 'DRAFT') return <span className="badge badge-secondary">Draft</span>;
    else if(openVacancys <= 0 && moment().isSameOrAfter(starting_at)){
      if(!didNotClockin){
          return <span className="badge badge-success" style={{backgroundColor:"green"}}><i className="fas fa-thumbs-up"></i>{clockin.length/2}/{openVacancys}</span>;
      }else return <span className="text-danger">[<i className="fas fa-exclamation-circle"></i>{" Employee hasn't clocked in"}]</span>;
    }
    else if(openVacancys <= 0) return <span className="badge" style={{background: "#5cb85c"}}>{totalEmployees} Filled</span>;
    else return <span className="badge badge-danger">{totalCandidates}/{openVacancys}</span>;
};
ShiftBadge.propTypes = {
  candidates: PropTypes.array,
  employees: PropTypes.array,
  maximum_allowed_employees: PropTypes.number
};

export default ShiftBadge;