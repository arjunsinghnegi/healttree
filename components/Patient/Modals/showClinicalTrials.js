
import { Field, reduxForm } from "redux-form";
import { hideGetStartedModal, saveUserInterest } from "../../../actions/staticPagesActions";
import React, { Component } from "react";
import { connect } from "react-redux";
import Form from "muicss/lib/react/form";
import { Modal } from "reactstrap";

class ClinicalTrialsInfo extends Component {

  constructor(props) {
    super(props);
    this.manage_modal = this.manage_modal.bind(this);
    this.state = {
      deptData: [],
      id: null,
      name: null,
      description: null,
      userInterest: 0,
    };
    // this.setUserInterest = this.setUserInterest.bind(this);
  }

  manage_modal() {
    this.props.handle_modal("false");
  }


  render() {
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop">
        <div className="modal-bg">
          <div className="modal-header">
            {/* <h5><span></span><img src={require("../../../assets/images/modal-logo.png")} alt="" /></h5> */}
            <i onClick={ this.manage_modal } data-dismiss="modal" aria-label="Close" className="fa fa-times close" aria-hidden="true"></i>
            <img src={require("../../../assets/images/welcome-modal-logo.png")} />

          </div>
          <div className="modal-body">
            <div className="inner-content">
              {/* <h1>Welcome To HealthTree</h1> */}
              <div className="show-clinical">
                <p>We are ready to show you the options that are available to you for treatment. </p>
                <p> We will also introduce you to clinical trials, the opportunity to complete a full health history and answer survey's from researchers.</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={ this.manage_modal } data-dismiss="modal" className="btn start_btn white-hvr-bounce-to-top get-started">Continue</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(null, null)(ClinicalTrialsInfo);

