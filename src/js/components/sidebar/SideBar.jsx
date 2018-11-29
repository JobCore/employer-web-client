import React from "react";
import PropTypes from 'prop-types';
import './style.scss';
import RightBar from '../../views/RightBar.jsx';

const SideBar = (props) => {
    const bars = props.sideBarLevels.map((sb, i) => 
      (<RightBar key={i} 
          level={i}
          isCollapsable={(i == props.sideBarLevels.length-1)}
          catalog={props.catalog}
          option={sb.option}
          formData={sb.formData}
          component={sb.component} 
          goFetch={props.goFetch} 
          onClose={() => props.onClose()}
      />));
  
    return (<div className={"sidebar "+props.className}>
        {bars}
    </div>);
};
SideBar.propTypes = {
  sideBarLevels: PropTypes.array.isRequired,
  goFetch: PropTypes.func, 
  catalog: PropTypes.object.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired
};
SideBar.defaultProps = {
  className: '',
  goFetch: null 
};

export default SideBar;