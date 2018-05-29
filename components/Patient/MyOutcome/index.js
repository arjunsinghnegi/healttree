import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
// import BackLink from "../../common/backButton";
import Calendar from "./calendar";
import LabelCell from "./labelCell";
export default class MyOutcome extends Component {
  constructor(props) {
    super(props);
    this.openSummary = this.openSummary.bind(this);
    // this.handleBackLink = this.handleBackLink.bind(this);
  }
  // handleBackLink() {
  //   browserHistory.push("/side-effects");
  // }
  onContinue() {
    browserHistory.push("/treatment-options");
  }
  openSummary() {
    browserHistory.push("/my-summary");
  }
  render() {
    return (
      <div id="page-content-wrapper">
        <div className="print_div">
          <button
            onClick={ (e) => this.openSummary(e) }
            type="button"
            className="btn green-btn green-hvr-bounce-to-top labs-info-btn upload_link">
            <i className="flaticon-clipboard"></i><span>Print My Outcome Summary</span>
          </button>
        </div>
        <div className="col-sm-12">
          <h2 className="page-title">My Outcomes</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <h2 className="calendarH2">My Outcome Calendar</h2>
          <LabelCell />
          <Calendar token={this.props.token}/>
          <div className="form-group row">
            <div className="col-sm-12 text-center">
              <button onClick={this.onContinue} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
