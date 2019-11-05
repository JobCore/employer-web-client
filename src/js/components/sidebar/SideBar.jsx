import React from "react";
import PropTypes from 'prop-types';
import './style.scss';
import RightBar from '../../views/RightBar.js';

const SideBar = (props) => {
    const bars = props.sideBarLevels.map((sb, i) =>
      (<RightBar key={i}
          level={i}
          isCollapsable={(i == props.sideBarLevels.length-1)}
          parent={(i > 0) ? props.sideBarLevels[i-1] : null}
          catalog={props.catalog}
          option={sb.option}
          formData={sb.formData}
          component={sb.component}
          goFetch={props.goFetch}
          onClose={() => props.onClose()}
          onBackdropClick={() => props.onBackdropClick ? props.onBackdropClick() : null}
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
  onClose: PropTypes.func.isRequired,
  onBackdropClick: PropTypes.func
};
SideBar.defaultProps = {
  className: '',
  goFetch: null,
  onBackdropClick: null
};

export default SideBar;