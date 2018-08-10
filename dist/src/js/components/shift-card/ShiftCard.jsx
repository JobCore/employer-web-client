'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

require('./style.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ShiftCard
 */
var ShiftCard = function (_React$Component) {
    _inherits(ShiftCard, _React$Component);

    function ShiftCard() {
        _classCallCheck(this, ShiftCard);

        var _this = _possibleConstructorReturn(this, (ShiftCard.__proto__ || Object.getPrototypeOf(ShiftCard)).call(this));

        _this.state = {
            hoveredClass: ''
        };
        _this.hasMousedOut = false;
        return _this;
    }

    _createClass(ShiftCard, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var totalCandidates = Array.isArray(this.props.shift.candidates) ? this.props.shift.candidates.length : 0;
            var openVacancys = this.props.shift.maximum_allowed_employees;
            var startDate = this.props.shift.date.format('ll');
            var startTime = this.props.shift.start_time.format('LT');
            var endTime = this.props.shift.finish_time.format('LT');
            return _react2.default.createElement(
                _theme2.default.Consumer,
                null,
                function (_ref) {
                    var bar = _ref.bar;
                    return _react2.default.createElement(
                        'li',
                        { className: "shiftcard " + _this2.state.hoveredClass, onMouseOver: function onMouseOver() {
                                if (_this2.props.hover) {
                                    _this2.setState({ hoveredClass: 'shiftcard-hovered', hasMousedOut: false });
                                    setTimeout(function () {
                                        if (_this2.state.hasMousedOut) _this2.setState({ hoveredClass: '' });
                                    }, 250);
                                }
                            },
                            onMouseOut: function onMouseOut() {
                                return _this2.setState({ hasMousedOut: true });
                            }
                        },
                        _react2.default.createElement(
                            'div',
                            { className: 'shift-details' },
                            !_this2.props.showStatus ? '' : _this2.props.shift.status == 'DRAFT' ? _react2.default.createElement(
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
                                _this2.props.shift.position.title
                            ),
                            ' @',
                            _react2.default.createElement(
                                'a',
                                { href: '#', className: 'shift-location' },
                                ' ',
                                _this2.props.shift.venue.title
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
                            typeof _this2.props.shift.price == 'string' ? _react2.default.createElement(
                                'span',
                                { className: 'shift-price' },
                                ' $',
                                _this2.props.shift.price,
                                '/hr.'
                            ) : _react2.default.createElement(
                                'span',
                                { className: 'shift-price' },
                                ' ',
                                _this2.props.shift.price.currencySymbol,
                                _this2.props.shift.price.amount,
                                '/',
                                _this2.props.shift.price.timeframe,
                                '.'
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'btn-group', role: 'group', 'aria-label': 'Basic example' },
                                _react2.default.createElement(
                                    'button',
                                    { type: 'button', className: 'btn btn-secondary',
                                        onClick: function onClick() {
                                            return bar.show({ slug: "show_shift_applicants", data: _this2.props.shift, title: "Shift Applicants" });
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
                                            return bar.show({ slug: "update_shift", data: _this2.props.shift, title: "Shift Details" });
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
        }
    }]);

    return ShiftCard;
}(_react2.default.Component);

exports.default = ShiftCard;

ShiftCard.propTypes = {
    shift: _propTypes2.default.object.isRequired,
    hover: _propTypes2.default.bool.isRequired,
    showStatus: _propTypes2.default.bool
};
ShiftCard.defaultProps = {
    hover: false,
    showStatus: false
};

//# sourceMappingURL=ShiftCard.jsx.map