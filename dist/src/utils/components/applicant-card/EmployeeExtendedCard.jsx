'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('./style.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Applican Card
 */
var EmployeeExtendedCard = function EmployeeExtendedCard(props) {
    var badgesHTML = props.employee.badges.map(function (b, i) {
        return _react2.default.createElement(
            'span',
            { key: i, className: 'badge' },
            b.title
        );
    });
    return _react2.default.createElement(
        _index.Theme.Consumer,
        null,
        function (_ref) {
            var bar = _ref.bar;
            return _react2.default.createElement(
                'li',
                { className: 'aplicantcard aplicantcard-hover' },
                _react2.default.createElement(_index.Avatar, { url: props.employee.profile.picture }),
                _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement(
                        'b',
                        null,
                        props.employee.profile.user.first_name + " " + props.employee.profile.user.last_name
                    )
                ),
                _react2.default.createElement(_index.Stars, { rating: Number(props.employee.rating), jobCount: props.employee.positions.length }),
                _react2.default.createElement(
                    'p',
                    { href: '#' },
                    badgesHTML
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'btn-group', role: 'group', 'aria-label': 'Basic example' },
                    _react2.default.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-secondary',
                            onClick: function onClick() {
                                return bar.show({ slug: "show_single_talent", data: props.employee, title: "Talent Details" });
                            }
                        },
                        _react2.default.createElement('i', { className: 'icon icon-favorite icon-xs' }),
                        ' ',
                        _react2.default.createElement(
                            'label',
                            null,
                            'Detals'
                        )
                    ),
                    _react2.default.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-secondary',
                            onClick: function onClick() {
                                return bar.show({ slug: "invite_talent", data: props.employee, title: "Invite Talent" });
                            }
                        },
                        _react2.default.createElement('i', { className: 'icon icon-favorite icon-xs' }),
                        ' ',
                        _react2.default.createElement(
                            'label',
                            null,
                            'Invite'
                        )
                    )
                )
            );
        }
    );
};
EmployeeExtendedCard.propTypes = {
    employee: _propTypes2.default.object.isRequired
};
exports.default = EmployeeExtendedCard;

//# sourceMappingURL=EmployeeExtendedCard.jsx.map