'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShiftDetails = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('./style.scss');

var _rcTimePicker = require('rc-time-picker');

var _rcTimePicker2 = _interopRequireDefault(_rcTimePicker);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ShiftDetails
 */
var ShiftDetails = exports.ShiftDetails = function ShiftDetails(_ref) {
    var onSave = _ref.onSave,
        onCancel = _ref.onCancel,
        _onChange = _ref.onChange,
        catalog = _ref.catalog,
        formData = _ref.formData;
    return _react2.default.createElement(
        'form',
        null,
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-6' },
                _react2.default.createElement(
                    'label',
                    null,
                    'Looking for'
                ),
                _react2.default.createElement(
                    'select',
                    { className: 'form-control',
                        value: formData.position,
                        onChange: function onChange(e) {
                            return _onChange({ position: e.target.value });
                        } },
                    _react2.default.createElement(
                        'option',
                        null,
                        'Select a position'
                    ),
                    catalog.positions.map(function (pos, i) {
                        return _react2.default.createElement(
                            'option',
                            { key: i, value: pos.id },
                            pos.title
                        );
                    })
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'col-6' },
                _react2.default.createElement(
                    'label',
                    null,
                    'How many?'
                ),
                _react2.default.createElement('input', { type: 'number', className: 'form-control',
                    value: formData.maximum_allowed_employees,
                    onChange: function onChange(e) {
                        return _onChange({ maximum_allowed_employees: e.target.value });
                    }
                })
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-6' },
                _react2.default.createElement(
                    'label',
                    null,
                    'Price / hour'
                ),
                _react2.default.createElement('input', { type: 'number', className: 'form-control',
                    value: formData.minimum_hourly_rate,
                    onChange: function onChange(e) {
                        return _onChange({ minimum_hourly_rate: e.target.value });
                    }
                })
            ),
            _react2.default.createElement(
                'div',
                { className: 'col-6' },
                _react2.default.createElement(
                    'label',
                    null,
                    'Date'
                ),
                _react2.default.createElement('input', { type: 'date', className: 'form-control',
                    value: typeof formData.date != 'undefined' ? formData.date.format(_utils.DATE_FORMAT) : '',
                    onChange: function onChange(e) {
                        return _onChange({ date: (0, _moment2.default)(e.target.value) });
                    }
                })
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-6' },
                _react2.default.createElement(
                    'label',
                    null,
                    'From'
                ),
                _react2.default.createElement(_rcTimePicker2.default, {
                    format: _utils.TIME_FORMAT,
                    showSecond: false,
                    minuteStep: 15,
                    use12Hours: true,
                    value: formData.start_time,
                    onChange: function onChange(value) {
                        return _onChange({ start_time: value });
                    }
                })
            ),
            _react2.default.createElement(
                'div',
                { className: 'col-6' },
                _react2.default.createElement(
                    'label',
                    null,
                    'To'
                ),
                _react2.default.createElement(_rcTimePicker2.default, {
                    format: _utils.TIME_FORMAT,
                    showSecond: false,
                    minuteStep: 15,
                    defaultValue: _utils.NOW,
                    use12Hours: true,
                    value: formData.finish_time,
                    onChange: function onChange(value) {
                        return _onChange({ finish_time: value });
                    }
                })
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-12' },
                _react2.default.createElement(
                    'label',
                    null,
                    'Venue'
                ),
                _react2.default.createElement(
                    'select',
                    { className: 'form-control',
                        value: formData.venue,
                        onChange: function onChange(e) {
                            return _onChange({ venue: e.target.value });
                        }
                    },
                    _react2.default.createElement(
                        'option',
                        { value: null },
                        'Select a venue'
                    ),
                    catalog.venues.map(function (ven, i) {
                        return _react2.default.createElement(
                            'option',
                            { key: i, value: ven.id },
                            ven.title
                        );
                    })
                )
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-12' },
                _react2.default.createElement(
                    'label',
                    null,
                    'Minimum start rating'
                ),
                _react2.default.createElement(
                    'select',
                    { className: 'form-control',
                        value: formData.minimum_allowed_rating,
                        onChange: function onChange(e) {
                            return _onChange({ minimum_allowed_rating: e.target.value });
                        }
                    },
                    _react2.default.createElement(
                        'option',
                        { value: 0 },
                        '0 star'
                    ),
                    _react2.default.createElement(
                        'option',
                        { value: 1 },
                        '1 star'
                    ),
                    _react2.default.createElement(
                        'option',
                        { value: 2 },
                        '2 star'
                    ),
                    _react2.default.createElement(
                        'option',
                        { value: 3 },
                        '3 star'
                    ),
                    _react2.default.createElement(
                        'option',
                        { value: 4 },
                        '4 star'
                    ),
                    _react2.default.createElement(
                        'option',
                        { value: 5 },
                        '5 star'
                    )
                )
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'btn-bar' },
            _react2.default.createElement(
                'button',
                { type: 'button', className: 'btn btn-success', onClick: function onClick() {
                        return onSave();
                    } },
                'Save'
            ),
            _react2.default.createElement(
                'button',
                { type: 'button', className: 'btn btn-secondary', onClick: function onClick() {
                        return onCancel();
                    } },
                'Cancel'
            )
        )
    );
};
ShiftDetails.propTypes = {
    onSave: _propTypes2.default.func.isRequired,
    onCancel: _propTypes2.default.func.isRequired,
    onChange: _propTypes2.default.func.isRequired,
    formData: _propTypes2.default.object,
    catalog: _propTypes2.default.object //contains the data needed for the form to load
};
exports.default = ShiftDetails;

//# sourceMappingURL=ShiftDetails.jsx.map