import { Field, reduxForm } from "redux-form";
import { getMyMyeloma, saveMyMyeloma } from "../../../actions/PatientsActions";
import { imagingLesionsArr, initialDiagnosisArr, renderDateField, renderSelectField } from "../renderFields";
import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { browserHistory } from "react-router";
import { confirmAlert } from "react-confirm-alert";
import { connect } from "react-redux";
import DatePicker from "../../common/datePicker";
import Form from "muicss/lib/react/form";
import { getFacilities } from "../../../actions/myelomaActions";
import { getUserInfo } from "../../../actions/UserActions";
import { Input } from "react-input-component";
import { Link } from "react-router";
import Loader from "../../common/loader";
import moment from "moment";
import { renderInputField } from "../MySurveys/dynamicFields";
import validate from "../validate";


// Teach Autosuggest how to calculate suggestions for any given input value.
// const getSuggestions = (value) => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0 ? [] : languages.filter((lang) =>
//     lang.name.toLowerCase().slice(0, inputLength) === inputValue
//   );
// };

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => (
  <span>{suggestion.name}</span>
);

class MyMyeloma extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstDiagnosedDate: null,
      boneOption: "0",
      initialDiagnosis: null,
      minDate: moment().subtract(100, "years"), // min date in datepicker
      maxDate: moment(), // max date in datepicker
      showLoader: false,
      facilityAddressObj: {
        "facility_name": null,
        "city": null,
        "state": null,
        "address_id": null,
        // "country": null,
        // "zipcode": null,
      },
      facilityError: null,
      facilityCityError: null,
      facilityStateError: null,
      errDate: null,
      errDiagnostics: null,
      errLesions: null,
      errDiagnostician: null,
      errVar: false,
      value: "",
      suggestions: [],
      serverFacilities: [],
      // "isFormChanged": false,
      // "redirectTo": "/about-me",
    };
    this.props.getFacilities(this.props.token);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.diagnosedLocation.bind(this);
    // this.handleBackLink = this.handleBackLink.bind(this);
    this.autocompleteChanged = this.autocompleteChanged.bind(this);

    /** **************/
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.facilityCityBlur = this.facilityCityBlur.bind(this);
    this.facilityStateBlur = this.facilityStateBlur.bind(this);
  }
  // handleFormChange() {
  //   this.setState({ "isFormChanged": true });
  // }
  // handleBackLink() {
  //   if (this.state.isFormChanged) {
  //     this.setState({ "redirectTo": "/about-me" });
  //     confirmAlert({
  //       title: "", // Title dialog
  //       message: "Do you want to save  changes?", // Message dialog
  //       // childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
  //       confirmLabel: "Confirm", // Text button confirm
  //       cancelLabel: "Cancel", // Text button cancel
  //       onConfirm: () => this.onSubmit(), // Action after Confirm
  //       onCancel: () => browserHistory.push("/about-me"), // Action after Cancel
  //     });
  //   } else {
  //     browserHistory.push("/about-me");
  //   }

  // }
  componentWillMount() {
    this.setState({ showLoader: true });
    this.props.dispatch(getMyMyeloma(this.props.token));
    this.props.dispatch(getUserInfo(this.props.token));
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.facilities !== this.props.facilities) {
      let tmpArr = [];
      if (nextProps.facilities.data && nextProps.facilities.data.length) {
        let data = nextProps.facilities.data;
        data.map(function(obj, key) {
          let tmpObj = {};
          tmpObj.id = obj.id;
          tmpObj.name = obj.attributes.facility_name + ", " + obj.attributes.city + ", " + obj.attributes.state,
          tmpObj.facility_name = obj.attributes.facility_name;
          tmpObj.city = obj.attributes.city;
          tmpObj.state = obj.attributes.state;
          tmpArr.push(tmpObj);
        });
      }
      this.setState({ serverFacilities: tmpArr });
    }
    if (nextProps.initialValues && this.props.initialValues !== nextProps.initialValues) {
      let myMyeloma = nextProps.initialValues;
      let tmpObj = {
        "facility_name": (myMyeloma.facility_name) ? myMyeloma.facility_name : "",
        "city": (myMyeloma.city) ? myMyeloma.city : null,
        "state": (myMyeloma.state) ? myMyeloma.state : null,
        "address_id": (myMyeloma.address_id) ? myMyeloma.address_id : null,
      };
      this.setState({ facilityAddressObj: tmpObj, value: tmpObj.facility_name });
      if (myMyeloma.first_diagnosed_date !== null) {
        this.setState({ firstDiagnosedDate: moment(myMyeloma.first_diagnosed_date) });
      }

      this.setState({ initialDiagnosis: myMyeloma.initial_diagnosis,
        boneOption: myMyeloma.bone_lesions }, function() {
        this.setState({ showLoader: false });
      });
    }
  }

  // start

  onChange(event, { newValue }) {
    let tmpObj = {
      "facility_name": newValue,
      "city": (this.state.facilityAddressObj.city) ? this.state.facilityAddressObj.city : null,
      "state": (this.state.facilityAddressObj.state) ? this.state.facilityAddressObj.state : null,
      "address_id": null,
    };
    this.state.serverFacilities.map(function(obj, key) {
      if (obj.name === newValue) {
        tmpObj = {
          "facility_name": obj.facility_name,
          "city": obj.city,
          "state": obj.state,
          "address_id": obj.id,
        };

      }
    });
    this.setState({
      value: newValue,
      facilityAddressObj: tmpObj,
      facilityError: null,
      facilityCityError: null,
      facilityStateError: null,
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value, this.state.serverFacilities),
    });
  };

  getSuggestions(value, arr) {
    if (!value) return;
    let inputValue = value.trim().toLowerCase();
    let inputLength = inputValue.length;
    let serverData = this.state.serverFacilities;
    return inputLength === 0 ? [] : arr.filter((lang) =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  }
  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  };


  /** *********************************************************/ 
  handleDateChange(date, err) {
    // this.handleFormChange();
    this.setState({
      firstDiagnosedDate: date,
      errDate: err, // moment(date).format('DD/MM/YYYY')
    });
  }

  onSubmit(formData) {
    // return false;
    // diagnosis date
    let errVar = false;
    if (this.state.facilityAddressObj && this.state.facilityAddressObj.facility_name) {
      formData["facility_name"] = this.state.facilityAddressObj.facility_name;
      formData["city"] = this.state.facilityAddressObj.city;
      formData["state"] = this.state.facilityAddressObj.state;
      formData["address_id"] = this.state.facilityAddressObj.address_id;
    } else {
      errVar = true;
      formData["facility_name"] = this.state.facilityAddressObj.facility_name;
      formData["city"] = this.state.facilityAddressObj.city;
      formData["state"] = this.state.facilityAddressObj.state;
      // formData["address_id"] = this.state.facilityAddressObj.facility_name;
    }
    this.setState({ errDate: null,
      errDiagnostics: null,
      errLesions: null,
      facilityError: null,
      facilityCityError: null,
      facilityStateError: null,
      errDiagnostician: null,
    });
    let firstDiagnosedDate = this.state.firstDiagnosedDate ? moment(this.state.firstDiagnosedDate).format("YYYY-MM-DD") : null;
    if (firstDiagnosedDate === null) {
      errVar = true;
      this.setState({ errDate: "Please enter when were you first diagnosed?" });
    }
    formData["first_diagnosed_date"] = firstDiagnosedDate;
    // diagnosis
    if (typeof (formData.initial_diagnosis) === undefined || !formData.initial_diagnosis) {
      errVar = true;
      this.setState({ errDiagnostics: "Please enter what was your first diagnosis." });
    }
    if (typeof (formData.initial_diagnosis) === undefined || !formData.initial_diagnosis) {
      errVar = true;
      this.setState({ errDiagnostics: "Please enter what was your first diagnosis." });
    }

    if (typeof (formData.facility_name) === undefined || !formData.facility_name) {
      errVar = true;
      this.setState({ facilityError: "Please enter facility name." });
    }
    if (typeof (formData.city) === undefined || !formData.city) {
      errVar = true;
      this.setState({ facilityCityError: "Please enter facility's city." });
    }
    if (typeof (formData.state) === undefined || !formData.state) {
      errVar = true;
      this.setState({ facilityStateError: "Please enter facility's state." });
    }
    if (typeof (formData.state) === undefined || !formData.state) {
      errVar = true;
      this.setState({ facilityStateError: "Please enter facility's state." });
    }

    // diagnostician
    if (typeof (formData.physician_name) === undefined || !formData.physician_name) {
      errVar = true;
      this.setState({ errDiagnostician: "Please enter diagnostician's name." });
    }

    if (formData.initial_diagnosis) {
      formData["initial_diagnosis"] = formData.initial_diagnosis.value === undefined ? this.state.initialDiagnosis : formData.initial_diagnosis.value;
    }
    // bone lesions
    if (typeof (formData.bone_lesions) === undefined || !formData.bone_lesions) {
      formData["bone_lesions"] = "0";
    }
    let userId = this.props.userinfo ? this.props.userinfo.id : null;
    if (!errVar) {
      this.props.dispatch(saveMyMyeloma(this.props.token, this.props.myMyelomaId, formData, userId, "current-history"));
    }

  }

  // functiont to get details from google address component
  diagnosedLocation(googleAddrObj) {
    let facility_name = document.getElementById("diagnosisFacility").value;
    let tmpObj = {
      "facility_name": facility_name,
      "city": null,
      "state": null,
    };
    googleAddrObj.address_components.map(function(obj, key) {
      // zipcode
      if (obj.types.indexOf("postal_code") > -1) {
        tmpObj.zipcode = obj.long_name;
      }
      // country
      if (obj.types.indexOf("country") > -1) {
        tmpObj.country = obj.long_name;
      }
      // state
      if (obj.types.indexOf("administrative_area_level_1") > -1) {
        tmpObj.state = obj.long_name;
      }
      // state
      if (obj.types.indexOf("administrative_area_level_2") > -1) {
        tmpObj.city = obj.long_name;
      }
    });

    this.setState({ facilityAddressObj: tmpObj, facilityError: null });
  }

  autocompleteChanged(e) {
    let tmpObj = {
      "facility_name": e.target.value,
      "city": null,
      "state": null,
      // "country": null,
      // "zipcode": null,
    };
    this.setState({ facilityAddressObj: tmpObj });
  }

  // if city field if changed
  facilityCityBlur(e) {
    let tmpObj = this.state.facilityAddressObj;
    tmpObj.address_id = null;
    tmpObj.city = e.target.value;
    this.setState({ "facilityAddressObj": tmpObj, facilityCityError: null });
  }

  // if state field is changed
  facilityStateBlur(e) {
    let tmpObj = this.state.facilityAddressObj;
    tmpObj.address_id = null;
    tmpObj.state = e.target.value;
    this.setState({ "facilityAddressObj": tmpObj, facilityStateError: null });
  }

  render() {
    const { handleSubmit } = this.props;
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Facility's name",
      value,
      onChange: this.onChange,
      tabIndex: 2,
    };
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">Myeloma Diagnosis</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <Form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))} autoComplete="off">
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">When were you first diagnosed?</label>
              <div className="col-sm-8 col-md-8 col-lg-7 rmb-10 pr-10">
                <DatePicker
                  name="first_diagnosed_date"
                  type="text"
                  placeholder="MM/DD/YYYY"
                  tabIndex={1}
                  className="form-control date_picker"
                  selected={this.state.firstDiagnosedDate}
                  onDateChange={this.handleDateChange}
                  showYearFlag={true}
                  showMonthFlag={true}
                  maxDate={this.state.maxDate}
                  minDate={this.state.minDate}
                />
                <span className="text-error">{this.state.errDate}</span>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Where were you first diagnosed?</label>
              <div className="col-sm-4 col-md-4 col-lg-3 rmb-10 pr-10 diagnosed-input">
                <Autosuggest
                  // onChange={this.autoSuggest()}
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                />
                <span className="text-error">{this.state.facilityError}</span>
              </div>
              <div className="col-sm-4 col-md-4 col-lg-2 rmb-10 pr-10">
                <Input
                  name="city"
                  type="text"
                  className="form-control"
                  id="Last"
                  maxLength="20"
                  placeholder="City"
                  onBlur={this.facilityCityBlur}
                  tabIndex={3}
                  value = {this.state.facilityAddressObj.city}
                />
                <span className="text-error">{this.state.facilityCityError}</span>
              </div>
              <div className="col-sm-4 col-md-4 col-lg-2 rmb-10 pr-10">
                <Input
                  name="state"
                  type="text"
                  className="form-control"
                  id="Last"
                  maxLength="25"
                  placeholder="State"
                  tabIndex={4}
                  onBlur={this.facilityStateBlur}
                  value = {this.state.facilityAddressObj.state}
                />
                <span className="text-error">{this.state.facilityStateError}</span>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">What was your initial diagnosis?</label>
              <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-7">
                <Field
                  name="initial_diagnosis"
                  options={initialDiagnosisArr}
                  placeholderText="Select Option"
                  tabIndex={5}
                  component={renderSelectField} />
                <span className="text-error">{this.state.errDiagnostics}</span>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label"> How many bone lesions did you have at diagnosis? (By MRI, PET-CT or X-ray)</label>
              <div className="col-sm-6 col-md-6 col-lg-7">
                {imagingLesionsArr.map((obj) => (
                  <div className="radio-btn" key={obj.value}>
                    <Field
                      name="bone_lesions"
                      component="input"
                      type="radio"
                      id={obj.value}
                      tabIndex={6}
                      className="radio-custom"
                      value={obj.value}
                      checked={ this.state.boneOption === obj.value ? true : false }
                      onClick={ () => this.setState({ boneOption: obj.value }) } />
                    <label htmlFor={obj.value} className="radio-custom-label">{obj.label}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Who is directing your treatment?</label>
              <div className="col-sm-6 col-md-6 col-lg-7">
                <Field
                  name="physician_name"
                  type="text"
                  className="form-control "
                  id="physician_name"
                  maxLength="25"
                  placeholder="Your physician's name"
                  tabIndex={7}
                  component={renderInputField} />
                <span className="text-error">{this.state.errDiagnostician}</span>
              </div>
            </div>

            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button
                  type="submit"
                  tabIndex={8}
                  className="btn green-btn btn-rt green-hvr-bounce-to-top"
                  disabled={this.props.isAuthenticating === true ? true : false}>
                  Continue</button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticating: state.patient.isAuthenticating,
    userinfo: state.user.userinfo,
    initialValues: state.patient.myMyeloma,
    // initialValues: [],
    getFacilities: getFacilities,
    myMyelomaId: state.patient.myMyelomaId,
    facilities: state.facilities,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

MyMyeloma = reduxForm({
  form: "MyeMyelomaForm",
  enableReinitialize: true,
})(MyMyeloma);
export default connect(mapStateToProps, { getMyMyeloma, saveMyMyeloma, getUserInfo, getFacilities })(MyMyeloma);
