import { Field, formValueSelector, reduxForm } from "redux-form";
import { getUserInfo, resetFormVar, saveUserInfo } from "../../../actions/UserActions";
import React, { Component } from "react";
import Alert from "react-s-alert";
// for image cropping
// import AvatarCropper from "react-avatar-cropper";
import ChangePasswordModal from "../Modals/changePassword";
import ChangeUsernameModal from "../Modals/changeUsernameModal";
import { confirmAlert } from "react-confirm-alert";
import { connect } from "react-redux";
// for drag and drop
import Dropzone from "react-dropzone";

import Loader from "../../common/loader";
import { renderInputField } from "../../common/dynamicFields";

import validate from "../validate";


class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userImg: null,
      user_name: null,
      cropperOpen: false,
      showLoader: true,
      modal: false,
      usernameModal: false,
      showPreview: false,
      // showDropZone: false,
      // selectedImage: null,
    };
    this.handleRequestHide = this.handleRequestHide.bind(this);
    // this.manageClick = this.manageClick.bind(this);
    this.revertImageClick = this.revertImageClick.bind(this);
  }
  componentWillMount() {
    // this.props.getUserInfo(this.props.token);
  }
  // component will receive props
  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.isSaving && this.state.usernameModal) {
        this.setState({ showLoader: true });
        this.props.resetFormVar();
      }
      if (nextProps.isSaved) {
        if (this.state.usernameModal) {
          Alert.success("Username successfully updated.");
          this.setState({ showLoader: true, usernameModal: false });
          // this.props.getUserInfo(this.props.token);
        } else {
          Alert.success("Profile image successfully updated.");
        }

        // this.props.resetFormVar();
      }
      if (nextProps.isSavingError) {
        this.setState({ showLoader: false });
        if (nextProps.serverErr && nextProps.serverErr.response && nextProps.serverErr.response.statusText) {
          Alert.error(nextProps.serverErr.response.statusText);
        } else {
          Alert.error("Something went wrong. Please try again later.");
        }

        this.props.resetFormVar();
      }
    }
    if (nextProps.initialValues && nextProps.initialValues !== props.initialValues) {
      let usrImg = "";
      let userImg = (nextProps.initialValues && nextProps.initialValues.profile_url) ? nextProps.initialValues.profile_url : require("../../../assets/images/user.png");
      if (!this.state.selectedImage) {
        usrImg = (nextProps.initialValues && nextProps.initialValues.profile_url) ? nextProps.initialValues.profile_url : require("../../../assets/images/user.png");
      } else {
        usrImg = this.state.selectedImage;
      }
      this.setState({ userImg: userImg, user_name: nextProps.initialValues.user_name }, function() {
        setTimeout(function() {
          this.setState({ showLoader: false });
        }.bind(this), 8000);
      });
    }
  }
  // onSubmit(formData) {
  //   let obj = {};
  //   obj.user_name = formData.user_name;
  //   if (this.state.selectedImage) {
  //     obj.avatar = this.state.selectedImage;
  //   }
  //   this.setState({ showLoader: true });
  //   this.props.saveUserInfo(this.props.token, obj);
  // }
  open_modal(e) {
    this.setState({
      modal: !this.state.modal,
    });
  }
  open_edit_username_modal(e) {
    this.setState({
      usernameModal: !this.state.usernameModal,
    });
  }
  // manageClick(e) {
  //   e.preventDefault();
  //   this.setState({ showDropZone: !this.state.showDropZone, selectedImage: null, showPreview: false });
  // }
  revertImageClick(e) {
    e.preventDefault();
    let obj = {};
    // obj.user_name = formData.user_name;
    // if (this.state.selectedImage) {
    obj.avatar = null,
    // }
    confirmAlert({
      title: "", // Title dialog
      message: "Are you sure you want to remove your profile image?", // Message dialog
      // childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
      confirmLabel: "Confirm", // Text button confirm
      cancelLabel: "Cancel", // Text button cancel
      onConfirm: () => {
        this.setState({ userImg: null, selectedImage: null, showPreview: false }, function() {
          // console.log("this.state.userImg", this.state.userImg);
          this.props.saveUserInfo(this.props.token, obj);
        });
      }, // Action after Confirm
      onCancel: () => "", // Action after Cancel
    });
  }

  handleRequestHide() {
    // console.log("on request hide");
  }
  onDrop(files) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function(event) {
      let instance = this;
      let encodedImg = event.target.result;
      this.setState({ selectedImage: encodedImg }, function() {
        let obj = {};
        // obj.user_name = formData.user_name;
        if (this.state.selectedImage) {
          obj.avatar = this.state.selectedImage;
        }
        this.props.saveUserInfo(this.props.token, obj);
        this.setState({ showPreview: true, cropperOpen: true });
      });
      // let firstSplit = event.target.result.split(";");
      // let secondSplit = firstSplit[1].split(",");
      // The file's text will be printed here
    //   instance.setState({ base64Image: encodedImg, files });
    }.bind(this);

  }
  render() {
    const { handleSubmit } = this.props;
    let image = (this.state.userImg) ? this.state.userImg : require("../../../assets/images/user.png");
    return (
      <div className="tabs-div">
        {this.state.showLoader && <Loader />}
        {/* span to open modal */}
        {/* <span onClick={(e) => this.open_modal(e)} className="pas-span">Change Password</span> */}
        <form noValidate>
          <div className="form-group row">
            <label htmlFor="inputEmail3" className="col-md-2 col-form-label">Profile: </label>
            <div className="col-md-2">
              <div className="form-group slctd_file_div tabs-selected-dv">
                {!this.state.showDropZone &&
                <div>

                  <div className="dropzone-tabs custom-dropzone">
                    <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} className="dropzone" accept= "image/jpeg, image/png">
                      {!this.state.showPreview && <img className= "dropzoneimage" src={(this.state.userImg) ? this.state.userImg : require("../../../assets/images/user.png")} />}
                      {this.state.showPreview && <img className= "dropzoneimage" src={this.state.selectedImage} />}
                    </Dropzone>
                    <div className="dropzone-marker">
                      <span onClick = {(e) => this.revertImageClick(e)} title="Click to discard selected image.">
                        <img src= {require("../../../assets/images/close.png")} alt="camera" />
                      </span>
                    </div>
                  </div>
                </div>}
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-4 col-md-4 col-lg-3">
              <label htmlFor="inputEmail3" className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-form-label account-lbl">Username:</label>
              <label htmlFor="inputEmail3" className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-form-label account-val">{this.state.user_name}</label>
            </div>
            {/* <div className="col-sm-4 col-md-4 col-lg-3">

                name="user_name"
                type="text"
                defaultValue={this.state.user_name}
                disabled={true}
                component={renderInputField}
                onClick={(e) => this.open_edit_username_modal(e)}
                // onChange={(e) => this.handleTextChange(e, parentKey)}
                placeholder="password"
                className="form-control"
                maxLength="50"/>
            </div> */}
            <div className="col-sm-4 col-md-4 col-lg-2">
              <button type="button" className="btn accoutSetting-btn" onClick={(e) => this.open_edit_username_modal(e)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</button>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-4 col-md-4 col-lg-3">
              <label htmlFor="inputEmail3" className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-form-label account-lbl">Password:</label>
              <label htmlFor="inputEmail3" className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-form-label account-val">*******</label>
            </div>
            {/* <div className="col-sm-4 col-md-4 col-lg-3">
              <Field
                name="falsePassword"
                type="password"
                defaultValue="*****"
                disabled={true}
                component={renderInputField}
                onClick={(e) => this.open_modal(e)}
                // onChange={(e) => this.handleTextChange(e, parentKey)}
                placeholder="password"
                className="form-control"
                maxLength="50"/>
            </div> */}
            <div className="col-sm-4 col-md-4 col-lg-2">
              <button type="button" className="btn accoutSetting-btn" onClick={(e) => this.open_modal(e)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</button>
            </div>
          </div>
          {/* <div className="form-group row">
            <div className="col-sm-5 text-center">
              <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Save</button>
            </div>
          </div> */}
        </form>

        {this.state.modal && <ChangePasswordModal
          modal_var = {this.state.modal}
          handle_modal = { (e) => this.open_modal(e) }
          token={this.props.token}
          title={this.state.title}
          modalData={this.state.modal_data}
        />}

        {this.state.usernameModal && <ChangeUsernameModal
          modal_var = {this.state.usernameModal}
          handle_modal = { (e) => this.open_edit_username_modal(e) }
          user_name={this.state.user_name}
          token={this.props.token}
          title={this.state.title}
          modalData={this.state.modal_data}
        />}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    initialValues: state.user.userinfo.attributes,
    isAuthenticating: state.user.isAuthenticating,
    isSaving: state.user.isSaving,
    isSaved: state.user.isSaved,
    isSavingError: state.user.isSavingError,
    serverErr: state.user.serverErr,
  };
}

AccountSettings = reduxForm({
  form: "AccountSetting",
  enableReinitialize: true,
  validate,
})(AccountSettings);

export default connect(mapStateToProps, { getUserInfo, saveUserInfo, resetFormVar })(AccountSettings);
