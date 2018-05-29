import "./css/login.css";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { getTermsOfUse } from "../../actions/staticPagesActions";
import Loader from "../common/loader";
class TermsOfUse extends Component {
  constructor(props) {
    super(props);
    console.log("i am here");
    this.props.getTermsOfUse();
    this.state = { title: null, content: null, showLoader: false };
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        this.setState({ showLoader: true });
      }

      if (nextProps.isSuccess && nextProps.data) {
        let data = nextProps.data[0].attributes;

        console.log("nextProps.data", data);

        this.setState({
          title: (data.title) ? data.title : null,
          content: (data.content) ? data.content : null,
        }, function() {
          this.setState({ showLoader: false });
        });
      }
      if (nextProps.isError) {
        this.setState({ showLoader: false });
      }
    }
  }
  back(e) {
    e.preventDefault();
    window.close();
    // browserHistory.push("/about-me");
  }
  render() {
    return (
      <div className="App">
        {this.state.showLoader && <Loader noPageTop= {true}/>}
        <div className="signin-bg">
          <div className="container center_tb">
            <div className="col-sm-12 col-md-12 col-lg-10 col-xl-8 center-div">
              <h1 className="logo text-center privacy_logo">
                <div className="back-btn-patient"> <button onClick={ this.back } className="btn green-btn btn-rt green-hvr-bounce-to-top feedback-btn">
                  <a><span>Back</span></a>
                </button></div>
                <img alt="logo" src={require("./images/white-logo.png")} /></h1>
              <div className="row">
                <div className="col-sm text-center privacy-healthtree">
                  <h1>{ (this.state.title) ? this.state.title : "Privacy Policy" }</h1>
                  {/* <span className="privacyPolicyContent">
                    </span> */}
                  <div className="privacyPolicyContent" dangerouslySetInnerHTML={{ __html: this.state.content }} />
                </div>
              </div>
            </div>
            <footer className="login_footer">Copyright <i className="fa fa-copyright" aria-hidden="true"></i> all right reserved.</footer>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    isRequesting: state.privacyPolicy.isRequesting,
    isSuccess: state.privacyPolicy.isSuccess,
    isError: state.privacyPolicy.isError,
    data: state.privacyPolicy.data,
  };
}
export default connect(mapStateToProps, { getTermsOfUse })(TermsOfUse);
