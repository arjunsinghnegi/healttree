import "../../assets/css/jquery.mCustomScrollbar.min.css";
import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import $ from "jquery";
import _ from "lodash";
import CheckboxSideMenuIcons from "./checkboxSideMenu";
import { connect } from "react-redux";
import { getUserInfo } from "../../actions/UserActions";
import { LOCALS_STORAGE_AUTHTOKEN } from "../../actions/constants";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import mouseWheel from "jquery-mousewheel";
import MySideMenuIcons from "./simpleSideMenu";
import PropTypes from "prop-types";

const SIDEMENU_ARRAY = [
  { index: 0, name: "About Me", icon: "flaticon-person", link: "/about-me", checked: true, module_name: "patient_info" },
  { index: 1, name: "Myeloma Diagnosis", icon: "flaticon-shape", link: "/myeloma-diagnosis", checked: true, module_name: "myeloma" },
  { index: 2, name: "Current Health", icon: "flaticon-health-care", link: "/current-history", module_name: "current_health" },
  { index: 3, name: "Fitness Level", icon: "fnt29 flaticon-runer-silhouette-running-fast", link: "/fitness-level", module_name: "fitness_level" },
  { index: 4, name: "Treatments & Outcomes", icon: "flaticon-medicines", link: "/treatments-outcomes", module_name: "treatment_outcome" },
  { index: 5, name: "Treatment Options", icon: "flaticon-choosing-spa-treatments-option-by-cost", link: "/treatment-options", module_name: "treatment_options" },
  { index: 6, name: "Find Clinical Trials", icon: "flaticon-lab-microscope", link: "/clinical-trials", module_name: "clinical_trials" },
  { index: 7, name: "Summary", icon: "flaticon-education-chart", link: "/summary", module_name: "summary" },
  { index: 8, name: "Full Health Profile", icon: "flaticon-shield", link: "/health-profile", module_name: "health_profile" },
  { index: 9, name: "Surveys", icon: "flaticon-experiment-results", link: "/surveys", module_name: "surveys" },
  { index: 10, name: "Settings", icon: "flaticon-settings", link: "/settings", ariahidden: "true", module_name: "settings" },
];

class Sidemenu extends Component {

  constructor(props) {
    super(props);
    let activeIndex = (localStorage.getItem("index")) ? parseInt(localStorage.getItem("index")) : 0;
    this.state = {
      activeIndex: activeIndex,
      email: null,
      url: null,
      userImg: require("../../assets/images/user.png"),
      profile_completion: {},
      pages: null,
      pendingSurvey: 0,
      module_counts: null,
      userType: 0, // type of user on the basis of which menu items will be displayed
      showClinicalTrials: false,
      showAllIcons: false,
      userModuleWeights: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  static contextTypes={
    router: PropTypes.object,
  }

  componentDidMount() {
    $("#sidebar-content-scroll").mCustomScrollbar({
      scrollButtons: { enable: true },
      mouseWheel: { scrollAmount: 188, normalizeDelta: true },
      autoExpandScrollbar: true,
      theme: "minimal-dark", // minimal-dark=rounded-dark=3d=3d-thick=light-3=dark-thin=rounded-dots=light-thick
    });
  }

  componentDidMount() {
    let token = (this.props.token) ? this.props.token : localStorage.getItem("authToken");
    this.props.getUserInfo(token);
    let that = this;
    browserHistory.listen(function(ev) {
      let indexObj = _.find(SIDEMENU_ARRAY, function(menu) {
        return menu.link == ev.pathname;
      }
      );
      let index = (indexObj && indexObj.index) ? indexObj.index : 0;
      that.setState({ activeIndex: index });
    });
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.userinfo !== props.userinfo) {
      this.setState({
        email: nextProps.userinfo.attributes ? nextProps.userinfo.attributes.email : "",
        firstName: nextProps.userinfo.attributes ? nextProps.userinfo.attributes.first_name : "",
        lastName: nextProps.userinfo.attributes ? nextProps.userinfo.attributes.last_name : "",
        userImg: (nextProps.userinfo.attributes && nextProps.userinfo.attributes.profile_url) ? nextProps.userinfo.attributes.profile_url : require("../../assets/images/user.png"),
        // profile_completion: (nextProps.profileCompleted && nextProps.profileCompleted) ? nextProps.profileCompleted + "%" : "0%",
      });
    }

    if (nextProps.profileCompleted && nextProps.profileCompleted.profileComplete && nextProps.profileCompleted !== props.profileCompleted) {
      this.setState({
        profile_completion: (nextProps.profileCompleted && nextProps.profileCompleted.profileComplete.profile_completed) ? nextProps.profileCompleted.profileComplete.profile_completed : 0,
        userModuleWeights: (nextProps.profileCompleted && nextProps.profileCompleted.profileComplete.userModuleWeights) ? nextProps.profileCompleted.profileComplete.userModuleWeights : null,
        // pages: nextProps.profileCompleted, userModuleWeights
      });
    }
    if (nextProps.moduleWeights !== props.moduleWeights) {
      this.setState({ pages: nextProps.moduleWeights });
    }

    if (nextProps.module_counts && nextProps.module_counts !== props.module_counts) {
      this.setState({ module_counts: nextProps.module_counts });
    }
    if (nextProps.userInterest !== props.userInterest) {
      if (nextProps.userInterest && nextProps.userInterest.interested_in) {
        this.setState({ userType: parseInt(nextProps.userInterest.interested_in) });
      }
    }
    if (nextProps.pendingSurvey !== props.pendingSurvey) {
      this.setState({
        pendingSurvey: (nextProps.pendingSurvey) ? parseInt(nextProps.pendingSurvey) : 0,
      });
    }

  }

  handleClick(index) {
    // let tesNode = document.getElementById("page-content-wrapper");
    // window.scrollTo(tesNode.offsetTop, 0);
    localStorage.setItem("index", index);
    // let refreshIndex = localStorage.getItem(index);
    this.setState({ activeIndex: index });
    SIDEMENU_ARRAY.map(function(obj, key) {
      if (parseInt(index) === obj.index) {
        this.context.router.push(obj.link);
      }
    }, this);
    // if (index === 0) {
    //   this.context.router.push("/about-me");
    // } else if (index === 1) {
    //   this.context.router.push("/my-myeloma");
    // } else if (index === 2) {
    //   this.context.router.push("/health-history");
    // } else if (index === 3) {
    //   this.context.router.push("/fitness-level");
    // } else if (index === 4) {
    //   this.context.router.push("/fish-test");
    // } else if (index === 5) {
    //   this.context.router.push("/my-treatments");
    // } else if (index === 6) {
    //   this.context.router.push("/complete-history");
    // } else if (index === 7) {
    //   this.context.router.push("/remission-status");
    // } else if (index === 8) {
    //   this.context.router.push("/my-summary");
    // } else if (index === 9) {
    //   this.context.router.push("/treatment-options");
    // } else if (index === 10) {
    //   this.context.router.push("/my-labs");
    // } else if (index === 11) {
    //   this.context.router.push("/my-surveys");
    // } else if (index === 12) {
    //   this.context.router.push("/settings");
    // }
  }

  // if user type is 2
  renderNormalLinks() {
    let currentLocation = this.context.router.location.pathname;
    let activeIndex = this.state.activeIndex;
    if ("/my-labs-info" === currentLocation || "/my-patient-portal-info" === currentLocation || "/consent-form" === currentLocation || "/records-request" === currentLocation) {
      activeIndex = 6;
    }
    let that = this;
    return SIDEMENU_ARRAY.map(function(obj) {
      return (
        <MySideMenuIcons
          key={obj.index}
          name={obj.name}
          icon={obj.icon}
          index={obj.index}
          pendingSurvey={this.state.pendingSurvey}
          isActive={activeIndex === obj.index}
          onClick={that.handleClick.bind(that)} />
      );
    }, this);
  }

  // if usertype is userType or both
  renderCheckBoxLinks() {
    let currentLocation = this.context.router.location.pathname;
    let activeIndex = this.state.activeIndex;
    if ("/my-labs-info" === currentLocation || "/my-patient-portal-info" === currentLocation || "/consent-form" === currentLocation || "/records-request" === currentLocation) {
      activeIndex = 6;
    }
    let that = this;
    // 0: for only about me; 1: myeloma diagnosis; 2: current health; 3: fitness level; 3: treatment outcomes
    let enableLink = 0;
    let checked = false;
    let userModuleWeights = null;
    let pages = null;
    if (this.state.userModuleWeights) {
      userModuleWeights = this.state.userModuleWeights;
    }
    if (this.state.pages) {
      pages = this.state.pages;
    } else {
      pages = localStorage.getItem("moduleWeights");
      pages = JSON.parse(pages);
    }
    let profile_completed = parseInt(this.state.profile_completion);
    let module_total = 0;
    let sideMenuArr = SIDEMENU_ARRAY;

    return sideMenuArr.map(function(obj, key) {

      let checked = false;
      let enableLink = false;
      let visibleMenuItem = false;
      if (pages[obj.module_name]) {
        let module_weight = pages[obj.module_name];
        let user_module_weight = 0;
        visibleMenuItem = true;
        if (userModuleWeights && userModuleWeights[obj.module_name]) {
          user_module_weight = userModuleWeights[obj.module_name];
        }
        if (module_weight === Math.round(user_module_weight)) {
          checked = true;
        }

        // check of last user module weight is greater than zero
        if (key) {
          let last_module = sideMenuArr[key - 1];
          if (userModuleWeights && userModuleWeights[last_module.module_name]) {
            enableLink = true;
          }
        } else {
          enableLink = true;
        }
        // if (profile_completed >= 100 && this.state.module_counts && parseInt(this.state.userType) === 0 && parseInt(this.state.module_counts.clinicalTrial) > 0) {
        //   // if (obj.module_name === "clinical_trials") {
        //   visibleMenuItem = true;
        //   enableLink = true;
        //   checked = true;
        //   // }
        // }

        if (visibleMenuItem) {
          return (
            <CheckboxSideMenuIcons
              key={obj.index}
              name={obj.name}
              icon={obj.icon}
              index={obj.index}
              pendingSurvey={this.state.pendingSurvey}
              checked={obj.checked}
              isActive={activeIndex === obj.index}
              onClick={that.handleClick.bind(that)}
              pages= {this.state.pages}
              sidemenuArr = {SIDEMENU_ARRAY}
              enable = {enableLink}
              checked = {checked}
            />
          );
        }
      } else {
        if (profile_completed >= 100 && this.state.userType !== 1) {
          visibleMenuItem = true;
        }

        // if (this.state.module_counts && parseInt(this.state.userType) === 0 && parseInt(this.state.module_counts.treatments) > 0) {
        //   if (obj.module_name === "treatment_options") {
        //     visibleMenuItem = true;
        //     enableLink = true;
        //     checked = true;
        //   }
        //   if (obj.module_name === "clinical_trials") {
        //     visibleMenuItem = true;
        //     enableLink = true;
        //   }
        // }
        // if (this.state.module_counts && parseInt(this.state.userType) === 0 && parseInt(this.state.module_counts.clinicalTrial) > 0) {
        //   // if (obj.module_name === "clinical_trials") {
        //   visibleMenuItem = true;
        //   enableLink = true;
        //   checked = true;
        //   // }
        // }

        if (visibleMenuItem) {
          return (
            <MySideMenuIcons
              key={obj.index}
              name={obj.name}
              icon={obj.icon}
              index={obj.index}
              pendingSurvey={this.state.pendingSurvey}
              checked={obj.checked}
              isActive={activeIndex === obj.index}
              onClick={that.handleClick.bind(that)}
              pages= {this.state.pages}
              sidemenuArr = {SIDEMENU_ARRAY}
              enable = {enableLink}
              checked = {checked}
            />
          );
        }
      }
    }, this);


  }
  render() {
    let usrImg = this.state.userImg;
    return (
      <div id="sidebar-wrapper">
        <div className="profile col-sm-12">
          <div className="user-pic"><img alt="user-pic" className="img-fluid userImage" src={this.state.userImg} /></div>
          <span>Welcome!</span>
          <p>{ this.state.firstName } { this.state.lastName }</p>
          {/* {this.state.userType === 1 && <div className="static-bar">
            <label>Profile Completed <span>{this.state.profile_completion}%</span></label>
            <div className="progress">
              <div className="progress-bar bg-warning" role="progressbar" style={{ width: this.state.profile_completion }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>} */}
        </div>
        { this.state.userType !== 1 && parseInt(this.state.profile_completion) !== 100 && this.state.module_counts && parseInt(this.state.module_counts.treatments) <= 0 && <div className="top-sidebar-content">
          <p>See your progress as you answer all the questions in each section to check off boxes.</p>
        </div>}
        <div id="sidebar-content-scroll" className="content">
          <form>
            <ul className="sidebar-nav custom-sidebar">
              { parseInt(this.state.userType) === 1 && this.renderNormalLinks() }

              {/* {parseInt(this.state.userType) === 0 && parseInt(this.state.profile_completion) >= 100 && parseInt(this.state.module_counts.clinicalTrial) > 0 && parseInt(this.state.module_counts.treatments) > 0 && this.renderNormalLinks() }
              { parseInt(this.state.userType) === 0 && parseInt(this.state.profile_completion) !== 100 && this.renderCheckBoxLinks() }
              { parseInt(this.state.userType) === 0 && parseInt(this.state.profile_completion) >= 100 && parseInt(this.state.module_counts.clinicalTrial) === 0 && this.renderCheckBoxLinks()} */}

              { this.state.userType !== 1 && parseInt(this.state.profile_completion) !== 100 && this.state.module_counts && parseInt(this.state.module_counts.treatments) <= 0 && this.renderCheckBoxLinks() }
              { this.state.userType !== 1 && this.state.module_counts && parseInt(this.state.module_counts.treatments) > 0 && this.renderNormalLinks() }

            </ul>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.login.token,
    userinfo: state.user.userinfo,
    profileCompleted: state.metaData,
    userInterest: state.metaData.userInterest,
    pendingSurvey: state.metaData.surveyPending,
    moduleWeights: state.moduleWeights.data,
    module_counts: state.metaData.moduleCounts,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
export default connect(mapStateToProps, { getUserInfo })(Sidemenu);


