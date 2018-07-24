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

var Theme = function Theme(_ref) {
    var children = _ref.children;

    return _react2.default.createElement(
        'div',
        { className: 'theme' },
        children
    );
};
Theme.propTypes = {
    children: _propTypes2.default.array.isRequired
};

var _Context = _react2.default.createContext({
    bar: {}
});
exports.default = {
    Theme: Theme,
    Provider: _Context.Provider,
    Consumer: _Context.Consumer
};

//# sourceMappingURL=Theme.jsx.map