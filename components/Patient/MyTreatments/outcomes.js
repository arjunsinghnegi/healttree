import { Field, reduxForm } from "redux-form";
import React, { Component } from "react";
// import {
//   renderCheckbox,
//   renderDateField,
// } from "../renderFields";
import { renderCheckbox, renderDateField, renderSelectField, renderTextArea } from "../../common/dynamicFields";
import { connect } from "react-redux";
import DatePicker from "../../common/datePicker";
import InfoIcon from "../../../assets/images/info_blue.png";
import moment from "moment";
import ReactTooltip from "react-tooltip";

class Outcomes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outcomeArr: props.defaultData.outcomeArr,
      treatmentsArr: props.treatmentsArr,
      start_date: props.start_date,
      end_date: props.end_date,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(), // max date in datepicker
    };

    this.listResistent = this.listResistent.bind(this);
    this.showOutcomes = this.showOutcomes.bind(this);
    this.handleOutcomeOptionChange = this.handleOutcomeOptionChange.bind(this);
    this.handleSubOutcomeOptionChange = this.handleSubOutcomeOptionChange.bind(this);
    this.handleResistantChange = this.handleResistantChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.tabIndex = 0;
  }

  componentDidMount() {
    this.props.getTabindex(this.tabIndex);
  }
  // show outcomes
  showOutcomes() {
    let outcomeArr = [];
    this.tabIndex = 0;
    let tabIndex = parseInt(this.tabIndex);

    this.state.outcomeArr.map(function(obj, key) {
      tabIndex = tabIndex + 1;
      outcomeArr.push(
        <div className="radio" key={key}>
          <label>
            <input tabIndex = {tabIndex} type="radio" name= "outcome" value={obj.value} checked = {obj.checked} onClick={(e) => this.handleOutcomeOptionChange(e, key)}/>
            <span className="treatmentLabel"> {obj.label} </span>
          </label>
          {/* render child suboptions */}
          {
            obj.checked && obj.subOptions && obj.subOptions.length > 0 && <div className="col-md-12 clearBoth outcome_padding">
              <span className="treatment-label-group">
                {obj.subOptionsText}
              </span>
              {obj.inputType === "radio" && this.renderSubOptions(obj)}
              {obj.inputType === "checkbox" && this.renderCheckSubOptions(obj)}
            </div>
          }
          {/* {obj.subOptions && obj.subOptions.length > 0 && this.renderSubOptions(obj)} */}
        </div>);
    }, this);
    this.tabIndex = tabIndex;
    return outcomeArr;
  }
  // handle text change
  handleTextChange(changeEvent, key, parentArr, currObj) {
    let selectedVal = changeEvent.target.value;
    let tmpOutcomeArr = this.state.outcomeArr;

    tmpOutcomeArr.map(function(obj, parentkey) {
      if (obj.value === parentArr.value && parentArr.subOptions.length) {
        let tmpObj = obj;
        let tmpArr = [];
        obj.subOptions.map((suboption, k) => {
          if (currObj.label === "Other" && suboption.value === parseInt(currObj.value)) {
            suboption.data = selectedVal;
          }
          // if (parentArr.inputType === "radio" || currObj.label === "Other") {
          //   if (suboption.value === parseInt(selectedVal)) {
          //     suboption.checked = !suboption.checked;
          //   } else {
          //     suboption.checked = false;
          //   }
          // } else {
          //   if (suboption.label === "Other") {
          //     suboption.checked = false;
          //   }
          //   if (suboption.value === parseInt(selectedVal)) {
          //     suboption.checked = !suboption.checked;
          //   }
          // }
          // suboption.data = null;
          tmpArr.push(suboption);
        });
        tmpObj.subOptions = tmpArr;
        tmpOutcomeArr[parentkey] = tmpObj;
      }
    });
    this.setState({ outcomeArr: tmpOutcomeArr });
    this.props.check_outcomes(tmpOutcomeArr);
  }
  // render outcome child sub options
  renderSubOptions(parentArr) {
    let suboptionsArr = [];
    parentArr.subOptions.map((options, key) => {
      suboptionsArr.push(
        <div className="radio" key={parentArr.id + "_" + key}>
          <label>
            <input type="radio" name= {"subOption_" + parentArr.id } value={options.value} checked = {options.checked} onClick={(e) => this.handleSubOutcomeOptionChange(e, key, parentArr, options)}/>
            <span className="treatmentLabel"> {options.label} </span>
            {options.infoText && options.infoText.length && <span><img src={InfoIcon} data-tip data-for= {options.infoText}/></span>}
            {options.infoText && options.infoText.length && <ReactTooltip place="right" type="info" effect="solid" id={options.infoText}> <p className="tooltip-p">{options.infoText}</p></ReactTooltip>}
          </label>
          {options.label === "Other" && options.checked && <Field
            name={parentArr.id + "_" + key}
            defaultValue={(options.data) ? (options.data) : null}
            component={renderTextArea}
            placeholder="Specify other reasons"
            onBlur={(e) => this.handleTextChange(e, parentArr, options)}
            className="form-control treatment-textarea"
            rows="5"
            maxLength={255}/>
          }
        </div>
      );
    });
    return suboptionsArr;
  }
  renderCheckSubOptions(parentArr) {
    let suboptionsArr = [];
    parentArr.subOptions.map((options, key) => {
      suboptionsArr.push(
        <div className="radio" key={parentArr.id + "_" + key}>
          <label>
            <input type="checkbox" name= {"subOption_" + parentArr.id } value={options.value} checked = {options.checked} onClick={(e) => this.handleSubOutcomeOptionChange(e, key, parentArr, options)}/>
            <span className="treatmentLabel"> {options.label} </span>
            {options.infoText && options.infoText.length && <span><img data-tip src={InfoIcon} data-for= {options.infoText}/></span>}
            {options.infoText && options.infoText.length && <ReactTooltip place="right" type="info" effect="solid" id={options.infoText}> <p className="tooltip-p">{options.infoText}</p></ReactTooltip>}
          </label>
          {options.label === "Other" && options.checked && <Field
            name={parentArr.id + "_" + key}
            defaultValue={(options.data) ? (options.data) : null}
            component={renderTextArea}
            placeholder="Specify reason"
            onBlur={(e) => this.handleTextChange(e, key, parentArr, options)}
            className="form-control treatment-textarea"
            rows="5"
            maxLength={300}/>
          }
        </div>
      );
    });
    return suboptionsArr;
  }

  // list resistent
  listResistent() {
    let resistantArr = [];
    let tabIndex = parseInt(this.tabIndex);
    let start_date = this.state.start_date.format("MM/DD/YYYY");
    let end_date = (this.state.end_date) ? this.state.end_date.format("MM/DD/YYYY") : moment();
    this.state.treatmentsArr.map(function(parentobj, k) {
      parentobj.treatments.map(function(obj, key) {
        if (!obj.checked) {
          return;
        }
        tabIndex = tabIndex + 1;
        resistantArr.push(
          <tr key={k + "k" + key}>
            <td className="outcomeTbl">{obj.label}</td>
            {/* <td>{start_date}</td> */}
            <td className="outcomeTbl"> <div className="col-sm-8 col-md-8 col-lg-12 "><DatePicker
              name="start_date"
              type="text"
              placeholder="MM/DD/YYYY"
              className="form-control date_picker"
              selected={obj.stoppedDate ? moment(obj.stoppedDate, "MM/DD/YYYY") : null}
              onDateChange={(date, error) => this.handleDateChange(date, error, k, key)}
              maxDate={this.state.maxDate}
              showYearFlag={true}
              showMonthFlag={true}
              maxDate={end_date ? moment(end_date) : this.state.maxDate}
              minDate={start_date}
              tabIndex={1}
            />
            </div></td>
            <td className="outcomeTbl">
              <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-12">
                <Field
                  name="initial_diagnosis"
                  options={[
                    { value: "Drug not working", label: "Drug not working" },
                    { value: "Intollerable side effects", label: "Intollerable side effects" }]}
                  placeholderText="Select Option"
                  tabIndex={"5"}
                  defaultValue = {obj.stoppedReason}
                  onChange = {(selected) => this.handleResistantChange(selected, k, key)}
                  component={renderSelectField} />
              </div>
              {/* <div tabIndex = {tabIndex} className="btn-group toggle-switch custom-toggle-switch" id="status" data-toggle="buttons">
                <label className={obj.isResistant ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => this.handleResistantChange(e, k, key, true) }>
                  <Field
                    name="heart_condition[module_id][status]"
                    component="input"
                    type="radio"
                    value="Yes"
                    checked={!obj.isResistant}
                  /> Yes </label>
                <label className={!obj.isResistant ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => this.handleResistantChange(e, k, key, false) }>
                  <Field
                    name="fish_test_performed[module_id][status]"
                    component="input"
                    type="radio"
                    value="No"
                    checked={obj.isResistant}
                  />No</label>
              </div> */}
            </td>
          </tr>
        );
      }, this);
    }, this);
    this.tabIndex = tabIndex;
    return resistantArr;
  }

  // handle change event
  handleOutcomeOptionChange(changeEvent, key) {
    // this.setState({ serverErr: null });
    let selectedVal = changeEvent.target.value;
    let tmpOutcomeArr = this.state.outcomeArr;
    tmpOutcomeArr.map(function(obj, key) {
      let tmpObj = obj;
      if (obj.value === parseInt(selectedVal)) {
        tmpObj.checked = !tmpObj.checked;
      } else {
        tmpObj.checked = false;
      }
      if (obj.subOptions && obj.subOptions.length) {
        let tmpSubArr = [];
        obj.subOptions.map((suboption, subkey) => {
          suboption.checked = false;
          tmpSubArr.push(suboption);
        });
        tmpObj.subOptions = tmpSubArr;
      }
      tmpOutcomeArr[key] = tmpObj;
    });
    this.setState({ outcomeArr: tmpOutcomeArr });
    this.props.check_outcomes(tmpOutcomeArr);
  }

  handleSubOutcomeOptionChange(changeEvent, key, parentArr, currObj) {
    let selectedVal = changeEvent.target.value;
    let tmpOutcomeArr = this.state.outcomeArr;
    tmpOutcomeArr.map(function(obj, parentkey) {
      if (obj.value === parentArr.value && parentArr.subOptions.length) {
        let tmpObj = obj;
        let tmpArr = [];
        obj.subOptions.map((suboption, k) => {
          if (parentArr.inputType === "radio") {
            if (suboption.value === parseInt(selectedVal)) {
              suboption.checked = !suboption.checked;
            } else {
              suboption.checked = false;
            }
          } else {
            // if (suboption.label === "Other") {
            //   suboption.checked = false;
            // }
            if (suboption.value === parseInt(selectedVal)) {
              suboption.checked = !suboption.checked;
              if (suboption.label === "Other") {
                suboption.data = null;
              }
            }
          }
          tmpArr.push(suboption);
        });
        tmpObj.subOptions = tmpArr;
        tmpOutcomeArr[parentkey] = tmpObj;
      }
    });
    this.setState({ outcomeArr: tmpOutcomeArr });
    this.props.check_outcomes(tmpOutcomeArr);
  }

  // handleResistantChange
  handleResistantChange(selectedVal, parentKey, key) {
    this.setState({ serverErr: null });

    let tmpTreatmentArr = this.state.treatmentsArr;
    let tmpObj = tmpTreatmentArr[parentKey].treatments[key];

    tmpObj.stoppedReason = (selectedVal.value) ? selectedVal.value : null;
    // tmpObj.isResistant = value;
    tmpTreatmentArr[parentKey].treatments[key] = tmpObj;
    this.setState({ treatmentsArr: tmpTreatmentArr });
    this.props.check_resistant(tmpTreatmentArr);
  }

  // handle date change for resistant
  handleDateChange(date, error, parentKey, key) {
    let tmpTreatmentArr = this.state.treatmentsArr;
    let tmpObj = tmpTreatmentArr[parentKey].treatments[key];
    tmpObj.stoppedDate = (date) ? date.format("MM/DD/YYYY") : null;
    tmpTreatmentArr[parentKey].treatments[key] = tmpObj;
    this.setState({ treatmentsArr: tmpTreatmentArr });
    this.props.check_resistant(tmpTreatmentArr);
  }


  render() {
    return (
      <div className="container">
        <div className="row add-treatment">
          <div className="col-md-10">
            <div className="col-md-12 clearBoth">
              <span className="treatment-label-group outcome-ques">What was your best response to this treatment/combination?</span>
              {/* <span className="treatmentGroupClear" onClick={(e) => this.clearOutcome(e)}><i className="fa fa-times" aria-hidden="true"></i> Clear</span>  */}
            </div>
            {/* start outcome options here */}
            <div className="col-md-12 clearBoth">
              {this.showOutcomes()}
            </div>
          </div>
          <div className="col-md-10 padding-top-20">
            <div className="col-md-12">
              <span className="treatment-label-group outcome-ques">Did your physician stop any of the individual drugs in this combination during treatment?</span>
            </div>
            {/* start outcome options here */}
            <div className="col-md-12">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th width="250" className="outcomeTbl">Treatment</th>
                    {/* <th>Start Date</th> */}
                    <th width="200" className="outcomeTbl">Date Stopped</th>
                    <th className="outcomeTbl">Reason Stopped</th>
                  </tr>
                </thead>
                <tbody>
                  {this.listResistent()}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(null, null)(Outcomes);
