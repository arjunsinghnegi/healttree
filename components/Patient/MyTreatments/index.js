import "react-confirm-alert/src/react-confirm-alert.css";// Import css
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { browserHistory, Link } from "react-router";
import {
  CONST_SIDE_EFFECT,
  OUTCOME_CONST,
  TREATMENT_TYPE_CONST,
  TREATMENTS_CONST,
} from "../renderFields";
import { Field, reduxForm } from "redux-form";
import { getDynamicOutcomes, getDynamicSideEffects, getDynamicTreatments } from "../../../actions/treatmentActions";
import { getTreatments, removeTreatments, resetPatient } from "../../../actions/PatientsActions";

import React, { Component } from "react";
import Alert from "react-s-alert";
// import BackLink from "../../common/backButton";
import ClinicalTrialsModal from "../Modals/showClinicalTrials";
import { confirmAlert } from "react-confirm-alert"; // Import
import { connect } from "react-redux";
import { DOWNLOAD_FORM_URL } from "../../../actions/constants";

import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import moment from "moment";
import MyTreatmentsModal from "../Modals/addTreatment";
import ReactTooltip from "react-tooltip";
import { renderDateField } from "../renderFields";
// import Remission from "./remission";
import { setModuleCount } from "../../../actions/miscActions";
import UploadQuestionnaireModal from "../Modals/uploadQuestionnaireModal";
import { parseJSON } from "../../../utils";

class MyTreatments extends Component {

  constructor(props) {
    super(props);
    // create side effects array for listing
    let tmpSideEffects = [];
    CONST_SIDE_EFFECT.map(function(obj, key) {
      obj.checked = false;
      tmpSideEffects.push(obj);
    });
    this.state = {
      treatments: [],
      userinfo: null,
      showLoader: false,
      title: "",
      modal_data: {},
      editId: null,
      uploadModal: false,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(), // max date in datepicker
      treatmentsArr: [],
      defaultTreatmentsArr: [],
      outcomeArr: JSON.parse(JSON.stringify(OUTCOME_CONST)),
      treatmentTypeArr: JSON.parse(JSON.stringify(TREATMENT_TYPE_CONST)),
      sub_outcome: null,
      // outcomeArr: [],
      current_treatment: false,
      outcome: null,
      start_date: null,
      end_date: null,
      treatmentId: null,
      componentEdited: false,
      constSideEffects: [],
      dynamicSideEffects: [],
      severity: 1,
      showModal: false,
      openclinicalTrialsModal: false,
      userType: 0,

    };
    // binding all the functions
    this.removeRecord = this.removeRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.close_modal = this.close_modal.bind(this);
    this.renderList = this.renderList.bind(this);
    this.handleClinicalModal = this.handleClinicalModal.bind(this);
    // set local storage
  }


  open_modal(e) {
    this.setState({
      modal1: !this.state.modal1,
    });
  }
  close_modal(e) {
    this.setState({
      modal1: false,
    });
  }

  componentWillMount() {
    this.props.getUserInfo(this.props.token);
    this.props.getTreatments(this.props.token);
    this.props.getDynamicTreatments(this.props.token);
    this.props.getDynamicSideEffects(this.props.token);
    // this.props.getDynamicOutcomes(this.props.token);
    this.setState({ showLoader: true });
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.userInterest && nextProps.userInterest !== props.userInterest) {
      if (nextProps.userInterest && nextProps.userInterest.interested_in) {
        this.setState({ userType: parseInt(nextProps.userInterest.interested_in) });
      }
    }
    // if new
    if (nextProps.treatmentSuccess && nextProps.treatmentList) {
      let tmpArr = [];
      // dynamic treatment list
      nextProps.treatmentList.map(function(obj, key) {
        obj.attributes.treatments.map(function(attr, k) {
          obj.attributes.treatments[k].checked = false;
        });
        tmpArr.push(obj.attributes);
      });
      this.setState({ treatmentsArr: tmpArr, defaultTreatmentsArr: tmpArr });
    }
    if (nextProps.treatment && this.props.treatment !== nextProps.treatment) {
      if (nextProps.treatment.isSuccess && nextProps.treatment.data) {
        this.setState({ showLoader: false });
        this.props.getTreatments(this.props.token);
        //
      }

      // checks for delete
      if (nextProps.treatment.isDeleting || nextProps.treatment.isRequesting) {
        this.setState({ showLoader: true });

      }
      if (nextProps.treatment.isDeleted) {
        let tmpArr = [];
        let delEntry = "";
        this.state.treatments.map(function(data, key) {
          if (data.id !== nextProps.treatment.del_id) {
            tmpArr.push(data);
          } else {
            delEntry = data.treatment;
          }
        });
        this.setState({ treatments: tmpArr, showLoader: false });
        Alert.success("Treatment has been removed successfully.");
        // reset patient reducer
        this.props.resetPatient();
      }
      if (nextProps.treatment.isDeleteError || nextProps.treatment.isError) {
        this.setState({ showLoader: false });
        Alert.error("Something went wrong. Please try again later.");
        // reset patient reducer
        this.props.resetPatient();
      }
    }
    if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userinfo: userinfo });
    }
    if (nextProps.treatments && this.props.treatments !== nextProps.treatments) {
      // check if user type is 0 and modal is to be shown
      // this.setState({ openclinicalTrialsModal: true });
      if (this.state.userType !== 1) {
        let userModuleCounts = localStorage.getItem("modulecounts");
        userModuleCounts = JSON.parse(userModuleCounts);
        if (parseInt(userModuleCounts.treatments) == 0 && nextProps.treatments.length) {
          this.setState({ openclinicalTrialsModal: true });
        }
      }
      // if (this.state.userType === 2) {
      //   let userModuleCounts = localStorage.getItem("modulecounts");
      //   userModuleCounts = JSON.parse(userModuleCounts);
      //   let tmpObj = {};
      //   tmpObj.clinical_trials_count = userModuleCounts.clinicalTrial;
      //   tmpObj.treatments_count = nextProps.treatments.length;
      //   this.props.setModuleCount(tmpObj);
      // }
      let treatments = [];
      nextProps.treatments.map(function(data, key) {
        let obj = {};
        obj.id = data.id;
        obj.start_date = data.attributes.start_date;
        obj.end_date = data.attributes.end_date;
        obj.treatment = data.attributes.treatment;
        obj.treatment_label = data.attributes.treatment_label;
        obj.outcome = data.attributes.outcome;
        obj.sub_outcome = data.attributes.sub_outcome,
        obj.resistantTo = data.attributes.resistant;
        obj.side_effects = data.attributes.side_effects;
        obj.severity = data.attributes.severity;
        obj.current_treatment = data.attributes.current_treatment;
        obj.treatment_type = data.attributes.treatment_type;
        obj.city = data.attributes.city;
        obj.state = data.attributes.state;
        obj.country = data.attributes.country;
        obj.zipcode = data.attributes.zipcode;
        obj.other_treatments = data.attributes.other_treatments,
        treatments.push(obj);
      });
      this.setState({ treatments: treatments, showLoader: false });
      this.props.resetPatient();
    }

    if (nextProps.dynamicSideEffects !== props.dynamicSideEffects) {
      if (nextProps.dynamicSideEffects.data && nextProps.dynamicSideEffects.isSuccess) {
        this.setState({ constSideEffects: nextProps.dynamicSideEffects.data, dynamicSideEffects: nextProps.dynamicSideEffects.data });
      }
    }
    // if (nextProps.dynamicOutcomes !== props.dynamicOutcomes) {
    //   console.log("i am here in dynamic outcoems");
    //   // if (nextProps.dynamicSideEffects.data && nextProps.dynamicSideEffects.isSuccess) {
    //   //   this.setState({ constSideEffects: nextProps.dynamicSideEffects.data });
    //   // }
    // }
  }

  uploadForm(e) {
    this.setState({
      uploadModal: !this.state.uploadModal,
    });
  }

  handleClinicalModal(e) {
    let userModuleCounts = localStorage.getItem("modulecounts");
    userModuleCounts = JSON.parse(userModuleCounts);
    let tmpObj = {};
    tmpObj.clinical_trials_count = userModuleCounts.clinicalTrial;
    tmpObj.treatments_count = this.state.treatments.length;
    this.props.setModuleCount(tmpObj);
    this.setState({
      openclinicalTrialsModal: false,
    }, function() {
      browserHistory.push("/treatment-options");
    });
  }

  // show side effects
  renderSideEffects(obj) {
    let tmpArr = [];
    this.state.constSideEffects.map(function(side_effect, key) {
      side_effect.attributes.side_effects.map(function(effect, k) {
        let index_of = obj.side_effects.indexOf(effect.id);
        if (index_of > -1) {
          let severity = obj.severity[index_of];
          tmpArr.push(<li key={key + "side" + effect.id} className="treatments-lbl-span"><span data-tip data-for={effect.label + key + effect.id + obj.id} className="pointer-cursor side_effect_li">{effect.label}</span>
            { parseInt(obj.severity[index_of]) >= 1 && parseInt(obj.severity[index_of]) <= 38 && <div className="pointer-cursor side_effect_severity side_severity_tolerable">{obj.severity[index_of]}</div>}
            { parseInt(obj.severity[index_of]) >= 39 && parseInt(obj.severity[index_of]) <= 68 && <div className="pointer-cursor side_effect_severity side_severity_btw">{obj.severity[index_of]}</div>}
            { parseInt(obj.severity[index_of]) >= 69 && parseInt(obj.severity[index_of]) <= 100 && <div className="pointer-cursor side_effect_severity side_severity_stopped">{obj.severity[index_of]}</div>}
            <ReactTooltip place="bottom" type="dark" effect="solid" id={effect.label + key + effect.id + obj.id}>
              <ul className="">
                <li>{effect.label} ({severity})</li>
              </ul>
            </ReactTooltip>
          </li>);
          // return <li key={key + "side" + effect.id} className="treatments-lbl-span"><span data-tip data-for={effect.label + key + effect.id} className="pointer-cursor side_effect_li">{effect.label}</span>
          // </li>;

        }
      });
      // console.log("index_of", side_effect);
      // let index_of = obj.side_effects.indexOf(obj.id);
      //

    });
    return tmpArr;
  }

  // show listing
  renderList(obj) {
    let tmpArr = [];
    this.state.treatments.map(function(obj, key) {
      let This = this;
      let sub_outcome = null,
        resistant_to = null;
      if (obj.sub_outcome && obj.sub_outcome.indexOf("{") > -1) {
        sub_outcome = JSON.parse(obj.sub_outcome);
      }
      if (obj.resistantTo && obj.resistantTo.indexOf("{") > -1) {
        resistant_to = JSON.parse(obj.resistantTo);
      }

      tmpArr.push(<div key={key} className= "col-md-12 div-seperator custom-seperator">
        <div className= "row legend-row">
          <div className="col-md-1 column-seprator align-cntr col-sm-2">Start Date</div>
          <div className="col-md-1 column-seprator align-cntr col-sm-2">End Date</div>
          <div className="col-md-3 column-seprator align-cntr col-sm-3">Treatment</div>
          {/* <div className="col-md-1 column-seprator">Current Treatment</div> */}
          <div className="col-md-2 column-seprator align-cntr col-sm-1 stopped-drug-panel">Stopped Drug</div>
          <div className="col-md-1 column-seprator align-cntr col-sm-1">Therapy Type</div>
          <div className="col-md-3 column-seprator align-cntr col-sm-2 side-effect-panel">Side Effects</div>
          <div className="col-md-1 column-seprator align-cntr col-sm-1">Actions</div>
        </div>
        <div className= "row data-row">
          <div className="col-md-1 column-seprator align-cntr col-sm-2">{moment(obj.start_date, "MM/DD/YYYY").format("DD MMM, YYYY")}</div>
          <div className="col-md-1 column-seprator align-cntr col-sm-2">{(obj.current_treatment) ? "Current Treatment" : moment(obj.end_date, "MM/DD/YYYY").format("DD MMM, YYYY")}</div>
          <div className="col-md-3 column-seprator col-sm-3">
            <ul className="treatment-ul treatment_outcome_height">
              {obj.treatment_label.map(function(data, k) {
                return <li key={key + "li" + k} className="treatments-lbl-span"><span data-tip data-for={data + key} className="pointer-cursor">{data}</span>
                  <ReactTooltip place="bottom" type="dark" effect="solid" id={data + key}>
                    <ul className="">
                      <li>{data}</li>
                    </ul>
                  </ReactTooltip>
                </li>;
              })}
            </ul>
          </div>
          {/* <div className="col-md-2 column-seprator align-cntr custom-seperator">{(obj.current_treatment) ? <i className="fa fa-check" aria-hidden="true"></i> : ""}</div> */}
          <div className="col-md-2 column-seprator align-cntr col-sm-1 stopped-drug-panel">
            <ul className="resistant-to treatment_outcome_height">
              {obj.treatment.map(function(data, k) {
                if (resistant_to && resistant_to[data]) {
                  let tmpResistant = resistant_to[data];
                  return <li key={key + "li" + k}>
                    <span>
                      {(tmpResistant[1]) ? (tmpResistant[1] === "Intollerable side effects" ? "Side Effects" : "Didn't Work") : "-"}
                      {(tmpResistant[0]) ? " (" + moment(tmpResistant[0], "MM/DD/YYYY").format("MM/DD/YYYY") + ")" : ""}
                    </span>
                  </li>;

                } else {
                  return <li key={key + "li" + k}><span></span></li>;
                }
              })}
            </ul>
          </div>
          <div className="col-md-1 column-seprator align-cntr col-sm-1">{obj.treatment_type}</div>
          <div className="col-md-3 column-seprator align-cntr col-sm-2 side-effect-panel">
            <ul className="side_effects_treatment treatment_outcome_height">
              {this.renderSideEffects(obj)}
            </ul>
          </div>
          <div className="col-md-1 column-seprator align-cntr col-sm-1"><span>
            <button className="btn edit" type="button" onClick = {(event) => This.editRecord(event, obj, key, "treatment")}><i data-tip data-for="edit-treatments" className="fa fa-stethoscope" aria-hidden="true" ></i></button>
            <ReactTooltip place="bottom" type="dark" effect="solid" id="edit-treatments" >
              <ul>
                <li>Edit Treatments</li>
              </ul>
            </ReactTooltip>
            <button className="btn edit" type="button" onClick = {(event) => This.editRecord(event, obj, key, "outcome")}><i data-tip data-for="edit-outcomes" className="fa fa-heartbeat" aria-hidden="true" ></i></button>
            <ReactTooltip place="bottom" type="dark" effect="solid" id="edit-outcomes" >
              <ul>
                <li>Edit Outcomes</li>
              </ul>
            </ReactTooltip>
            <button className="btn edit" type="button" onClick = {(event) => This.editRecord(event, obj, key, "side_effect")}><i data-tip data-for="edit-sideeffects" className="fa fa-medkit" aria-hidden="true" ></i></button>
            <ReactTooltip place="bottom" type="dark" effect="solid" id="edit-sideeffects" >
              <ul>
                <li>Edit Side Effects</li>
              </ul>
            </ReactTooltip>
            <button title="Delete" className="btn delete" type="button" onClick = {(event) => This.removeRecord(event, obj)}><i className="fa fa-trash-o" aria-hidden="true" data-tip data-for="remove-outcomes" ></i></button>
            <ReactTooltip place="bottom" type="dark" effect="solid" id="remove-outcomes" >
              <ul>
                <li>Remove Treatments</li>
              </ul>
            </ReactTooltip>
          </span>
          </div>
        </div>
        <div className= "row data-row bottom-row">
          <div className="col-md-1 resp-lbl">Outcome</div>
          <div className="col-md-11">
            <label>{obj.outcome}</label>

            { sub_outcome && sub_outcome.index && this.state.outcomeArr.map((outcome, k) => {
              if (obj.outcome === outcome.label && outcome.subOptions && outcome.subOptions.length) { // <label></label>;
                let i = 0;
                return outcome.subOptions.map((subOption, key) => {
                  if (sub_outcome.index.indexOf(subOption.value) > -1 && subOption.label !== "Other") {
                    i++;
                    if (obj.outcome === "My myeloma is now undetectable") {
                      return <span className="">{(i === 1) ? ", " : ""}{subOption.label}{(i) == sub_outcome.index.length ? ". " : ", "}</span>;
                    }
                    if (obj.outcome === "I discontinued this treatment") {
                      return <span className="">{(i === 1) ? " because: " : ""}{subOption.label}{(i) == sub_outcome.index.length ? ". " : ", "}</span>;
                    }
                    // return <span className="">{(i === 1) ? ", " : ""}{subOption.label} {(i) == sub_outcome.index.length ? ((sub_outcome.other) ? ", " : ".") : ", "}</span>;

                  }
                });
              }
            })}

            {
              (sub_outcome && sub_outcome.other) && <span className="">Other Reason: {sub_outcome.other}.</span>
            }


            {/* {sub_outcome && <div className="row sub_outcome_div">
              {sub_outcome.index && this.state.outcomeArr.map((outcome, k) => {
                if (obj.outcome === outcome.label && outcome.subOptions.length) {
                  return outcome.subOptions.map((subOption, key) => {
                    if (sub_outcome.index.indexOf(subOption.value) > -1 && subOption.label !== "Other") {
                      return <span className="sub_outcome_lbl">{subOption.label}</span>;
                    }
                  });
                }
              })}
              {
                (sub_outcome.other) && <span className="sub_outcome_lbl">Other ({sub_outcome.other})</span>
              }

            </div>} */}
          </div>
        </div>
        {/* <div className= "row data-row bottom-row">
          <div className="col-md-3 resp-lbl">Is maintenance therapy </div>
          <div className="col-md-9">{obj.is_maintenance_therapy ? "Yes" : "No"}</div>
        </div> */}
      </div>);
    }, this);
    return tmpArr;
  }

  renderli(arr) {
    let tmpArr = [];
    arr.map(function(obj, key) {
      tmpArr.push(<li key={key}>{obj}</li>);
    });
    return tmpArr;
  }


  onContinue(formData) {
    // browserHistory.push("/remission-status");
    browserHistory.push("/treatment-options");
  }


  // add new record
  addRecord(event, row) {
    event.preventDefault();
    let obj = {};
    obj.id = null;
    obj.start_date = null;
    obj.end_date = null;
    obj.treatment = null;
    obj.dosage = null;
    obj.frequency = null;
    let sideEffectArr = JSON.parse(JSON.stringify(this.state.dynamicSideEffects));
    this.state.dynamicSideEffects.map(function(obj, key) {
      sideEffectArr[key].checked = false;
      sideEffectArr[key].severity = 0;
    });
    this.setState({ title: "Add My Treatments",
      "modal_data": obj,
      "treatmentId": null,
      "current_treatment": false,
      "treatment_type": null,
      "outcome": null,
      "start_date": null,
      "end_date": null,
      "treatmentId": null,
      "componentEdited": false,
      "facility": obj.facility,
      "constSideEffects": sideEffectArr,
      "treatmentCount": 0,
      "treatmentsArr": JSON.parse(JSON.stringify(this.state.defaultTreatmentsArr)),
      "outcomeArr": JSON.parse(JSON.stringify(OUTCOME_CONST)) }, function() {
      this.open_modal(event);
    });
  }

  addTreatment(event) {
    browserHistory.push("/add-treatment");
  }
  // remove record
  removeRecord(event, row) {
    event.preventDefault();
    confirmAlert({
      title: "", // Title dialog
      message: "Are you sure you want  to remove treatment?", // Message dialog
      // childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
      confirmLabel: "Confirm", // Text button confirm
      cancelLabel: "Cancel", // Text button cancel
      onConfirm: () => this.props.removeTreatments(this.props.token, row.id), // Action after Confirm
      onCancel: () => "", // Action after Cancel
    });
    //
  }

  // editRecord function called in order to edit treatment
  editRecord(event, row, k, componentEdited) {
    event.preventDefault();
    let treatmentArr = JSON.parse(JSON.stringify(this.state.defaultTreatmentsArr)),
      tmpArr = JSON.parse(JSON.stringify(this.state.defaultTreatmentsArr)),
      tmpOutcomeArr = JSON.parse(JSON.stringify(OUTCOME_CONST)),
      treatmentTmpArr = row.treatment,
      resistantTmpArr = row.resistantTo,
      sideEffectTmpArr = row.side_effects,
      severityTmpArr = row.severity,
      otherTreatmentsArr = row.other_treatments ? JSON.parse(row.other_treatments) : null,
      sideEffectArr = JSON.parse(JSON.stringify(this.state.constSideEffects));
    treatmentArr.map(function(parentObj, parentKey) {

      parentObj.treatments.map(function(obj, key) {
        treatmentTmpArr.map(function(treatObj, treatKey) {
          if (obj.value === treatObj) {
            tmpArr[parentKey].treatments[key].checked = true;
            if (obj.label === "Other" && otherTreatmentsArr && otherTreatmentsArr.length) {
              otherTreatmentsArr.map((otherTreatment, otherKey) => {
                if (otherTreatment[parentObj.value]) {
                  tmpArr[parentKey].treatments[key].otherTxt = otherTreatment[parentObj.value];
                }
              });
            }
            if (resistantTmpArr && resistantTmpArr.indexOf("{") > -1) {
              let tmpResistantArr = JSON.parse(resistantTmpArr);
              if (tmpResistantArr[treatObj]) {
                tmpArr[parentKey].treatments[key].stoppedDate = tmpResistantArr[treatObj][0];
                tmpArr[parentKey].treatments[key].stoppedReason = tmpResistantArr[treatObj][1];
              }
            }
          }
        });

        // resistantTmpArr.map(function(resistantObj, treatKey) {
        //   if (obj.value === resistantObj) {
        //     tmpArr[parentKey].treatments[key].isResistant = true;
        //   }
        // });
      });

    });
    let sub_outcome = null;
    let other = null;
    if (row.sub_outcome) {
      if (row.sub_outcome.indexOf("[") > -1) {
        let subOutcomeArr = JSON.parse(row.sub_outcome);
        if (subOutcomeArr.index) {
          sub_outcome = subOutcomeArr.index;
        }
        if (subOutcomeArr.other) {
          other = subOutcomeArr.other;
        }
      }
    }
    let outcomeArr = JSON.parse(JSON.stringify(OUTCOME_CONST));
    outcomeArr.map(function(obj, key) {
      if (row.outcome == obj.label) {
        if (obj.subOptions && obj.subOptions.length) {
          let tmpSubOptions = [];
          obj.subOptions.map((suboption, subkey) => {
            if (sub_outcome && typeof(sub_outcome) === "object") {
              if (sub_outcome.indexOf(suboption.value) > -1) {
                suboption.checked = true;
              }
            }
            // else {
            if (suboption.label === "Other" && other) {
              suboption.checked = true;
              suboption.data = other;
            }
            // }
            tmpSubOptions.push(suboption);
          });
          tmpOutcomeArr[key].subOptions = tmpSubOptions;
        }
        tmpOutcomeArr[key].checked = true;
      }
    });

    this.state.constSideEffects.map(function(obj, key) {
      obj.attributes.side_effects.map(function(sideEffect, k) {
        let indexOfSideEffect = sideEffectTmpArr.indexOf(sideEffect.id);
        if (indexOfSideEffect > -1) {
          sideEffectArr[key].attributes.side_effects[k].checked = true;
          sideEffectArr[key].attributes.side_effects[k].severity = severityTmpArr[indexOfSideEffect];
        }
      });
    });
    this.setState({ treatmentsArr: tmpArr,
      outcomeArr: tmpOutcomeArr,
      start_date: row.start_date,
      end_date: row.end_date,
      current_treatment: row.current_treatment,
      treatment_type: row.treatment_type,
      treatmentId: row.id,
      componentEdited: componentEdited,
      constSideEffects: sideEffectArr,
      severity: row.severity,
      // facility: facilityObj,
    }, function() {
      this.open_modal(event);
    });
  }

  render() {
  //  const { handleSubmit } = this.props;
    const options = {
      page: 1, // which page you want to show as default
      sizePerPageList: [{
        text: "5", value: 5,
      }, {
        text: "10", value: 10,
      }, {
        text: "All", value: this.state.treatments.length,
      }], // you can change the dropdown list for size per page
      sizePerPage: 10, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: "bottom", // default is bottom, top and both is all available
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
    };
    return (
      <div id="page-content-wrapper">
        <Alert stack={{ limit: 1 }} />
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">Treatments & Outcomes</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          {this.state.modal1 && <MyTreatmentsModal
            modal_var = {this.state.modal1}
            handle_modal = { (e) => this.open_modal(e) }
            userinfo={this.state.userinfo}
            token={this.props.token}
            title={this.state.title}
            modalData={this.state.modal_data}
            onSubmit = {this.onSubmit}
            treatmentsArr = {this.state.treatmentsArr}
            outcomeArr = {this.state.outcomeArr}
            treatmentTypeArr = {this.state.treatmentTypeArr}
            start_date = {this.state.start_date}
            end_date = {this.state.end_date}
            treatmentId = {this.state.treatmentId}
            current_treatment = {this.state.current_treatment}
            treatment_type = {this.state.treatment_type}
            componentEdited = {this.state.componentEdited}
            constSideEffects = {this.state.constSideEffects}
            severity = {this.state.severity}
            facility = {this.state.facility}
            treatmentCount = {this.state.treatments.length}
          />}

          {this.state.uploadModal && <UploadQuestionnaireModal
            modal_var = {this.state.uploadModal}
            handle_modal = { (e) => this.uploadForm(e) }
            userinfo={this.state.userinfo}
            token={this.props.token}
            props={this.props}
            title= "Upload Questionnaire"
          />}
          {this.state.openclinicalTrialsModal && <ClinicalTrialsModal
            modal_var = {this.state.openclinicalTrialsModal}
            handle_modal = { (e) => this.handleClinicalModal(e) }
            userinfo={this.state.userinfo}
            token={this.props.token}
            props={this.props}
            title= "Upload Questionnaire"
          />}
          <div className="treatment">
            <div className="myeloma_content">
              <label>We need some information about all treatments you have had. </label>
            </div>
            <form noValidate className="editroll">
              {this.state.treatmentsArr.length > 0 && this.state.constSideEffects.length > 0 && <button
                onClick={ (e) => this.addTreatment(e) }
                type="button"
                className="btn blue_btn text-center hvr-bounce-to-top">
                <i className="flaticon-clipboard"></i><span>Add Treatments</span>
              </button>}
              <div className="form-group">
                <div className="outer-mypataient-table">
                  {this.state.treatments.length !== 0 && this.renderList()}
                </div>
              </div>
            </form>
            {/* <div className="form-group">
              <div className="col-sm-12">
                <Remission token= {this.props.token}/>
              </div>
            </div>*/}
            <div className="form-group">
              <div className="col-sm-12 text-center">
                <button onClick={this.onContinue} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusText: state.patient.statusText,
    isAuthenticating: state.patient.isAuthenticating,
    treatments: state.patient.treatments,
    userinfo: state.user.userinfo,
    treatment: state.treatment,
    treatmentReq: state.treatment.treatmentReq,
    treatmentSuccess: state.treatment.treatmentSuccess,
    treatmentFail: state.treatment.treamentFail,
    treatmentList: state.treatment.treatmentList,
    dynamicSideEffects: state.dynamicSideEffects,
    userInterest: state.metaData.userInterest,
    // dynamicOutcomes: state.dynamicOutcome,
  };
}

MyTreatments = reduxForm({
  form: "TreatmentEdit",
})(MyTreatments);
// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
export default connect(mapStateToProps, { getTreatments, getUserInfo, removeTreatments, resetPatient, getDynamicTreatments, getDynamicSideEffects, setModuleCount, getDynamicOutcomes })(MyTreatments);
