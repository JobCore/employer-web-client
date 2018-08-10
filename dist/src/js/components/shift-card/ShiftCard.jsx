'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

require('./style.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ShiftCard
 */
var ShiftCard = function ShiftCard(props) {
    var totalCandidates = Array.isArray(props.shift.candidates) ? props.shift.candidates.length : 0;
    var openVacancys = props.shift.maximum_allowed_employees;
    var startDate = props.shift.date.format('ll');
    var startTime = props.shift.start_time.format('LT');
    var endTime = props.shift.finish_time.format('LT');
    return _react2.default.createElement(
        _theme2.default.Consumer,
        null,
        function (_ref) {
            var bar = _ref.bar;
            return _react2.default.createElement(
                'li',
                { className: 'shiftcard ' + (props.hover ? 'shiftcard-hover' : '') },
                _react2.default.createElement(
                    'div',
                    { className: 'shift-details' },
                    !props.showStatus ? '' : props.shift.status == 'DRAFT' ? _react2.default.createElement(
                        'span',
                        { href: '#', className: 'badge badge-secondary' },
                        'D'
                    ) : openVacancys == totalCandidates ? _react2.default.createElement(
                        'span',
                        { href: '#', className: 'badge' },
                        totalCandidates,
                        '/',
                        openVacancys
                    ) : _react2.default.createElement(
                        'span',
                        { href: '#', className: 'badge badge-danger' },
                        totalCandidates,
                        '/',
                        openVacancys
                    ),
                    _react2.default.createElement(
                        'a',
                        { href: '#', className: 'shift-position' },
                        props.shift.position.title
                    ),
                    ' @',
                    _react2.default.createElement(
                        'a',
                        { href: '#', className: 'shift-location' },
                        ' ',
                        props.shift.venue.title
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
                    ),
                    typeof props.shift.price == 'string' ? _react2.default.createElement(
                        'span',
                        { className: 'shift-price' },
                        ' $',
                        props.shift.price,
                        '/hr.'
                    ) : _react2.default.createElement(
                        'span',
                        { className: 'shift-price' },
                        ' ',
                        props.shift.price.currencySymbol,
                        props.shift.price.amount,
                        '/',
                        props.shift.price.timeframe,
                        '.'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'btn-group', role: 'group', 'aria-label': 'Basic example' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-secondary',
                                onClick: function onClick() {
                                    return bar.show({ slug: "show_shift_applicants", data: props.shift, title: "Shift Applicants" });
                                }
                            },
                            _react2.default.createElement('i', { className: 'icon icon-favorite icon-xs' }),
                            ' ',
                            _react2.default.createElement(
                                'label',
                                null,
                                'Applicants'
                            )
                        ),
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-secondary',
                                onClick: function onClick() {
                                    return bar.show({ slug: "update_shift", data: props.shift, title: "Shift Details" });
                                }
                            },
                            _react2.default.createElement('i', { className: 'icon icon-favorite icon-xs' }),
                            ' ',
                            _react2.default.createElement(
                                'label',
                                null,
                                'Detais'
                            )
                        )
                    )
                )
            );
        }
    );
};
ShiftCard.propTypes = {
    shift: _propTypes2.default.object.isRequired,
    hover: _propTypes2.default.bool.isRequired,
    showStatus: _propTypes2.default.bool
};
ShiftCard.defaultProps = {
    hover: false,
    showStatus: false
};
exports.default = ShiftCard;

//# sourceMappingURL=ShiftCard.jsx.map