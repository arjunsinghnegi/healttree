import { browserHistory, Link } from "react-router";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { getPatientInfo, savePatientInfo } from "../../../actions/PatientsActions";
import React, { Component } from "react";
import { renderCheckbox, renderDateField, renderInputField, renderSelectField } from "../renderFields";
import base64 from "base-64";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import moment from "moment";
import validate from "../validate";


class MyPatientPortalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      errDob: null,
      dob: null,
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  componentWillMount() {
    this.setState({ showLoader: true });
    this.props.dispatch(getUserInfo(this.props.token));
    this.props.dispatch(getPatientInfo(this.props.token));
    console.log("token>>>", this.props.token);
    console.log("encrypted token", base64.encode(base64.encode(this.props.token + "--token")));
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.isSavingSuccess) {
      browserHistory.push("/consent-form");
    }

    if (nextProps.initialValues && nextProps.initialValues !== props.initialValues) {
      let initialValues = nextProps.initialValues;
      if (initialValues.dob) {
        this.setState({ dob: moment(initialValues.dob) });
      }
      this.setState({ patientInfo: initialValues, showLoader: false });
    }
    if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      console.log("userinfo>>>", userinfo);
      this.setState({ userId: userinfo.id });
    }
  }
  onSubmit(formData) {
    // browserHistory.push("/consent-form");
    console.log("formData", formData);
    var saveObj = {
      portal_username: base64.encode(base64.encode(formData.portal_username)),
      portal_password: base64.encode(base64.encode(formData.portal_password)),
      portal_url: base64.encode(base64.encode(formData.portal_url)),
    };
    console.log("saveObj", saveObj);
    this.props.dispatch(savePatientInfo(this.props.token, saveObj, this.state.patientInfo, this.state.userId));
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
          <h2 className="page-title">Patient Portal Account </h2>
          <span className="back"><Link to="/my-labs-info"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Back</Link></span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Username</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="portal_username"
                  type="text"
                  className="form-control"
                  id="portal_username"
                  maxLength="100"
                  placeholder="Your patient portal username"
                  autoComplete = "off"
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Password</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="portal_password"
                  type="password"
                  className="form-control"
                  id="portal_password"
                  maxLength="100"
                  placeholder="Your patient portal password"
                  autoComplete = "off"
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Portal URL</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="portal_url"
                  type="text"
                  className="form-control"
                  id="portal_url"
                  maxLength="100"
                  placeholder="Your patient portal URL"
                  autoComplete = "off"
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
MyPatientPortalInfo = reduxForm({
  form: "MyLabsInfo",
  enableReinitialize: true,
  validate,
})(MyPatientPortalInfo);
function mapStateToProps(state) {
  return {
    statusText: state.patient.statusText,
    isAuthenticating: state.patient.isAuthenticating,
    initialValues: state.patient.patientinfo,
    userinfo: state.user.userinfo,
    isSavingSuccess: state.patient.isSavingSuccess,
  };
}

export default connect(mapStateToProps, { getPatientInfo, savePatientInfo })(MyPatientPortalInfo);
