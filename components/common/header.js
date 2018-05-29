import React, { Component } from "react";
import { browserHistory } from "react-router";
import { confirmAlert } from "react-confirm-alert";
import { connect } from "react-redux";
import FeedbackModal from "../Patient/Modals/feedback";
import IdleTimer from "react-idle-timer";
import { logout } from "../../actions/LoginActions";

class Header extends Component {

  constructor(props) {
    super(props);
    console.log("this.props", this.props.token);
    this.state = {
      wrapperToggle: "",
      closeNav: "",
      timeout: 900000, // 15mins converted to millisecs
      modal: false,
      userId: null,
    };
    this.onActive = this.onActive.bind(this);
    this.onIdle = this.onIdle.bind(this);
    this.logout = this.logout.bind(this);
    this.open_modal = this.open_modal.bind(this);
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.userinfo && props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userId: userinfo.id });
    }
  }
  // if user is idle
  onIdle() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("index");
    confirmAlert({
      title: "Session Timeout", // Title dialog
      message: "You are logged out due to inactivity for more than 15 mins. Please click Ok and sign in again.", // Message dialog
      // childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
      confirmLabel: "Ok", // Text button confirm
      cancelLabel: null, // Text button cancel
      onConfirm: () => this.logout(), // Action after Confirm
      // onCancel: () => this.logout(), // Action after Cancel
    });
  }
  // perform an action if activity is detected
  onActive() {}
  logout() {
    console.log("i am here in logout");
    browserHistory.push("/signin");
  }
  onClickHandler(e) {
    this.props.wrapperToggle("toggled");
    this.setState({ closeNav: "close-nav" });
  }
  // function to allow user to add feedback


  // Open modal on add and update department
  open_modal(e) {
    this.setState({
      modal: !this.state.modal,
    });
  }
  render() {
    return (
      <IdleTimer
        ref="idleTimer"
        element={document}
        activeAction={this.onActive}
        idleAction={this.onIdle}
        timeout={this.state.timeout}
        format="MM-DD-YYYY HH:MM:ss.SSS">
        <header>
          <div className="container-fluid">
            {this.state.modal && <FeedbackModal
              modal_var = {this.state.modal}
              handle_modal = { (e) => this.open_modal(e) }
              userId={this.state.userId}
              token={this.props.token}
              props={this.props}
              title= "Help us make HealthTree better"
            />}
            <div className="row align-items-center">
              <div className="col">
                <h1 className="logo"><img alt="logo" src={require("../../assets/images/logo.png")} /></h1>
              </div>
              <div className="col">
                <span onClick={ () => this.onClickHandler() } className={`${this.state.closeNav} hidden-md-up toggle-sm`} id="menu-toggle">
                  <i className="flaticon-menu"></i>
                  <i className="flaticon-close"></i>
                </span>
                <button onClick={ this.props.logout } className="btn blue_btn text-center hvr-bounce-to-top">
                  <a><span>Logout</span><i className="fa fa-sign-out" aria-hidden="true"></i></a>
                </button>
                {this.state.userId && <button onClick={ this.open_modal } className="btn green-btn btn-rt green-hvr-bounce-to-top feedback-btn">
                  <a><span>Feedback</span><i className="fa fa-comments" aria-hidden="true"></i></a>
                </button>}
              </div>
            </div>
          </div>
        </header>

      </IdleTimer>
    );
  }
}
function mapStateToProps(state) {
  return {
    userinfo: state.user.userinfo,
  };
}
export default connect(mapStateToProps, { logout })(Header);
