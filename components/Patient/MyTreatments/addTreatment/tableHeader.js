import React, { Component } from "react";

export default class TreatmentTableHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    //   <div className="outer-mypataient-table">
      <div className= "row legend-row">
        <div className="col-md-1 column-seprator align-cntr col-sm-2">Start Date</div>
        <div className="col-md-1 column-seprator align-cntr col-sm-2">End Date</div>
        <div className="col-md-3 column-seprator align-cntr col-sm-3">Treatment</div>
        {/* <div className="col-md-1 column-seprator">Current Treatment</div> */}
        <div className="col-md-2 column-seprator align-cntr col-sm-1 stopped-drug-panel">Stopped Drug</div>
        <div className="col-md-1 column-seprator align-cntr col-sm-1">Therapy Type</div>
        <div className="col-md-3 column-seprator align-cntr col-sm-2 side-effect-panel">Side Effects</div>
        <div className="col-md-1 column-seprator align-cntr col-sm-1">Actions</div>
      </div>
    //   </div>
    );
  }
}
