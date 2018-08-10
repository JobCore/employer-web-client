'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./style.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Avatar = function Avatar(props) {
  return _react2.default.createElement('div', { className: "avatar " + props.className,
    style: { backgroundImage: "url(" + props.url + ")" }
  });
};
Avatar.propTypes = {
  className: _propTypes2.default.string,
  url: _propTypes2.default.string
};
Avatar.defaultProps = {
  className: '',
  url: 'https://randomuser.me/api/portraits/women/1.jpg'
};

exports.default = Avatar;

//# sourceMappingURL=Avatar.jsx.map