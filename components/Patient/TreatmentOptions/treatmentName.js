import React, { Component } from "react";
import blueHeart from "./images/blueheart-20.png";
import pinkHeart from "./images/pinkheart-20.png";
import ReactTooltip from "react-tooltip";
export default class TreatmentName extends Component {
  constructor(props) {
    super(props);
    this.handleHeartClick = this.handleHeartClick.bind(this);
  }

  handleHeartClick(event, treatment, key) {
    event.preventDefault();
    this.props.set_fav(treatment, key, this.props.parentKey, this.props.type);
  }


  render() {
    const treatment = this.props.treatment;
    const key = this.props.indx;
    const path = this.props.path;
    return (
      <span className="span-bluedv">
        <span className="truncate-option treatment-name" data-tip data-for={treatment.name + key}>
          {!treatment.link && treatment.name}
          {treatment.link && <a className = "pointer-cursor treatment-anchor" href= {path}> {treatment.name}</a>}
        </span>
        {/* <span className="caution-span" data-tip data-for={treatment.name + key + "caution" }><img alt="logo" src={require("../../../assets/images/caution.png")} /></span> */}
        {!treatment.marked_as && <span className="caution-span" onClick = {(e) => this.handleHeartClick(e, treatment, key)}><img alt="click to mark fav" src={blueHeart} /></span>}
        {treatment.marked_as && treatment.marked_as == "Favorite" && <span className="caution-span" onClick = {(e) => this.handleHeartClick(e, treatment, key)}><img alt="click to mark fav" src={pinkHeart} /></span>}
        <ReactTooltip place="bottom" type="dark" effect="solid" id={treatment.name + key}>
          <ul>
            <li className="summary_li">{treatment.name}</li>
          </ul>
        </ReactTooltip>
        {/* <ReactTooltip place="bottom" type="dark" effect="solid" id={treatment.name + key + "caution"}>
          <ul>
            <li className="summary_li">Do not use: {treatment.rules_caution.toString()}</li>
          </ul>
        </ReactTooltip> */}
      </span>

    );
  }
}
