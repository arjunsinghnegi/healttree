
import {
  CONST_SIDE_EFFECT,
  OUTCOME_CONST,
  renderCheckbox,
  renderDateField,
  TREATMENTS_CONST,
} from "../renderFields";
import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import React, { Component } from "react";
import { resetPatient, saveTreatments } from "../../../actions/treatmentActions";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import moment from "moment";
import Outcome from "../MyTreatments/outcomes";
import SideEffect from "../MyTreatments/sideEffects";
import Treatment from "../MyTreatments/treatments";


class AddTreatment extends Component {
  constructor(props) {
    super(props);
    this.manage_modal = this.manage_modal.bind(this);
    this.state = {
      treatmentsArr: props.treatmentsArr,
      outcomeArr: props.outcomeArr,
      treatmentTypeArr: props.treatmentTypeArr,
      sideEffectsArr: props.constSideEffects,
      serverErr: null,
      start_date: (props.start_date) ? moment(props.start_date, "MM/DD/YYYY") : null,
      end_date: (props.end_date) ? moment(props.end_date, "MM/DD/YYYY") : null,
      current_treatment: (props.current_treatment) ? true : false,
      treatment_type: props.treatment_type,
      showAddOutcome: (props.componentEdited === "outcome") ? true : false,
      showSideEffects: (props.componentEdited === "side_effect") ? true : false,
      componentEdited: props.componentEdited, // if only edit outcome is selected
      isValid: false,
      treatmentId: (props.treatmentId) ? props.treatmentId : null,
      errObj: {
        start_date: null,
        end_date: null,
        treament: null,
      },
      isRequesting: false,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(), // max date in datepicker
      add_another_treatment: false,
    };

    // this.clearAll = this.clearAll.bind(this);
    // this.clearGroup = this.clearGroup.bind(this);

    this.toggleOutcomeForm = this.toggleOutcomeForm.bind(this);

    this.showError = this.showError.bind(this);
    // this.clearOutcome = this.clearOutcome.bind(this);
    this.addAnotherTreatment = this.addAnotherTreatment.bind(this);
    this.checkTreatmentValidations = this.checkTreatmentValidations.bind(this);
    this.checkOutcomes = this.checkOutcomes.bind(this);
    this.checkResistant = this.checkResistant.bind(this);
    this.checkSideEffects = this.checkSideEffects.bind(this);
    this.checkSeverity = this.checkSeverity.bind(this);
    this.showSideEffect = this.showSideEffect.bind(this);
    this.getTabindex = this.getTabindex.bind(this);
    this.tabIndex = 100;
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.isSuccess && nextProps.treatment) {
      if (this.state.treatmentId) {
        Alert.success("Treatment has been updated successfully.");
      } else {
        Alert.success("Treatment has been added successfully.");
      }
      this.setState({ "isRequesting": false, showLoader: false });
      if (this.state.add_another_treatment) {
        // reset all the variables here
        let tmpSideEffects = [];
        this.props.constSideEffects.map(function(obj, key) {
          obj.checked = false;
          tmpSideEffects.push(obj);
        });
        this.setState({
          treatmentsArr: JSON.parse(JSON.stringify(this.props.treatmentsArr)),
          outcomeArr: JSON.parse(JSON.stringify(this.props.outcomeArr)),
          treatmentTypeArr: JSON.parse(JSON.stringify(this.props.treatmentTypeArr)),
          sideEffectsArr: tmpSideEffects,
          severity: 1,
          current_treatment: false,
          treatment_type: null,
          outcome: null,
          start_date: null,
          end_date: null,
          treatmentId: null,
          isValid: false,
          showAddOutcome: false,
          showSideEffects: false,
        }, function() {
          this.setState({ "add_another_treatment": false });
        });
      } else {
        this.manage_modal();
      }
      this.props.resetPatient();
    }
    if (nextProps.isRequesting) {
      this.setState({ "isRequesting": true });
    }
  }

  getTabindex(tabIndex) {
    this.tabIndex = parseInt(tabIndex) + 1;
  }

  checkTreatmentValidations(isValid, errObj, dataObj) {
    this.setState({ isValid: isValid, errObj: errObj });
    if (isValid) {
      this.setState({
        treatmentsArr: dataObj.treatmentsArr,
        start_date: dataObj.start_date,
        end_date: dataObj.end_date,
        current_treatment: dataObj.current_treatment,
        treatment_type: dataObj.treatment_type,
      });
    }
  }

  checkOutcomes(outcomeArr) {
    this.setState({ outcomeArr: outcomeArr });
  }
  checkResistant(treatmentArr) {
    this.setState({ treatmentsArr: treatmentArr });
  }
  checkSideEffects(sideEffectsArr) {
    this.setState({ sideEffectsArr: sideEffectsArr });
  }
  checkSeverity(severity) {
    this.setState({ severity: severity });
  }

  // Add anotther treatment
  addAnotherTreatment(e) {
    e.preventDefault();
    this.setState({ add_another_treatment: true }, function() {
      this.onSubmit();
    });

  }
  // show/hide outcome
  toggleOutcomeForm() {
    this.setState({ showAddOutcome: !this.state.showAddOutcome, showSideEffects: false });
  }


  showSideEffect(e) {
    e.preventDefault();
    this.setState({ showSideEffects: !this.state.showSideEffects, showAddOutcome: !this.state.showAddOutcome });
  }


  // display form errors
  showError(e) {
    e.preventDefault();
    let errObj = this.state.errObj;
    let errHtml = "<span>To save you must have: </span><ul class= treatmentErr>";
    if (errObj.treament_type) {
      errHtml = errHtml + "<li>" + errObj.treament_type + "</li>";
    }
    if (errObj.otherTxt) {
      errHtml = errHtml + "<li>" + errObj.otherTxt + "</li>";
    }
    if (errObj.start_date) {
      errHtml = errHtml + "<li>" + errObj.start_date + "</li>";
    }
    if (errObj.end_date) {
      errHtml = errHtml + "<li>" + errObj.end_date + "</li>";
    }
    if (errObj.treament) {
      errHtml = errHtml + "<li>" + errObj.treament + "</li>";
    }

    errHtml = errHtml + "</ul>";
    Alert.error(errHtml, {
      html: true,
    });
    // Alert.error("Something went wrong while removing treatment. Please try again later.");
  }

  // close modal
  manage_modal() {
    // this.setState({ start_date: null, end_date: null, dosageOptions: [], frequencyOptions: [], err: {}, treatment_code: null, cyclesReceived: CYCLES });
    this.props.handle_modal("false");
  }
  //   on submission of form
  onSubmit() {
    let userId = this.props.userinfo.id;
    let tmpTreatmentArr = [],
      tmpResistantArr = {},
      tmpSideEffectsArr = [],
      tmpSeverityArr = [],
      tmpOtherTreatmentsArr = [];
    let outcome = null;
    let otherData = null;
    let sub_outcome = null;
    this.state.treatmentsArr.map(function(parentObj, parentKey) {
      parentObj.treatments.map(function(obj, key) {
        if (obj.checked) {
          tmpTreatmentArr.push(obj.value);
          if (obj.label === "Other") {
            let tmpOtherObj = {};
            tmpOtherObj[parentObj.value] = obj.otherTxt;
            tmpOtherTreatmentsArr.push(tmpOtherObj);
          }
        }

        if (obj.stoppedDate || obj.stoppedReason) {
          tmpResistantArr[obj.value] = [];
          if (obj.stoppedDate) {
            tmpResistantArr[obj.value].push(obj.stoppedDate);
          } else {
            tmpResistantArr[obj.value].push("");
          }
          if (obj.stoppedReason) {
            tmpResistantArr[obj.value].push(obj.stoppedReason);
          } else {
            tmpResistantArr[obj.value].push("");
          }
        }
        // if (obj.isResistant) {
        //   tmpResistantArr.push(obj.value);
        // }
      });
    });

    this.state.outcomeArr.map(function(obj, key) {
      if (obj.checked) {
        outcome = obj.value;
        sub_outcome = [];
        if (obj.subOptions && obj.subOptions.length) {
          obj.subOptions.map((subOption, subkey) => {
            if (subOption.checked && parseInt(subOption.value) !== 13) {
              sub_outcome.push(subOption.value);
            }
            if (subOption.checked && subOption.label === "Other" && subOption.data && subOption.data.trim()) {
              otherData = subOption.data;
              // sub_outcome.push(subOption.data);
            }
          });
        }
      }
    });
    this.state.sideEffectsArr.map(function(obj, key) {
      obj.attributes.side_effects.map(function(side_effect, k) {
        if (side_effect.checked) {
          tmpSideEffectsArr.push(side_effect.id);
          tmpSeverityArr.push(side_effect.severity);
        }
      });
      // if (obj.checked) {
      //   let tmpObj = {
      //     name: obj.value,
      //     value: obj.severity,
      //   };
      //   tmpSideEffectsArr.push(tmpObj);
      // }
    });
    let finalOutcome = {};
    finalOutcome.index = sub_outcome;
    finalOutcome.other = otherData;
    let tmpObj = {
      "type": "patient_treatments",
      "attributes": {
        "start_date": (this.state.start_date) ? this.state.start_date.format("MM/DD/YYYY") : null,
        "end_date": (this.state.end_date) ? this.state.end_date.format("MM/DD/YYYY") : null,
        "treatment": tmpTreatmentArr,
        "current_treatment": this.state.current_treatment,
        "treatment_type": this.state.treatment_type,
        "outcome": outcome,
        "sub_outcome": JSON.stringify(finalOutcome),
        "side_effects": tmpSideEffectsArr,
        "severity": tmpSeverityArr,
        "resistant": JSON.stringify(tmpResistantArr),
        "other_treatments": JSON.stringify(tmpOtherTreatmentsArr),
      },
      "relationships": {
        "user": {
          "data": {
            "type": "users",
            "id": userId,
          },
        },
      },
    };
    if (this.state.treatmentId) {
      tmpObj.id = this.state.treatmentId;
    }
    this.props.saveTreatments(this.props.token, tmpObj, this.state.treatmentId);

  }


  render() {
    const { handleSubmit } = this.props;
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop addTreatmentModal">
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <ModalHeader toggle={this.manage_modal}>
            { !this.state.showAddOutcome && !this.state.showSideEffects && <span className="page-title">{this.state.treatmentId ? "Edit " : "Add "} Treatments </span>}
            { this.state.showAddOutcome && !this.state.showSideEffects && <span className="page-title">{this.state.treatmentId ? "Edit " : "Add "} Outcomes </span>}
            {this.state.showSideEffects && <span className="page-title">{this.state.treatmentId ? "Edit " : "Add "} Side Effects</span>}
          </ModalHeader>
          <ModalBody>
            {/* Add Treatments options */}
            {!this.state.showAddOutcome && !this.state.showSideEffects && <Treatment defaultData={this.state} check_validations={this.checkTreatmentValidations} getTabindex = {this.getTabindex}/>}
            {/* Add outcome form start */}
            {this.state.showAddOutcome && !this.state.showSideEffects && <Outcome defaultData={this.state} treatmentsArr = {this.state.treatmentsArr} start_date={this.state.start_date} end_date={this.state.end_date} check_outcomes={this.checkOutcomes} check_resistant={this.checkResistant} getTabindex = {this.getTabindex} />}
            {/* Add Side Effects form */}
            {this.state.showSideEffects && <SideEffect defaultData={this.state} sideEffects={this.state.sideEffectsArr} check_side_effects={this.checkSideEffects} check_severity={this.checkSeverity} getTabindex = {this.getTabindex}/>}
          </ModalBody>
          {!this.state.isRequesting && <ModalFooter>
            {/* Cancel button */}
            <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" tabIndex = {this.tabIndex} onClick={ this.manage_modal }>Cancel</button>
            {/* Back button to return to treatment */}
            { this.state.showAddOutcome && !this.state.componentEdited && <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ this.toggleOutcomeForm }>Back</button>}
            {/* Back button to return to outcomes */}
            { this.state.showSideEffects && !this.state.componentEdited && <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ this.showSideEffect }>Back</button>}
            {/* Disabled Save button in case of edit */}
            { !this.state.isValid && (this.state.componentEdited == "treatment") && <button tabIndex = {this.tabIndex + 1} type="button" className="btn green-btn btn-rt disabled-btn" onClick={(e) => this.showError(e) }>Save</button>}
            {/* Enabled Save button in case of edit */}
            {/* for add treatment */}
            { this.state.componentEdited && this.state.isValid && (this.state.componentEdited == "treatment") && <button
              type="submit"
              className="btn green-btn btn-rt green-hvr-bounce-to-top"
              tabIndex = {this.tabIndex + 1}
              disabled={this.state.isRequesting === true ? true : false}>
              Save</button> }
            {/* Save button for side effects and outcome in case of edit */}
            { this.state.componentEdited && (this.state.componentEdited != "treatment") && <button
              type="submit"
              className="btn green-btn btn-rt green-hvr-bounce-to-top"
              tabIndex = {this.tabIndex + 1}
              disabled={this.state.isRequesting === true ? true : false}>
              Save</button> }

            {/* Add Enabled Save button */}
            { this.state.showSideEffects && this.state.isValid && <button
              type="submit"
              className="btn green-btn btn-rt green-hvr-bounce-to-top"
              tabIndex = {this.tabIndex + 1}
              disabled={this.state.isRequesting === true ? true : false}>
              Finished Adding Treatment</button> }
            {/* Add Disabled Save button */}
            { this.state.showSideEffects && !this.state.isValid && !this.state.componentEdited && <button tabIndex = {this.tabIndex + 1} type="button" className="btn green-btn btn-rt disabled-btn" onClick={(e) => this.showError(e) }>Finished Adding Treatment</button>}
            {/* Add outcome button */}
            { !this.state.showAddOutcome && this.state.isValid && !this.state.showSideEffects && !this.state.componentEdited &&
            <button type="button" tabIndex = {this.tabIndex + 1} className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ this.toggleOutcomeForm }>{this.state.treatmentId ? "Edit " : "Add "} Outcomes</button>}
            {/* disabled outcome button */}
            { !this.state.showAddOutcome && !this.state.isValid && !this.state.showSideEffects && !this.state.componentEdited && <button tabIndex = {this.tabIndex + 1} type="button" className="btn green-btn btn-rt disabled-btn" onClick={(e) => this.showError(e) }>{this.state.treatmentId ? "Edit " : "Add "} Outcomes</button>}
            {/* Show side effects button */}
            { this.state.showAddOutcome && !this.state.componentEdited && <button type="button" className="btn green-btn btn-rt" onClick={(e) => this.showSideEffect(e) }>{this.state.treatmentId ? "Edit " : "Add "} Side Effects</button>}
            {this.state.showSideEffects && !this.state.treatmentId && <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ (e) => this.addAnotherTreatment(e) }>Add Another Treatment</button>}
          </ModalFooter>}
        </form>
      </Modal>
    );
  }
}


function mapStateToProps(state) {
  return {
    treatment: state.treatment.data,
    isRequesting: state.treatment.isRequesting,
    isError: state.treatment.isError,
    isSuccess: state.treatment.isSuccess,
  };
}

AddTreatment = reduxForm({
  form: "MyTreatmentsModalForm",
  enableReinitialize: true,
})(AddTreatment);
export default connect(mapStateToProps, { resetPatient, saveTreatments })(AddTreatment);
