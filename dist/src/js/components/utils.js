'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NOW = exports.DATE_FORMAT = exports.TIME_FORMAT = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIME_FORMAT = exports.TIME_FORMAT = 'h:mm a';
var DATE_FORMAT = exports.DATE_FORMAT = 'YYYY-MM-DD';
var NOW = exports.NOW = (0, _moment2.default)().hour(0).minute(0);

//# sourceMappingURL=utils.js.map