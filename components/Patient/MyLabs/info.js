import { browserHistory, Link } from "react-router";
import { Field, reduxForm } from "redux-form";
import { getPatientInfo, savePatientInfo } from "../../../actions/PatientsActions";
import React, { Component } from "react";
import { normalizePhone, renderDateField, renderInputField } from "../renderFields";
import base64 from "base-64";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import moment from "moment";
import validate from "../validate";

class MyLabsInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      errDob: null,
      dob: null,
      patientInfo: [],
      userId: null,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment().subtract(18, "years"), // max date in datepicker
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  componentWillMount() {
    this.setState({ showLoader: true });
    this.props.dispatch(getUserInfo(this.props.token));
    this.props.dispatch(getPatientInfo(this.props.token));
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.isSavingSuccess) {
      browserHistory.push("/my-patient-portal-info");
    }
    if (nextProps.initialValues && nextProps.initialValues !== props.initialValues) {
      let initialValues = nextProps.initialValues;
      if (initialValues.dob) {
        this.setState({ dob: moment(initialValues.dob) });
      }
      this.setState({ patientInfo: initialValues });
    }
    if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userId: userinfo.id });
    }
    this.setState({ showLoader: false });
  }
  onSubmit(formData) {
    // let dob = this.state.dob ? moment(this.state.dob).format("YYYY-MM-DD") : null;
    // if (dob === null) {
    //   this.setState({ errDob: "Please enter dob(Date of birth)" });
    // }
    // formData["dob"] = dob;
    formData["ssn"] = parseInt(formData.ssn, 10);
    var saveObj = {
      // dob: formData.dob,
      ssn: base64.encode(base64.encode(formData.ssn)),
      contact_number: formData.contact_number,
    };
    this.props.dispatch(savePatientInfo(this.props.token, saveObj, this.state.patientInfo, this.state.userId));
    // browserHistory.push("/my-patient-portal-info");
  }
  handleDateChange(date) {
    this.setState({
      dob: date, // moment(date).format('DD/MM/YYYY')
    });
  }
  render() {
    const { handleSubmit } = this.props;
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">A Little More About You </h2>
          <span className="back"><Link to="/clinical-trials"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Back</Link></span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-4 col-form-label">Phone Number</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="contact_number"
                  type="text"
                  className="form-control"
                  id="phone"
                  maxLength="12"
                  placeholder="Your phone number"
                  normalize={normalizePhone}
                  component={renderInputField} />
              </div>
            </div>
            {/* <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-4 col-form-label">Date of birth</label>
              <div className="mui-select custom-box  col-sm-4 col-md-4 col-lg-3 pl-10">
                <Field
                  name="dob"
                  type="text"
                  component={renderDateField}
                  placeholder="MM/DD/YYYY"
                  className="form-control date_picker"
                  showYearFlag={true}
                  selected={this.state.dob}
                  onDateChange={this.handleDateChange}
                  readOnly= {true}
                  maxDate={this.state.maxDate}
                  minDate={this.state.minDate}
                  showMonthFlag={true} />
                <span className="text-error">{this.state.errDob}</span>
              </div>
            </div> */}
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-4 col-form-label">Last 4 digits of your Social Security Number</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="ssn"
                  type="text"
                  className="form-control"
                  id="phone"
                  maxLength="4"
                  placeholder="Last 4 digits of SSN"
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusText: state.patient.statusText,
    isAuthenticating: state.patient.isAuthenticating,
    initialValues: state.patient.patientinfo,
    userinfo: state.user.userinfo,
    isSavingSuccess: state.patient.isSavingSuccess,
  };
}

MyLabsInfo = reduxForm({
  form: "MyLabsInfo",
  enableReinitialize: true,
  validate,
})(MyLabsInfo);

export default connect(mapStateToProps, { getPatientInfo, savePatientInfo })(MyLabsInfo);
