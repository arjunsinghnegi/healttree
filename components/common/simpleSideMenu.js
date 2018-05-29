import { browserHistory, Link } from "react-router";
import React, { Component } from "react";

class SideMenuIcons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingSurvey: props.pendingSurvey,
    };
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.pendingSurvey !== props.pendingSurvey) {
      this.setState({ pendingSurvey: nextProps.pendingSurvey });
    }
  }
  handleClick() {
    this.props.onClick(this.props.index);
  }

  render() {
    return (
      <li className={this.props.isActive ? "active" : ""} onClick={this.handleClick.bind(this)}>
        <Link to="#">
          <i className={this.props.icon} aria-hidden={this.props.ariahidden}></i>
          <span>{this.props.name}</span>
          {this.props.name == "Surveys" && this.state.pendingSurvey > 0 && <span className="badge-notification">{this.state.pendingSurvey}</span>}
        </Link>
      </li>
    );
  }
}

export default SideMenuIcons;
