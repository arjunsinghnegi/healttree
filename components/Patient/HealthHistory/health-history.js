import "react-confirm-alert/src/react-confirm-alert.css";// Import css
import { browserHistory, Link } from "react-router";
import { Field, reduxForm } from "redux-form";
import { getHealthHistoryOptions, resetHealthHistory, saveHealthHistoryOptions, saveHealthHistorySubOptions } from "../../../actions/healthHistoryActions";
import React, { Component } from "react";
import $ from "jquery";
// import BackLink from "../../common/backButton";
import { confirmAlert } from "react-confirm-alert";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import ReactTooltip from "react-tooltip";
import validate from "../validate";


class MyMyeloamaMore extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "showLoader": false,
      "questionnaireOptions": [],
      "expandAll": false,
      // "isFormChanged": false,
      // "redirectTo": "/fitness-level",
    };
    this.changeConditionStatus = this.changeConditionStatus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateHealthHistory = this.updateHealthHistory.bind(this);
    this.toggleQuestion = this.toggleQuestion.bind(this);
    this.updateIndvHealthHistory = this.updateIndvHealthHistory.bind(this);
    this.updateSuboptions = this.updateSuboptions.bind(this);
    // this.handleBackLink = this.handleBackLink.bind(this);
    // this.handleFormChange = this.handleFormChange.bind(this);
  }

  componentWillMount() {
    this.props.getHealthHistoryOptions(this.props.token);
  }
  // handleBackLink() {
  //   if (this.state.isFormChanged) {
  //     this.setState({ "redirectTo": "/my-myeloma" });
  //     confirmAlert({
  //       title: "", // Title dialog
  //       message: "Do you want to save  changes?", // Message dialog
  //       // childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
  //       confirmLabel: "Confirm", // Text button confirm
  //       cancelLabel: "Cancel", // Text button cancel
  //       onConfirm: () => this.updateHealthHistory(), // Action after Confirm
  //       onCancel: () => browserHistory.push("/my-myeloma"), // Action after Cancel
  //     });
  //   } else {
  //     browserHistory.push("/my-myeloma");
  //   }
  // }
  // handleFormChange() {
  //   this.setState({ "isFormChanged": true });
  // }
  changeConditionStatus(event, key, status) {
    // check for collapse and expand condition
    console.log("check for collapse and expand condition");
    event.preventDefault();
    let isUpdate = true;
    let tmpQuestionnaireOptions = JSON.parse(JSON.stringify(this.state.questionnaireOptions));
    // if (parseInt(status) === 0 && tmpQuestionnaireOptions[key].attributes.health_history.labelTxt !== "Yes") {
    //   isUpdate = false;
    // }
    if (parseInt(status) === 0) {
      // if (tmpQuestionnaireOptions[key].attributes.health_history.labelTxt === "Edit" || tmpQuestionnaireOptions[key].attributes.health_history.labelTxt === "Yes") {
      //   tmpQuestionnaireOptions[key].attributes.health_history.labelTxt = "Close";
      //   tmpQuestionnaireOptions[key].attributes.health_history.expand = true;
      // } else {
      //   tmpQuestionnaireOptions[key].attributes.health_history.labelTxt = "Edit";
      //   tmpQuestionnaireOptions[key].attributes.health_history.expand = false;
      // }
      // feb 28
      tmpQuestionnaireOptions[key].attributes.health_history.labelTxt = "Yes";
      tmpQuestionnaireOptions[key].attributes.health_history.expand = true;
      isUpdate = false;
    }
    tmpQuestionnaireOptions[key].attributes.health_history.status = status;
    if (parseInt(status) === 1 || parseInt(status) === 2) {
      tmpQuestionnaireOptions[key].attributes.health_history.labelTxt = "Yes";
      tmpQuestionnaireOptions[key].attributes.health_history.expand = false;
      let rules = tmpQuestionnaireOptions[key].attributes.health_history.rules;
      rules.map(function(rule, subKey) {
        tmpQuestionnaireOptions[key].attributes.health_history.rules[subKey].status = false;
      });
    }


    // tmpQuestionnaireOptions.map(function(question, k) {
    //   if (k !== key && question.attributes.health_history.status === 0) {
    //     let isTrue = false;
    //     tmpQuestionnaireOptions[k].attributes.health_history.rules.map(function(rule, ruleKey) {
    //       if (rule.status) {
    //         isTrue = true;
    //       }
    //     });
    //     if (!isTrue) {
    //       tmpQuestionnaireOptions[k].attributes.health_history.status = 1;
    //       tmpQuestionnaireOptions[k].attributes.health_history.labelTxt = "Yes";
    //       tmpQuestionnaireOptions[k].attributes.health_history.expand = false;
    //       // isUpdate = true;
    //       this.updateIndvHealthHistory(tmpQuestionnaireOptions[k]);
    //     }
    //   }
    // }, this);
    if (isUpdate) {
      this.updateIndvHealthHistory(tmpQuestionnaireOptions[key]);
    }
    this.setState({ questionnaireOptions: tmpQuestionnaireOptions });
  }

  handleInputChange(value, optionsKey, subKey) {
    this.setState({ showLoader: true });
    let tmpQuestionnaireOptions = JSON.parse(JSON.stringify(this.state.questionnaireOptions));

    tmpQuestionnaireOptions[optionsKey].attributes.health_history.rules[subKey].status = !value;
    // let rules = tmpQuestionnaireOptions[optionsKey].attributes.health_history.rules;
    // let isTrue = false;
    // rules.map(function(rule, k) {
    //   if (rule.status) {
    //     isTrue = true;
    //   }
    // });
    // if (isTrue) {
    //   // if any sub value is updated
    //   tmpQuestionnaireOptions[optionsKey].attributes.health_history.status = 0;
    //   tmpQuestionnaireOptions[optionsKey].attributes.health_history.labelTxt = "Yes";
    //   tmpQuestionnaireOptions[optionsKey].attributes.health_history.expand = true;
    // // end
    // } else {
    //   tmpQuestionnaireOptions[optionsKey].attributes.health_history.status = 1;
    //   tmpQuestionnaireOptions[optionsKey].attributes.health_history.labelTxt = "Yes";
    //   tmpQuestionnaireOptions[optionsKey].attributes.health_history.expand = false;
    // }
    this.updateSuboptions(tmpQuestionnaireOptions[optionsKey].attributes.health_history.rules[subKey]);
    this.updateIndvHealthHistory(tmpQuestionnaireOptions[optionsKey]);
    this.setState({ questionnaireOptions: tmpQuestionnaireOptions, showLoader: false });
  }
  updateSuboptions(obj) {
    let saveObj = {
      "data": {
        "id": obj.id,
        "type": "users_rules",
        "attributes": {
          "status": obj.status,
        },
      },
    };
    this.props.saveHealthHistorySubOptions(this.props.token, saveObj);
  }
  renderSubOptions(key) {
    let options = this.state.questionnaireOptions[key].attributes.health_history.rules;
    let retrunDiv = [];
    let This = this;
    options.map(function(obj, k) {
      // obj.status = true;
      let uniqueKey = obj.label + key + k;
      retrunDiv.push(
        <div className="form-check col-sm-12" key={uniqueKey}>
          <input key={uniqueKey} id={uniqueKey} className="checkbox-custom" name={uniqueKey} type="checkbox" defaultChecked={obj.status} onChange={(e) => This.handleInputChange(obj.status, key, k)}/>
          <label htmlFor={uniqueKey} className="checkbox-custom-label label-sm">{obj.label}</label>
        </div>);
    });
    return (retrunDiv);
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        this.setState({ "showLoader": true });
      }
      if (nextProps.isSuccess || nextProps.isError) {
        this.setState({ "showLoader": false });
      }
      if (nextProps.healthHistoryData && nextProps.isSuccess) {
        let data = nextProps.healthHistoryData;
        data.map(function(obj, key) {
          let attr = obj.attributes.health_history;
          if (attr.rules.length && parseInt(attr.status) === 0) {
            // attr.rules.map(function(rule, ruleKey) {
            // });
            data[key].attributes.health_history.labelTxt = "Yes";
            data[key].attributes.health_history.expand = true;
          } else {
            data[key].attributes.health_history.labelTxt = "Yes";
            data[key].attributes.health_history.expand = false;
          }
        });
        this.setState({ questionnaireOptions: data });
        // console.log("loop ends here");
        this.props.resetHealthHistory();
      }
      if (nextProps.isUpdateSuccess) {
        // if (redirectTo === "/my-myeloma") {
        //   browserHistory.push("/my-myeloma");
        // } else {
        // browserHistory.push("/fitness-level");
        // }
      }

    }
  }

  updateHealthHistory() {
    // let obj = {};
    // obj.data = this.state.questionnaireOptions;
    // this.props.saveHealthHistoryOptions(this.props.token, obj);
    this.props.getUserInfo(this.props.token);
    browserHistory.push("/fitness-level");

  }
  updateIndvHealthHistory(obj) {
    let saveObj = {};
    saveObj.id = obj.id;
    saveObj.type = "users_health_conditions";
    let tmpObj = {
      // "name": obj.attributes.health_history.name,
      // "rank": obj.attributes.health_history.rank,
      // "tooltip": obj.attributes.health_history.tooltip,
      "status": obj.attributes.health_history.status,
      // "rules": obj.attributes.health_history.rules 
    };
    // saveObj.attributes = { health_history: tmpObj };
    saveObj.attributes = tmpObj;
    this.props.saveHealthHistoryOptions(this.props.token, { data: saveObj });
  }
  // toggle expand and collapse all
  toggleQuestion(event, status) {
    let data = this.state.questionnaireOptions;
    data.map(function(obj, key) {
      let attr = obj.attributes.health_history;
      // after
      data[key].attributes.health_history.labelTxt = (status) ? "Close" : "Edit";
      data[key].attributes.health_history.expand = status;
      // before
      if (attr.rules.length && parseInt(attr.status) === 0) {
        data[key].attributes.health_history.labelTxt = (status) ? "Close" : "Edit";
        // data[key].attributes.health_history.expand = status;
      } else {
        data[key].attributes.health_history.labelTxt = "Yes";
        // data[key].attributes.health_history.expand = false;
      }
    });
    this.setState({ questionnaireOptions: data });
  }
  render() {
    const { handleSubmit } = this.props;
    const This = this;
    const healthHistoryOptions = this.state.questionnaireOptions.map(function(obj, key) {
      return (
        <div className="col-sm-12 col-md-12 col-lg-12 form-group row align-items-center custom-current-health" key={key}>
          <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">{obj.attributes.health_history.name}
            {obj.attributes.health_history.tooltip && <span className="tool-tip-history"> <img alt="question-pic" className="img-fluid tool-tip-img" src={require("../../../assets/images/question.png")} data-tip data-for= {obj.attributes.id}/> </span>}
            {obj.attributes.health_history.tooltip && <ReactTooltip place="right" type="info" effect="solid" id={obj.attributes.id}> <p className="tooltip-p">{obj.attributes.health_history.tooltip}</p></ReactTooltip>}
          </label>
          <div className="col-sm-12 col-md-12 col-lg-6">
            <div className="btn-group toggle-switch dnt-kn" id="status" data-toggle="buttons">
              <label className={obj.attributes.health_history.status === 0 ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"} onClick={(e) => This.changeConditionStatus(e, key, 0) }>
                <Field
                  name="heart_condition[module_id][status]"
                  component="input"
                  type="radio"
                  value="Yes"
                  checked={obj.attributes.health_history.status === 0 ? true : false }
                />
                {obj.attributes.health_history.labelTxt}</label>
              <label className={obj.attributes.health_history.status === 1 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => This.changeConditionStatus(e, key, 1) }>
                <Field
                  name="fish_test_performed[module_id][status]"
                  component="input"
                  type="radio"
                  value="No"
                  checked={obj.attributes.health_history.status === 1 ? true : false }
                />
                  No</label>
              <label className={obj.attributes.health_history.status === 2 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"} onClick={(e) => This.changeConditionStatus(e, key, 2)}>
                <Field
                  name="fish_test_performed[module_id][status]"
                  component="input"
                  type="radio"
                  value="dn"
                  checked={obj.attributes.health_history.status === 2 ? true : false }
                />
                Don&#39;t Know</label>
            </div>
          </div>
          {obj.attributes.health_history.expand && <div className = "form-group row history_label custom-history_label" >
            <label htmlFor="inputPassword3" className="col-sm-12 col-form-label"> Check all that apply</label>
            {This.renderSubOptions(key)}
          </div> }
        </div>
      );
    });
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">Current Health</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          {/* <div className="form-group row">
            <div className="col-sm-12 collapseDiv">
              <button type="button" className="btn green-btn submitForm expandAll" onClick = {(e) => this.toggleQuestion(e, true)}>Expand All</button>
              <button type="button" className="btn green-btn submitForm collapseAll" onClick = {(e) => this.toggleQuestion(e, false)}>Collapse All</button>
            </div>
          </div> */}
          <form>
            {/* <div className="myeloma_content">
              <p>Now we need to understand a little about your current health.</p>
            </div> */}
            <div className="form-group row align-items-center">
              { healthHistoryOptions }
            </div>
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top submitForm" onClick = {this.updateHealthHistory}>Continue</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return{
//     statusText : state.login.statusText,
//     isAuthenticating : state.login.isAuthenticating
//   }
// }

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

MyMyeloamaMore = reduxForm({
  form: "MyeloamaMoreForm",
  validate,
})(MyMyeloamaMore);

function mapStateToProps(state) {
  return {
    isRequesting: state.healthHistoryOptions.isRequesting,
    isError: state.healthHistoryOptions.isError,
    isSuccess: state.healthHistoryOptions.isSuccess,
    healthHistoryData: state.healthHistoryOptions.data,
    isUpdateSuccess: state.healthHistoryOptions.isUpdateSuccess,
  };
}
export default connect(mapStateToProps, { getHealthHistoryOptions, saveHealthHistoryOptions, getUserInfo, resetHealthHistory, saveHealthHistorySubOptions })(MyMyeloamaMore);
