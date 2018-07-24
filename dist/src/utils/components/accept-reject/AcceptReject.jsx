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

/**
 * @render react
 * @name AcceptReject
 * @description Ideal to accept or reject candidates/invites for shifts
 * @example
 *  <AcceptReject
 *      onAccept={() => acceptCandidate(props.shift.id, props.applicant)} 
 *      onReject={() => rejectCandidate(props.shift.id, props.applicant)} 
 *  />
 */
var AcceptReject = function AcceptReject(props) {
    return _react2.default.createElement(
        'div',
        { className: "accept-reject " + props.className },
        _react2.default.createElement(
            'button',
            { className: 'btn btn-danger', onClick: function onClick() {
                    return props.onReject();
                } },
            _react2.default.createElement('i', { className: 'fas fa-times-circle' }),
            props.showLabels ? _react2.default.createElement(
                'label',
                null,
                'Reject'
            ) : ''
        ),
        _react2.default.createElement(
            'button',
            { className: 'btn btn-success', onClick: function onClick() {
                    return props.onAccept();
                } },
            _react2.default.createElement('i', { className: 'fas fa-check-circle' }),
            props.showLabels ? _react2.default.createElement(
                'label',
                null,
                'Accept'
            ) : ''
        )
    );
};
AcceptReject.propTypes = {
    className: _propTypes2.default.string,
    showLabels: _propTypes2.default.bool,
    onReject: _propTypes2.default.func,
    onAccept: _propTypes2.default.func
};
AcceptReject.defaultProps = {
    className: '',
    showLabels: false
};

exports.default = AcceptReject;

//# sourceMappingURL=AcceptReject.jsx.map