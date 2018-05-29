import "react-responsive-tabs/styles.css";
import { getTabData, getTabs, resetTab } from "../../../actions/fullHealthProfileActions";

import React, { Component } from "react";
import Alert from "react-s-alert";
import ChildTab from "./tabs";
import { connect } from "react-redux";
import { getSurveyQuestions } from "../../../actions/surveyActions";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import Tabs from "react-responsive-tabs";

// import Tabs from "react-tabs-navigation";

class HealthHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      tabs: [],
      showMore: true,
      transform: true,
      showInkBar: true,
      items: [],
      selectedTabKey: 0,
    };
    this.props.getTabs(this.props.token);
    this.tabChanged = this.tabChanged.bind(this);
    this.props.getUserInfo(this.props.token);
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.tabsList !== props.tabsList) {
      let tabsListing = nextProps.tabsList;
      // if request
      if (tabsListing.isRequesting) {
        this.setState({ showLoader: true });
      }
      // if error
      if (tabsListing.isError) {
        this.setState({ showLoader: false });
      }
      // if succcess
      if (tabsListing.isSuccess && tabsListing.data) {
        let tmpArr = [];
        tabsListing.data.map(function(tabObj, key) {
          tmpArr.push({
            key: key,
            title: <div className="tab-container" onClick = {(e) => this.tabChanged(e, key, tabObj)}>
              <div className="tab-name">{tabObj.attributes.name}</div>
            </div>,
            tabClassName: "tab", // Optional
            panelClassName: "panel", // Optional
            getContent: () => <div>
              <ChildTab tab={key} formData={tabObj} token={this.props.token} displayName = {tabObj.attributes.name}/>
            </div>,
          });
          // tmpArr.push({
          //   children: () => (
          //     <div>
          //       <ChildTab tab={key} formData={tabObj} token={this.props.token} displayName = {tabObj.attributes.name}/>
          //     </div>
          //   ),
          //   displayName: tabObj.attributes.name,
          // });
        }, this);

        this.setState({ items: tmpArr }, function() {
          this.setState({ showLoader: false });
          this.props.resetTab();
          if (tabsListing.data[0] && tabsListing.data[0].id) {
            this.props.getTabData(this.props.token, tabsListing.data[0].id);
          }
        });
      }

    }
    if (nextProps.quesList !== props.quesList) {
      let quesList = nextProps.quesList;
      if (quesList.isRequesting) {
        this.setState({ showLoader: true });
      }
      if (quesList.isSuccess || quesList.isError) {
        this.setState({ showLoader: false });
      }
    }


    if (nextProps.surveyQuestions !== props.surveyQuestions) {
      let surveyQues = nextProps.surveyQuestions;
      // this.setState({ showLoader: true });
      if (surveyQues.isQuestionRequesting) {
        this.setState({ showLoader: true });
      }
      if (surveyQues.isQuestionSuccess) {
        this.setState({ showLoader: false });
      }
      if (surveyQues.isQuestionError) {
        Alert.error("Something went wrong. Please try again after sometime.");
        this.setState({ showLoader: false });
      }

    }
  }


  tabChanged(e, key, tabObj) {
    e.preventDefault();
    this.setState({ selectedTabKey: key });
    if (tabObj.attributes.survey_id) {
      let survey_id = tabObj.attributes.survey_id;
      let reqFullHealth = true;
      this.props.getTabData(this.props.token, tabObj.id, survey_id);
      // this.props.getSurveyQuestions(this.props.token, survey_id, reqFullHealth);
    } else if (tabObj.id) {
      this.props.getTabData(this.props.token, tabObj.id);
    }
    // let children = this.state.tabs[e].children();
    // let formData = children.props.children.props.formData;
    // if (tabObj.id) {
    //   this.props.getTabData(this.props.token, tabObj.id);
    // }


  }


  render() {
    const { selectedTabKey } = this.state;
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">Full Health Profile</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
        </div>
        <div className="myeloma_content settings-tabs">
          <Tabs showMore = {true} transform={true} showInkBar={true} selectedTabKey={selectedTabKey} items={this.state.items} />
          {/* <Tabs
            fixOffset={"20px"}
            tabs={this.state.tabs}
            onTabChange={this.tabChanged}
            tabsBarClassName="completeHealth"
            lineStyle={{
              backgroundColor: "#FF7145",
              display: "none",
            }}
            selectedTabStyle={{
              "backgroundColor": "#fff",
              "boxShadow": "none",
              "color": "#000",
              "borderTop": "1px solid #3a9ff3",
            }}
          /> */}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    tabsList: state.tabsFullProfile,
    userinfo: state.user.userinfo,
    quesList: state.fullProfileQues,
    surveyQuestions: state.surveyQuestions,
  };
}
export default connect(mapStateToProps, { getSurveyQuestions, getTabs, getTabData, resetTab, getUserInfo })(HealthHistory);
