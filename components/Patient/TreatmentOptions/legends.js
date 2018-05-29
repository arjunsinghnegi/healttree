import React, { Component } from "react";
export default class Legends extends Component {
  constructor(props) {
    super(props);
    this.renderLabels = this.renderLabels.bind(this);
  }
  renderLabels() {
    let indents = [];
    this.props.legendArr.map(function(legend, key) {
      indents.push(<div className= "col-sm-3 label_parent" key={key}>
        <div>
          <div className="label-div treatment-options-div" style={{ "borderColor": legend.attributes.color_code }}>
            <label className="treatment-options-lbl">{legend.attributes.name}</label>
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
