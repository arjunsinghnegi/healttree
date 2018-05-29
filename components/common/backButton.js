import React, { Component } from "react";

export default class backButton extends Component {
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
  }
  back(e) {
    e.preventDefault();
    this.props.handle_back_link();
  }
  render() {
    return (
      <button
        onClick={ (e) => this.back(e) }
        type="button"
        className="btn green-btn green-hvr-bounce-to-top back-btn">
        <i className="flaticon-clipboard"></i><span>{"<< Back"}</span>
      </button>
    );
  }
}
