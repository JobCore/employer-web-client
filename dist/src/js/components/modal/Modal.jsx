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

var Modal = function Modal(props) {
    return _react2.default.createElement(
        'div',
        { className: "bc-modal " + props.className },
        _react2.default.createElement(
            'div',
            { className: 'modal-dialog', role: 'document' },
            _react2.default.createElement(
                'div',
                { className: 'modal-content' },
                props.children
            )
        )
    );
};
Modal.propTypes = {
    className: _propTypes2.default.string,
    children: _propTypes2.default.string
};
Modal.defaultProps = {
    className: ''
};

exports.default = Modal;

//# sourceMappingURL=Modal.jsx.map