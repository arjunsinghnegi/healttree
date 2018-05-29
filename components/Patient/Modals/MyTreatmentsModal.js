import { CONST_DOSAGE,
  CONST_FREQUENCY,
  CONST_TREATMENTS,
  CYCLES,
  renderDateField,
  renderMultiSelectField,
  renderSelectField,
} from "../renderFields";
import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { saveTreatments } from "../../../actions/PatientsActions";
// import CheckBoxList from "react-checkbox-list";

class MyTreatmentsModal extends Component {
  constructor(props) {
    super(props);
    this.manage_modal = this.manage_modal.bind(this);
    this.state = {
      start_date: null,
      end_date: null,
      dosageOptions: [],
      frequencyOptions: [],
      err: {},
      treatment_code: null,
      maxDate: moment(), // max date in datepicker
      cyclesReceived: CYCLES,
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.changeTreatmentOptions = this.changeTreatmentOptions.bind(this);
  }

  manage_modal() {
    this.setState({ start_date: null, end_date: null, dosageOptions: [], frequencyOptions: [], err: {}, treatment_code: null, cyclesReceived: CYCLES });
    this.props.handle_modal("false");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.modalData && nextProps.modalData.start_date) {
      this.handleStartDateChange(moment(nextProps.modalData.start_date, "YYYY-MM-DD"));
    } else if (nextProps.modalData && !nextProps.modalData.start_date) {
      if (!this.state.start_date) {
        this.handleStartDateChange(null);
      }

    }
    if (nextProps.modalData && nextProps.modalData.end_date) {
      this.handleEndDateChange(moment(nextProps.modalData.end_date, "YYYY-MM-DD"));
    } else if (nextProps.modalData && !nextProps.modalData.end_date) {
      if (!this.state.end_date) {
        this.handleEndDateChange(null);
      }
    }
    if (nextProps.modalData && nextProps.modalData.treatment) {
      this.setState({ treatment: nextProps.modalData.treatment });
      let treatmentValue = nextProps.modalData.treatment;
      let dosageOptions = CONST_DOSAGE[treatmentValue];
      let cyclesReceived = CYCLES;
      let frequencyOptions = CONST_FREQUENCY[treatmentValue];
      this.setState({ dosageOptions: dosageOptions, frequencyOptions: frequencyOptions, cyclesReceived: cyclesReceived });
    }
    if (nextProps.modalData && nextProps.modalData.frequency) {
      this.setState({ treatment: nextProps.modalData.frequency });
    }
    if (nextProps.modalData && nextProps.modalData.dosage) {
      this.setState({ treatment: nextProps.modalData.dosage });
    }
    // if (nextProps.modalData && nextProps.modalData.side_effect_code) {
    //   console.log("nextProps.modalData.side_effect_code", nextProps.modalData.side_effect_code);
    //   this.setState({ side_effect_code: nextProps.modalData.side_effect_code });
    // }
  }

  handleStartDateChange(date) {
    this.setState({
      start_date: date,
      end_date: null,
    });
  }

  handleEndDateChange(date) {
    this.setState({
      end_date: date,
    });
  }
  onSubmit(formData) {
    formData["start_date"] = this.state.start_date;
    formData["end_date"] = this.state.end_date;
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
    if (!formData.treatment_code) {
      errObj.treatment_code = "Please select treatment options.";
      errVal = true;
    }
    let userId = this.props.userinfo ? this.props.userinfo.id : null;
    if (!errVal) {
      // this.props.dispatch(saveMySideEffects(this.props.token, this.props.sideEffectId, formData, userId, ""));
      // console.log("hi", this.props.modalData.id);
      this.props.onSubmit(this.props.token, this.props.modalData.id, formData, userId, "");
      // let This = this;
      // setTimeout(function() {
      //   This.props.handle_modal("false");
      // }, 1000);
      this.setState({ err: {} });
    } else {
      this.setState({ err: errObj });
    }
  }

  changeTreatmentOptions(treatmentObj) {
    let treatmentValue = treatmentObj.value;
    let dosageOptions = CONST_DOSAGE[treatmentValue];
    let frequencyOptions = CONST_FREQUENCY[treatmentValue];
    this.setState({ treatment_code: treatmentValue, dosageOptions: dosageOptions, frequencyOptions: frequencyOptions });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop patientedit-form">
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <ModalHeader toggle={this.manage_modal}>
            <span className="page-title">Add Treatment</span>
          </ModalHeader>
          <ModalBody>
            <div className="modal-body">
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Treatment Start Date</label>
                <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                  <Field
                    name="start_date"
                    type="text"
                    component={renderDateField}
                    placeholder="MM/DD/YYYY"
                    className="form-control date_picker"
                    selected={this.state.start_date}
                    onDateChange={this.handleStartDateChange}
                    maxDate={this.state.maxDate}
                    showYearFlag={true}
                    showMonthFlag={true} />
                  { this.state.err.start_date && <span className="text-error">{this.state.err.start_date}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Treatment End Date</label>
                <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                  <Field
                    name="end_date"
                    type="text"
                    component={renderDateField}
                    placeholder="MM/DD/YYYY"
                    className="form-control date_picker"
                    selected={this.state.end_date}
                    minDate={this.state.start_date}
                    maxDate={this.state.maxDate}
                    onDateChange={this.handleEndDateChange}
                    showYearFlag={true}
                    showMonthFlag={true} />
                  { this.state.err.end_date && <span className="text-error">{this.state.err.end_date}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Treatment</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  {/* <CheckBoxList ref="chkboxList" defaultData={data} onChange={this.handleCheckboxListChange} />*/}
                  <Field
                    name="treatment_code"
                    options={CONST_TREATMENTS}
                    placeholderText="Select Option"
                    component={renderMultiSelectField}
                    value={this.state.treatment_code}
                    onChange={(e) => this.changeTreatmentOptions(e)} />
                  { this.state.err.treatment_code && <span className="text-error">{this.state.err.treatment_code}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">No. of Cycles Received</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  <Field
                    name="dosage_code"
                    options={this.state.cyclesReceived}
                    placeholderText="Select Option"
                    value={0}
                    component={renderSelectField} />
                </div>
              </div>
              {/* <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Dosage</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  <Field
                    name="dosage_code"
                    options={this.state.dosageOptions}
                    placeholderText="Select Option"
                    component={renderSelectField} />
                </div>
              </div> */}
              {/* <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Frequency</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  <Field
                    name="frequency_code"
                    options={this.state.frequencyOptions}
                    placeholderText="Select Option"
                    component={renderSelectField} />
                </div>
              </div> */}
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
  // console.log("ownprops", ownprops.modalData.treatment);
  return {
    isRequesting: state.patient.isRequesting,
    initialValues: {
      treatment_code: (ownprops.modalData && ownprops.modalData.treatment) ? ownprops.modalData.treatment : "",
      dosage_code: (ownprops.modalData && ownprops.modalData.dosage) ? ownprops.modalData.dosage : "",
      frequency_code: (ownprops.modalData && ownprops.modalData.frequency) ? ownprops.modalData.frequency : "",
    },
  };
}

// Form validation
const validate = (values) => {
  // console.log(values);
  const error = {};
  //
  // if (!values.dob_month) {
  //   error.dob_month = "Please select birth month.";
  // }
  //
  // if (!values.dob_year) {
  //   error.dob_year = "Please select birth year.";
  // }
  //
  // if (!values.race) {
  //   error.race = "Please select race.";
  // }
  //
  // if (!values.zipcode) {
  //   error.zipcode = "Please enter zip code.";
  // }
  // if (values.zipcode) {
  //   values.zipcode = isNaN(Number(values.zipcode)) ? "" : values.zipcode;
  // }
  // if (!values.agreed) {
  //   error.agreed = "Please check license agreement.";
  // }
  // return error;
};

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

MyTreatmentsModal = reduxForm({
  form: "MyTreatmentsModalForm",
  enableReinitialize: true,
  validate,
})(MyTreatmentsModal);
export default connect(mapStateToProps, { saveTreatments })(MyTreatmentsModal);
