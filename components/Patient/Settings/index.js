import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AccountSettings from "./accountSettings";
import Prefrences from "./prefrences";
// import Tabs from "react-tabs-navigation";


export default class MySettings extends Component {
  /* *************************RENDER FUNCTION******************************* */
  render() {
    return (
      <div id="page-content-wrapper">
        <div className="col-sm-12">
          <h2 className="page-title">Settings</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          <div className="tabs-row settings-tabs custom-setting">
            <Tabs>
              <TabList>
                <Tab><span>Account Setting</span></Tab>
                {/* <Tab><span>Survey Prefrences</span></Tab> */}
              </TabList>
              <TabPanel>
                <AccountSettings token={this.props.token}/>
              </TabPanel>
              {/* <TabPanel>
                <Prefrences token={this.props.token}/>
              </TabPanel> */}
            </Tabs>
          </div>
        </div>
      </div>

    );
  }
}
