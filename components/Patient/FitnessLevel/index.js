import { browserHistory, Link } from "react-router";
import { CONST_EXCERCISE_INTENSITY, CONST_EXCERCISE_INTERVAL, CONST_FITNESS_LEVEL, renderInputField, renderRadio, renderSelectField } from "../renderFields";
import { Field, reduxForm } from "redux-form";
import { getFitnessLevel, saveFitnessLevel } from "../../../actions/PatientsActions";
import { getUserInfo, resetFormVar } from "../../../actions/UserActions";
import React, { Component } from "react";
// import BackLink from "../../common/backButton";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import FitnessQuestions from "./questions";
import Form from "muicss/lib/react/form";

import Loader from "../../common/loader";
import validate from "../validate";

// remove when health history is dynamic
let tmpRelation = new Array();
tmpRelation["exercise_six_hour"] = "Do you walk or exercise 6 or more hours per week?";
tmpRelation["exercise_one_to_five"] = "Do you walk or exercise between 1-5 hours per week?";
tmpRelation["normal_energy"] = "Are you able to get through your day without feeling tired or lack of energy?";
tmpRelation["prepare_meal"] = "Are you able to shop for groceries or prepare your meals without help?";
tmpRelation["light_housework"] = "Are you able to go outside, walk up stairs or do light housework without help?";
tmpRelation["depend_others"] = "Do you have someone with you at all times to help you with all daily activities?";
const QUESTIONS_RELATION = tmpRelation;

class FitnessLevel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fitnessLevel: [],
      orignalArr: [],
      "isRespEmpty": false,
      "isValueTrue": false,
      "showLoader": false,
      "userinfo": null,
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getOutcomeValue = this.getOutcomeValue.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.setStateValue = this.setStateValue.bind(this);
    // this.handleBackLink = this.handleBackLink.bind(this);
    this.props.getUserInfo(this.props.token);
  }
  // handleBackLink() {
  //   browserHistory.push("/health-history");
  // }
  componentWillMount() {
    this.setState({ showLoader: true });
    this.props.dispatch(getFitnessLevel(this.props.token));

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues && this.props.initialValues !== nextProps.initialValues) {
      let fitnessLevel = nextProps.initialValues.fitnessLevel;
      let tmpVal = nextProps.initialValues;
      this.setState({
        "fitnessLevel": fitnessLevel,
        "orignalArr": JSON.parse(JSON.stringify(fitnessLevel)),
        "fitness_id": (nextProps.initialValues.id) ? nextProps.initialValues.id : null,
      }, function() {
        this.setState({ showLoader: false });
      });
    }
    if (nextProps.userIsAuthenticated && nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
      let userinfo = nextProps.userinfo;
      this.setState({ userinfo: userinfo });
      // this.props.resetFormVar();
    }
  }

  handleDateChange(date) {
    this.setState({
      firstDiagnosedDate: date, // moment(date).format('DD/MM/YYYY')
    });
  }
  // function to change status of input button
  changeStatus(e, obj, fitnessArrKey, changedValue) {
    let tmpArr = this.state.fitnessLevel;
    this.state.fitnessLevel.map(function(fitnessObj, key) {
      // if (changedValue == true) {
      if (key == fitnessArrKey) {
        tmpArr[key].value = changedValue;
        tmpArr[key].isVisible = true;
      }
      if (key < fitnessArrKey) {
        tmpArr[key].value = false;
        tmpArr[key].isVisible = true;
      }

      if (key > fitnessArrKey) {
        tmpArr[key].value = null;
        tmpArr[key].isVisible = false;
      }
      // }
      if (changedValue == false) {
        if (key == (fitnessArrKey + 1)) {
          tmpArr[key].value = null;
          tmpArr[key].isVisible = true;
        }
      }

    });
    this.setState({ fitnessLevel: tmpArr });

  }
  onSubmit(formData) {
    let isAnyValTrue = false;
    let tmpArr = {
      "users_fitness_level_questions": [],
    };
    let fitnessArrLen = this.state.fitnessLevel.length;
    let orignalArr = this.state.orignalArr;
    let idsArr = [] ;
    this.state.fitnessLevel.map(function(fitnessObj, key) {
      // tmpArr[fitnessObj.key] = fitnessObj.value;
      if (isAnyValTrue) {
        fitnessObj.value = null;
      }
      if (fitnessObj.value) {
        isAnyValTrue = true;
      } else if ((parseInt(key) == parseInt(fitnessArrLen - 1)) && fitnessObj.value !== null) {
        isAnyValTrue = true;
      }
      // if (orignalArr[key].value !== fitnessObj.value) {
      idsArr.push(fitnessObj.id);
      let tmpObj = {
        id: fitnessObj.id,
        status: fitnessObj.value,
      };
      tmpArr.users_fitness_level_questions.push(tmpObj);
      // }
    }, this);
    if (isAnyValTrue) {
      let userId = this.state.userinfo ? this.state.userinfo.id : null;
      if (idsArr.length) {
        this.props.dispatch(saveFitnessLevel(this.props.token, idsArr.toString(), tmpArr, userId, "/treatments-outcomes"));
      } else {
        browserHistory.push("/treatments-outcomes");
      }

      this.setState({ showLoader: true });
    } else {
      Alert.error("Please select atleast one option.");
      return;
    }
  }
  getOutcomeValue(value) {
  }
  setStateValue() {
    this.setState({ isValueTrue: true });
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <h2 className="page-title">My Fitness Level</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>

          <Form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            {/* exercise_six_hour changeStatus={this.changeStatus}*/}           
            {this.state.fitnessLevel && this.state.fitnessLevel.map(function(obj, key) {
              if (obj.isVisible) {
                return (
                  <FitnessQuestions key={key} data={obj} fitnessArrKey={key} changeStatus={this.changeStatus}/>
                );
              }

            }, this)
            }
            {/* end here */}
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button
                  type="submit"
                  className="btn green-btn btn-rt green-hvr-bounce-to-top">
                  Continue</button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticating: state.patient.isAuthenticating,
    userinfo: state.user.userinfo,
    userIsAuthenticated: state.user.isAuthenticated,
    initialValues: state.patient.fitnessLevel,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

FitnessLevel = reduxForm({
  form: "FitnessLevelForm",
  enableReinitialize: true,
  validate,
})(FitnessLevel);
export default connect(mapStateToProps, { getFitnessLevel, saveFitnessLevel, getUserInfo, resetFormVar })(FitnessLevel);
