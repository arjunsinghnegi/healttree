import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "./react-datepicker";
import MaskedInput from "react-maskedinput";
import moment from "moment";


class CustomDatePicker extends Component {
  constructor(props) {
    super(props);
    console.log("<<<dateFormat%%%%%%%%", props.dateFormat);
    let dateFormat = props.dateFormat ? props.dateFormat : "MM/DD/YYYY";
    this.state = {
      selectedDate: props.selected || "",
      dateError: null,
      minDate: props.minDate,
      maxDate: props.maxDate,
      showDatePicker: true,
      dateFormat: dateFormat,
      inputDate: (props.selected) ? (props.selected).format(dateFormat) : "",
    };

    // list of function that are being used in the component
    this.customInput = this.customInput.bind(this);
    this.dateChanged = this.dateChanged.bind(this);
    this._onChange = this._onChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      this.setState({ selectedDate: (nextProps.selected) ? (nextProps.selected) : "",
        inputDate: (nextProps.selected) ? (nextProps.selected).format(this.state.formatDate) : "",
        minDate: nextProps.minDate,
        maxDate: nextProps.maxDate,
      });
    }
  }
  onFocus(e) {
    e.preventDefault();
    // this.setState({ showDatePicker: true });
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ showDatePicker: false });
  }
  customInput() {
    return (
      <div>
        <MaskedInput tabIndex={this.props.tabIndex} type="text" mask="11/1111" name="card" size="20" onChange={this._onChange} value={this.state.inputDate} placeholder={this.state.dateFormat} className={this.props.className}/>
        {/* <div className="fa-div">
          <i className="date-picker-icon fa fa-calendar fa-2x" aria-hidden="true"></i>
        </div> */}
      </div>
    );
  }
  dateChanged(e) {
    this.setState({ selectedDate: e, inputDate: e.format(this.state.dateFormat) }, function() {
      this.props.onDateChange(e);
    });

  }

  _onChange(e) {
    let rawDate = e.target.value;
    console.log("rawData%%%%%%%%%", rawDate);
    this._calendar.setOpen(false);
    let isValid = moment(rawDate, "MM/DD/YYYY").format("MM/DD/YYYY") === rawDate;
    if (isValid) {
      let dob = moment(rawDate, "MM/DD/YYYY").format("MM/DD/YYYY");
      if (dob === "Invalid Date") {
        this.setState({ dateError: "Please enter valid date format." });
        return;
      }
      // check if date is not less that minDate
      let isAfterMinDate = moment(dob, "MM/DD/YYYY").isAfter(this.state.minDate);
      if (isAfterMinDate) {
        let isBeforeMaxDate = moment(dob, "MM/DD/YYYY").isBefore(this.state.maxDate);
        if (isBeforeMaxDate) {
          // start functionality here
          this.setState({ dateError: null });
          this.setState({ inputDate: dob, selectedDate: moment(rawDate, "MM/DD/YYYY") }, function() {
            this.props.onDateChange(moment(dob, "MM/DD/YYYY"));
            this._calendar.setOpen(true);
          });
        } else {
          // this.setState({ dateError: "Please enter valid date of birth." });
          this.props.onDateChange(null, "Date should not be greater than " + this.state.maxDate.format("MM/DD/YYYY") + ".");
          return;
        }
      } else {
        // this.setState({ dateError: "Please enter valid date of birth." });
        this.props.onDateChange(null, "Date should not be less than " + this.state.minDate.format("MM/DD/YYYY") + ".");
        return;
      }
    } else {
      // this.setState({ dateError: "Please enter valid date format (MM/DD/YYYY)." });
      this.props.onDateChange(null, "Please enter valid date format (MM/DD/YYYY).");
    }
  }
  render() {
    return (
      <div className="date-picker-icon-div">
        <DatePicker
          customInput={this.customInput()}
          ref={(c) => this._calendar = c}
          selected={this.state.selectedDate}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          onChange={(e) => this.dateChanged(e)}
          placeholderText={this.props.placeholder}
          dateFormat={this.state.dateFormat}
          showYearDropdown={true}
          scrollableYearDropdown={true}
          isRequired={true}
          yearDropdownItemNumber={15}
          // showYearDropdown={this.props.showYearFlag ? true : false }
          // readOnly = {this.props.readOnly || false}
          showMonthDropdown={this.props.showMonthFlag ? true : false}
        />
      </div>
    );
  }
}
export default connect(null, null)(CustomDatePicker);
