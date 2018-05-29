import "react-confirm-alert/src/react-confirm-alert.css";// Import css
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { browserHistory, Link } from "react-router";
import { Field, reduxForm } from "redux-form";
import { getRemissionStatus, removeRemissionStatus, saveRemissionStatus } from "../../../actions/PatientsActions";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { confirmAlert } from "react-confirm-alert"; // Import
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import moment from "moment";
import { REMISSION_STATUS_OUTCOMES } from "../renderFields";
import RemissionStatusModal from "../Modals/RemissionStatusModal";
class RemissionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remissions: [],
      userinfo: null,
      showLoader: false,
      title: "",
      modal_data: {},
      editId: null,
      outcome: 0,
    };
    // binding all the functions
    this.onSubmit = this.onSubmit.bind(this);
    this.actionFormatter = this.actionFormatter.bind(this);
    this.removeRecord = this.removeRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
    this.addRecord = this.addRecord.bind(this);
  }

  // Open modal on add and update department
  open_modal(e) {
    // e.preventDefault();
    this.setState({
      modal1: !this.state.modal1,
    });
  }

  componentWillMount() {
    // this.props.getUserInfo(this.props.token);
    this.props.getRemissionStatus(this.props.token);
    this.setState({ showLoader: true });
  }

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps---------", nextProps);
    // if new
    if (nextProps.remission && this.props.remission !== nextProps.remission) {
      if (nextProps.remission.isSuccess && nextProps.remission.data) {
        let tmpArr = this.state.remissions;
        if (this.state.editId) {
          let data = nextProps.remission.data;
          this.props.getRemissionStatus(this.props.token);
          // tmpArr.map(function(obj, key) {
          //   // console.log("data.id", data.id);
          //   // console.log("nextProps.remission.del_id", data);
          //   if (obj.id === data.id) {
          //     // tmpArr[key].id = data.id;
          //     tmpArr[key].start_date = data.attributes.start_date;
          //     tmpArr[key].end_date = data.attributes.end_date;
          //     tmpArr[key].outcome = data.attributes.outcome;
          //     tmpArr[key].cells_no = data.attributes.cells_no;
          //   }
          // });
          //  console.log("tmpArr", tmpArr);
          this.setState({ editId: null, remissions: tmpArr, showLoader: false }, function() {
            let entry = REMISSION_STATUS_OUTCOMES[data.attributes.outcome].label;
            Alert.success(`${entry} outcome has been updated successfully.`);
          });
        } else {
          let data = nextProps.remission.data;
          // let obj = {};
          // obj.id = data.id;
          // obj.start_date = data.attributes.start_date;
          // obj.end_date = data.attributes.end_date;
          // obj.outcome = data.attributes.outcome;
          // obj.cells_no = data.attributes.cells_no;
          // tmpArr.push(obj);
          this.props.getRemissionStatus(this.props.token);
          this.setState({ remissions: tmpArr, showLoader: false });
          let entry = REMISSION_STATUS_OUTCOMES[data.attributes.outcome].label;
          Alert.success(`${entry} outcome has been added successfully.`);
        }
      }

      // checks for delete
      if (nextProps.remission.isDeleting || nextProps.remission.isRequesting) {
        this.setState({ showLoader: true });
      }
      if (nextProps.remission.isDeleted) {
        let tmpArr = [];
        let delEntry = "";
        this.state.remissions.map(function(data, key) {
          if (data.id !== nextProps.remission.del_id) {
            tmpArr.push(data);
          } else {
            delEntry = REMISSION_STATUS_OUTCOMES[data.outcome].label;
          }
        });
        this.setState({ remissions: tmpArr, showLoader: false });
        Alert.success(`${delEntry} outcome has been removed successfully.`);
      }
      if (nextProps.remission.isDeleteError || nextProps.remission.isError) {
        this.setState({ showLoader: false });
        Alert.error("Something went wrong while removing remission. Please try again later.");
      }
    }
    if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userinfo: userinfo });
    }
    if (nextProps.remissions && this.props.remissions !== nextProps.remissions) {
      // console.log("remissions", nextProps.remissions);
      let remissions = [];
      nextProps.remissions.map(function(data, key) {
        let obj = {};
        obj.id = data.id;
        obj.start_date = data.attributes.start_date;
        obj.end_date = data.attributes.end_date;
        obj.outcome = data.attributes.outcome;
        obj.cells_no = data.attributes.cells_no;
        remissions.push(obj);
      });
      this.setState({ remissions: remissions, showLoader: false });
    }
  }

  onContinue(formData) {
    browserHistory.push("/remission-status");
  }
  onSubmit(token, remissionId, formData, userId) {
    // console.log("formData-----", remissionId, formData, userId);
    if (remissionId) {
      this.setState({ editId: remissionId });
    }
    this.props.saveRemissionStatus(token, remissionId, formData, userId, "");
    this.setState({
      modal1: false,
    });
  }
  // actionFormatter function to show edit and delete icon in remissions listing table
  actionFormatter(cell, row) {
    return <span>
      <button className="btn edit" type="button" onClick = {(event) => this.editRecord(event, row)} ><i className="fa fa-pencil-square-o" aria-hidden="true" ></i></button>
      <button className="btn delete" type="button" onClick = {(event) => this.removeRecord(event, row)} ><i className="fa fa-trash-o" aria-hidden="true" ></i></button>
    </span>;
  }
  // removeRecord function called in order to remove remission
  addRecord(event, row) {
    event.preventDefault();
    this.open_modal(event);
    let obj = {};
    obj.id = null;
    obj.start_date = null;
    obj.end_date = null;
    obj.outcome = this.state.outcome;
    obj.cells_no = null;
    this.setState({ title: "Add Treatment Outcome ", "modal_data": obj });
  }
  removeRecord(event, row) {
    event.preventDefault();
    let entry = REMISSION_STATUS_OUTCOMES[row.outcome].label;
    confirmAlert({
      title: "", // Title dialog
      message: `Are you sure you want  do remove the ${entry} outcome?`, // Message dialog
      // childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
      confirmLabel: "Confirm", // Text button confirm
      cancelLabel: "Cancel", // Text button cancel
      onConfirm: () => this.props.removeRemissionStatus(this.props.token, row.id), // Action after Confirm
      onCancel: () => "", // Action after Cancel
    });
    //
  }

  // editRecord function called in order to edit remission
  editRecord(event, row) {
    event.preventDefault();
    // console.log("row", row);
    this.setState({ "title": "Edit Treatment Outcome ", "modal_data": row }, function() {
      this.open_modal(event);
    });
  }

  render() {
    const options = {
      page: 1, // which page you want to show as default
      sizePerPageList: [{
        text: "5", value: 5,
      }, {
        text: "10", value: 10,
      }, {
        text: "All", value: this.state.remissions.length,
      }], // you can change the dropdown list for size per page
      sizePerPage: 10, // which size per page you want to locate as default
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
      <div>
        {this.state.showLoader && <Loader />}
        <RemissionStatusModal
          modal_var = {this.state.modal1}
          handle_modal = { (e) => this.open_modal(e) }
          userinfo={this.state.userinfo}
          token={this.props.token}
          title={this.state.title}
          modalData={this.state.modal_data}
          onSubmit = {this.onSubmit}/>
        <div className="myeloma_content">
        </div>
        <form>
          <button
            onClick={ (e) => this.addRecord(e) }
            type="button"
            className="btn blue_btn text-center hvr-bounce-to-top">
            <i className="flaticon-clipboard"></i><span>Add Outcomes</span>
          </button>
          <div className="form-group">
            <div className="table-responsive">
              <BootstrapTable data={this.state.remissions} striped hover pagination={ true } options={ options }>
                <TableHeaderColumn isKey={true} dataField="start_date" dataFormat={(cell, row) => moment(row.start_date).format("MMM YYYY")} width={"150px"} dataSort={ true }>Start Date</TableHeaderColumn>
                <TableHeaderColumn dataField="end_date" dataFormat={(cell, row) => moment(row.end_date).format("MMM YYYY")} width={"150px"} dataSort={ true }>End Date</TableHeaderColumn>
                <TableHeaderColumn dataField="outcome" dataFormat={(cell, row) => row.outcome === null ? "N/A" : REMISSION_STATUS_OUTCOMES[row.outcome].label + ((row.cells_no) ? `(${row.cells_no})` : "") } >Outcome after treatment</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.actionFormatter} width={"100px"}>Action</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    statusText: state.patient.statusText,
    isAuthenticating: state.patient.isAuthenticating,
    remissions: state.patient.remissions,
    userinfo: state.user.userinfo,
    remission: state.remission,
  };
}
export default connect(mapStateToProps, { getRemissionStatus, getUserInfo, removeRemissionStatus, saveRemissionStatus })(RemissionStatus);
