'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('./style.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../index');

var _reactRouterDom = require('react-router-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DashboardBox = function DashboardBox(_ref) {
    var shifts = _ref.shifts,
        title = _ref.title,
        status = _ref.status;

    var shiftsHTML = shifts.map(function (s, i) {
        return _react2.default.createElement(_index.ShiftCard, { key: i, shift: s });
    });
    return _react2.default.createElement(
        'div',
        { className: 'dashboard_box' },
        _react2.default.createElement(
            'div',
            { className: 'row header' },
            _react2.default.createElement(
                'div',
                { className: 'col-4 text-center' },
                _react2.default.createElement(
                    'button',
                    { className: 'btn btn-primary btn-lg' },
                    title
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'col-8' },
                _react2.default.createElement('span', { className: 'bar mt-2' })
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-10 content' },
                _react2.default.createElement(
                    'ul',
                    null,
                    shiftsHTML
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'col-2 text-center' },
                _react2.default.createElement(
                    'p',
                    null,
                    title
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'kpi' },
                    '6'
                ),
                _react2.default.createElement(
                    _reactRouterDom.Link,
                    { className: 'btn btn-success', to: "/shifts?status=" + status },
                    'View all'
                )
            )
        )
    );
};

DashboardBox.propTypes = {
    status: _propTypes2.default.string.isRequired,
    shifts: _propTypes2.default.array.isRequired,
    title: _propTypes2.default.string.isRequired
};
exports.default = DashboardBox;

//# sourceMappingURL=DashboardBox.jsx.map