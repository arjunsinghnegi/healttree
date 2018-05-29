
import { Field, formValueSelector, reduxForm } from "redux-form";
import { getTabData, resetTab } from "../../../actions/fullHealthProfileActions";
import React, { Component } from "react";
import { renderCheckbox, renderDynamicRadio, renderInputField, renderSelectField, renderTextArea } from "../../common/dynamicFields";
import { resetSaveSurvey, saveSurvey } from "../../../actions/saveSurveyActions";
import Alert from "react-s-alert";
import { connect } from "react-redux";

import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";

// import { formatPattern } from "react-router/lib/PatternUtils";
// import { Input, TextArea } from "react-input-component";

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      questions: [],
      userinfo: null,
    };
    this.selectedTab = props.displayName;
    this.props.getUserInfo(this.props.token);
    this.returnField = this.returnField.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.renderCheckboxField = this.renderCheckboxField.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  componentWillReceiveProps(nextProps, props) {

    if (nextProps !== props) {
      if (nextProps.saveHealthProfile !== props.saveHealthProfile) {
        if (nextProps.saveHealthProfile.isSuccess) {
          Alert.success("Your complete health profile information saved successfully");
          this.setState({ showLoader: false });
          this.props.resetSaveSurvey();
        }
      }
      if (nextProps.quesList !== props.quesList) {
        let quesList = nextProps.quesList;
        console.log("ques_list>>>>", quesList);
        // **************************** //
        this.setState({ showLoader: false }); // remove this when implementing full health histiry
        // **************************** //
        // if (quesList.isRequesting) {
        //   this.setState({ showLoader: true });
        // }
        // if (quesList.isError) {
        //   Alert.error("Something went wrong. Please try again after sometime.");
        //   this.setState({ showLoader: false });
        // }
        // if (quesList.data && quesList.isSuccess) {
        //   this.setState({ questions: quesList.data, showLoader: false });
        //   this.props.resetTab();
        // }

        // if (nextProps.userinfo && props.userinfo !== nextProps.userinfo) {
        //   let userinfo = nextProps.userinfo;
        //   this.setState({ userinfo: userinfo });
        //   // this.props.resetFormVar();
        // }
      }
    }
  }
  onContinue(e) {
    e.preventDefault();
    // browserHistory.push("/my-labs");
  }


  // render dynamic field
  returnField(parentKey, obj) {
    // radio
    if (obj.attributes.question_type === "radio") {
      let tmpArr = [];
      return <div className="col-md-8"> {this.renderRadioField(parentKey, obj)}</div>;
    }

    // checkbox
    if (obj.attributes.question_type === "checkbox") {
      let tmpArr = [];
      return <div className="col-md-8"> {this.renderCheckboxField(parentKey, obj)}</div>;
    }

    // text area
    if (obj.attributes.question_type === "text_area") {
      let maxLength = null;
      //   if (obj.attributes.validations.length) {
      //     obj.attributes.validations.map(function(validation) {
      //       if (validation.name === "Max")
      //         maxLength = validation.value;
      //     });
      //   }
      return <div className="col-md-8 dynamic-text-area">
        {/* <TextArea
          value={(obj.attributes.answer) ? (obj.attributes.answer) : null}
          name={parentKey + "_" + obj.id}
          className="form-control treatment-textarea"
          placeholder={obj.attributes.place_holder}
          rows="5"
          onChange={(e) => this.handleTextChange(e, parentKey)}
        /> */}
        <Field
          name={parentKey + "_" + obj.id}
          defaultValue={(obj.attributes.answer) ? (obj.attributes.answer) : null}
          component={renderTextArea}
          placeholder={obj.attributes.place_holder}
          onChange={(e) => this.handleTextChange(e, parentKey)}
          className="form-control treatment-textarea"
          rows="5"
          maxLength={maxLength}/>
      </div>;
    }

    // select box
    if (obj.attributes.question_type === "drop_down") {
      let tmpArr = [];
      obj.attributes.choices.map(function(attr, key) {
        tmpArr.push({ value: attr.id, label: attr.name });
      });
      return <div className="col-md-6 dynamic-text-area"> <Field
        name={parentKey + "_" + obj.id}
        options={tmpArr}
        component={renderSelectField}
        onChange = {(selected) => this.handleSelectChange(selected, parentKey)}
        className="form-control"/> </div>;
    }

    // if survey type in simple input field

    return <div className="col-md-8">
      {/* <Input
        value={(obj.attributes.answer) ? (obj.attributes.answer) : null}
        name={parentKey + "_" + obj.id}
        type="text"
        className="form-control"
        placeholder={obj.attributes.place_holder}
        onChange={(e) => this.handleTextChange(e, parentKey)}
      /> */}
      <Field
        name={parentKey + "_" + obj.id}
        type="text"
        defaultValue={(obj.attributes.answer) ? (obj.attributes.answer) : null}
        component={renderInputField}
        onChange={(e) => this.handleTextChange(e, parentKey)}
        placeholder={obj.attributes.place_holder}
        className="form-control"
        maxLength="50"/>
    </div>;
  }

  // retrun * is fields are required
  returnAstrix(obj) {
    // let questions = this.state.questions[parentKey];   
    let astrix = [];
    if (obj.attributes.validations.length) {
      obj.attributes.validations.map(function(validation, key) {
        if (validation.name === "Require") {
          astrix.push(<span key = {key} className="required-astrix">*</span>);
        }
      });
    }
    return astrix;
  }

  // for dynamic radio buttons
  renderRadioField(parentKey, questionOptions) {
    let choices = questionOptions.attributes.choices;
    let options = [];
    choices.map(function(obj, key) {
      let indexOfAns = (questionOptions.attributes.answer) ? questionOptions.attributes.answer.indexOf(obj.id) : -1;
      obj.checked = false;
      if (indexOfAns > -1) {
        obj.checked = true;
      }
      options.push(
        <label key = {key} className="dynamic-radio">
          <input type="radio" name={parentKey + "_" + questionOptions.id} value={obj.id} checked = {obj.checked} onClick={(e) => this.handleOptionChange(e, parentKey, questionOptions, obj)}/>
          <span className="treatmentLabel"> {obj.name} </span>
        </label>
      );
    }, this);
    return options;
  }

  // for dynamic check boxes
  renderCheckboxField(parentKey, questionOptions) {
    let choices = questionOptions.attributes.choices;
    let options = [];
    choices.map(function(obj, key) {
      let indexOfAns = (questionOptions.attributes.answer) ? questionOptions.attributes.answer.indexOf(obj.id) : -1;
      obj.checked = false;
      if (indexOfAns > -1) {
        obj.checked = true;
      }
      options.push(
        <label key = {key} className="dynamic-radio">
          <input type="checkbox" name={parentKey + "_" + questionOptions.id} value={obj.id} checked = {obj.checked} onClick={(e) => this.handleCheckboxChange(e, parentKey, questionOptions, obj)}/>
          <span className="treatmentLabel"> {obj.name} </span>
        </label>
      );
    }, this);
    return options;
  }

  // handle on click event on radio buttons
  handleOptionChange(e, parentKey, parentObj, selected) {
    let tmpQuestions = this.state.questions;
    let tmpArr = [];
    tmpQuestions[parentKey].attributes.answer = [];
    tmpQuestions[parentKey].attributes.errMessage = null;
    tmpQuestions[parentKey].attributes.choices.map(function(choice, key) {
      if (choice.id === selected.id) {
        choice.checked = choice.checked ? false : true ;
        if (choice.checked) {
          tmpQuestions[parentKey].attributes.answer.push(choice.id);
        }
      } else {
        choice.checked = false ;
      }
      tmpArr.push(choice);
    });
    tmpQuestions[parentKey].attributes.choices = tmpArr;

    this.setState({ questions: tmpQuestions });
  }

  // handle on click event on click of checkbox
  handleCheckboxChange(e, parentKey, parentObj, selected) {
    let tmpQuestions = this.state.questions;
    let tmpArr = [];
    tmpQuestions[parentKey].attributes.answer = [];
    tmpQuestions[parentKey].attributes.errMessage = null;
    tmpQuestions[parentKey].attributes.choices.map(function(choice, key) {
      if (choice.id === selected.id) {
        choice.checked = choice.checked ? false : true ;
      }
      // id any of choices are checked
      if (choice.checked) {
        tmpQuestions[parentKey].attributes.answer.push(choice.id);
      }
      tmpArr.push(choice);
    });
    tmpQuestions[parentKey].attributes.choices = tmpArr;
    this.setState({ questions: tmpQuestions });
  }

  // handle change in select box
  handleSelectChange(selected, parentKey) {
    let tmpQuestions = this.state.questions;
    tmpQuestions[parentKey].attributes.answer = [];
    tmpQuestions[parentKey].attributes.errMessage = null;
    if (selected.value) {
      tmpQuestions[parentKey].attributes.answer.push(selected.value);
    }
    this.setState({ questions: tmpQuestions });
  }

  // handle input and text area change
  handleTextChange(e, parentKey) {
    let tmpQuestions = this.state.questions;
    tmpQuestions[parentKey].attributes.answer = e.target.value;
    tmpQuestions[parentKey].attributes.errMessage = null;
    this.setState({ questions: tmpQuestions });
    // tmpQuestions[parentKey].attributes.answer = [];
    // tmpQuestions[parentKey].attributes.errMessage = null;
    // if (selected.value) {
    //   tmpQuestions[parentKey].attributes.answer.push(selected.value);
    // }
  }

  onSubmit(formData) {
    let isValid = true;
    let questionsArr = this.state.questions;
    let tmpQuesArr = [];
    let userId = this.state.userinfo.id;
    questionsArr.map(function(question, key) {
      let obj = {
        "survey_question_id": question.id,
        // "survey_question_choice_id": null,
        "answer": null,
        // "is_selected": null,
        "user_id": userId,
      };
      if (question.attributes.question_type === "radio" || question.attributes.question_type === "checkbox" || question.attributes.question_type === "drop_down") {
        if (questionsArr[key].attributes.validations.length) {
          questionsArr[key].attributes.validations.map(function(validation) {
            // check for required validation
            if (validation.name === "Require") {
              if (!questionsArr[key].attributes.answer || !questionsArr[key].attributes.answer.length) {
                questionsArr[key].attributes.errMessage = "Field is required";
                isValid = false;
              } else {
                obj.answer = questionsArr[key].attributes.answer;
                // obj.is_selected = true;
              }
            }
          });
        } else {
          obj.answer = questionsArr[key].attributes.answer;
          // obj.is_selected = true;
        }
      } else if (question.attributes.question_type === "text_field") { // for 

        if (questionsArr[key].attributes.validations.length) {
          let isNumeric = false;
          questionsArr[key].attributes.validations.map(function(validation) {
            if (validation.name === "Require") {
              if (!questionsArr[key].attributes.answer || !questionsArr[key].attributes.answer.length) {
                questionsArr[key].attributes.errMessage = "Field is required";
                isValid = false;
              }
            }
            // check for required validation

            // for only number
            if (validation.name === "Numeric") {
              isNumeric = true;
              if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {
                let numbers = /^[0-9]+$/;
                if (!questionsArr[key].attributes.answer.match(numbers)) {
                  questionsArr[key].attributes.errMessage = "Only numbers allowed.";
                  isValid = false;
                }
              }
            }

            // for min
            if (validation.name === "Min") {
              if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {
                if (isNumeric) {
                  // check with value
                  if (parseInt(questionsArr[key].attributes.answer) < parseInt(validation.value)) {
                    questionsArr[key].attributes.errMessage = "Field value should be greater than " + validation.value + ".";
                    isValid = false;
                  }
                } else {
                  //   check with length
                  if (parseInt(questionsArr[key].attributes.answer.length) < parseInt(validation.value)) {
                    questionsArr[key].attributes.errMessage = "Field length should be greater than " + validation.value + ".";
                    isValid = false;
                  }
                }
              }
            }
            // for max
            if (validation.name === "Max") {
              if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {

                if (isNumeric) {
                  // check with value
                  if (parseInt(questionsArr[key].attributes.answer) > parseInt(validation.value)) {
                    questionsArr[key].attributes.errMessage = "Field value should be less than " + validation.value + ".";
                    isValid = false;
                  }
                } else {
                  //   check with length
                  if (parseInt(questionsArr[key].attributes.answer.length) > parseInt(validation.value)) {
                    questionsArr[key].attributes.errMessage = "Field length should be less than " + validation.value + ".";
                    isValid = false;
                  }
                }
              }
            }

            // for only text
            if (validation.name === "Text") {
              if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {
                let text = /^[a-zA-Z ]+$/;
                if (!questionsArr[key].attributes.answer.match(text)) {
                  questionsArr[key].attributes.errMessage = "Only alphabets allowed.";
                  isValid = false;
                }
              }
            }
            // set answer
            obj.answer = questionsArr[key].attributes.answer;
          });
        } else {
          obj.answer = (questionsArr[key].attributes.answer) ? questionsArr[key].attributes.answer : null;
        }
      } else {
        // for text area
        if (questionsArr[key].attributes.validations.length) {
          questionsArr[key].attributes.validations.map(function(validation) {
            if (validation.name === "Require") {
              if (!questionsArr[key].attributes.answer || !questionsArr[key].attributes.answer.length) {
                questionsArr[key].attributes.errMessage = "Field is required";
                isValid = false;
              }
            }
            // check for required validation


            // for min
            if (validation.name === "Min") {
              if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {
                if (parseInt(questionsArr[key].attributes.answer.length) < parseInt(validation.value)) {
                  questionsArr[key].attributes.errMessage = "Field length should be greater than " + validation.value + ".";
                  isValid = false;
                }
              }
            }
            // for max
            if (validation.name === "Max") {
              if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {
                if (parseInt(questionsArr[key].attributes.answer.length) > parseInt(validation.value)) {
                  questionsArr[key].attributes.errMessage = "Field length should be less than " + validation.value + ".";
                  isValid = false;
                }
              }
            }

            // for only text
            // if (validation.name === "Text") {
            //   if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {
            //     let text = /^[a-zA-Z ]+$/;
            //     if (!questionsArr[key].attributes.answer.match(text)) {
            //       questionsArr[key].attributes.errMessage = "Only alphabets allowed.";
            //       isValid = false;
            //     }
            //   }
            // }

            // // for only number
            // if (validation.name === "Numeric") {
            //   if (questionsArr[key].attributes.answer && questionsArr[key].attributes.answer.length) {
            //     let numbers = /^[0-9]+$/;
            //     if (!questionsArr[key].attributes.answer.match(numbers)) {
            //       questionsArr[key].attributes.errMessage = "Only numbers allowed.";
            //       isValid = false;
            //     }
            //   }
            // }
            // set answer
            obj.answer = questionsArr[key].attributes.answer;
          });
        } else {
          obj.answer = (questionsArr[key].attributes.answer) ? questionsArr[key].attributes.answer : null;
        }
      }
      // push obj to mai array
      let indvObj = {
        "type": "survey_answers",
        "attributes": obj,
      };
      tmpQuesArr.push(indvObj);
    }, this);

    this.setState({ questions: questionsArr });
    if (isValid) {
      let finalObj = {
        "data": tmpQuesArr,
      };
      this.setState({ showLoader: true });
      this.props.saveSurvey(this.props.token, finalObj);
    } else {
      Alert.error("To save please check the fields and try again.");
    }
  }


  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="col-sm-12">
        {this.state.showLoader && <Loader />}
        <ol className="breadcrumb">
          <li className="breadcrumb-item"></li>
        </ol>
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          {this.state.questions.map(function(obj, key) {
            return <div className="form-group row" key={key}>
              <label htmlFor="inputEmail3" className="col-sm-12 col-md-4 col-form-label">{key + 1}. {obj.attributes.title} {this.returnAstrix(obj)}</label>
              {this.returnField(key, obj)}
              {obj.attributes.errMessage && <div className="col-md-12"><span className="text-error">{obj.attributes.errMessage}</span></div>}
            </div>;
          }, this)}
          {/* <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-4 col-form-label">What is Lorem Ipsum?</label>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <Field
              name="monoclonal_protien"
              type="text"
              className="form-control "
              id="Last"
              maxLength="12"
              placeholder=""
              tabIndex={2}
              component={renderInputField} />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-4 col-form-label">Where does it come from?</label>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <Field
              name="monoclonal_protien"
              type="text"
              className="form-control "
              id="Last"
              maxLength="12"
              placeholder=""
              tabIndex={2}
              component={renderInputField} />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-4 col-form-label">Why do we use it?</label>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <Field
              name="monoclonal_protien"
              type="text"
              className="form-control "
              id="Last"
              maxLength="12"
              placeholder=""
              tabIndex={2}
              component={renderInputField} />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-4 col-form-label">Where can I get some?</label>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <Field
              name="monoclonal_protien"
              type="text"
              className="form-control "
              id="Last"
              maxLength="12"
              placeholder=""
              tabIndex={2}
              component={renderInputField} />
          </div>
        </div>*/}
          {this.state.questions.length > 0 && <div className="form-group row">
            <div className="col-sm-12 text-center">
              <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Save</button>
            </div>
          </div>}
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quesList: state.fullProfileQues,
    userinfo: state.user.userinfo,
    saveHealthProfile: state.saveSurvey,
    // initialValues: setInitialValues(state.fullProfileQues),
  };
}

Tabs = reduxForm({
  form: "TabsForm",
  enableReinitialize: true,
})(Tabs);
export default connect(mapStateToProps, { getTabData, getUserInfo, saveSurvey, resetTab, resetSaveSurvey })(Tabs);
