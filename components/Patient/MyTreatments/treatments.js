
import { Field, reduxForm } from "redux-form";
import React, { Component } from "react";
import {
  renderCheckbox,
  renderDateField,
  renderSelectField,
  renderTextArea,
} from "../../common/dynamicFields";
import Autocomplete from "react-google-autocomplete";
import { connect } from "react-redux";
import DatePicker from "../../common/datePicker";
import InfoIcon from "../../../assets/images/info_blue.png";
import moment from "moment";
import ReactTooltip from "react-tooltip";

class Treatments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treatmentsArr: props.defaultData.treatmentsArr,
      treatmentTypeArr: props.defaultData.treatmentTypeArr,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(), // max date in datepicker
      start_date: (props.defaultData.start_date) ? moment(props.defaultData.start_date, "MM/DD/YYYY") : null,
      end_date: (props.defaultData.end_date) ? moment(props.defaultData.end_date, "MM/DD/YYYY") : null,
      current_treatment: props.defaultData.current_treatment,
      treatment_type: props.defaultData.treatment_type,
    };
    // bind all the functions to be used
    this.showTreatments = this.showTreatments.bind(this);
    this.renderTreatmentOptions = this.renderTreatmentOptions.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.validateTreatments = this.validateTreatments.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.changeConditionStatus = this.changeConditionStatus.bind(this);
    this.detectSpacePresent = this.detectSpacePresent.bind(this);
    this.handleTreatmentTypeChange = this.handleTreatmentTypeChange.bind(this);
    this.tabIndex = 4;
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    this.validateTreatments();
    this.props.getTabindex(this.tabIndex);
  }


  // detect condition change
  detectSpacePresent(e, field) {
    if (e.keyCode == 32) {
      e.preventDefault();
      if (field === "currentTreatment") {
        this.setState({ current_treatment: !this.state.current_treatment });
      }
    }
  }
  // render treatments
  showTreatments() {
    let treatmentArr = [];
    this.tabIndex = 4;
    this.state.treatmentsArr.map(function(obj, key) {
      treatmentArr.push(<div className="col-md-4" key={key}>
        <div className="treatment-group">
          <span className="treatment-label-group">{obj.label}</span>
          {/* <span className="treatmentGroupClear" onClick={(e) => this.clearGroup(e, key)}>
            <i className="fa fa-times" aria-hidden="true"></i> Clear
          </span> */}
        </div>
        {this.renderTreatmentOptions(obj, key, this.tabIndex)}
      </div>);
    }, this);
    return treatmentArr;
  }
  // treatment options
  renderTreatmentOptions(arr, parentKey, tabIndex) {
    let options = [];
    arr.treatments.map(function(obj, key) {
      tabIndex = tabIndex + 1;
      options.push(
        <div className="radio" key={key}>
          <label>
            <input type="checkbox" tabIndex = {tabIndex} name={arr.value} value={obj.value} checked = {obj.checked} onClick={(e) => this.handleOptionChange(e, parentKey, key)}/>
            <span className="treatmentLabel"> {obj.label} </span>
          </label>
          {obj.label === "Other" && obj.checked && <Field
            name={parentKey + "_" + key + "_" + obj.label}
            defaultValue={obj.otherTxt}
            component={renderTextArea}
            placeholder="Kindly mention any other treatment. "
            onChange={(e) => this.handleTextChange(e, parentKey, arr)}
            className="form-control treatment-textarea"
            rows="5"
            maxLength={1000}/>}
        </div>
      );
    }, this);
    this.tabIndex = tabIndex;
    return options;
  }

  // handle change in text area
  handleTextChange(e, parentKey, arr) {
    let tmpTreatmentArr = this.state.treatmentsArr;
    tmpTreatmentArr[parentKey].treatments.map(function(obj, key) {
      if (obj.label === "Other" && obj.checked) {
        let tmpObj = tmpTreatmentArr[parentKey].treatments[key];
        tmpObj.otherTxt = e.target.value;
        tmpTreatmentArr[parentKey].treatments[key] = tmpObj;
        this.validateTreatments();
      }
    }, this);
    this.setState({ treatmentsArr: tmpTreatmentArr });
  }
  // treatment type options

  renderTreatmentTypeOptions(tabIndex) {
    let options = [];
    this.state.treatmentTypeArr.map(function(obj, key) {
      tabIndex = tabIndex + 1;
      let checked = false;
      if (this.state.treatment_type && obj.label === this.state.treatment_type) {
        checked = true;
      }
      options.push(
        <div className="radio treatment-type-radio" key={key}>
          <label>
            <input type="radio" tabIndex = {tabIndex} name={obj.value} value={obj.value} checked = {checked} onClick={(e) => this.handleTreatmentTypeChange(e, obj, key)}/>
            <span className="treatmentLabel"> {obj.label}
            </span>
            {obj.infoText && obj.infoText.length && <span><img src={InfoIcon} data-tip data-for= {obj.infoText}/></span>}
            {obj.infoText && obj.infoText.length && <ReactTooltip place="right" type="info" effect="solid" id={obj.infoText}> <p className="tooltip-p">{obj.infoText}</p></ReactTooltip>}
          </label>
        </div>
      );
    }, this);
    this.tabIndex = tabIndex;
    return options;
  }
  // handle change event
  handleOptionChange(changeEvent, parentKey, key) {
    this.setState({ serverErr: null });
    let selectedVal = changeEvent.target.value;
    let tmpTreatmentArr = this.state.treatmentsArr;
    tmpTreatmentArr[parentKey].treatments.map(function(obj, key) {
      let tmpObj = tmpTreatmentArr[parentKey].treatments[key];
      if (obj.value === selectedVal) {
        tmpObj.checked = !tmpObj.checked;
        tmpObj.isResistant = false;
        // reset the value of the text area
        if (obj.value === "Other") {
          tmpObj.otherTxt = null;
        }
      }


      // else {
      //   tmpObj.checked = false;
      // }
      tmpObj.isResistant = (tmpObj.isResistant && tmpObj.checked) ? tmpObj.isResistant : false;
      tmpTreatmentArr[parentKey].treatments[key] = tmpObj;
    });
    // call function to validate the treatments
    // this.validateTreatments();
    this.setState({ treatmentsArr: tmpTreatmentArr }, function() {
      // call function to validate the treatments
      this.validateTreatments();
    });
  }

  // handle change in treatment type
  handleTreatmentTypeChange(changeEvent, changedObj, changeKey) {
    let tmpTreatmentTypeArr = this.state.treatmentTypeArr;
    tmpTreatmentTypeArr.map(function(obj, key) {
      tmpTreatmentTypeArr[key].checked = false;
      if (parseInt(key) === parseInt(changeKey)) {
        tmpTreatmentTypeArr[key].checked = true;
      }

    });
    // // call function to validate the treatments
    // // this.validateTreatments();
    this.setState({ tmpTreatmentTypeArr: tmpTreatmentTypeArr, treatment_type: changedObj.label }, function() {
      // call function to validate the treatments and create treatment object
      this.validateTreatments();
    });
  }
  // check for errors
  validateTreatments() {
    let isValid = true;
    let counter = 0;
    let otherTxtCounter = 0;
    let errObj = {
      start_date: null,
      end_date: null,
      treament: null,
    };
    this.state.treatmentsArr.map(function(parentObj, parentKey) {
      parentObj.treatments.map(function(obj, key) {
        if (obj.checked) {
          counter += 1;
        }
        obj.otherTxt = (obj.otherTxt && obj.otherTxt.trim()) ? obj.otherTxt.trim() : null;

        if (obj.label === "Other" && obj.checked && !obj.otherTxt) {
          otherTxtCounter += 1;
        }
      });
    });

    if (otherTxtCounter) {
      isValid = false;
      errObj.otherTxt = "Kindly mention other treatment.";
    }
    if (!counter) {
      isValid = false;
      errObj.treament = "At least one treatment selected.";
    }
    if (!this.state.start_date) {
      isValid = false;
      errObj.start_date = "Valid Start Date.";
      // set start error here
    }
    if (!this.state.treatment_type) {
      isValid = false;
      errObj.treatment_type = "Please select treatment type.";
      // set start error here
    }
    if (!this.state.current_treatment && !this.state.end_date) {
      isValid = false;
      errObj.end_date = "Either Valid End Date or Current Treatment.";
      // set end date here
    }
    let obj = {
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      current_treatment: this.state.current_treatment,
      treatment_type: this.state.treatment_type,
      treatmentsArr: this.state.treatmentsArr,
      treatment_type: this.state.treatment_type,
    };
    this.props.check_validations(isValid, errObj, obj);
    // 
  }

  // handle date change
  handleDateChange(date, error, field) {
    if (date && field === "start") {
      this.setState({ start_date: date }, function() {
        this.validateTreatments();
      });
    }
    if (date && field === "end") {
      this.setState({ end_date: date }, function() {
        this.validateTreatments();
      });
    }
    // call function to validate the treatments

  }


  changeConditionStatus(e, value) {
    e.preventDefault();
    if (value) {
      this.setState({ end_date: null, current_treatment: value }, function() {
        this.validateTreatments();
      });
    } else {
      this.setState({ current_treatment: value }, function() {
        this.validateTreatments();
      });
    }
  }

  changeMaintenanceStatus(e, value) {
    e.preventDefault();
    this.setState({ treatment_type: value }, function() {
      this.validateTreatments();
    });

  }
  render() {
    return (
      <div className="container">
        <div className="row add-treatment custom-tretement">
          <div className="col-md-12 col-lg-12 add-treatment-text">
            <p>Please enter the treatments you have received during a specific time period. You can add a single treatment (like stem cell transplant) or a combination of treatments (like Revlimid, Velcade and Dex).</p>
            <p>If you dropped a treatment in the combination during this time, we will ask you later about which treatment was dropped and when.</p>
          </div>
          <div className="col-md-12 col-lg-12">
            <span className="treatment-label-group">Please tell us which type of treatment this is:</span>
          </div>
          <div className="col-md-12 col-lg-12 treatment-type-complete">
            {this.renderTreatmentTypeOptions(this.tabIndex)}
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="treat-pad-bot">
              <span className="treatment-label-group"> Start Date </span>
            </div>
            <div>
              <DatePicker
                name="start_date"
                type="text"
                placeholder="MM/DD/YYYY"
                className="form-control date_picker"
                selected={this.state.start_date}
                onDateChange={(date, error) => this.handleDateChange(date, error, "start")}
                // maxDate={this.state.maxDate}
                showYearFlag={true}
                showMonthFlag={true}
                maxDate={this.state.end_date ? moment(this.state.end_date) : this.state.maxDate}
                minDate={this.state.minDate}
                tabIndex={1}
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="treat-pad-bot">
              <span className="treatment-label-group"> End Date </span>
            </div>
            <div>
              {!this.state.current_treatment && <DatePicker
                name="end_date"
                type="text"
                placeholder="MM/DD/YYYY"
                className="form-control date_picker"
                selected={this.state.end_date}
                minDate = {this.state.start_date ? moment(this.state.start_date) : this.state.minDate}
                maxDate={this.state.maxDate}
                onDateChange={(date, error) => this.handleDateChange(date, error, "end")}
                showYearFlag={true}
                tabIndex={2}
                showMonthFlag={true} />}
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="treat-pad-bot">
              <span className="treatment-label-group"> I am still on this treatment.</span>
            </div>
            <div>
              <div>
                <div onKeyDown={(e) => this.detectSpacePresent(e, "currentTreatment")} tabIndex={3} className="btn-group toggle-switch" id="status" data-toggle="buttons">
                  <label className={this.state.current_treatment ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => this.changeConditionStatus(e, true) }>
                    <Field
                      name="heart_condition[module_id][status]"
                      component="input"
                      type="radio"
                      value="Yes"
                      checked={!this.state.current_treatment}
                    />
                  Yes
                  </label>
                  <label className={!this.state.current_treatment ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => this.changeConditionStatus(e, false) }>
                    <Field
                      name="fish_test_performed[module_id][status]"
                      component="input"
                      type="radio"
                      value="No"
                      checked={this.state.current_treatment}
                    />
                  No
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-md-6 col-lg-3">
            <div className="treat-pad-bot">
              <span className="treatment-label-group"> It is a maintenance therapy.</span>
            </div>
            <div>
              <div>
                <div onKeyDown={(e) => this.detectSpacePresent(e, "maintenanceTherapy")} tabIndex={4} className="btn-group toggle-switch" id="status" data-toggle="buttons">
                  <label className={this.state.treatment_type ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => this.changeMaintenanceStatus(e, true) }>
                    <Field
                      name="heart_condition[module_id][status]"
                      component="input"
                      type="radio"
                      value="Yes"
                      checked={!this.state.is_maintenance_therapy}
                    />
                  Yes
                  </label>
                  <label className={!this.state.is_maintenance_therapy ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => this.changeMaintenanceStatus(e, false) }>
                    <Field
                      name="fish_test_performed[module_id][status]"
                      component="input"
                      type="radio"
                      value="No"
                      checked={this.state.is_maintenance_therapy}
                    />
                  No
                  </label>
                </div> 
              </div>
            </div>
          </div> */}
        </div>

        <div className="row">
          <span className="treatment-label-group">Treatment Groups</span>
        </div>
        <div className="row">
          {this.showTreatments()}
        </div>
      </div>
    );
  }
}
export default connect(null, null)(Treatments);
