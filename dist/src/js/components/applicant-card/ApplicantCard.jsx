'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./style.scss');

var _avatar = require('../avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _stars = require('../stars');

var _stars2 = _interopRequireDefault(_stars);

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

var _acceptReject = require('../accept-reject');

var _acceptReject2 = _interopRequireDefault(_acceptReject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Applican Card
 */
var ApplicantCard = function ApplicantCard(props) {
    return _react2.default.createElement(
        _theme2.default.Consumer,
        null,
        function (_ref) {
            var bar = _ref.bar;
            return _react2.default.createElement(
                'li',
                { className: 'aplicantcard' },
                _react2.default.createElement(_avatar2.default, { url: props.applicant.profile.picture }),
                _react2.default.createElement(_acceptReject2.default, {
                    onAccept: function onAccept() {
                        return props.onAccept(props.shift.id, props.applicant);
                    },
                    onReject: function onReject() {
                        return props.onReject(props.shift.id, props.applicant);
                    }
                }),
                _react2.default.createElement(
                    'a',
                    { href: '#', className: 'shift-position' },
                    props.applicant.profile.user.first_name + " " + props.applicant.profile.user.last_name
                ),
                _react2.default.createElement(_stars2.default, { rating: Number(props.applicant.rating) })
            );
        }
    );
};
ApplicantCard.propTypes = {
    applicant: _propTypes2.default.object.isRequired,
    shift: _propTypes2.default.object.isRequired,
    onAccept: _propTypes2.default.func.isRequired,
    onReject: _propTypes2.default.func.isRequired
};

exports.default = ApplicantCard;

//# sourceMappingURL=ApplicantCard.jsx.map