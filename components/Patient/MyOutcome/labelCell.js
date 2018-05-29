import React, { Component } from "react";
import { OUTCOME_LABEL_KEYS } from "../renderFields";
export default class OutcomeCell extends Component {
  constructor(props) {
    super(props);
    this.renderLabels = this.renderLabels.bind(this);

  }
  renderLabels() {
    let indents = [];
    OUTCOME_LABEL_KEYS.map(function(obj, key) {
      let key_class = `${obj.className} outcome-cell outcome-cell-label`;
      indents.push(<div className= "col-sm-6 label_parent" key={key}>
        <div>
          <div className={key_class}></div>
          <div className="label-div">
            <label className="outcome-label">{obj.label}</label>
          </div>
        </div>

      </div>);
    });
    return indents;
  }
  render() {
    return (
      <div className="outcome-labels">
        <div className="row">
          {this.renderLabels()}
        </div>
      </div>
    );
  }
}
