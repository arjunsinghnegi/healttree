import { Field, reduxForm } from "redux-form";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { resetFeedback, saveFeedback } from "../../../actions/feedbackActions";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import { renderTextArea } from "../renderFields";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      isRequesting: false,
      isSuccess: false,
      isError: false,
    };

    this.manage_modal = this.manage_modal.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);

  }
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.token && nextProps.token !== props.token) {
      this.setState({ token: nextProps.token });
    }
    if (nextProps.isRequesting) {
      this.setState({
        isRequesting: true,
        isSuccess: false,
        isError: false,
      });
    }
    if (nextProps.isSuccess) {
      this.setState({
        isRequesting: false,
        isSuccess: true,
        isError: false,
      });
      Alert.success("Thank You! Your feedback is highly appreciated and will help us to improve our ability to serve you and other users of our website.");
      this.props.resetFeedback();
      this.manage_modal();
    }
    if (nextProps.isError) {
      this.setState({
        isRequesting: false,
        isSuccess: false,
        isError: true,
      });
      this.props.resetFeedback();
      Alert.error("Something went wrong ! Please try again later.");
    }
  }


  manage_modal() {
    this.props.handle_modal("false");
  }

  onSubmit(formData) {

    if (!formData.feedback || !formData.feedback.trim()) {
      Alert.error("Please enter your feedback and then click on Submit.");
      // this.setState({ "noteErr": "Please enter your feedback" });
      return;
    }
    let data = {
      "data": {
        type: "patient_feedbacks",
        attributes: {
          feedback: formData.feedback,
        },
        relationships: {
          user: {
            data: {
              type: "users",
              id: this.props.userId },
          },
        },

      },
    };
    // console.log("data", data);
    // // call function to save the data
    // let data = {
    //   "content": formData.personal_note,
    //   "user_id": this.props.userinfo.id,
    //   "treatment_option_id": this.props.treatment_id,
    // };
    let token = (this.state.token) ? this.state.token : localStorage.getItem("authToken");
    this.props.saveFeedback(token, data);

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
                name="feedback"
                type="text"
                className="form-control treatment-textarea"
                id="goal"
                rows={10}
                maxLength="10000"
                placeholder="Your highly valuable feedback goes here..."
                component={renderTextArea} />
              {/* <span className="text-error">{this.state.noteErr}</span> */}
            </div>
          </ModalBody>
          <ModalFooter>
            {!this.state.isRequesting && <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Submit</button>}
            {this.state.isRequesting && <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={(e) => e.preventDefault } >Saving...</button>}
            <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={ this.manage_modal } ref={this.clickDiv}>Cancel</button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

function mapStateToProps(state, ownprops) {
  return {
    token: state.login.token,
    isRequesting: state.feedback.isRequesting,
    isSuccess: state.feedback.isSuccess,
    isError: state.feedback.isError,
  };
}

Feedback = reduxForm({
  form: "FeedbackForm",
  enableReinitialize: true,
})(Feedback);
export default connect(mapStateToProps, { resetFeedback, saveFeedback })(Feedback);
