import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

const Avatar = (props) => {
    return (<div className={"avatar "+props.className}
            style={{backgroundImage: "url("+props.url+")"}}
        ></div>);
};
Avatar.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string
};
Avatar.defaultProps = {
  className: '',
  url: 'https://randomuser.me/api/portraits/women/1.jpg'
};

export default Avatar;