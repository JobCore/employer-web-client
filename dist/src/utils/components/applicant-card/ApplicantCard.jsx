'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./style.scss');

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Applican Card
 */
var ApplicantCard = function ApplicantCard(props) {
    return _react2.default.createElement(
        _index.Theme.Consumer,
        null,
        function (_ref) {
            var bar = _ref.bar;
            return _react2.default.createElement(
                'li',
                { className: 'aplicantcard' },
                _react2.default.createElement(_index.Avatar, { url: props.applicant.profile.picture }),
                _react2.default.createElement(_index.AcceptReject, {
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
                _react2.default.createElement(_index.Stars, { rating: Number(props.applicant.rating) })
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