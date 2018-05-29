import React, { Component } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { reduxForm } from "redux-form";

export default class GetStartModal extends Component {

  constructor(props) {
    super(props);
    this.manage_modal = this.manage_modal.bind(this);
    this.state = {
      deptData: [],
      id: null,
      name: null,
      description: null,
    };
  }

  manage_modal() {
    this.props.handle_modal("false");
  }

  componentWillReceiveProps(nextProps) {
 console.log(nextProps);

    // if ( nextProps.department && this.props.department !== nextProps.department ) {
    //     let department = nextProps.department;
    //     this.setState( { id : department.id } );
    //     this.setState( { name : department.name } );
    //     this.setState( { description : department.description } );
    // }
  }

  onSubmit(formData) {
 console.log(formData);

    // this.props.createDepartment(this.props.tenantId, this.state.id, this.props.token, formData);
    // let This = this;
    // setTimeout(function(){
    //     This.props.handle_modal('false');
    // }, 1000);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg check-pop patientedit-form">
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <ModalHeader toggle={this.manage_modal}>
            <span className="modal-title">{ this.state.id ? "Edit" : "Add" } Department</span>
          </ModalHeader>
          <ModalBody>
	                <div className="row">
                  Confused about the myeloma treatment options available to you? With so many new treatment optionsavailable, you are not alone.
In order to help find the most personally relevant options that you can discuss with your doctor, we need to gather some information about your myeloma and prior treatments.
There are a few paths we can take to get your medical data into our system.
We will step you through in the simplest way possible.
  							  </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="submit"
              className="blue-btn">
                  Save
            </button>
            <button type="button" className="grey-btn mr-sm-4" onClick={ this.manage_modal }>Cancel</button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

// function validate(values) {
//
//     const error = {};
//
//     if(!values.name) {
//         error.name = 'Please enter department name';
//     }
//     return error;
// }
//
// function mapStateToProps(state) {
//      return {
//          isAuthenticated: state.departments.isAuthenticated,
//          isAuthenticating: state.departments.isAuthenticating,
//          statusText : state.departments.statusText,
//          initialValues : {
//            name: state.departments.name,
//            description: state.departments.description
//          }
//      }
// }

// export default reduxForm({
//     form: 'AddEditDepartmentForm',
//     fields: ['name', 'description'],
//     validate
// }, mapStateToProps, { createDepartment })( AddEditDepartmentModal );
