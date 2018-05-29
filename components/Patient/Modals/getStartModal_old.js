
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
    console.log("this.state.user", user_interest);
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
            <h5><span>My Decision</span><img src={require("../../../assets/images/modal-logo.png")} alt="" /></h5>
            {/* <i onClick={ this.manage_modal } data-dismiss="modal" aria-label="Close" className="fa fa-times close" aria-hidden="true"></i>*/}
          </div>
          <div className="modal-body">
            <div className="welcome-modal-content">
              <p>Confused about the myeloma treatment options available to you? With so many new treatment options available, you are not alone.</p>
              <p>In order to help find the most personally relevant options that you can discuss with your doctor, we need to gather some information about your myeloma and prior treatments.</p>
              <p>There are a few paths we can take to get your medical data into our system. We will step you through in the simplest way possible.</p>
            </div>

            <div className="user-input-type">
              <form>
                <div className="form-group row">
                  <label htmlFor="inputPassword3" className="col-sm-6 col-md-6 col-lg-12 col-xl-12 col-form-label"><font>What are you interested in learning about?</font></label>
                  <div className="col-sm-6 col-md-6 col-lg-7">
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
                  </div>
                  <div className="col-sm-6 col-md-6 col-lg-7" tabIndex={2}>
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
                      <label className="radio-custom-label">Outcomes and Research Reports</label>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-6 col-lg-7" tabIndex={3}>
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
                      <label className="radio-custom-label">Both</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={ this.manage_modal } data-dismiss="modal" className="btn start_btn white-hvr-bounce-to-top">Let’s get started</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(null, { hideGetStartedModal, saveUserInterest })(GetStartModal);

