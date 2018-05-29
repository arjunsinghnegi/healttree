import { browserHistory, Link } from "react-router";
import { Card, CardText, CardTitle } from "reactstrap";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import { changeFields, getMyelomaCenters, getPatientInfo, savePatientInfo } from "../../../actions/PatientsActions";

import { GoogleMap, InfoWindow, Marker, withGoogleMap } from "react-google-maps";
import { normalizePhone, raceArr, renderCheckbox, renderDateField, renderInputField, renderSelectField, renderTextArea } from "../renderFields";
import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "../../common/datePicker";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import ModalWindow from "../Modals/getStartModal";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import validate from "../validate";

const SimpleMapExampleGoogleMap = withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={props.defaultZoom}
    center={props.defaultLatLng}
  >
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={{ lat: marker.attributes.latitude, lng: marker.attributes.longitude }}
        onClick={() => props.onMarkerClick(marker)}
      >
        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>{`${marker.attributes.name}`} <br/> ({`${marker.attributes.contact_number}`}) </div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));
class Patient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // travelOption: false,
      check: false,
      gender: "female",
      patientInfo: [],
      userId: null,
      dob: null,
      selected: null,
      race: null,
      zipcode: null,
      zipState: true,
      errDob: null,
      err_treatment_goal: null,
      myelomaCenters: [],
      showError: false,
      showMap: false,
      showLoader: false,
      // array of objects of markers
      markers: [],
      defaultZoom: 8,
      defaultLatLng: { lat: 39.5369523, lng: -111.4782672 },
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(), // max date in datepicker
      cancerCare: false,
    };
    this.getMyelomaCentersOnZipCode = this.getMyelomaCentersOnZipCode.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    // this.changeStatus = this.changeStatus.bind(this);
    this.zipCodeChanged = this.zipCodeChanged.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
    this.detectSpacePresent = this.detectSpacePresent.bind(this);
    this.detectSpaceTreatment = this.detectSpaceTreatment.bind(this);
    this.updateCancerCare = this.updateCancerCare.bind(this);
    this.rawDate = null;
  }


  checkcenters = () => {
    this.setState({
      check: true,
      showMap: false,
      defaultZoom: 4,
    });
    this.props.getMyelomaCenters(this.props.token, null);
  }
  componentDidMount() {
    document.getElementById("about_first").focus();
    //  this.nameInput.focus();
  }

  // for switches
  detectSpacePresent(e) {
    if (e.keyCode == 32) {
      e.preventDefault();
      // this.state.gender
      // if (this.state.gender === "male") {
      //   this.setState({ gender: "female" });
      // }
      if (this.state.gender === "female") {
        this.setState({ gender: "male" });
      }

    }
  }
  // for switches
  detectSpaceTreatment(e, stateObj) {
    if (e.keyCode == 32) {
      e.preventDefault();
      // if (stateObj === "travelOption") {
      //   this.changeStatus(e);
      // }
      if (stateObj === "cancerCare") {
        this.updateCancerCare(e);
      }

    }
  }
  // change cancer care
  updateCancerCare(e) {
    e.preventDefault();
    // this.props.changeFields(this.props.initialValues);
    this.setState({ cancerCare: !this.state.cancerCare }, function() {
      if (!this.state.cancerCare) {
        this.props.dispatch(change("AboutmeForm", "care_giver_name", ""));
        this.props.dispatch(change("AboutmeForm", "care_giver_email", ""));
        this.props.dispatch(change("AboutmeForm", "care_giver_phone", ""));
      }
    });
  }
  // Toggle to "true" to show InfoWindow and re-renders component
  handleMarkerClick(targetMarker) {
    this.setState({
      myelomaCenters: this.state.myelomaCenters.map((marker) => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true,
          };
        }
        return marker;
      }),
    });
  }

  handleMarkerClose(targetMarker) {

    this.setState({
      myelomaCenters: this.state.myelomaCenters.map((marker) => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false,
          };
        }
        return marker;
      }),
    });
  }


  componentWillMount() {
    // Open modal - auto
    // if (this.props.dtree === true) {
    //   this.setState({ modal1: !this.state.modal1 });
    // }
    this.props.dispatch(getUserInfo(this.props.token));
    this.props.dispatch(getPatientInfo(this.props.token));
    this.setState({ "showLoader": true });
  }


  componentWillReceiveProps(nextProps, props) {
    if (nextProps.isSavingSuccess) {
      browserHistory.push("/myeloma-diagnosis");
    }
    if (nextProps.myelomaCenters && nextProps.myelomaCenters !== this.props.myelomaCenters) {
      nextProps.myelomaCenters.map(function(obj, i) {
        nextProps.myelomaCenters[i].showInfo = true;
      });
      this.setState({ myelomaCenters: nextProps.myelomaCenters }, function() {
        let myelomaCntrLen = this.state.myelomaCenters.length;
        let lat = (this.state.myelomaCenters[myelomaCntrLen - 1].attributes && this.state.myelomaCenters[myelomaCntrLen - 1].attributes.latitude) ? this.state.myelomaCenters[myelomaCntrLen - 1].attributes.latitude : 39.5369523;
        let lng = (this.state.myelomaCenters[myelomaCntrLen - 1].attributes && this.state.myelomaCenters[myelomaCntrLen - 1].attributes.longitude) ? this.state.myelomaCenters[myelomaCntrLen - 1].attributes.longitude : -111.4782672;
        let showMap = false;
        if (this.state.myelomaCenters.length) {
          showMap = true;
        }
        this.setState({ "defaultLatLng": { "lat": lat, "lng": lng }, "showMap": showMap });
      });
      if (!nextProps.myelomaCenters.length) {
        this.setState({ showError: true });
      } else {
        this.setState({ showError: false });
      }
    }
    if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userId: userinfo.id });
    }
    if (nextProps.isFetchingSuccess) {
      this.setState({ "showLoader": false });
    }

    if (nextProps.initialValues && this.props.initialValues !== nextProps.initialValues) {
      let initialValues = nextProps.initialValues;
      if (!initialValues.is_read_myeloma) {
        this.setState({ modal1: !this.state.modal1 });
      }

      // call function to get myleoma centers
      // if (initialValues.able_to_travel) {
      //   this.getMyelomaCentersOnZipCode();
      // }
      if (initialValues.dob !== null) {
        this.setState({ dob: moment(initialValues.dob), selected: moment(initialValues.dob) });
      }
      if (initialValues.care_giver_email || initialValues.care_giver_name || initialValues.care_giver_phone) {
        this.setState({ cancerCare: true });
      }
      this.setState({ patientInfo: initialValues,
        "gender": initialValues.gender,
        // "travelOption": true,
        // dobMonth: initialValues.dob_month,
        // dobYear: initialValues.dob_year,
        "zipcode": initialValues.zipcode,
        "race": initialValues.race }, function() {
        this.getMyelomaCentersOnZipCode(initialValues.zipcode);
      });
    }
  }

  onSubmit(formData) {
    formData["gender"] = (this.state.gender) ? this.state.gender : "female";
    // formData["able_to_travel"] = this.state.travelOption;
    if (!formData.treatment_goal || formData.treatment_goal.trim() === "") {
      this.setState({ err_treatment_goal: "Please share your treatment goals." });
      return false;
    }
    // make sure all the date formats are correct
    // check for current format

    let dob = this.state.dob ? moment(this.state.dob).format("YYYY-MM-DD") : null;
    if (dob === null) {
      this.setState({ errDob: "Please enter valid date of birth." });
      return false;
    }

    formData["dob"] = dob;
    if (formData.race) {
      formData["race"] = formData.race.value === undefined ? this.state.race : formData.race.value;
    }
    // care_giver_email
    if (!this.state.cancerCare) {
      formData["care_giver_email"] = "";
      formData["care_giver_name"] = "";
      formData["care_giver_phone"] = "";
    }
    // care_giver_name

    // care_giver_phone
    var saveObj = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      dob: formData.dob,
      race: formData.race,
      agreed: formData.agreed,
      able_to_travel: formData.able_to_travel,
      zipcode: formData.zipcode,
      accepted_understand_clause: formData.accepted_understand_clause,
      treatment_goal: formData.treatment_goal,
      is_read_myeloma: true,
      care_giver_email: formData.care_giver_email,
      care_giver_name: formData.care_giver_name,
      care_giver_phone: formData.care_giver_phone,
    };

    this.props.dispatch(savePatientInfo(this.props.token, saveObj, this.state.patientInfo, this.state.userId));
  }

  // Open modal on add and update department
  open_modal(e) {
  //  e.preventDefault();
    document.getElementById("about_first").focus();
    this.setState({
      modal1: !this.state.modal1,
    });
  }

  getMyelomaCentersOnZipCode(zipcode) {
    // let zipcode = this.props.zipcode;
    if (zipcode === undefined) {
      this.setState({ zipState: false });
      document.getElementsByClassName("zip-code")[0].focus();
    }
    if (zipcode) {
      this.props.dispatch(getMyelomaCenters(this.props.token, zipcode));

    }
  }

  renderMyelomaCenters() {
    // if (this.state.zipState === false) {
    //   return <div className="text-warning">Please enter zipcode first.</div>;
    // }

    // if (this.state.showError && !this.state.myelomaCenters.length) {
    //   return <div className="text-warning">No myeloma center found for this zipcode.</div>;
    // }

    return this.state.myelomaCenters.map((center, key) => {
      return (
        <Card key={center.id} block inverse color="info">
          <CardTitle><a href={center.attributes.url} target="_blank" className="centerUrl" rel="noopener">{center.attributes.name}</a></CardTitle>
          <CardText>Contact number : {center.attributes.contact_number}</CardText>
        </Card>);
    });
  }

  handleDateChange(date, err) {
    this.setState({
      dob: date,
      errDob: err, // moment(date).format("DD/MM/YYYY")
    });
  }

  // function to change status of input button
  // changeStatus() {
  //   // this.setState({ "travelOption": !this.state.travelOption }, function() {
  //   // if (this.state.travelOption) {
  //   //   this.getMyelomaCentersOnZipCode();
  //   // } else {
  //   this.setState({ "myelomaCenters": [] });
  //   // }
  //   // });
  // }
  zipCodeChanged(event) {
    let zipcode = event.target.value;
    this.setState({ "myelomaCenters": [], "showMap": false, "defaultZoom": 8, check: false });
    this.setState({ zipState: true });
    if (!zipcode) {
      this.setState({ zipState: false });
      document.getElementsByClassName("zip-code")[0].focus();
    } else {
      if (zipcode.length > 4 && zipcode.length <= 6) {
        this.props.dispatch(getMyelomaCenters(this.props.token, zipcode));
      }
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">About Me</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          {this.state.modal1 && <ModalWindow
            token = {this.props.token}
            patientInfo = {this.state.patientInfo}
            userId = {this.state.userId}
            modal_var = {this.state.modal1}
            handle_modal = { (e) => this.open_modal(e) } />}
          <form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))} autoComplete = "off">
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">First Name</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  autoFocus={true}
                  ref={(input) => {
                    this.nameInput = input;
                  }}
                  name="first_name"
                  type="text"
                  className="form-control"
                  id="about_first"
                  maxLength="30"
                  placeholder="Your First Name"
                  tabIndex={1}
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Last Name</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="last_name"
                  type="text"
                  className="form-control "
                  id="Last"
                  maxLength="30"
                  placeholder="Your Last Name"
                  tabIndex={2}
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Gender</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <div onKeyDown={(e) => this.detectSpacePresent(e)} tabIndex={3} className="btn-group toggle-switch" id="status" data-toggle="buttons">
                  <label className={this.state.gender === "female" ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={ (e) => this.setState({ gender: "female" }) }>
                    <Field
                      name="gender"
                      component="input"
                      type="radio"
                      className="form-control"
                      value="female"
                      checked={this.state.gender === "female" ? true : false }
                    />
                  Female</label>
                  <label className={this.state.gender === "male" ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={ (e) => this.setState({ gender: "male" }) }>
                    <Field
                      name="gender"
                      component="input"
                      type="radio"
                      className="form-control"
                      value="male"
                      checked={this.state.gender === "male" ? true : false }
                    />
                  Male</label>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Date of birth</label>
              <div className="mui-select custom-box col-sm-8 col-md-8 col-lg-6 custom-mui-select">
                <DatePicker
                  name="dob"
                  type="text"
                  component={renderDateField}
                  placeholder="MM/DD/YYYY"
                  className="form-control date_picker_component"
                  selected={this.state.selected}
                  onDateChange={this.handleDateChange}
                  maxDate={this.state.maxDate}
                  minDate={this.state.minDate}
                  showYearFlag={true}
                  readOnly= {false}
                  tabIndex={4}
                  showMonthFlag={true} />
                <span className="text-error">{this.state.errDob}</span>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Race</label>
              <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="race"
                  options={raceArr}
                  placeholderText="Select Race"
                  tabIndex={5}
                  component={renderSelectField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Zip Code</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="zipcode"
                  type="text"
                  className="zip-code form-control"
                  id="zip-code"
                  maxLength={5}
                  placeholder="Please Enter Zip Code"
                  onKeyUp = {(e) => this.zipCodeChanged(e)}
                  autoComplete = "off"
                  tabIndex={6}
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">Treatment Goals</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="treatment_goal"
                  type="text"
                  className="form-control treatment-textarea"
                  id="goal"
                  maxLength="250"
                  rows={4}
                  placeholder="Please share your treatment goals"
                  tabIndex={7}
                  component={renderTextArea} />
                <span className="text-error">{this.state.err_treatment_goal}</span>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-6 col-md-6 col-lg-4 col-form-label">Myeloma Academic Centers Near You. <span className="tool-tip-history"> <img alt="question-pic" className="img-fluid tool-tip-img" src={require("../../../assets/images/question.png")} data-tip data-for= "able_to_travel"/> </span></label>
              <div className="col-sm-4 col-md-4 col-lg-4">
                {this.props.isAuthenticatingMyelomaCenter && <div className="spinner btn-rt"></div>}
                {this.state.zipState === false && <div className="text-warning">Please enter zipcode first.</div>}
                {this.state.showError && !this.state.myelomaCenters.length && <div className="text-warning">No myeloma center found for this zipcode.</div>}

              </div>
              <ReactTooltip place="right" type="info" effect="solid" id="able_to_travel"> <p className="tooltip-p">See the closest Cancer Treatment Centers or Specialist to your zip code.</p></ReactTooltip>

            </div>

            <div id="myeloma-div" className="form-group row">
              <div className="col-sm-12 col-md-12 col-lg-12 floatLeft">
                <div className="col-sm-6 col-md-6 col-lg-5 floatLeft centerslist map-title">
                  {!this.props.isAuthenticatingMyelomaCenter && this.renderMyelomaCenters()}
                </div>
                <div className="col-sm-6 col-md-6 col-lg-7 floatLeft mapDiv">
                  {this.state.showMap && <SimpleMapExampleGoogleMap
                    containerElement={
                      <div className="mapContainer"/>
                    }
                    mapElement={
                      <div className="mapElem" />
                    }
                    defaultZoom={this.state.defaultZoom}
                    markers={this.state.myelomaCenters}
                    defaultLatLng={this.state.defaultLatLng}
                    onMarkerClick={this.handleMarkerClick}
                    onMarkerClose={this.handleMarkerClose}
                  />}
                </div>
                {/* link for accessing all Myeloma Academic Centers */}
                {(this.state.showMap || (this.state.showError && !this.state.myelomaCenters.length)) && !this.state.check && <div className="form-group floatRight">
                  <a onClick={() => this.checkcenters()}>See All Academic Centers</a>
                </div>}
              </div>

            </div>
            {/* Care giver information */}
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-6 col-md-6 col-lg-5 col-form-label">Is there a family member or friend assisting you with your cancer care?</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <div onKeyDown={(e) => this.detectSpaceTreatment(e, "cancerCare")} tabIndex={9} className="btn-group toggle-switch" id="status" data-toggle="buttons">
                  <label className={this.state.cancerCare ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={ (e) => this.updateCancerCare(e) }>
                    <Field
                      name="cancerCare"
                      component="input"
                      type="radio"
                      className="form-control"
                      value="yes"
                      checked={ this.state.cancerCare ? true : false } />
                  Yes</label>
                  <label className={!this.state.cancerCare ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={ (e) => this.updateCancerCare(e) }>
                    <Field
                      name="gender"
                      component="input"
                      type="radio"
                      className="form-control"
                      value="no"
                      checked={ !this.state.cancerCare ? true : false } />
                  No</label>
                </div>
              </div>
            </div>
            {this.state.cancerCare && <div><div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-form-label">Caregiver Name</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="care_giver_name"
                  type="text"
                  className="form-control"
                  id="c_name"
                  maxLength="30"
                  placeholder="Your caregiver's name"
                  tabIndex={10}
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-form-label">Caregiver Phone Number</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="care_giver_phone"
                  type="text"
                  className="form-control"
                  id="c_phone"
                  maxLength="12"
                  placeholder="Caregiver Phone Number"
                  tabIndex={11}
                  normalize = {normalizePhone}
                  component={renderInputField} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-form-label">Caregiver Email</label>
              <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                  name="care_giver_email"
                  type="text"
                  className="form-control"
                  id="c_email"
                  maxLength="100"
                  tabIndex={12}
                  placeholder="Caregiver's email address"
                  component={renderInputField} />
              </div>
            </div>
            </div>}
            <div className="form-group row">
              <div className="form-check col-sm-12">
                <Field
                  type="checkbox"
                  // label ={"By checking this box, you agree to our" + <Link to="/privacy-policy">privacy policy</Link>}
                  className="checkbox-custom"
                  id="agreed"
                  name="agreed"
                  htmlFor="agreed"
                  isLink = {true}
                  tabIndex={13}
                  component={renderCheckbox} />
              </div>
            </div>
            <div className="form-group row">
              <div className="form-check col-sm-12">
                <Field
                  type="checkbox"
                  label="I understand that HealthTree is not a replacement for a medical opinion by a licensed oncologist, hematologist or myeloma specialist.  HealthTree provides general guidance that should be taken to a medical professional who can review the specifics of your case."
                  className="checkbox-custom"
                  id="accepted_understand_clause"
                  name="accepted_understand_clause"
                  htmlFor="accepted_understand_clause"
                  tabIndex={14}
                  component={renderCheckbox} />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top" tabIndex={14}>Continue</button>
              </div>
            </div>
          </form>
        </div>

      </div>
    );
  }
}


const selector = formValueSelector("AboutmeFormMKSASSS");

function mapStateToProps(state) {
  return {
    statusText: state.patient.statusText,
    isAuthenticating: state.patient.isAuthenticating,
    isAuthenticatingMyelomaCenter: state.patient.isAuthenticatingMyelomaCenter,
    initialValues: state.patient.patientinfo,
    myelomaCenters: state.patient.myelomaCenters,
    isSavingSuccess: state.patient.isSavingSuccess,
    isFetchingSuccess: state.patient.isSuccess,
    // userinfo: state.login.userinfo,
    userinfo: state.user.userinfo,
    zipcode: selector(state, "zipcode"),
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

Patient = reduxForm({
  form: "AboutmeForm",
  enableReinitialize: true,
  validate,
})(Patient);

export default connect(mapStateToProps, { getUserInfo, getPatientInfo, savePatientInfo, getMyelomaCenters, changeFields })(Patient);
