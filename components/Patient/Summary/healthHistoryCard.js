import React, { Component } from "react";

export default class HealthHistoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: (props.data) ? props.data : [],
    };
    this.renderRows = this.renderRows.bind(this);
  }
  componentWillReceiveProps(nextProps, props) {
    console.log("nextProps.data", nextProps.data);
    if (nextProps.data !== props.data) {
      this.setState({ data: (nextProps.data) ? nextProps.data : [] });
    }
  }
  // renderRows
  renderRows() {
    let row = [];
    if (!this.state.data.length) {
      return row;
    }
    this.state.data.map(function(obj, key) {
      row.push(<div className="row" key={key}>
        <div className="col-8 col-sm-1">
          <label className="health_lbl"></label>
        </div>
        <div className="col-8 col-sm-11">
          <label className="">{obj}</label>
        </div>
      </div>);
    });
    return row;
  }
  render() {
    return (
      <div className="col summary_div custom-summary">
        <label className="summaryh2">{this.props.label}</label>
        {this.renderRows()}
      </div>
    );
  }
}
