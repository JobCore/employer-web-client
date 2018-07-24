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

var ShiftOption = function ShiftOption(option) {
    var startDate = option.value.date.format('ll');
    var startTime = option.value.start_time.format('LT');
    var endTime = option.value.finish_time.format('LT');
    return _react2.default.createElement(
        'div',
        { className: 'shift-option' },
        _react2.default.createElement(
            'a',
            { href: '#', className: 'shift-position' },
            option.value.position.title
        ),
        ' @',
        _react2.default.createElement(
            'a',
            { href: '#', className: 'shift-location' },
            ' ',
            option.value.venue.title
        ),
        _react2.default.createElement(
            'span',
            { className: 'shift-date' },
            ' ',
            startDate,
            ' from ',
            startTime,
            ' to ',
            endTime,
            ' '
        )
    );
};
ShiftOption.propTypes = {
    children: _propTypes2.default.node,
    value: _propTypes2.default.object
};
exports.default = ShiftOption;

//# sourceMappingURL=ShiftOption.jsx.map