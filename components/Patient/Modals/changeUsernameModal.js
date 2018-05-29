// import { changePassword, resetModalVal } from "../../../actions/changePassword";

import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { resetFormVar, saveUserInfo } from "../../../actions/UserActions";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import { renderInputField } from "../../common/dynamicFields";

class ChangeUsernameModal extends Component {
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
    // this.props.resetFormVar();
  }

  componentWillReceiveProps(nextProps, props) {
    // this.setState({ "serverErr": null });
    // if (nextProps !== props) {
    // if (nextProps.isRequesting) {
    //   console.log("is requesting");
    // }
    // if (nextProps.isSaved) {
    //   Alert.success("Username successfully updated.");
    //   this.props.handle_modal("false");
    // }
    // if (nextProps.isSavingError && nextProps.err) {
    //   // this.setState({ "serverErr": nextProps.err.msg });
    // }
    // }
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
    if (!formData.username) {
      errObj.username = "Please enter new username";
      errVal = true;

    }
    if (this.props.user_name === formData.username) {
      errObj.username = "Current and new username cannot be same";
      errVal = true;
    }
    // if (!formData.password) {
    //   errObj.password = "Please enter new password";
    //   errVal = true;
    // }
    // if (!formData.password_confirmation) {
    //   errObj.password_confirmation = "Please enter confirm password";
    //   errVal = true;
    // }
    // if (formData.password_confirmation && formData.password_confirmation != formData.password) {
    //   errObj.password_confirmation = "New and confirm password doesn't match";
    //   errVal = true;
    // }
    if (errVal) {
      return false;
    } else {
      let obj = { "user_name": formData.username };
      this.props.saveUserInfo(this.props.token, obj);
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop patientedit-form">
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))} onChange= {(e) => this.resetErr(e)}>
          <ModalHeader toggle={this.manage_modal}>
            <span className="page-title">Change Username</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group row">
              { this.state.serverErr && <span className="spanErrMsg"><strong>Error!</strong> {this.state.serverErr}</span>}
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label"> Current Username</label>
              <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                <Field
                  name="current_username"
                  type="text"
                  component={renderInputField}
                  disabled={true}
                  defaultValue={this.props.user_name}
                  placeholder=" Current Password"
                  className="form-control"
                  maxLength="25"/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label"> New Username</label>
              <div className="col-sm-8 col-md-8 col-lg-6 rmb-10 pr-10">
                <Field
                  name="username"
                  type="text"
                  component={renderInputField}
                  placeholder="New username"
                  className="form-control"
                  maxLength="25"/>
                { this.state.err.username && <span className="text-error">{this.state.err.username}</span> }
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
    isSaving: state.user.isSaving,
    isSaved: state.user.isSaved,
    isSavingError: state.user.isSavingError,
  };
}

ChangeUsernameModal = reduxForm({
  form: "changePassMpdal",
  enableReinitialize: true,
//   validate,
})(ChangeUsernameModal);

export default connect(mapStateToProps, { saveUserInfo, resetFormVar })(ChangeUsernameModal);
