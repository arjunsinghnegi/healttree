import { changePassword, resetModalVal } from "../../../actions/changePassword";
import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import { renderInputField } from "../renderFields";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.manage_modal = this.manage_modal.bind(this);
    this.state = {
      err: {},
      serverErr: null,
    };
    this.resetErr = this.resetErr.bind(this);

  }

  // call function in parent to handle modal
  manage_modal() {
    this.props.handle_modal("false");
  }

  componentWillMount() {
    this.props.resetModalVal();
  }

  componentWillReceiveProps(nextProps, props) {
    // this.setState({ "serverErr": null });
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        // console.log("is requesting");
      }
      if (nextProps.isSuccess) {
        Alert.success("Password successfully updated.");
        this.props.handle_modal("false");
      }
      if (nextProps.isFailed && nextProps.err) {
        this.setState({ "serverErr": nextProps.err.msg });
      }
    }
  }

  resetErr(e) {
    e.preventDefault();
    this.setState({ "serverErr": null });
  }
  //   on submit of form
  onSubmit(formData) {
    let errObj = {};
    this.setState({ err: errObj });
    let errVal = false;
    if (!formData.current_password) {
      errObj.current_password = "Please enter current password";
      errVal = true;
    }
    if (!formData.password) {
      errObj.password = "Please enter new password";
      errVal = true;
    }
    if (!formData.password_confirmation) {
      errObj.password_confirmation = "Please enter confirm password";
      errVal = true;
    }
    if (formData.password_confirmation && formData.password_confirmation != formData.password) {
      errObj.password_confirmation = "New and confirm password doesn't match";
      errVal = true;
    }
    if (errVal) {
      return false;
    } else {
      let obj = {
        "data": {
          "password": formData.password,
          "password_confirmation": formData.password_confirmation,
          "current_password": formData.current_password,
        },
      };
      this.props.changePassword(obj, this.props.token);
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop patientedit-form">
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))} onChange= {(e) => this.resetErr(e)}>
          <ModalHeader toggle={this.manage_modal}>
            <span className="page-title">Change Password</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group row">
              { this.state.serverErr && <span className="spanErrMsg"><strong>Error!</strong> {this.state.serverErr}</span>}
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label"> Current Password</label>
              <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                <Field
                  name="current_password"
                  type="password"
                  component={renderInputField}
                  placeholder=" Current Password"
                  className="form-control"
                  maxLength="8"/>
                { this.state.err.current_password && <span className="text-error">{this.state.err.current_password}</span> }
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label"> New Password</label>
              <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                <Field
                  name="password"
                  type="password"
                  component={renderInputField}
                  placeholder="Password"
                  className="form-control"
                  maxLength="8"/>
                { this.state.err.password && <span className="text-error">{this.state.err.password}</span> }
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label"> Confirm  Password</label>
              <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                <Field
                  name="password_confirmation"
                  type="password"
                  component={renderInputField}
                  placeholder=" Confirm Password"
                  className="form-control"
                  maxLength="8"/>
                { this.state.err.password_confirmation && <span className="text-error">{this.state.err.password_confirmation}</span> }
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
function mapStateToProps(state) {
  return {
    isRequesting: state.changePassword.isRequesting,
    isSuccess: state.changePassword.isSuccess,
    isFailed: state.changePassword.isError,
    data: state.changePassword.data,
    err: state.changePassword.errMessage,
  };
}

ChangePassword = reduxForm({
  form: "changePassMpdal",
  enableReinitialize: true,
//   validate,
})(ChangePassword);

export default connect(mapStateToProps, { changePassword, resetModalVal })(ChangePassword);
