import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import {
  renderCheckbox,
  renderDateField,
  renderSelectField,
  renderTextArea,
} from "../../../common/dynamicFields";
import DatePicker from "../../../common/datePicker";
import moment from "moment";
export default class InitialTreatment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "treatment_type": null,
      "stem_cell_transplant_date": null,
      "start_date": null,
      final_obj: this.props.finalObj,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(),
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleInitialChange = this.handleInitialChange.bind(this);
    this.validateTreatments = this.validateTreatments.bind(this);
  }
  componentDidMount() {
  }

  // go to next step
  onContinue() {
    console.log("continue clicked");
  }
  // clicked on back button
  backToTreatment() {
    browserHistory.push("/treatments-outcomes");
  }

  handleInitialChange(e, type) {
    this.setState({ treatment_type: type, start_date: null }, () => {
      this.validateTreatments();
    });
  }

  handleDateChange(date, error, field) {
    if (date && field === "start") {
      this.setState({ start_date: date }, () => {
        this.validateTreatments();
      });
    }
    if (date && field === "end") {
      this.setState({ end_date: date }, () => {
        this.validateTreatments();
      });
    }
    // call function to validate the treatments
  }

  // check all the component fields
  validateTreatments() {
    let isValid = true;
    let counter = 0;
    let errObj = {
      start_date: null,
      end_date: null,
      treament_type: null,
    };
    if (!this.state.start_date) {
      isValid = false;
      errObj.start_date = "Valid Start Date.";
      // set start error here
    }
    if (!this.state.treatment_type) {
      isValid = false;
      errObj.treatment_type = "Please select any one treatment type.";
      // set start error here
    }
    if (!this.state.end_date && this.state.treatment_type && this.state.treatment_type !== "Stem Cell Transplant") {
      isValid = false;
      errObj.end_date = "Either Valid End Date.";
      // set end date here
    }

    let obj = (this.state.final_obj) ? this.state.final_obj : {};
    obj.start_date = this.state.start_date,
    obj.end_date = this.state.end_date,
    obj.treatment_type = this.state.treatment_type;

    this.props.check_validations(isValid, errObj, obj);
  }

  render() {
    return (
      <div className="new-treatment-workflow">
        {/* <div className="myeloma_content">
          <label>There are many different types of treatments for multiple myeloma. We are going to ask you about the treatments you have received. </label>
          <label>This information is very important becuase it allows us to show you a personalized plan of treatment options.</label>
          <label>You will enter treatments for a specific date range in the order you received them. When you are done, it will look something like this:</label>
        </div> */}
        {/* Start form here */}
        <div className="form-group">
          <div className="new-ques-div">
            <div className="col-md-12 col-lg-12 new-blue-treatment">
            </div>
            <div className="col-md-12 col-lg-12">
              <div className="treat-pad-bot">
                <span className="new-treatment-label-group">What was the first myeloma treatment you received? </span>
              </div>
              <div>
                <div className="radio">
                  <label>
                    <input type="radio" tabIndex = {1} name="stem_cell_transplant" value= "Stem Cell Transplant" checked = {(this.state.treatment_type === "Stem Cell Transplant")} onClick={(e) => this.handleInitialChange(e, "Stem Cell Transplant")}/>
                    <span className="new-treatment-label">Stem Cell Transplant</span>
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" tabIndex = {2} name="chemotherapy" value= "Chemotherapy or other Myeloma Treatment" checked = {(this.state.treatment_type) === "Chemotherapy or other Myeloma Treatment"} onClick={(e) => this.handleInitialChange(e, "Chemotherapy or other Myeloma Treatment")}/>
                    <span className="new-treatment-label">Chemotherapy or other Myeloma Treatment</span>
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" tabIndex = {3} name="stem_cell_transplant" value= "Radiation" checked = {(this.state.treatment_type) === "Radiation"} onClick={(e) => this.handleInitialChange(e, "Radiation")}/>
                    <span className="new-treatment-label">Radiation</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {this.state.treatment_type && this.state.treatment_type === "Stem Cell Transplant" && <div className="col-md-4 col-lg-3">
            <div className="treat-pad-bot">
              <span className="new-treatment-label-group"> Start Date </span>
            </div>
            <div>
              <DatePicker
                name="start_date"
                type="text"
                placeholder="MM/YYYY"
                className="form-control date_picker"
                selected={this.state.start_date}
                onDateChange={(date, error) => this.handleDateChange(date, error, "start")}
                dateFormat = "MM/YYYY"
                // maxDate={this.state.maxDate}
                showYearFlag={true}
                showMonthFlag={true}
                maxDate={this.state.end_date ? moment(this.state.end_date) : this.state.maxDate}
                minDate={this.state.minDate}
                tabIndex={1}
              />
            </div>
          </div>}
        </div>
        {/* If treatment type is Stem Cell Transplant */}

        <div className="form-group">
          <div className="col-sm-12 text-center">
            {this.state.treatment_type && <button onClick={this.onContinue} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>}
            <button onClick={this.backToTreatment} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Quit</button>
          </div>
        </div>
      </div>

    );
  }
}
