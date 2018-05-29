import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import CheckBox from "react-animated-checkbox";

class MySideMenuIcons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingSurvey: props.pendingSurvey,
      checked: this.props.checked,
      // enable: this.props.enable,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.pendingSurvey !== props.pendingSurvey) {
      this.setState({ pendingSurvey: nextProps.pendingSurvey });
    }
  }
  handleClick(e) {
    // this.setState({ checked: !this.state.checked });
    // if (parseInt(this.props.index) <= parseInt(this.props.enable)) {
    //   this.props.onClick(this.props.index);
    // }
    if (this.props.enable) {
      this.props.onClick(this.props.index);
    }
    // return false;

    // this.props.onClick(this.props.index);
  }

  render() {
    return (
      <li className={this.props.isActive ? "active" : ""} onClick={this.handleClick.bind(this)}>
        {/* <Link to="#">
            <i className={this.props.icon} aria-hidden={this.props.ariahidden}></i>
            <span>{this.props.name}</span>
            {this.props.name == "Surveys" && this.state.pendingSurvey > 0 && <span className="badge-notification">{this.state.pendingSurvey}</span>}
          </Link> */}
        <div>
          <CheckBox
            checked={(this.props.checked)}
            checkBoxStyle={{
              checkedColor: "#3a9ff3",
              size: 22,
              unCheckedColor: "#b8b8b8",
            }}
            duration={400}
            onClick={(e) => this.handleClick(e)}
          />
          <span className= {this.props.isActive ? "checkbox-span pointer_cursor active" : "checkbox-span pointer_cursor"}>{this.props.name}</span>
        </div>

      </li>
    );
  }
}

export default MySideMenuIcons;
