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

var Stars = function Stars(_ref) {
    var rating = _ref.rating,
        jobCount = _ref.jobCount;

    var whole = Math.floor(rating);
    var decimalPart = rating - whole;
    var lis = [];
    for (var i = 0; i < whole; i++) {
        lis.push(_react2.default.createElement('i', { key: i, className: 'fas fa-star' }));
    }return _react2.default.createElement(
        'div',
        { className: 'starrating' },
        lis.length > 0 ? lis : _react2.default.createElement(
            'small',
            null,
            'No rating available'
        ),
        decimalPart > 0 ? _react2.default.createElement('i', { className: 'fas fa-star-half' }) : '',
        jobCount ? _react2.default.createElement(
            'span',
            { className: 'jobs' },
            'in ',
            jobCount,
            ' jobs completed'
        ) : ''
    );
};
Stars.propTypes = {
    rating: _propTypes2.default.number.isRequired,
    jobCount: _propTypes2.default.number
};

exports.default = Stars;

//# sourceMappingURL=Stars.jsx.map