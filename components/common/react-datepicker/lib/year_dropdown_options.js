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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function generateYears(year, noOfYear) {
  var list = [];
  for (var i = 0; i < 2 * noOfYear; i++) {
    list.push(year + noOfYear - i);
  }
  return list;
}

var YearDropdownOptions = function (_React$Component) {
  _inherits(YearDropdownOptions, _React$Component);

  function YearDropdownOptions(props) {
    _classCallCheck(this, YearDropdownOptions);

    var _this = _possibleConstructorReturn(this, (YearDropdownOptions.__proto__ || Object.getPrototypeOf(YearDropdownOptions)).call(this, props));

    _this.renderOptions = function () {
      var selectedYear = _this.props.year;
      var options = _this.state.yearsList.map(function (year) {
        return _react2.default.createElement(
          'div',
          { className: 'react-datepicker__year-option',
            key: year,
            ref: year,
            onClick: _this.onChange.bind(_this, year) },
          selectedYear === year ? _react2.default.createElement(
            'span',
            { className: 'react-datepicker__year-option--selected' },
            '\u2713'
          ) : '',
          year
        );
      });

      options.unshift(_react2.default.createElement(
        'div',
        { className: 'react-datepicker__year-option',
          ref: 'upcoming',
          key: 'upcoming',
          onClick: _this.incrementYears },
        _react2.default.createElement('a', { className: 'react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-upcoming' })
      ));
      options.push(_react2.default.createElement(
        'div',
        { className: 'react-datepicker__year-option',
          ref: 'previous',
          key: 'previous',
          onClick: _this.decrementYears },
        _react2.default.createElement('a', { className: 'react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-previous' })
      ));
      return options;
    };

    _this.onChange = function (year) {
      _this.props.onChange(year);
    };

    _this.handleClickOutside = function () {
      _this.props.onCancel();
    };

    _this.shiftYears = function (amount) {
      var years = _this.state.yearsList.map(function (year) {
        return year + amount;
      });

      _this.setState({
        yearsList: years
      });
    };

    _this.incrementYears = function () {
      return _this.shiftYears(1);
    };

    _this.decrementYears = function () {
      return _this.shiftYears(-1);
    };

    _this.state = {
      yearsList: _this.props.scrollableYearDropdown ? generateYears(_this.props.year, 10) : generateYears(_this.props.year, 5)
    };
    return _this;
  }

  _createClass(YearDropdownOptions, [{
    key: 'render',
    value: function render() {
      var dropdownClass = (0, _classnames2.default)({
        'react-datepicker__year-dropdown': true,
        'react-datepicker__year-dropdown--scrollable': this.props.scrollableYearDropdown
      });

      return _react2.default.createElement(
        'div',
        { className: dropdownClass },
        this.renderOptions()
      );
    }
  }]);

  return YearDropdownOptions;
}(_react2.default.Component);

YearDropdownOptions.propTypes = {
  onCancel: _propTypes2.default.func.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  scrollableYearDropdown: _propTypes2.default.bool,
  year: _propTypes2.default.number.isRequired
};
exports.default = YearDropdownOptions;
