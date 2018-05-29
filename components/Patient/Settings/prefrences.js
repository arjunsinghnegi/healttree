import { Field, formValueSelector, reduxForm } from "redux-form";
import { getPatientInfo, resetPatient, savePatientInfo } from "../../../actions/PatientsActions";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import { renderCheckbox } from "../renderFields";


// Prefrence Class
class Prefrences extends Component {
  constructor(props) {
    super(props);
    let obj = {
      share_lab_results_researcher: false,
      share_lab_results_pharma: false,
      survey_researcher: false,
      survey_pharma: false,
    };
    this.state = {
      showLoader: false,
      prefrences: obj,
      userId: null,
      patientInfo: [],
    };
    this.changeConditionStatus = this.changeConditionStatus.bind(this);
  }

  // component finishes mounting
  componentWillMount() {
    this.props.getPatientInfo(this.props.token);
  }
  // component will recieve props
  componentWillReceiveProps(nextProps, props) {
    // console.log("next", nextProps, props);
    if (nextProps !== props) {
      if (nextProps.patientPrefrences && nextProps.isAuthenticated) {
        let pref = nextProps.patientPrefrences;
        let obj = {
          share_lab_results_researcher: (pref.share_lab_researcher) ? pref.share_lab_researcher : false,
          share_lab_results_pharma: (pref.share_lab_researcher) ? pref.share_lab_pharma : false,
          survey_researcher: (pref.participate_researcher_survey) ? pref.share_lab_researcher : false,
          survey_pharma: (pref.participate_pharma_survey) ? pref.share_lab_researcher : false,
        };
        this.setState({ "showLoader": false, "prefrences": obj, "patientInfo": pref });
        this.props.resetPatient();

      }
      if (nextProps.isAuthenticating) {
        this.setState({ "showLoader": true });
      }
      if (nextProps.isSavingSuccess) {
        Alert.success("Prefrences successfully updated.");
        this.setState({ "showLoader": false });
      }
    }
    if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userId: userinfo.id });
    }
  }
  onSubmit(formData) {
    let obj = this.state.prefrences;
    var saveObj = {
      share_lab_researcher: obj.share_lab_results_researcher,
      share_lab_pharma: obj.share_lab_results_pharma,
      participate_researcher_survey: obj.survey_researcher,
      participate_pharma_survey: obj.survey_pharma,
    };
    // console.log("%%", saveObj);
    this.props.dispatch(savePatientInfo(this.props.token, saveObj, this.state.patientInfo, this.state.userId));
  }

  changeConditionStatus(e, stateName, value) {
    e.preventDefault();
    let obj = {
      share_lab_results_researcher: this.state.prefrences.share_lab_results_researcher,
      share_lab_results_pharma: this.state.prefrences.share_lab_results_pharma,
      survey_researcher: this.state.prefrences.survey_researcher,
      survey_pharma: this.state.prefrences.survey_pharma,
    };
    if (stateName === "share_lab_results_researcher") {
      obj.share_lab_results_researcher = value;
      // this.setState({ "prefrences.share_lab_results_researcher": value });
    }
    if (stateName === "share_lab_results_pharma") {
      obj.share_lab_results_pharma = value;
      // this.setState({ "share_lab_results_pharma": value });
    }
    if (stateName === "survey_researcher") {
      obj.survey_researcher = value;
      // this.setState({ "survey_researcher": value });
    }
    if (stateName === "survey_pharma") {
      obj.survey_pharma = value;
      // this.setState({ "survey_pharma": value });
    }
    // console.log("prefrences>>", obj);
    this.setState({ "prefrences": obj });
  }
  render() {
    const This = this;
    const { handleSubmit } = this.props;
    return (
      <div className="tabs-div">
        {this.state.showLoader && <Loader />}
        <form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          {/* Share lab results with researcher */}
          <div className="form-group row">
            <label htmlFor="inputEmail3" className="col-md-4 col-form-label">Share Lab Results with Researcher</label>
            <div className="col-sm-4">
              <div className="btn-group toggle-switch" id="status" data-toggle="buttons">
                <label className={this.state.prefrences.share_lab_results_researcher ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => This.changeConditionStatus(e, "share_lab_results_researcher", true) }>
                  <Field
                    name="heart_condition[module_id][status]"
                    component="input"
                    type="radio"
                    value="Yes"
                    checked={!this.state.prefrences.share_lab_results_researcher}
                  />
              Yes</label>
                <label className={!this.state.prefrences.share_lab_results_researcher ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => This.changeConditionStatus("share_lab_results_researcher", false) }>
                  <Field
                    name="fish_test_performed[module_id][status]"
                    component="input"
                    type="radio"
                    value="No"
                    checked={this.state.prefrences.share_lab_results_researcher}
                  />
                No</label>
              </div>
            </div>
          </div>

          {/*  Share Lab Results with Pharma */}
          <div className="form-group row">
            <label htmlFor="inputEmail3" className="col-md-4 col-form-label">Share Lab Results with Pharma</label>
            <div className="col-sm-4">
              <div className="btn-group toggle-switch" id="status" data-toggle="buttons">
                <label className={this.state.prefrences.share_lab_results_pharma ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => This.changeConditionStatus(e, "share_lab_results_pharma", true) }>
                  <Field
                    name="share_lab_results_pharma"
                    component="input"
                    type="radio"
                    value="Yes"
                    checked={!this.state.prefrences.share_lab_results_pharma}
                  />
              Yes</label>
                <label className={!this.state.prefrences.share_lab_results_pharma ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => This.changeConditionStatus(e, "share_lab_results_pharma", false) }>
                  <Field
                    name="share_lab_results_pharma"
                    component="input"
                    type="radio"
                    value="No"
                    checked={this.state.prefrences.share_lab_results_pharma}
                  />
                No</label>
              </div>
            </div>
          </div>
          {/* Participate to Researcher Surveys */}
          <div className="form-group row">
            <label htmlFor="inputEmail3" className="col-md-4 col-form-label">Participate to Researcher Surveys</label>
            <div className="col-sm-4">
              <div className="btn-group toggle-switch" id="status" data-toggle="buttons">
                <label className={this.state.prefrences.survey_researcher ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => This.changeConditionStatus(e, "survey_researcher", true) }>
                  <Field
                    name="survey_researcher"
                    component="input"
                    type="radio"
                    value="Yes"
                    checked={!this.state.prefrences.survey_researcher}
                  />
              Yes</label>
                <label className={!this.state.prefrences.survey_researcher ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => This.changeConditionStatus(e, "survey_researcher", false) }>
                  <Field
                    name="survey_researcher"
                    component="input"
                    type="radio"
                    value="No"
                    checked={this.state.prefrences.survey_researcher}
                  />
                No</label>
              </div>
            </div>
          </div>
          {/* Participate to Pharma Survey */}
          <div className="form-group row">
            <label htmlFor="inputEmail3" className="col-md-4 col-form-label">Participate to Pharma Surveys</label>
            <div className="col-sm-4">
              <div className="btn-group toggle-switch" id="status" data-toggle="buttons">
                <label className={this.state.prefrences.survey_pharma ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => This.changeConditionStatus(e, "survey_pharma", true) }>
                  <Field
                    name="survey_pharma"
                    component="input"
                    type="radio"
                    value="Yes"
                    checked={!this.state.prefrences.survey_pharma}
                  />
              Yes</label>
                <label className={!this.state.prefrences.survey_pharma ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => This.changeConditionStatus(e, "survey_pharma", false) }>
                  <Field
                    name="survey_pharma"
                    component="input"
                    type="radio"
                    value="No"
                    checked={this.state.prefrences.survey_pharma}
                  />
                No</label>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-5 text-center">
              <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Save</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
Prefrences = reduxForm({
  form: "Prefrences",
  enableReinitialize: true,
})(Prefrences);

function mapStateToProps(state) {
  return {
    isAuthenticating: state.patient.isAuthenticating,
    patientPrefrences: state.patient.patientinfo,
    isSavingSuccess: state.patient.isSavingSuccess,
    isFetchingSuccess: state.patient.isSuccess,
    isAuthenticated: state.patient.isAuthenticated,
    userInfo: state.user.userinfo,
  };
}


export default connect(mapStateToProps, { getPatientInfo })(Prefrences);
