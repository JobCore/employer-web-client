import React from "react";
import PropTypes from "prop-types";
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import './styles.scss';

const Beacon = (props) => (<div className="beacon" {...props}>
    <span className="beaconOuter" />
    <span className="beaconInner"><i className="fas fa-question"></i></span>
</div>);

const locale = { back: 'Previous', close: 'Close', last: 'Finish', next: 'Next', skip: 'Skip' };

const Wizard = (props) => (<Joyride 
    beaconComponent={Beacon}
    run={props.run}
    showSkipButton={true}
    locale={locale}
    {...props}
/>);
Wizard.propTypes = {
    run: PropTypes.bool
};
Wizard.defaultProps = {
    run: false
};
export default Wizard;