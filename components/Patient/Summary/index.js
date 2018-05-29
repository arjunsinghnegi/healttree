import { browserHistory, Link } from "react-router";
import { CONST_EXCERCISE_INTENSITY, CONST_EXCERCISE_INTERVAL, CONST_FITNESS_LEVEL, CONST_TREATMENTS, imagingLesionsArr, initialDiagnosisArr, REMISSION_STATUS_OUTCOMES } from "../renderFields";
import { getSummaryData, resetSummaryData } from "../../../actions/summaryActions";
import React, { Component } from "react";
import $ from "jquery";
import BackLink from "../../common/backButton";
import base64 from "base-64";
import Card from "./card";
import { connect } from "react-redux";
// import { getDynamicSideEffects } from "../../../actions/treatmentActions";
// import { getPatientInfo } from "../../../actions/PatientsActions";

import { getUserInfo } from "../../../actions/UserActions";
import HealthHistoryCard from "./healthHistoryCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Loader from "../../common/loader";
import moment from "moment";
import { raceArr } from "../renderFields";
import { SERVER_URL } from "../../../actions/constants";
import TreatmentCard from "./treatmentCard";

class MySummary extends Component {
  constructor(props) {
    super(props);
    let fitnessArr = [
      { label: "Level", value: "-" },
      { label: "Frequency", value: "-" },
      { label: "Intensity", value: "-" },
    ];
    let diseaseArr = [
      { label: "Initial Diagnoses In", value: "-" },
      { label: "Initial Diagnosis", value: "-" },
      { label: "Lessions by Imaging", value: "-" },
      { label: "Diagnosis Facility", value: "-" },
      { label: "Diagnosis City", value: "-" },
      { label: "Diagnosis State", value: "-" },
      { label: "Diagnosis Led By", value: "-" },
    ];
    let personalInforArr = [
      { label: "Gender", value: "-" },
      { label: "DOB", value: "-" },
      { label: "Race", value: "-" },
      { label: "Treatment Goals", value: "-" },
    ];
    let healthHistoryArr = [];
    this.state = {
      "showLoader": false,
      "name": "",
      "fitnessArr": fitnessArr,
      // "diseaseArr": diseaseArr,
      diseaseArr: [],
      "healthHistoryArr": [],
      "treatmentArr": [],
      "outcomesArr": [],
      "constSideEffects": [],
      "personalInforArr": personalInforArr,
      "userId": null,
    };
    // this.props.getDynamicSideEffects(this.props.token);
    // this.props.getPatientInfo(this.props.token);
    this.props.getSummaryData(this.props.token);
    this.props.getUserInfo(this.props.token);
    // this.handleBackLink = this.handleBackLink.bind(this);
    this.onPrint = this.onPrint.bind(this);
  }
  // handleBackLink() {
  //   browserHistory.push("/my-outcome");
  // }
  componentWillReceiveProps(nextProps, props) {
    // if (nextProps.patientInfo && nextProps.patientInfo !== props.patientInfo) {
    //   let personalData = nextProps.patientInfo;
    //   let race = "-";
    //   if (personalData.race) {
    //     raceArr.map(function(obj, val) {
    //       if (obj.value === personalData.race) {
    //         race = obj.label;
    //       }
    //     });
    //   }
    //   let gender = "-";
    //   if (personalData.gender) {
    //     if (personalData.gender === "female") {
    //       gender = "Female";
    //     } else {
    //       gender = "Male";
    //     }
    //   }
    //   let personalInforArr = [
    //     { label: "Gender", value: gender },
    //     { label: "DOB", value: (personalData.dob) ? moment(personalData.dob).format("DD MMM, YYYY") : "-" },
    //     { label: "Race", value: race },
    //     { label: "Treatment Goals", value: (personalData.treatment_goal) ? personalData.treatment_goal : "-" },
    //   ];
    //   this.setState({ "first_name": nextProps.patientInfo.first_name, "last_name": nextProps.patientInfo.last_name, "personalInforArr": personalInforArr });
    // }
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        this.setState({ "showLoader": true });
      }

      if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
        let userinfo = nextProps.userinfo;
        this.setState({ userId: userinfo.id });
      }
      if (nextProps.data && nextProps.isSuccess) {
        let data = nextProps.data;
        // Treatments
        if (data.attributes.treatments) {
          let treatments = data.attributes.treatments;
          let tmpArr = [];
          treatments.map(function(obj, key) {
            let tmpObj = {};
            tmpObj.id = data.id;
            tmpObj.start_date = moment(obj.start_date).format("YYYY MMM");
            tmpObj.end_date = (obj.end_date) ? moment(obj.end_date).format("YYYY MMM") : "-";
            tmpObj.treatment = obj.treatment ;
            tmpObj.treatment_labels = obj.treatment_labels ;
            tmpObj.current_treatment = obj.current_treatment ;
            tmpObj.resistant = obj.resistant;
            tmpObj.outcome = obj.outcome ? obj.outcome : null;
            tmpObj.sub_outcome = obj.sub_outcome ? obj.sub_outcome : null;
            tmpObj.severity = obj.severity ? obj.severity : [];
            tmpObj.side_effects = obj.side_effects;
            tmpObj.is_maintenance_therapy = (obj.is_maintenance_therapy) ? "Yes" : "No";
            tmpArr.push(tmpObj);
          });
          this.setState({ "treatmentArr": tmpArr });
        }

        // Disease History
        if (data.attributes.disease_history) {
          let disease_history = data.attributes.disease_history;
          let initialDiagnosis = null;
          if (disease_history.initial_diagnosis) {
            initialDiagnosisArr.map((diagnosis, key) => {
              if (diagnosis.value === disease_history.initial_diagnosis) {
                initialDiagnosis = diagnosis.label;
              }
            });
          }
          let diseaseArr = [
            { label: "Initial Diagnoses Date", value: (disease_history.first_diagnosed_date) ? moment(disease_history.first_diagnosed_date).format("LL") : "-" },
            { label: "Initial Diagnosis", value: (initialDiagnosis) ? initialDiagnosis : "-" },
            { label: "Lessions By Imaging", value: (disease_history.bone_lesions) ? imagingLesionsArr[disease_history.bone_lesions].label : "-" },
            // { label: "Diagnosis Facility", value: (diagnosis_location.length) ? diagnosis_location.toString() : "-" },
            { label: "Diagnosis Facility", value: ((disease_history.facility_name)) ? (disease_history.facility_name) : "-" },
            { label: "Diagnosis City", value: ((disease_history.city)) ? (disease_history.city) : "-" },
            { label: "Diagnosis State", value: ((disease_history.state)) ? (disease_history.state) : "-" },
            { label: "Current Physician", value: (disease_history.physician_name) ? disease_history.physician_name : "-" },
          ];
          this.setState({ "diseaseArr": diseaseArr });
        }

        // Side Effects
        // if (data.attributes.side_effects) {

        // }
        // Health History
        if (data.attributes.health_history) {
          console.log("data.attributes.health_history", data.attributes.health_history);
          this.setState({ "healthHistoryArr": data.attributes.health_history });
        }

        /* **************Outcome History***************/
        if (data.attributes.outcomes) {
          let outcomes = data.attributes.outcomes;
          let tmpArr = [];
          outcomes.map(function(obj, key) {
            let tmpObj = {};
            tmpObj.start_date = moment(obj.start_date).format("YYYY MMM");
            tmpObj.end_date = moment(obj.end_date).format("YYYY MMM");
            tmpObj.treatment = obj.outcome ;
            REMISSION_STATUS_OUTCOMES.map(function(outcome, k) {
              if (parseInt(obj.outcome) === parseInt(outcome.value)) {
                tmpObj.treatment = outcome.label;
                if (obj.cells_no && parseInt(obj.outcome) === 5) {
                  tmpObj.treatment = outcome.label + " (" + obj.cells_no + ")";
                } else {
                  tmpObj.treatment = outcome.label;
                }
              }
            });
            tmpArr.push(tmpObj);
          });
          this.setState({ "outcomesArr": tmpArr });
        }

        /* **************Fitness Level***************/
        if (data.attributes.fitness_level) {
          let fitness_level = data.attributes.fitness_level;
          let tmpArr = [];
          let isTrue = false;
          fitness_level.map(function(obj, key) {
            if (obj.status !== null) {
              let tmpObj = {};
              tmpObj.label = obj.title;
              tmpObj.value = (obj.status) ? "Yes" : "No";
              isTrue = true;
              tmpArr.push(tmpObj);
            }
            // if no option is selectd
            if (!isTrue && (parseInt(key) === parseInt(fitness_level.length - 1))) {
              let tmpObj = {};
              tmpObj.label = obj.title;
              tmpObj.value = "No";
              isTrue = true;
              tmpArr.push(tmpObj);
            }
          });
          console.log("key={key}", tmpArr);
          this.setState({ "fitnessArr": tmpArr });
        }


        // user data
        let personalData = data.attributes.patient_info;
        let race = "-";
        if (personalData.race) {
          raceArr.map(function(obj, val) {
            if (obj.value === personalData.race) {
              race = obj.label;
            }
          });
        }
        let gender = "-";
        if (personalData.gender) {
          if (personalData.gender === "female") {
            gender = "Female";
          } else {
            gender = "Male";
          }
        }
        let personalInforArr = [
          { label: "Gender", value: gender },
          { label: "Date of Birth", value: (personalData.dob) ? moment(personalData.dob).format("LL") : "-" },
          { label: "Race", value: race },
          { label: "Treatment Goals", value: (personalData.goal) ? personalData.goal : "-" },
        ];
        this.setState({ "name": personalData.name, "personalInforArr": personalInforArr });

      }
      if (nextProps.isSuccess || nextProps.isError) {
        this.props.resetSummaryData();
        this.setState({ "showLoader": false });
      }

    }
  }


  // on print function
  onPrint() {
    // canvas.width,canvas.height
    console.log("i am in print", this.state.userId);
    let token = encodeURI(base64.encode(base64.encode(this.props.token + "--token")));
    let id = encodeURI(base64.encode(base64.encode(this.state.userId + "--id")));
    let url = `${SERVER_URL}/pdfs/${id}/${token}/summary.pdf`;
    console.log("i am in print", url);
    // browserHistory.push(url);
    window.open(url);
    // this.setState({ "showLoader": true });
    // html2canvas(document.getElementById("summary_div"), {
    //   onrendered: function(canvas) {
    //     console.log("canvas", canvas);
    //     var canvasImg = canvas.toDataURL("image/jpg");
    //     $("#divhidden").html("<img src=\"" + canvasImg + "\" alt=\"\">");
    //     // let img = canvas.toDataURL();
    //     // console.log("img", img);
    //     // let doc = new jsPDF("landscape", "in", [canvas.width, canvas.height]);
    //     // // doc.addHTML(htmlObj);
    //     // doc.setFontSize(20);
    //     // doc.addImage(img, 0, 0, canvas.width, canvas.height);
    //     // console.log("doc is here", doc);
    //     // doc.save("Summary.pdf");
    //     setTimeout(function() {
    //       // let printContent = document.getElementById("divhidden");
    //       // let printWindow = window.open("", "", "left=50,top=50");
    //       window.print();
    //       // console.log("printContent", printContent);
    //       // if (printWindow) {
    //       //   printWindow.document.write(printContent.innerHTML);
    //       //   printWindow.document.write("<script src=\'https://code.jquery.com/jquery-1.10.1.min.js\'><\/script>");
    //       //   printWindow.document.write("<script>$(window).load(function(){ print(); close(); });<\/script>");
    //       //   printWindow.document.close();
    //       // }

    //       this.setState({ "showLoader": false });
    //     }.bind(this), 3000);

    //   }.bind(this),
    // });

  }
  onContinue(e) {
    e.preventDefault();
    browserHistory.push("/health-profile");
  }

  render() {
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        {/* <BackLink handle_back_link = {this.handleBackLink}/> */}
        {this.state.userId && <div className="print_div">
          <button
            onClick={ (e) => this.onPrint(e) }
            type="button"
            className="btn green-btn green-hvr-bounce-to-top labs-info-btn upload_link">
            <i className="flaticon-clipboard"></i><span>Print Summary</span>
          </button>
        </div>}
        <div className="container summary-container" id="summary_div">
          <div className="row sum_row">
            <div className="col-sm-12 summary_user_info"><h2 className="page-title summary_title">{this.state.name}</h2></div>
          </div>
          <div className="inner-summary-div">
            <div className="row">
              <Card label = "Personal Info" data={this.state.personalInforArr}/>
              <Card label = "Fitness Level" data={this.state.fitnessArr}/>
            </div>
            <div className="row">
              {this.state.diseaseArr.length > 0 && <Card label = "Disease History" data={this.state.diseaseArr}/>}
              <HealthHistoryCard label = "Health History" data={this.state.healthHistoryArr}/>
            </div>
            <div className="row">
              <TreatmentCard label = "Treatments" data={this.state.treatmentArr} constSideEffects={this.state.constSideEffects}/>
              {/* <TreatmentCard label = "Outcomes" data={this.state.outcomesArr}/> */}
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12 text-center treatment-op-continue">
            <button onClick={this.onContinue} type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
          </div>
        </div>
        <div id="divhidden">
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    // patientInfo: state.patient.patientinfo,
    data: state.summary.data,
    isRequesting: state.summary.isRequesting,
    isError: state.summary.isError,
    isSuccess: state.summary.isSuccess,
    // dynamicSideEffects: state.dynamicSideEffects,
    userinfo: state.user.userinfo,
  };
}
export default connect(mapStateToProps, { getSummaryData, getUserInfo, resetSummaryData })(MySummary);
