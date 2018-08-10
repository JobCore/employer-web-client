'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('./style.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _avatar = require('../avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _stars = require('../stars');

var _stars2 = _interopRequireDefault(_stars);

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

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
    var favoriteCount = props.employee.favoriteLists.length;
    return _react2.default.createElement(
        _theme2.default.Consumer,
        null,
        function (_ref) {
            var bar = _ref.bar;
            return _react2.default.createElement(
                'li',
                { className: 'aplicantcard aplicantcard-hover' },
                _react2.default.createElement(_avatar2.default, { url: props.employee.profile.picture }),
                _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement(
                        'b',
                        null,
                        props.employee.profile.user.first_name + " " + props.employee.profile.user.last_name
                    )
                ),
                _react2.default.createElement(_stars2.default, { rating: Number(props.employee.rating), jobCount: props.employee.positions.length }),
                _react2.default.createElement(
                    'p',
                    { href: '#' },
                    favoriteCount > 0 ? _react2.default.createElement(
                        'span',
                        { className: 'badge badge-warning' },
                        _react2.default.createElement('i', { className: 'fas fa-star' }),
                        ' ',
                        favoriteCount,
                        ' Lists'
                    ) : '',
                    ' ',
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