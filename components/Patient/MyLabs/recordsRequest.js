import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import Loader from "../../common/loader";

export default class RecordsRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
    };
  }
  render() {
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">Success! We are requesting your records! </h2>
          <span className="back"><Link to="/consent-form"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Back</Link></span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <div className="myeloma_content">
            <p>Collecting your records takes approximately 2-3 weeks. </p>
            <p>In the meantime, keep an eye on your email inbox. We’ll let you know when your myeloma lab timeline and genetics information is ready to view</p>
            <p>You can email us any time at <a href="mailto:info@crowdcare.org" target="_top">info@crowdcare.org.</a> </p>
          </div>
          { /* <div className="col-sm-12 text-center">
            <Link to="/my-surveys" className="btn green-btn green-hvr-bounce-to-top labs-info-btn">Continue</Link>
          </div> */}
        </div>
      </div>
    );
  }
}
