import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';

const ButtonIcon = ({ icon, iconAlign, iconClassName, transform, children, ...rest }) => (
    <Button {...rest}>
        {iconAlign === 'right' && children}

        {iconAlign === 'left' && children}
    </Button>
);

ButtonIcon.propTypes = {
    ...Button.propTypes,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    children: PropTypes.any,
    iconAlign: PropTypes.oneOf(['left', 'right']),
    iconClassName: PropTypes.string,
    transform: PropTypes.string
};

ButtonIcon.defaultProps = { iconAlign: 'left' };

export default ButtonIcon;
