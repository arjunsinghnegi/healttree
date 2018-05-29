import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getConsentFormRequest } from "../../../actions/staticPagesActions";
import Loader from "../../common/loader";

class ConsentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      consentForm: "",
    };
  }
  componentWillMount() {
    this.props.getConsentFormRequest();
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        this.setState({ "showLoader": true });
      }
      if (nextProps.isSuccess || nextProps.isError) {
        this.setState({ "showLoader": false });
      }
      if (nextProps.data && nextProps.isSuccess) {
        let data = nextProps.data;
        this.setState({ consentForm: data[0].attributes });
      }
    }
  }
  render() {
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">Consent Form </h2>
          <span className="back"><Link to="/my-patient-portal-info"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Back</Link></span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <div className="myeloma_content">
            <div dangerouslySetInnerHTML={{ __html: this.state.consentForm.content }} />
          </div>
          <div className="col-sm-12 text-right">
            <Link to="/summary" className="btn green-btn green-hvr-bounce-to-top labs-info-btn">Continue</Link>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    isRequesting: state.consentForm.isRequesting,
    isError: state.consentForm.isError,
    isSuccess: state.consentForm.isSuccess,
    data: state.consentForm.data,
  };
}
export default connect(mapStateToProps, { getConsentFormRequest })(ConsentForm);
