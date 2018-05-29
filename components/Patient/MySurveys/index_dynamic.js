import { browserHistory, Link } from "react-router";
import React, { Component } from "react";

export default class MySurveys extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  // function to be called when particular button is clicked
  onClick(e) {
    e.preventDefault();
    console.log("start the functionality here");
  }

  /* *************************RENDER FUNCTION******************************* */
  render() {
    return (
      <div id="page-content-wrapper">
        <div className="col-sm-12">
          <h2 className="page-title">My Surveys</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <div className="row">
            <div className="col-sm-12 survey-div">
              <div className="survey-dv">
                <p><b>1. REQUEST FROM ROBERT Z. ORLOWSKI, MD, PhD,  MD ANDERSON CANCER CENTER</b></p>
                <span className="survey-span">“Has your healthcare team ever suggested that you consider a clinical trial as a treatment option?”</span>
                <div className="survey-btn">
                  <button onClick={(e) => this.onClick(e)} type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 survey-div">
              <div className="survey-dv">
                <p><b>2. REQUEST FROM OLA C. LANDGREN, MD, PhD, MEMORIAL SLOAN-KETTERING CANCER CENTER</b></p>
                <span className="survey-span">“Have you ever been tested for minimal residual disease (MRD)?”</span>
                <div className="survey-btn">
                  <button onClick={(e) => this.onClick(e)} type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}