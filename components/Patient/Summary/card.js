import React, { Component } from "react";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: (props.data) ? props.data : [],
    };
    this.renderRows = this.renderRows.bind(this);
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.data !== props.data) {
      this.setState({ data: (nextProps.data) ? nextProps.data : [] });
    }
  }
  // renderRows
  renderRows(label) {
    let row = [];
    if (!this.state.data.length) {
      return row;
    }
    this.state.data.map(function(obj, key) {
      if (label == "Fitness Level") {
        row.push(<div className="row" key={key}>
          <div className="col-9 col-sm-9">
            <label className="summary_lbl">{obj.label}</label>
          </div>
          <div className="col-3 col-sm-3">
            <label>{obj.value}</label>
          </div>
        </div>);
      } else {
        row.push(<div className="row" key={key}>
          <div className="col-8 col-sm-5">
            <label className="summary_lbl">{obj.label}:</label>
          </div>
          <div className="col-4 col-sm-7">
            <label>{obj.value}</label>
          </div>
        </div>);
      }
    });
    return row;
  }
  render() {
    return (
      <div className="col summary_div custom-summary">
        <label className="summaryh2">{this.props.label}</label>
        {this.renderRows(this.props.label)}
      </div>
    );
  }
}
