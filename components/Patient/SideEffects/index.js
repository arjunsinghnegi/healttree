import "react-confirm-alert/src/react-confirm-alert.css";// Import css
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { browserHistory, Link } from "react-router";
import { getMySideEffects, getTreatments, removeMySideEffect, saveMySideEffects } from "../../../actions/PatientsActions";
import React, { Component } from "react";
import Alert from "react-s-alert";
// import BackLink from "../../common/backButton";
import { confirmAlert } from "react-confirm-alert";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import moment from "moment";
import MySideEffectsModal from "../Modals/MySideEffectsModal";

class MySideEffects extends Component {

  constructor(props) {
    super(props);
    console.log("i am here", props);
    this.state = {
      sideEffects: [],
      userinfo: null,
      showLoader: false,
      title: "",
      modal_data: {},
      editId: null,
      treatments: [],
      "redirectTo": "/my-outcome",
    };
    // binding all the functions
    this.onSubmit = this.onSubmit.bind(this);
    this.actionFormatter = this.actionFormatter.bind(this);
    this.removeRecord = this.removeRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.endDateFormat = this.endDateFormat.bind(this);
    this.startDateFormat = this.startDateFormat.bind(this);
    // this.handleBackLink = this.handleBackLink.bind(this);
  }

  // Open modal on add and update department
  open_modal(e) {
    // e.preventDefault();
    this.setState({
      modal1: !this.state.modal1,
    });
  }
  // handleBackLink() {
  //   browserHistory.push("/my-treatments");
  // }
  componentWillMount() {
    this.props.getUserInfo(this.props.token);
    this.props.getMySideEffects(this.props.token);
    this.props.getTreatments(this.props.token);
    this.setState({ showLoader: true });
  }

  componentWillReceiveProps(nextProps) {
    // if new
    if (nextProps.sideEffect && this.props.sideEffect !== nextProps.sideEffect) {
      if (nextProps.sideEffect.isSuccess && nextProps.sideEffect.data) {
        let tmpArr = this.state.sideEffects;
        let data = nextProps.sideEffect.data;
        if (this.state.editId) {
          this.props.getMySideEffects(this.props.token);
          this.setState({ showLoader: true });
          Alert.closeAll();
          Alert.success(`${data.attributes.side_effect} side effect has been updated successfully.`);
          // });

        } else {
          this.props.getMySideEffects(this.props.token);
          this.setState({ showLoader: true });
          Alert.closeAll();
          Alert.success(`${data.attributes.side_effect} side effect has been added successfully.`);
        }
      }

      // checks for delete
      if (nextProps.sideEffect.isDeleting || nextProps.sideEffect.isRequesting) {
        this.setState({ showLoader: true });
      }
      if (nextProps.sideEffect.isDeleted) {
        let tmpArr = [];
        let delEntry = "";
        this.state.sideEffects.map(function(data, key) {
          // console.log("data.id", data.id);
          // console.log("nextProps.sideEffect.del_id", nextProps.sideEffect.del_id);
          if (data.id !== nextProps.sideEffect.del_id) {
            tmpArr.push(data);
          } else {
            delEntry = data.side_effect;
            console.log("delEntry", delEntry);
          }
        });
        this.setState({ sideEffects: tmpArr, showLoader: false });
        Alert.success(`${delEntry} side effect has been removed successfully.`);
      }
      if (nextProps.sideEffect.isDeleteError || nextProps.sideEffect.isError) {
        this.setState({ showLoader: false });
        Alert.error("Something went wrong while removing side effect. Please try again later.");
      }
    }
    if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userinfo: userinfo });
    }
    if (nextProps.sideEffects && this.props.sideEffects !== nextProps.sideEffects) {
      // console.log("sideEffects", nextProps.sideEffects);
      let sideEffects = [];
      nextProps.sideEffects.map(function(data, key) {
        let obj = {};
        obj.id = data.id;
        obj.start_date = data.attributes.start_date;
        obj.end_date = data.attributes.end_date;
        obj.side_effect = data.attributes.side_effect;
        obj.severity = data.attributes.severity;
        obj.patient_treatment_id = data.attributes.patient_treatment_id;
        sideEffects.push(obj);
      });
      this.setState({ sideEffects: sideEffects, showLoader: false });
    }

    // treatments
    if (nextProps.treatments && this.props.treatments !== nextProps.treatments) {
      let treatments = [];
      nextProps.treatments.map(function(data, key) {
        let obj = {};
        obj.value = data.id;
        obj.start_date = data.attributes.start_date;
        obj.end_date = data.attributes.end_date;
        obj.treatment = data.attributes.treatment;
        obj.label = data.attributes.treatment_label.toString();
        obj.outcome = data.attributes.outcome;
        obj.resistantTo = data.attributes.resistant;
        obj.current_treatment = data.attributes.current_treatment;
        treatments.push(obj);
      });
      console.log("treatments****", treatments);
      this.setState({ treatments: treatments, showLoader: false });
      // this.props.resetPatient();
    }
  }

  onContinue(formData) {
    browserHistory.push("/my-outcome");
  }
  onSubmit(token, effectId, formData, userId) {
    console.log("formData", token, effectId, formData, userId);
    if (effectId) {
      this.setState({ "editId": effectId });
    }
    this.props.saveMySideEffects(token, effectId, formData, userId, "");
    this.setState({
      modal1: false,
    });
  }
  endDateFormat(cell, row) {
    return moment(row.end_date).format("DD MMM, YYYY");
  }
  startDateFormat(cell, row) {
    return moment(row.start_date).format("DD MMM, YYYY");
  }
  // actionFormatter function to show edit and delete icon in side effects listing table
  actionFormatter(cell, row) {
    return <span>
      <button className="btn edit" type="button"><i className="fa fa-pencil-square-o" aria-hidden="true" onClick = {(event) => this.editRecord(event, row)}></i></button>
      <button className="btn delete" type="button"><i className="fa fa-trash-o" aria-hidden="true" onClick = {(event) => this.removeRecord(event, row)}></i></button>
    </span>;
  }
  // removeRecord function called in order to remove SideEffect
  addRecord(event, row) {
    event.preventDefault();
    this.open_modal(event);
    let obj = {};
    obj.id = null;
    obj.start_date = null;
    obj.end_date = null;
    obj.side_effect = null;
    obj.severity = null;
    this.setState({ title: "Add My Side Effects", "modal_data": obj });
  }
  removeRecord(event, row) {
    event.preventDefault();
    confirmAlert({
      title: "", // Title dialog
      message: `Are you sure you want  to remove the ${row.side_effect} side effect?`, // Message dialog
      // childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
      confirmLabel: "Confirm", // Text button confirm
      cancelLabel: "Cancel", // Text button cancel
      onConfirm: () => this.props.removeMySideEffect(this.props.token, row.id), // Action after Confirm
      onCancel: () => "", // Action after Cancel
    });
    //
  }

  // editRecord function called in order to edit SideEffect
  editRecord(event, row) {
    event.preventDefault();
    console.log("row", row);
    this.setState({ "title": "Edit My Side Effects ", "modal_data": row }, function() {
      this.open_modal(event);
    });
  }
  render() {
  //  const { handleSubmit } = this.props;
    const options = {
      page: 1, // which page you want to show as default
      sizePerPageList: [{
        text: "5", value: 5,
      }, {
        text: "10", value: 10,
      }, {
        text: "All", value: this.state.sideEffects.length,
      }], // you can change the dropdown list for size per page
      sizePerPage: 4, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: "bottom", // default is bottom, top and both is all available
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
    };
    return (
      <div id="page-content-wrapper">
        <Alert stack={{ limit: 1 }} />
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">My Side Effects</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          {this.state.treatments.length > 0 && this.state.modal1 && <MySideEffectsModal
            modal_var = {this.state.modal1}
            handle_modal = { (e) => this.open_modal(e) }
            userinfo={this.state.userinfo}
            token={this.props.token}
            title={this.state.title}
            modalData={this.state.modal_data}
            treatments={this.state.treatments}
            onSubmit = {this.onSubmit}/>}
          <div className="treatment">
            <div className="myeloma_content">
              <p>Can you tell us about any treatment side effects you have experienced?  This will help us to create a treatment tree for you that will be the most tolerable.</p>
            </div>
            <form>
              {this.state.treatments.length > 0 && <button
                onClick={ (e) => this.addRecord(e) }
                type="button"
                className="btn blue_btn text-center hvr-bounce-to-top">
                <i className="flaticon-clipboard"></i><span>Add</span>
              </button> }
              <div className="form-group">
                <div className="table-responsive">
                  <BootstrapTable data={this.state.sideEffects} striped hover pagination={ true } options={ options }>
                    <TableHeaderColumn isKey={true} dataField="start_date" dataFormat={this.startDateFormat} width={"150px"} dataSort={ true }>Start Date</TableHeaderColumn>
                    <TableHeaderColumn dataFormat={this.endDateFormat} width={"150px"} dataSort={ true }>End Date</TableHeaderColumn>
                    <TableHeaderColumn dataField="side_effect" dataSort={ true } >Side Effect</TableHeaderColumn>
                    <TableHeaderColumn dataField="severity" width={"100px"} dataSort={ true }>Severity</TableHeaderColumn>
                    <TableHeaderColumn dataFormat={this.actionFormatter} width={"100px"}>Action</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </div>
              <div className="button-dv1">
                <div className="text-center">
                  <button onClick={this.onContinue} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusText: state.patient.statusText,
    isAuthenticating: state.patient.isAuthenticating,
    sideEffects: state.patient.sideEffects,
    userinfo: state.user.userinfo,
    sideEffect: state.sideEffect,
    treatments: state.patient.treatments,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
export default connect(mapStateToProps, { getMySideEffects, getUserInfo, removeMySideEffect, saveMySideEffects, getTreatments })(MySideEffects);
