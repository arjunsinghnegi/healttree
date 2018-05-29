import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { REMISSION_STATUS_OUTCOMES, renderDateField, renderDynamicRadio, renderInputField } from "../renderFields";
import { connect } from "react-redux";
import moment from "moment";
import { saveRemissionStatus } from "../../../actions/PatientsActions";

class RemissionStatusModal extends Component {
  constructor(props) {
    super(props);
    this.manage_modal = this.manage_modal.bind(this);

    this.state = {
      start_date: null,
      end_date: null,
      cellNo: false,
      outcome: 0,
      err: {},
      maxDate: moment(), // max date in datepicker
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.getOutcomeValue = this.getOutcomeValue.bind(this);
  }

  manage_modal() {
    this.setState({ start_date: null, end_date: null, cellNo: false, outcome: 0, err: {} });
    this.props.handle_modal("false");
  }

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps>>??", nextProps.modalData);
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
    if (nextProps.modalData && nextProps.modalData.outcome) {
      // console.log("nextProps.modalData.outcome", nextProps.modalData.outcome);
      this.setState({ outcome: nextProps.modalData.outcome });
      let outcomeValue = nextProps.modalData.outcome;
      if (outcomeValue === 5) {
        this.setState({ cellNo: true });
      } else {
        this.setState({ cellNo: false });
      }
    }
  }

  handleStartDateChange(date) {
    this.setState({
      start_date: date,
      end_date: null,
    });
  }

  handleEndDateChange(date) {
    console.log("date", date);
    // this.setState({
    //   end_date: date,
    // });
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
    if (!formData.outcome_code) {
      formData.outcome_code = this.state.outcome;
    }
    if (parseInt(formData.outcome_code) !== 5) {
      formData.cells_no = null;
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

  getOutcomeValue(value) {
    // console.log("i m here ", value);
    if (value === "5") {
      this.setState({ cellNo: true, outcome: parseInt(value) });
    } else {
      this.setState({ cellNo: false, outcome: parseInt(value) });
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop patientedit-form">
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <ModalHeader toggle={this.manage_modal}>
            <span className="page-title">{this.props.title}</span>
          </ModalHeader>
          <ModalBody>
            <div className="modal-body">
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Remission Start Date</label>
                <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                  <Field
                    name="start_date"
                    type="text"
                    component={renderDateField}
                    placeholder="MM/DD/YYYY"
                    className="form-control date_picker"
                    selected={this.state.start_date}
                    onDateChange={this.handleStartDateChange}
                    showYearFlag={true}
                    showMonthFlag={true}
                    maxDate={this.state.maxDate}
                    readOnly={true}/>
                  { this.state.err.start_date && <span className="text-error">{this.state.err.start_date}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Remission End Date</label>
                <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                  <Field
                    name="end_date"
                    type="text"
                    component={renderDateField}
                    placeholder="MM/DD/YYYY"
                    className="form-control date_picker"
                    selected={this.state.end_date}
                    minDate={this.state.start_date}
                    onDateChange={this.handleEndDateChange}
                    showYearFlag={true}
                    showMonthFlag={true}
                    maxDate={this.state.maxDate}
                    readOnly={true}/>
                  { this.state.err.end_date && <span className="text-error">{this.state.err.end_date}</span> }
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label">Outcome after treatment</label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  <Field
                    component={renderDynamicRadio}
                    name="outcome_code"
                    templateList={REMISSION_STATUS_OUTCOMES}
                    className="form-control"
                    checked={this.state.outcome}
                    getRadioButtonValue = {this.getOutcomeValue} />
                </div>
              </div>
              <div id="cells_no" className={this.state.cellNo === true ? "form-group row" : "hide-div form-group row"}>
                <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label"></label>
                <div className="mui-select custom-box  col-sm-8 col-md-8 col-lg-6">
                  <Field
                    name="cells_no"
                    type="text"
                    className="form-control "
                    maxLength="100"
                    placeholder="number of cells"
                    component={renderInputField} />
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
  // console.log("ownprops", ownprops.modalData.treatment);
  return {
    isRequesting: state.patient.isRequesting,
    initialValues: {
      cells_no: (ownprops.modalData && ownprops.modalData.cells_no) ? ownprops.modalData.cells_no : "",
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
  // return error;
};

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

RemissionStatusModal = reduxForm({
  form: "RemissionStatusModalForm",
  enableReinitialize: true,
  validate,
})(RemissionStatusModal);
export default connect(mapStateToProps, { saveRemissionStatus })(RemissionStatusModal);
