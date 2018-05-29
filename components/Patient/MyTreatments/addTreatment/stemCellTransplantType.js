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
export default class StemCellTransPlantType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "stem_cell_treatment_type": null,
      final_obj: this.props.finalObj,
    };
    this.handleStemCellTypeChange = this.handleStemCellTypeChange.bind(this);
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

  handleStemCellTypeChange(e, type) {
    this.setState({ stem_cell_treatment_type: type }, () => {
      this.validateTreatments();
    });
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
      <div className="treatment">
        <div className="myeloma_content">
          <label>There are two types of stem cell transplants. The first one is called an Autologous transplant, sometimes referred to an AUTO transplant. An AUTO transplant is when you get your own stem cells. If you have more than one transplant scheduled within 3 months it is called a tandam, autologous transplant. </label>
          <label>The second type is called an Allogeneic transplant, sometimes referred to an ALLO transplant. An ALLO transplant is when you get another person's stem cells. Stem cells that are donated by a family memeber is a form of an ALLO transplant called a Haploidnetical or HAPLO allogeniec stem cell transplant. </label>
          <label>There is a reduced intensity ALLO transplant, which uses milder doeses of chemotherapy, sometimes referred to a MINI.</label>
        </div>
        {/* Start form here */}
        <div className="form-group">
          <div className="col-md-12 col-lg-12">
            <div className="treat-pad-bot">
              <span className="treatment-label-group">Which type os stem cell transplant did you receive? </span>
            </div>
            <div>
              <div className="radio">
                <label>
                  <input type="radio" tabIndex = {1} name="auto_stem_cell_transplant" value= "Autologous (AUTO) Stem Cell Transplant" checked = {(this.state.treatment_type === "Autologous (AUTO) Stem Cell Transplant")} onClick={(e) => this.handleStemCellTypeChange(e, "Autologous (AUTO) Stem Cell Transplant")}/>
                  <span className="treatmentLabel">Autologous (AUTO) Stem Cell Transplant</span>
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" tabIndex = {1} name="stem_cell_transplant" value= "Tandem autologous (AUTO) Stem Cell Transplant" checked = {(this.state.treatment_type === "Tandem autologous (AUTO) Stem Cell Transplant")} onClick={(e) => this.handleStemCellTypeChange(e, "Tandem autologous (AUTO) Stem Cell Transplant")}/>
                  <span className="treatmentLabel">Tandem autologous (AUTO) Stem Cell Transplant</span>
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" tabIndex = {1} name="stem_cell_transplant" value= "Allogeneic (ALLO) Stem Cell Transplant" checked = {(this.state.treatment_type === "Allogeneic (ALLO) Stem Cell Transplant")} onClick={(e) => this.handleStemCellTypeChange(e, "Allogeneic (ALLO) Stem Cell Transplant")}/>
                  <span className="treatmentLabel">Allogeneic (ALLO) Stem Cell Transplant</span>
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" tabIndex = {1} name="stem_cell_transplant" value= "Haploidnetical (HAPLO) Allogeneic Stem Cell Transplant" checked = {(this.state.treatment_type === "Haploidnetical (HAPLO) Allogeneic Stem Cell Transplant")} onClick={(e) => this.handleStemCellTypeChange(e, "Haploidnetical (HAPLO) Allogeneic Stem Cell Transplant")}/>
                  <span className="treatmentLabel">Haploidnetical (HAPLO) Allogeneic Stem Cell Transplant</span>
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" tabIndex = {1} name="stem_cell_transplant" value= "Reduced Intensity (MINI) Allogeneic Stem Cell Transplant" checked = {(this.state.treatment_type === "Reduced Intensity (MINI) Allogeneic Stem Cell Transplant")} onClick={(e) => this.handleStemCellTypeChange(e, "Reduced Intensity (MINI) Allogeneic Stem Cell Transplant")}/>
                  <span className="treatmentLabel">Reduced Intensity (MINI) Allogeneic Stem Cell Transplant</span>
                </label>
              </div>
            </div>
          </div>
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
