'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _week = require('./week');

var _week2 = _interopRequireDefault(_week);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6;

var Month = function (_React$Component) {
  _inherits(Month, _React$Component);

  function Month() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Month);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Month.__proto__ || Object.getPrototypeOf(Month)).call.apply(_ref, [this].concat(args))), _this), _this.handleDayClick = function (day, event) {
      if (_this.props.onDayClick) {
        _this.props.onDayClick(day, event);
      }
    }, _this.handleDayMouseEnter = function (day) {
      if (_this.props.onDayMouseEnter) {
        _this.props.onDayMouseEnter(day);
      }
    }, _this.handleMouseLeave = function () {
      if (_this.props.onMouseLeave) {
        _this.props.onMouseLeave();
      }
    }, _this.isWeekInMonth = function (startOfWeek) {
      var day = _this.props.day;
      var endOfWeek = startOfWeek.clone().add(6, 'days');
      return startOfWeek.isSame(day, 'month') || endOfWeek.isSame(day, 'month');
    }, _this.renderWeeks = function () {
      var weeks = [];
      var isFixedHeight = _this.props.fixedHeight;
      var currentWeekStart = _this.props.day.clone().startOf('month').startOf('week');
      var i = 0;
      var breakAfterNextPush = false;

      while (true) {
        weeks.push(_react2.default.createElement(_week2.default, {
          key: i,
          day: currentWeekStart,
          month: _this.props.day.month(),
          onDayClick: _this.handleDayClick,
          onDayMouseEnter: _this.handleDayMouseEnter,
          minDate: _this.props.minDate,
          maxDate: _this.props.maxDate,
          excludeDates: _this.props.excludeDates,
          includeDates: _this.props.includeDates,
          inline: _this.props.inline,
          highlightDates: _this.props.highlightDates,
          selectingDate: _this.props.selectingDate,
          filterDate: _this.props.filterDate,
          preSelection: _this.props.preSelection,
          selected: _this.props.selected,
          selectsStart: _this.props.selectsStart,
          selectsEnd: _this.props.selectsEnd,
          showWeekNumber: _this.props.showWeekNumbers,
          startDate: _this.props.startDate,
          endDate: _this.props.endDate,
          utcOffset: _this.props.utcOffset }));

        if (breakAfterNextPush) break;

        i++;
        currentWeekStart = currentWeekStart.clone().add(1, 'weeks');

        // If one of these conditions is true, we will either break on this week
        // or break on the next week
        var isFixedAndFinalWeek = isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT;
        var isNonFixedAndOutOfMonth = !isFixedHeight && !_this.isWeekInMonth(currentWeekStart);

        if (isFixedAndFinalWeek || isNonFixedAndOutOfMonth) {
          if (_this.props.peekNextMonth) {
            breakAfterNextPush = true;
          } else {
            break;
          }
        }
      }

      return weeks;
    }, _this.getClassNames = function () {
      var _this$props = _this.props,
          selectingDate = _this$props.selectingDate,
          selectsStart = _this$props.selectsStart,
          selectsEnd = _this$props.selectsEnd;

      return (0, _classnames2.default)('react-datepicker__month', {
        'react-datepicker__month--selecting-range': selectingDate && (selectsStart || selectsEnd)
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Month, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: this.getClassNames(), onMouseLeave: this.handleMouseLeave, role: 'listbox' },
        this.renderWeeks()
      );
    }
  }]);

  return Month;
}(_react2.default.Component);

Month.propTypes = {
  day: _propTypes2.default.object.isRequired,
  endDate: _propTypes2.default.object,
  excludeDates: _propTypes2.default.array,
  filterDate: _propTypes2.default.func,
  fixedHeight: _propTypes2.default.bool,
  highlightDates: _propTypes2.default.array,
  includeDates: _propTypes2.default.array,
  inline: _propTypes2.default.bool,
  maxDate: _propTypes2.default.object,
  minDate: _propTypes2.default.object,
  onDayClick: _propTypes2.default.func,
  onDayMouseEnter: _propTypes2.default.func,
  onMouseLeave: _propTypes2.default.func,
  peekNextMonth: _propTypes2.default.bool,
  preSelection: _propTypes2.default.object,
  selected: _propTypes2.default.object,
  selectingDate: _propTypes2.default.object,
  selectsEnd: _propTypes2.default.bool,
  selectsStart: _propTypes2.default.bool,
  showWeekNumbers: _propTypes2.default.bool,
  startDate: _propTypes2.default.object,
  utcOffset: _propTypes2.default.number
};
exports.default = Month;
