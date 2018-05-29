import { Field, reduxForm } from "redux-form";
import { getPersonalNote, savePersonalNote } from "../../../actions/treatmentOptionsActions";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import { renderTextArea } from "../renderFields";

class PersonalNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      base64Image: null,
      isRequesting: false,
      noteErr: "",
      note_id: null,
    };
    this.manage_modal = this.manage_modal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }
  componentWillMount() {
    // this.handleEndDateChange();
    // console.log("i am here ")
    this.props.getPersonalNote(this.props.token);
  }
  componentWillReceiveProps(nextProps, props) {
    console.log("initialValues", nextProps.initialValues);
    if (nextProps.initialValues && nextProps.initialValues !== props.initialValues) {
      if (nextProps.initialValues.note_id) {
        this.setState({ note_id: nextProps.initialValues.note_id });
      }
    }
    // console.log("nextProps.data>>", nextProps.noteData);
    // console.log("nextProps.isRequesting", nextProps.isRequesting);
    // console.log("nextProps.isSuccess", nextProps.isSuccess);
    // console.log("nextProps.isFailed", nextProps.isFailed);
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        this.setState({ isRequesting: true });
      }
      if (nextProps.isSuccess && nextProps.data !== props.data) {
        this.setState({ isRequesting: false }, function() {
          Alert.success("Personal note successfully added.");
          this.props.getPersonalNote(this.props.token);
          this.manage_modal();
          // this.componentWillDisappear();
        });
      }
      if (nextProps.isFailed) {
        Alert.error("Failed to update personal note. Please try again later.");
        this.setState({ isRequesting: false }, function() {
          // this.resetForm();
        });
      }
    }
  }
  resetForm() {
    // this.setState({ files: [], base64Image: null });
  }

  manage_modal() {
    // this.resetForm();
    console.log("falseeee");
    this.props.handle_modal("false");
  }

  onSubmit(formData) {
    if (!formData.personal_note || !formData.personal_note.trim()) {
      this.setState({ "noteErr": "Please enter your personal notes" });
    }
    // call function to save the data
    let data = {
      "content": formData.personal_note,
      "user_id": this.props.userinfo.id,
      "treatment_option_id": this.props.treatment_id,
    };
    this.props.savePersonalNote(this.props.token, data, this.state.note_id);

    // return false;

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
              <Field
                name="personal_note"
                type="text"
                className="form-control treatment-textarea"
                id="goal"
                rows={10}
                maxLength="500"
                placeholder="Your personal notes"
                component={renderTextArea} />
              <span className="text-error">{this.state.noteErr}</span>
            </div>
          </ModalBody>
          <ModalFooter>
            <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
            <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ this.manage_modal } ref={this.clickDiv}>Cancel</button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

function mapStateToProps(state, ownprops) {
  return {
    "isRequesting": state.personalNote.isRequesting,
    "isSuccess": state.personalNote.isSuccess,
    "data": state.personalNote.data,
    "isFailed": state.personalNote.isError,
    "isGetRequest": state.personalNote.isGetRequest,
    "isGetSuccess": state.personalNote.isGetSuccess,
    "isGetError": state.personalNote.isGetError,
    "initialValues": state.personalNote.noteData,
  };
}

PersonalNote = reduxForm({
  form: "PersonalNoteForm",
  enableReinitialize: true,
})(PersonalNote);
export default connect(mapStateToProps, { getPersonalNote, savePersonalNote })(PersonalNote);
