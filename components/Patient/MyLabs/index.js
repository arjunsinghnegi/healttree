import { browserHistory, Link } from "react-router";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { getCinicalTrials, resetClinicalTrials, saveClinicalTrial } from "../../../actions/clinicalLabsActions";
import React, { Component } from "react";
import { renderCheckbox, renderDateField, renderInputField, renderNumberField, renderSelectField, renderTextArea } from "../renderFields";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import DatePicker from "../../common/datePicker";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import MaskedInput from "react-maskedinput";
import moment from "moment";
import { setModuleCount } from "../../../actions/miscActions";
import FullHealthModal from "../Modals/showCompleteHealth";

class MyLabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(), // max date in datepicker
      userinfo: null,
      clinicalTrialId: null,
      selected: null,
      userType: 0,
      openFullHealthInfoModal: false,
      formObj: {
        "trial_date": null,
        "monoclonal_protein": "",
        "kappa_count": "",
        "lambda_count": "",
        "kappa_lambda_radio": "",
        "creatinine": "",
        "wbc": "",
        "hemoglobin": "",
      },
      errObj: {
        "trial_date": null,
      },
    };
    this.props.getUserInfo(this.props.token);
    this.props.getCinicalTrials(this.props.token);
    this._onChange = this._onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getMyLabs = this.getMyLabs.bind(this);
    // this.handleBackLink = this.handleBackLink.bind(this);
  }
  handleDateChange(date, err) {
    let formObj = this.state.formObj;
    formObj.trial_date = date;
    let errObj = this.state.errObj;
    errObj.trial_date = err;

    this.setState({
      formObj: formObj,
      errObj: errObj, // moment(date).format("DD/MM/YYYY")
    });
  }
  _onChange(key, e) {
    let formObj = this.state.formObj;
    formObj[key] = e.target.value;
  }
  onSubmit(e) {
    e.preventDefault();
    let formObj = this.state.formObj;
    if (!formObj.trial_date) {
      Alert.error("Please enter valid trial date.");
      return;
    }
    // console.log("value in formobj",formObj)
    if (!formObj.monoclonal_protein && !formObj.kappa_count && !formObj.lambda_count && !formObj.kappa_lambda_radio && !formObj.creatinine) {
      Alert.error("Please enter atleast one lab value");
      return;
    }
    let formObject = {
      trial_date: formObj.trial_date,
      monoclonal_protein: parseFloat(formObj.monoclonal_protein),
      kappa_count: parseFloat(formObj.kappa_count),
      lambda_count: parseFloat(formObj.lambda_count),
      kappa_lambda_radio: parseFloat(formObj.kappa_lambda_radio),
      creatinine: parseFloat(formObj.creatinine),
      wbc: parseFloat(formObj.wbc),
      hemoglobin: parseFloat(formObj.hemoglobin),
    };

    let trial_date = moment(formObj.trial_date).format("YYYY-MM-DD");
    formObj.trial_date = trial_date;
    console.log("formObj", formObj);
    // return false;
    let saveObj = {
      "data": {
        "type": "clinical_trials",
        "attributes": formObject,
        "relationships": {
          "user": {
            "data": { "type": "users", "id": this.state.userinfo.id },
          },
        },
      },
    };
    if (this.state.clinicalTrialId) {
      saveObj.data.id = this.state.clinicalTrialId;
    }
    this.props.saveClinicalTrial(this.props.token, this.state.clinicalTrialId, saveObj);

  }
  getMyLabs(e) {
    e.preventDefault();
    browserHistory.push("/my-labs-info");
  }

  handleClinicalModal(e) {
    let userModuleCounts = localStorage.getItem("modulecounts");
    userModuleCounts = JSON.parse(userModuleCounts);
    let tmpObj = {};
    tmpObj.clinical_trials_count = 1;
    tmpObj.treatments_count = userModuleCounts.treatments;
    this.props.setModuleCount(tmpObj);
    this.setState({
      openFullHealthInfoModal: false,
    }, function() {
      // browserHistory.push("/treatment-options");
    });
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.userInterest && nextProps.userInterest !== props.userInterest) {
        if (nextProps.userInterest && nextProps.userInterest.interested_in) {
          this.setState({ userType: parseInt(nextProps.userInterest.interested_in) });
        }
      }
      if (nextProps.isRequesting) {
        this.setState({ showLoader: true });
      }
      if (nextProps.isSuccess && nextProps.data) {
        if (nextProps.data.length) {
          // let clinical_id = nextProps.data[0].id;
          // let data = nextProps.data[0].attributes;
          // let date = (data.trial_date) ? moment(data.trial_date, "YYYY/MM/DD") : null;
          // let formObj = nextProps.data[0].attributes;
          // formObj.trial_date = date;
          // this.setState({ formObj: formObj, selected: date, clinicalTrialId: clinical_id }, function() {
          this.setState({ showLoader: false });
          //   this.props.resetClinicalTrials();
          // });
        } else {
          console.log("i am eghre");
          this.setState({ showLoader: false });
        }

      }
      if (nextProps.userinfo !== props.userinfo) {
        this.setState({ userinfo: nextProps.userinfo });
      }
      if (nextProps.isSaveRequesting) {
        console.log("nextProps.isSaveRequesting", nextProps.isSaveRequesting);
        this.setState({ showLoader: true });
      }

      if (nextProps.isSaveSuccess) {
        Alert.success("Clinical trials information have been saved successfully.");
        // if (this.state.userType === 0) {
        //   let userModuleCounts = localStorage.getItem("modulecounts");
        //   userModuleCounts = JSON.parse(userModuleCounts);
        //   // console.log("userModuleCounts>>>>>>>", userModuleCounts);
        //   let dataId = (nextProps.data && nextProps.data.id);
        //   // console.log("dataId********", dataId);
        //   // userModuleCounts.clinicalTrial = 0;
        //   if (parseInt(userModuleCounts.clinicalTrial) === 0 && dataId) {
        //     console.log(" openclinicalTrialsModal");
        //     this.setState({ openFullHealthInfoModal: true });
        //   }
        // }
        this.setState({ showLoader: false });
        this.props.resetClinicalTrials();
      }
      if (nextProps.isSaveError) {
        // console.log("error here");
        if (nextProps.errData && nextProps.errData.length) {
          // console.log("nextProps.errData[0].title", nextProps.errData[0].title);
          Alert.error(nextProps.errData[0].title);
        } else {
          Alert.error("Something went wrong please try again later.");
        }

        this.setState({ showLoader: false });
      }
    }
  }
  render() {
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">Clinical Trials</h2>
          <div className="myeloma_content">
            <label>Clinical Trials are the way that new myeloma discoveries are found. They are an important part of our search for better ways to prevent, treat and cure cancer.
            Some benefits to participating in a clinical trial include:
            <span> 1) Access to new drugs and treatments, sometimes years before they are available in the clinic.</span>
            <span> 2) You are closely monitored by your clinical team.</span>
            <span> 3) Your participation makes a valuable contribution in the fight to end cancer.</span>
            </label>

            <label className="clinical-trial-ul my-labs-lbl">1. Enter your most recent lab values for the following. </label>
          </div>
          <form>
            <div className="clinical-frst-section">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <div className="form-group row clinical-trial-dv">
                    <label htmlFor="inputEmail3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">
                Date</label>
                    <div className="mui-select custom-box col-sm-10 col-md-8 col-lg-5">
                      <DatePicker
                        name="trial_date"
                        type="text"
                        component={renderDateField}
                        placeholder="MM/DD/YYYY"
                        selected={this.state.selected}
                        className="form-control"
                        showYearFlag={true}
                        readOnly= {false}
                        tabIndex={1}
                        maxDate={this.state.end_date ? moment(this.state.end_date) : this.state.maxDate}
                        minDate={this.state.minDate}
                        onDateChange={this.handleDateChange}
                        showMonthFlag={true} />
                    </div>
                    {/* <span className="text-error">{this.state.trail_date_err}</span> */}
                  </div>
                  <div className="form-group row clinical-trial-dv">
                    <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">Monoclonal Protein (M-Protein)</label>
                    <div className="col-sm-10 col-md-8 col-lg-5">
                      {/* <MaskedInput tabIndex={tabIndex} type="text" mask="1111" name={name} size={size} value={val} className={className} onChange={onChange}/> */}
                      <MaskedInput
                        name="monoclonal_protein"
                        type="text"
                        mask="1.11"
                        className="form-control"
                        placeholder="0.00"
                        tabIndex={2}
                        onBlur={(e) => this._onChange("monoclonal_protein", e)}
                        value={this.state.formObj.monoclonal_protein}
                      />
                    </div>
                    <label htmlFor="inputPassword3" className="col-sm-2 col-md-2 col-lg-1 col-form-label clinical-label">g/dL</label>
                  </div>
                  <div className="form-group row clinical-trial-dv">
                    <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">Kappa Free Light Chains (Serum/Blood)</label>
                    <div className="col-sm-10 col-md-8 col-lg-5">
                      <MaskedInput
                        name="kappa_count"
                        type="text"
                        mask="11.11"
                        className="form-control"
                        placeholder="00.00"
                        tabIndex={3}
                        onBlur={(e) => this._onChange("kappa_count", e)}
                        value={this.state.formObj.kappa_count}
                      />
                    </div>
                    <label htmlFor="inputPassword3" className="col-sm-2 col-md-2 col-lg-1 col-form-label clinical-label">mg/dL</label>
                  </div>
                  <div className="form-group row clinical-trial-dv">
                    <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">Lambda Free Light Chains (Serum/Blood)</label>
                    <div className="col-sm-10 col-md-8 col-lg-5">
                      <MaskedInput
                        name="lambda_count"
                        type="text"
                        mask="11.11"
                        className="form-control"
                        placeholder="00.00"
                        tabIndex={4}
                        onBlur={(e) => this._onChange("lambda_count", e)}
                        value={this.state.formObj.lambda_count}
                      />
                    </div>
                    <label htmlFor="inputPassword3" className="col-sm-2 col-md-2 col-lg-1 col-form-label clinical-label">mg/dL</label>
                  </div>
                  <div className="form-group row clinical-trial-dv">
                    <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">Kappa/Lambda Ratio (Serum/Blood)</label>
                    <div className="col-sm-10 col-md-8 col-lg-5">
                      <MaskedInput
                        name="kappa_lambda_radio"
                        type="text"
                        mask="1.11"
                        className="form-control"
                        tabIndex={5}
                        placeholder="0.00"
                        onBlur={(e) => this._onChange("kappa_lambda_radio", e)}
                        value={this.state.formObj.kappa_lambda_radio}
                      />
                    </div>
                  </div>
                  <div className="form-group row clinical-trial-dv">
                    <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">Creatinine Clearance</label>
                    <div className="col-sm-10 col-md-8 col-lg-5">
                      <MaskedInput
                        name="creatinine"
                        type="text"
                        mask="1.11"
                        className="form-control"
                        placeholder="0.00"
                        tabIndex={6}
                        onBlur={(e) => this._onChange("creatinine", e)}
                        value={this.state.formObj.creatinine}
                      />
                    </div>
                    <label htmlFor="inputPassword3" className="col-sm-2 col-md-2 col-lg-1 col-form-label clinical-label">mg/dL</label>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 text-center">
                  <div className="wrapper right-dot-sec">
                    <div className="line"></div>
                    <div className="wordwrapper">
                      <div className="word">or</div>
                    </div>
                  </div>
                  {/* <Link to="/my-labs-info" className="btn green-btn btn-rt green-hvr-bounce-to-top right-dot-btn">Get My Labs</Link> */}
                  <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top right-dot-btn" onClick={(e) => this.getMyLabs(e)}>Get My Labs</button>
                </div>
              </div>
            </div>
            <div className="">
              <div className="form-group row clinical-trial-dv">
                <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-12 col-form-label"><b>2. Enter the following lab results to indicate the current state of your disease.</b></label>
              </div>
              <div className="form-group row clinical-trial-dv">
                <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-3 col-form-label">White Blood Cell count (WBC)</label>
                <div className="col-sm-10 col-md-8 col-lg-3">
                  <MaskedInput
                    name="wbc"
                    type="text"
                    mask="11.11"
                    className="form-control"
                    placeholder="00.00"
                    tabIndex={7}
                    onBlur={(e) => this._onChange("wbc", e)}
                    value={this.state.formObj.wbc}
                  />
                </div>
                <label htmlFor="inputPassword3" className="col-sm-4 col-md-2 col-lg-1 col-form-label clinical-label">K/uL</label>
              </div>
              <div className="form-group row clinical-trial-dv">
                <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-3 col-form-label">Hemoglobin (HGB)</label>
                <div className="col-sm-10 col-md-8 col-lg-3">
                  <MaskedInput
                    name="hemoglobin"
                    type="text"
                    mask="11.1"
                    className="form-control"
                    placeholder="00.0"
                    tabIndex={8}
                    onBlur={(e) => this._onChange("hemoglobin", e)}
                    value={this.state.formObj.hemoglobin}
                  />
                  {/* <Field
                  name="hemoglobin"
                  type="number"
                  className="form-control "
                  id="Last"
                  maxLength="12"
                  placeholder=""
                  tabIndex={2}
                  component={renderInputField} /> */}
                </div>
                <label htmlFor="inputPassword3" className="col-sm-4 col-md-2 col-lg-1 col-form-label clinical-label">g/dL</label>
              </div>
            </div>
            {this.state.userinfo && <div className="form-group row clinical-trial-dv">
              <div className="col-sm-12 col-md-12 col-lg-3 col-form-label"></div>
              <div className="col-sm-10 col-md-8 col-lg-3 save-trial-btn">
                <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" tabIndex={9} onClick={this.onSubmit}>Save</button>
              </div>
            </div>}
          </form>
          {/* <div className="myeloma_content">
            <p><b>If you don't have this information, click the Get My Labs button, provide some additional information and we will find and enter them for you.</b></p>

          </div> */}
          {/* <div className="col-sm-12 text-center">
            <Link to="/my-labs-info" className="btn green-btn green-hvr-bounce-to-top labs-info-btn">Get My Labs</Link>
          </div> */}
        </div>
        {this.state.openFullHealthInfoModal && <FullHealthModal
          modal_var = {this.state.openFullHealthInfoModal}
          handle_modal = { (e) => this.handleClinicalModal(e) }
          userinfo={this.state.userinfo}
          token={this.props.token}
          props={this.props}
          title= "Upload Questionnaire"
        />}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    data: state.clinicalTrials.data,
    isRequesting: state.clinicalTrials.isRequesting,
    isError: state.clinicalTrials.isError,
    isSuccess: state.clinicalTrials.isSuccess,
    isSaveRequesting: state.clinicalTrials.isSaveRequesting,
    isSaveError: state.clinicalTrials.isSaveError,
    isSaveSuccess: state.clinicalTrials.isSaveSuccess,
    userinfo: state.user.userinfo,
    userInterest: state.metaData.userInterest,
    errData: state.clinicalTrials.errData,
  };
}
MyLabs = reduxForm({
  form: "MyLabsForm",
  enableReinitialize: true,
})(MyLabs);

export default connect(mapStateToProps, { getCinicalTrials, getUserInfo, saveClinicalTrial, resetClinicalTrials, setModuleCount })(MyLabs);
