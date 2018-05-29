import "./css/login.css";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import ForgotPassword from "./forgot-password";
import { getModuleWeights } from "../../actions/moduleWeightActions";
import { loginPageContent } from "../../actions/LoginActions";
import ResetPassword from "./reset-password";
import Signin from "./signin";
import Signup from "./signup";


class Logins extends Component {

  constructor(props) {
    super(props);
    this.state = { currentUrl: "signin", title: null, content: null };
  }

  componentWillMount() {

    this.props.loginPageContent();
    this.props.getModuleWeights();
    // console.log("this.props.params.id", this.props.params);
    if (localStorage.getItem("authToken")) {
      browserHistory.push("/about-me");
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.homeContent && nextProps.homeContent.length > 0) {
      document.getElementById("homePageContent").innerHTML = nextProps.homeContent[0].attributes.content;
    }
  }

  render() {
    return (
      <div className="App">
        <Alert stack={ { limit: 1 } } />
        <div className="signin-bg">
          <div className="container center_tb">
            <div className="col-sm-12 col-md-12 col-lg-10 col-xl-8 center-div">
              <h1 className="logo text-center"><img alt="logo" src={require("./images/white-logo.png")} /></h1>
              <div className="row">
                <div className="col-sm text-center what-healthtree">
                  <h2>{ (this.props.homeContent && this.props.homeContent.length > 0) ? this.props.homeContent[0].attributes.title : "What is HealthTree?" }</h2>
                  <span id="homePageContent">
                    <p>Whether you’re a smoldering, newly diagnosed, high-risk or relapsed/refractory multiple myeloma patient, HealthTree can help you learn about treatment options that may be right for you.</p>
                    <p>With the explosion in treatment combinations in the past decade, myeloma has become one of the most hopeful yet complex diseases to treat. <strong>Healthtree</strong> can help identify personally relevant treatment and clinical trial options you can review with your doctor. Powered by the skill and expertise of over 100 myeloma experts, Healthtree is updated frequently to reflect new treatment options as soon as they are approved.</p>
                  </span>
                </div>
                <div className="col-sm login_box">
                  {this.props.location.pathname === "/signup" ?
                    <Signup /> :
                    this.props.location.pathname === "/forgot-password" ?
                      <ForgotPassword /> :
                      ((this.props.location.pathname === "/reset-password/" + this.props.params.id) && this.props.params.id) ?
                        <ResetPassword uniqueId = {this.props.params.id} /> : <Signin /> }
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
    statusText: state.login.statusText,
    isAuthenticating: state.login.isAuthenticating,
    homeContent: state.login.homeContent,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
export default connect(mapStateToProps, { loginPageContent, getModuleWeights })(Logins);
