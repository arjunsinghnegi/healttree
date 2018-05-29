import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import { FORM_UPLOAD_API } from "../../../actions/constants";
import { renderInputField } from "../renderFields";
import { uploadForm } from "../../../actions/PatientsActions";

class UploadQuestionnaire extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      base64Image: null,
      isRequesting: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.manage_modal = this.manage_modal.bind(this);
  }
  componentWillMount() {
    // this.handleEndDateChange();
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        this.setState({ isRequesting: true });
      }
      if (nextProps.isSuccess && nextProps.data !== props.data) {
        console.log("in nextProps", nextProps);
        this.setState({ isRequesting: false }, function() {
          Alert.success("Questionnaire successfully uploaded.");
          this.manage_modal();
        });
      }
      if (nextProps.isFailed) {
        Alert.error("Questionnaire failed to upload . Please try with valid file.");
        this.setState({ isRequesting: false }, function() {
          // setTimeout(function() {
          this.manage_modal();
          // }.bind(this), 3000);
        });
      }
    }
  }
  resetForm() {
    this.setState({ files: [], base64Image: null });
  }

  manage_modal() {
    this.resetForm();
    this.props.handle_modal("false");
  }

  onSubmit() {
    if (!this.state.base64Image) {
      return false;
    }
    let attributes = {};
    attributes.attachment = this.state.base64Image;
    this.props.uploadForm(this.props.token, attributes);
    // setTimeout(function() {
    //   this.manage_modal();
    // }.bind(this), 3000);
  }
  onDrop(files) {
    const reader = new FileReader();
    console.log("files", files);
    reader.readAsDataURL(files[0]);
    reader.onload = function(event) {
      let instance = this;
      let encodedImg = event.target.result;
      console.log("encodedImg", encodedImg);
      // let firstSplit = event.target.result.split(";");
      // let secondSplit = firstSplit[1].split(",");
      // The file's text will be printed here
      instance.setState({ base64Image: encodedImg, files });
    }.bind(this);

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
              <div className="form-group row  slctd_file_div">
                <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} className="dropzone_div" accept= ".pdf, image/jpeg, image/png">
                  <p>Drop file here, or click to select file to upload. <br/ > (Accepted files: .png, .jpg, .jpeg, .pdf )</p>
                </Dropzone>
              </div>
              <div className="form-group row">
                { this.state.base64Image && <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-2 col-form-label">Selected File</label>}
                { this.state.base64Image && <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-6 col-form-label file_name">{this.state.files[0].name}</label>}
                { this.state.base64Image && <label htmlFor="inputEmail3" className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-form-label file_size">({(this.state.files[0].size / 1000).toFixed(2)} kb)</label>}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {!this.state.isRequesting && <button
              type="submit"
              className="btn green-btn btn-rt green-hvr-bounce-to-top">
            Continue</button>}
            {this.state.isRequesting && <button
              type="button"
              className="btn green-btn btn-rt green-hvr-bounce-to-top"
              onClick = {(e) => e.preventDefault()}>
            Uploading...</button>}
            <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ this.manage_modal }ref={this.clickDiv}>Cancel</button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

function mapStateToProps(state, ownprops) {
  return {
    isRequesting: state.questionnaire.isRequesting,
    isSuccess: state.questionnaire.isSuccess,
    data: state.questionnaire.data,
    isFailed: state.questionnaire.isError,
  };
}

UploadQuestionnaire = reduxForm({
  form: "UploadQuestionnaireForm",
  enableReinitialize: true,
})(UploadQuestionnaire);
export default connect(mapStateToProps, { uploadForm })(UploadQuestionnaire);
