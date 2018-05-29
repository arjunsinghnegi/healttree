import React, { Component } from "react";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import InitialTreatment from "./addTreatment/initialTreatment";
import Introduction from "./addTreatment/introduction";

class AddTreatment extends Component {
  constructor(props) {
    super(props);
    if (!props.treatments) {
      console.log("i am here");
      browserHistory.push("/treatments-outcomes");
    }
    let treatmentLength = (props.treatments) ? props.treatments.length : null;
    // console.log("treatmentLength", treatmentLength);
    this.state = {
      showModal: (!treatmentLength) ? true : false,
      showIntroduction: (!treatmentLength) ? true : false,
      showInitialTreatment: (treatmentLength) ? true : false,
      "finalObj": null,
    };
    this.recreateFinalObj = this.recreateFinalObj.bind(this);
  }

  componentDidMount() {
    console.log("i am here in addTreatmetn");
  }

  componentWillReceiveProps(props, nextProps) {
    console.log("nextProps", nextProps);
    // if (!nextProps.treatments) {
    //   console.log("treatments", nextProps.treatments);
    // }
  }

  manageComponents(nextLevel) {
    console.log("nextLevel", nextLevel);
  }
  // creating final obj
  recreateFinalObj(isValid, errObj, obj) {
    this.setState({ finalObj: obj });
    console.log("finalObj", isValid, "<<>>0", errObj, "***0", obj);
  }
  render() {
    return (
      <div id="page-content-wrapper">
        <div className="col-sm-12">
          <h2 className="page-title">Add Treatment</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          {/* introductory text */}
          {this.state.showIntroduction && <Introduction />}
          {/* Myeloma treatment */}
          {this.state.showInitialTreatment && <InitialTreatment
            stateData = {this.state}
            check_validations = {this.recreateFinalObj}/>}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    treatments: state.patient.treatments,
  };
}

export default connect(mapStateToProps, null)(AddTreatment);
