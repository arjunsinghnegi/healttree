// import "react-rangeslider/lib/index.css";
import "rc-slider/assets/index.css";
import { CONST_SIDE_EFFECT, renderDateField, renderSelectField } from "../renderFields";
import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { saveMySideEffects } from "../../../actions/PatientsActions";
// import Slider from "react-rangeslider";

import Slider from "rc-slider";
const style = { width: 400, margin: 50 };
const marks = {
  1: "",
  20: "",
  40: "",
};
class MySideEffectsModal extends Component {
  constructor(props) {
    super(props);
    console.log("<<props>>", props);
    this.manage_modal = this.manage_modal.bind(this);
    this.state = {
      start_date: null,
      end_date: null,
      side_effect_code: "",
      dosageOptions: [],
      frequencyOptions: [],
      err: {},
      severity: props.modalData.severity ? props.modalData.severity : 3,
      maxDate: moment(),
      minDate: moment(),
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleCode = this.handleCode.bind(this);
    this.handleTreatment = this.handleTreatment.bind(this);
    this.log = this.log.bind(this);
  }
  componentWillMount() {


    // this.handleEndDateChange();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.modalData && nextProps.modalData.start_date) {
      this.handleStartDateChange(moment(nextProps.modalData.start_date, "YYYY-MM-DD"));
    }
    if (nextProps.modalData && nextProps.modalData.end_date) {
      this.handleEndDateChange(moment(nextProps.modalData.end_date, "YYYY-MM-DD"));
    }
    if (nextProps.modalData && nextProps.modalData.severity) {
      this.setState({ severity: nextProps.modalData.severity });
    }
    // if (nextProps.modalData && nextProps.modalData.side_effect_code) {
    //   console.log("nextProps.modalData.side_effect_code", nextProps.modalData.side_effect_code);
    //   this.setState({ side_effect_code: nextProps.modalData.side_effect_code });
    // }
  }
  manage_modal() {
    this.props.handle_modal("false");
  }

  handleStartDateChange(date) {
    if (!date) {
      date = null;
    }
    this.setState({
      start_date: date,
      end_date: null,
    });

  }

  handleEndDateChange(date) {
    if (!date) {
      date = null;
    }
    this.setState({
      end_date: date,
    });
  }

  onSubmit(formData) {
    // let errObj = {};
    let isValid = true;

    // let startDate = this.state.start_date ? moment(this.state.start_date).format("YYYY-MM-DD") : null;
    formData["start_date"] = this.state.start_date;
    // let endDate = this.state.end_date ? moment(this.state.end_date).format("YYYY-MM-DD") : null;
    formData["end_date"] = this.state.end_date;
    formData.severity = this.state.severity;
    console.log("formData>>>>begin", formData);
    let errObj = {};
    this.setState({ err: errObj });
    let errVal = false;
    if (!formData.start_date) {
      errObj.start_date = "Please enter start date";
      errVal = true;
    }
    if (!formData.end_date) {
      errObj.end_date = "Please enter end date";
      errVal = true;
    }
    if (!formData.side_effect_code) {
      errObj.side_effect_code = "Please select side effect.";
      errVal = true;
    }
    if (!formData["treatment"] || formData["treatment"] === null) {

      errObj.treatments = "Please select treatment.";
      errVal = true;
    } else {
      formData.patient_treatment_id = formData["treatment"].value;
    }
    console.log("i am here", formData);
    let userId = this.props.userinfo ? this.props.userinfo.id : null;
    if (!errVal) {
      // this.props.dispatch(saveMySideEffects(this.props.token, this.props.sideEffectId, formData, userId, ""));
      // console.log("hi", this.props.modalData.id);
      this.props.onSubmit(this.props.token, this.props.modalData.id, formData, userId, "");
      // let This = this;
      // setTimeout(function() {
      //   This.props.handle_modal("false");
      // }, 1000);
    } else {
      this.setState({ err: errObj }, function() {
        console.log("this.state.", this.state.err);
      });
    }

  }

  // changeTreatmentOptions(treatmentObj) {
  //   let treatmentValue = treatmentObj.value;
  //   let dosageOptions = CONST_DOSAGE[treatmentValue];
  //   let frequencyOptions = CONST_FREQUENCY[treatmentValue];
  //   // console.log(dosageOptions);
  //   this.setState({ dosageOptions: dosageOptions, frequencyOptions: frequencyOptions });
  // }
  handleCode(event) {
    // console.log("event", event);
    this.setState({ side_effect_code: event.value });
  }

  // when treatment is clicked
  handleTreatment(event) {
    console.log("event>>>", event);
    let start_date = moment(event.start_date, "MM/DD/YYYY");
    let end_date = null;
    if (event.end_date === null) {
      end_date = moment();
    }
    this.setState({ start_date: start_date, end_date: end_date, maxDate: end_date, minDate: start_date });
  }

  log(val) {
    console.log("log", val);
    this.setState({
      severity: val,
    });
  }
  render() {
    const { handleSubmit } = this.props;
    const { severity } = this.state;
    const required = (value) => value ? undefined : "Required";
    const horizontalLabels = {
      0: "Tolerable Treatment",
      10: "Stopped",
    };
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop patientedit-form">
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <ModalHeader toggle={this.manage_modal}>
            <span className="page-title">{this.props.title}</span>
          </ModalHeader>
          <ModalBody>
            <div className="modal-body">
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Select Treatment</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  <Field
                    name="treatment"
                    options={this.props.treatments}
                    placeholderText="Select Option"
                    onChange = {this.handleTreatment}
                    component={renderSelectField} />
                  { this.state.err.treatments && <span className="text-error">{this.state.err.treatments}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Side Effect Start Date</label>
                <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                  <Field
                    name="start_date"
                    type="text"
                    component={renderDateField}
                    placeholder="MM/DD/YYYY"
                    className="form-control date_picker"
                    selected={this.state.start_date}
                    onDateChange={this.handleStartDateChange}
                    minDate={this.state.minDate}
                    showYearFlag={true}
                    showMonthFlag={true}
                    maxDate={this.state.maxDate}
                    readOnly={true}/>
                  { this.state.err.start_date && <span className="text-error">{this.state.err.start_date}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Side Effect End Date</label>
                <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                  <Field
                    name="end_date"
                    type="text"
                    component={renderDateField}
                    placeholder="MM/DD/YYYY"
                    className="form-control date_picker"
                    selected={this.state.end_date}
                    minDate={this.state.minDate}
                    onDateChange={this.handleEndDateChange}
                    maxDate={this.state.maxDate}
                    showYearFlag={true}
                    showMonthFlag={true}
                    readOnly={true}/>
                  { this.state.err.end_date && <span className="text-error">{this.state.err.end_date}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Side Effect</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  <Field
                    name="side_effect_code"
                    options={CONST_SIDE_EFFECT}
                    placeholderText="Select Option"
                    onChange = {this.handleCode}
                    component={renderSelectField} />
                  { this.state.err.side_effect_code && <span className="text-error">{this.state.err.side_effect_code}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Side Effect Severity</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">

                  <Slider min={1} marks={marks} step={1} included={false} defaultValue={this.state.severity} max={100} onAfterChange={this.log}/>
                  <span className="pull-left fnt_13">Tolerable</span>
                  <span className="pull-right fnt_13">Stopped treatment</span>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="submit"
              className="btn green-btn btn-rt green-hvr-bounce-to-top"
              disabled={this.props.isRequesting === true ? true : false}>
            Continue</button>
            <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ this.manage_modal }>Cancel</button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

function mapStateToProps(state, ownprops) {
  return {
    isRequesting: state.patient.isRequesting,
    initialValues: {
      side_effect_code: (ownprops.modalData && ownprops.modalData.side_effect) ? ownprops.modalData.side_effect : "",
      // treatment: "156",
      treatment: (ownprops.modalData && ownprops.modalData.patient_treatment_id) ? ownprops.modalData.patient_treatment_id.toString() : "",
    },
  };
}
//    initialValues: state.patient.sideEffects,

// Form validation
const validate = (values) => {
  // console.log("sideEffects-----", values);
  const error = {};
  //
  //  if (!values.start_date) {
  //    error.start_date = "Please select start date.";
  // }
  //
  //  if (!values.end_date) {
  //    error.end_date = "Please select end date.";
  // }
  //
  // if (!values.side_effect_code) {
  //   error.race = "Please select side effect.";
  // }
  // if (!values.severity) {
  //   error.race = "Please select severity.";
  // }
  // return error;
};

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

MySideEffectsModal = reduxForm({
  form: "MySideEffectsModalForm",
  enableReinitialize: true,
  validate,
})(MySideEffectsModal);
export default connect(mapStateToProps, { saveMySideEffects })(MySideEffectsModal);
