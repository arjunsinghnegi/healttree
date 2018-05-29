import { browserHistory, Link } from "react-router";
import React, { Component } from "react";

export default class NewPage extends Component {
  render() {
    return (
      <div id="page-content-wrapper">
        <div className="col-sm-12">
          <h2 className="page-title">My Surveys</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item active"><Link to="/my-labs">My Labs</Link></li>
            <li className="breadcrumb-item">My Surveys</li>
          </ol>
          <div className="under_construction_div">
            <div className="under_construction" > <img height = "100px" src={ require("../../../assets/images/under_construction.gif") } alt="loading" />
            </div>
            <p>Page Under Contstruction </p>
          </div>
        </div>
      </div>
    );
  }
}
