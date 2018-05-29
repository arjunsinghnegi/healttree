
import { Field, reduxForm } from "redux-form";
import { hideGetStartedModal, saveUserInterest } from "../../../actions/staticPagesActions";
import React, { Component } from "react";
import { connect } from "react-redux";
import Form from "muicss/lib/react/form";
import { Modal } from "reactstrap";

class GetStartModal extends Component {

  constructor(props) {
    super(props);
    this.manage_modal = this.manage_modal.bind(this);
    console.log("props in getStartmodal", props);
    this.state = {
      deptData: [],
      id: null,
      name: null,
      description: null,
      userInterest: 0,
    };
    this.setUserInterest = this.setUserInterest.bind(this);
  }

  manage_modal() {
    let saveObj = {
      "is_read_myeloma": true,
      "intrested_in": (this.state.userInterest),
    };
    this.props.hideGetStartedModal(this.props.token, saveObj);
    // this.props.saveUserInterest(this.props.token, saveObj, this.props.patientInfo, this.props.userId);
    this.props.handle_modal("false");
  }

  setUserInterest(e, user_interest) {
    // e.preventDefault();
    // console.log("this.state.user", user_interest);
    this.setState({ userInterest: user_interest });
  }

  // componentWillReceiveProps( nextProps ) {console.log(nextProps);
  //
  //     // if ( nextProps.department && this.props.department !== nextProps.department ) {
  //     //     let department = nextProps.department;
  //     //     this.setState( { id : department.id } );
  //     //     this.setState( { name : department.name } );
  //     //     this.setState( { description : department.description } );
  //     // }
  // }

  onSubmit(formData) { // console.log(formData);

    // this.props.createDepartment(this.props.tenantId, this.state.id, this.props.token, formData);
    // let This = this;
    // setTimeout(function(){
    //     This.props.handle_modal('false');
    // }, 1000);
  }

  render() {
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop">
        <div className="modal-bg">
          <div className="modal-header">
            {/* <h5><img src={require("../../../assets/images/logo.png")} alt="" /></h5> */}
            {/* <div className="logo-dv"> */}
            <img src={require("../../../assets/images/welcome-modal-logo.png")} />
            {/* </div> */}
          </div>
          <div className="modal-body">
            <div className="inner-content">
              <h1>Welcome To HealthTree</h1>
              <p>In order to help you find the most personally relevant options, we need to gather some information about you and your myeloma. You may want to have any paper or electronic records that you have to help you enter the information as accurate as possible.</p>
              <p>After you see your treatment options we will introduce you to clinical trials and the possibility of contributing to research efforts.</p>
              {/* <div className="checkbox-dv">
                <p>What are you interested in learning about?</p>
                <div className="checkbox">
                  <div className="radio-btn" onClick={ (e) => this.setUserInterest(e, 0)} tabIndex={1}>
                    <Field
                      name="bone_lesions"
                      component="input"
                      type="radio"
                      tabIndex={1}
                      className="radio-custom"
                      checked={ this.state.userInterest === 0 ? true : false }
                      onClick={ (e) => this.setUserInterest(e, 0)}
                    />
                    <label className="radio-custom-label">Treatment Options</label>
                  </div>
                  <div className="radio-btn" onClick={ (e) => this.setUserInterest(e, 1)}>
                    <Field
                      name="bone_lesions"
                      component="input"
                      type="radio"
                      tabIndex={2}
                      className="radio-custom"
                      checked={ this.state.userInterest === 1 ? true : false }
                      onClick={ (e) => this.setUserInterest(e, 1)}
                    />
                    <label className="radio-custom-label">Share my information for Research</label>
                  </div>
                  <div className="radio-btn" onClick={ (e) => this.setUserInterest(e, 2)}>
                    <Field
                      name="bone_lesions"
                      component="input"
                      type="radio"
                      tabIndex={3}
                      className="radio-custom"
                      checked={ this.state.userInterest === 2 ? true : false }
                      onClick={ (e) => this.setUserInterest(e, 2)}
                    />
                    <label className="radio-custom-label">Both treatment and research</label>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="modal-footer">
            {/* <button type="button" className="btn btn-primary started-btn">Get Started</button> */}
            <button type="button" onClick={ this.manage_modal } data-dismiss="modal" className="btn start_btn white-hvr-bounce-to-top get-started">Get started</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(null, { hideGetStartedModal, saveUserInterest })(GetStartModal);

