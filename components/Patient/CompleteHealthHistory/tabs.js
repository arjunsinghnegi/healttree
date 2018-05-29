
import { Field, formValueSelector, reduxForm } from "redux-form";
import { getChildQuestions, getTabData, resetChildQues, resetTabQues } from "../../../actions/fullHealthProfileActions";
import React, { Component } from "react";
import { renderCheckbox, renderDynamicRadio, renderInputField, renderSelectField, renderTextArea } from "../../common/dynamicFields";
import { resetSaveSurvey, saveSurvey } from "../../../actions/saveSurveyActions";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import Loader from "../../common/loader";
import { resetSurveyQues } from "../../../actions/surveyActions";
// import { formatPattern } from "react-router/lib/PatternUtils";
// import { Input, TextArea } from "react-input-component";

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      questions: [],
      userinfo: null,
      formValid: true,
      // isSurveyQues: false,
    };
    this.selectedTab = props.displayName;
    this.returnField = this.returnField.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.renderCheckboxField = this.renderCheckboxField.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
    this.getSubQuestions = this.getSubQuestions.bind(this);
    this.setChildQues = this.setChildQues.bind(this);
    this.saveAnswer = this.saveAnswer.bind(this);
    this.validate = this.validate.bind(this);
    this.validateChilds = this.validateChilds.bind(this);
    this.radioCheckFieldValidation = this.radioCheckFieldValidation.bind(this);
    this.textFieldValidation = this.textFieldValidation.bind(this);
  }


  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.saveHealthProfile !== props.saveHealthProfile) {
        if (nextProps.saveHealthProfile.isSuccess) {
          // Alert.success("Your complete health profile information saved successfully");
          this.setState({ showLoader: false });
          this.props.resetSaveSurvey();
        }
      }
      if (nextProps.quesList !== props.quesList) {
        let quesList = nextProps.quesList;
        // this.setState({ showLoader: true });
        if (quesList.isRequesting) {
          this.setState({ showLoader: true });
        }
        if (quesList.isError) {
          Alert.error("Something went wrong. Please try again after sometime.");
          this.setState({ showLoader: false });
        }

        if (quesList.data && quesList.isSuccess) {
          this.setState({ questions: quesList.data, showLoader: false }, function() {
          });
          this.props.resetTabQues();
        }

        if (nextProps.userinfo && props.userinfo !== nextProps.userinfo) {
          let userinfo = nextProps.userinfo;
          this.setState({ userinfo: userinfo });
          // this.props.resetFormVar();
        }
      }

      if (nextProps.surveyQuestions !== props.surveyQuestions) {
        let quesList = nextProps.surveyQuestions;
        if (quesList.isQuestionRequesting) {
          this.setState({ showLoader: true });
        }
        if (quesList.isQuestionError) {
          Alert.error("Something went wrong. Please try again after sometime.");
          this.setState({ showLoader: false });
        }

        if (quesList.questions && quesList.isQuestionSuccess) {
          if (this.state.questions && this.state.questions.length) {
            let questions = this.state.questions;
            questions.push(quesList.questions[0]);
            this.setState({ questions: questions, showLoader: false }, function() {
              this.props.resetSurveyQues();
            });
          } else {
            this.setState({ questions: quesList.questions, showLoader: false }, function() {
              this.props.resetSurveyQues();
            });
          }

          // 

        }

      }
      // child questions
      if (nextProps.childQues !== props.childQues) {
        let childQues = nextProps.childQues;
        // this.setState({ showLoader: false });
        if (childQues.isRequesting) {
          this.setState({ showLoader: true });
        }
        if (childQues.isError) {
          Alert.error("Something went wrong. Please try again after sometime.");
          this.setState({ showLoader: false });
        }
        if (childQues.data && childQues.isSuccess) {
          this.setState({ showLoader: false });
          this.setChildQues(childQues.data);
          // this.setState({ questions: quesList.data, showLoader: false });
          // this.props.resetTab();
        }


      }
    }
  }

  // set child questions
  setChildQues(data) {
    let quesState = this.state.questions;
    let groupQues = null, groupQuesAgain = null;
    // if (!data.data.length) {
    //   alert("no data found in array");
    //   return false;
    // }
    if (data.heirarchy) {
      quesState.map((group, groupKey) => {
        if (group.id === data.heirarchy.group_id) {
          groupQues = group;
          groupQuesAgain = group;
        }
      });
      if (data.heirarchy.parents && groupQues) {
        // let hierarchyLength = data.heirarchy.parents.length;
        // let obj = null;
        // let returnArr = [];
        data.heirarchy.parents.map((parent, parentKey) => {
          // if (groupQues.questionsArr[parent]) {
          // returnArr[parent] = groupQues[parent];
          groupQues = (groupQues.questionsArr && groupQues.questionsArr[parent]) ? groupQues.questionsArr[parent] : [];
        });
        groupQues.questionsArr = data.data;
        // map ques group here
        if (data.heirarchy.parents) {
          data.heirarchy.parents.map((parent, parentKey) => {
            groupQuesAgain = groupQuesAgain.questionsArr[parent];
            if (groupQuesAgain.questionsArr && groupQuesAgain.questionsArr.length) {
              // groupQuesAgain.questionsArr.map((question, obj) => {
              groupQuesAgain.showMore = true;
              groupQuesAgain.showMoreIcon = false;
              // });
            } else {
              groupQuesAgain.showMore = false;
              groupQuesAgain.showMoreIcon = false;
            }
          });
        }

        // set plus and minus icons

        this.setState({ questions: quesState }, function() {
          // let quesState = this.state.questions;
        });
      }
    }

  }

  // returnCompleteArr(returnArr, groupQues) {
  //   let quesState = this.state.questions;
  //   if (returnArr.length) {

  //   } else {

  //     quesState[groupQues.id] = groupQues;
  //   }
  // }
  onContinue(e) {
    e.preventDefault();
    // browserHistory.push("/my-labs");
  }
  // valica
  validate(e) {
    e.preventDefault();
    // this.setState({ formValid: true });
    let finalObj = [];
    let questions = this.state.questions;
    questions.map(function(question, key) {
      if (question.questionsArr && question.questionsArr.length) {
        this.validateChilds(question.questionsArr, finalObj, this.state.userinfo.id);
      }
    }, this);

    this.setState({ questions });
  }

  validateChilds(childArr, finalObj, userId) {

    childArr.map((childQues, childkey) => {

      let isValid = true;
      if (childQues.validations && childQues.validations.length) {

        let validations = childQues.validations;
        // validations.map((validateObj, validateKey) => {

        if (childQues.question_type === "radio" || childQues.question_type === "checkbox" || childQues.question_type === "drop_down") {
          isValid = this.radioCheckFieldValidation(validations, childQues);
          if (isValid) {
            let tmpObj = {
              "type": "survey_answers",
              "attributes": {
                "survey_question_id": childQues.id,
                "answer": (childQues.answer && childQues.answer.length) ? childQues.answer : null,
                "user_id": userId,
              },
            };
            finalObj.push(tmpObj);
          }
        } else if (childQues.question_type === "text_field") {
          // check for required
          isValid = this.textFieldValidation(validations, childQues);

          if (isValid) {
            let tmpObj = {
              "type": "survey_answers",
              "attributes": {
                "survey_question_id": childQues.id,
                "answer": (childQues.answer && childQues.answer.length) ? childQues.answer : null,
                "user_id": userId,
              },
            };
            finalObj.push(tmpObj);
          }
        } else {
          isValid = this.textFieldValidation(validations, childQues);

          if (isValid) {
            let tmpObj = {
              "type": "survey_answers",
              "attributes": {
                "survey_question_id": childQues.id,
                "answer": (childQues.answer && childQues.answer.length) ? childQues.answer : null,
                "user_id": userId,
              },
            };
            finalObj.push(tmpObj);
          }
        }
        // });
      } else {
        // no rules specified
        let tmpObj = {
          "type": "survey_answers",
          "attributes": {
            "survey_question_id": childQues.id,
            "answer": (childQues.answer && childQues.answer.length) ? childQues.answer : null,
            "user_id": userId,
          },
        };
        finalObj.push(tmpObj);
      }

      if (childQues.questionsArr && childQues.questionsArr.length) {

        this.validateChilds(childQues.questionsArr, finalObj, userId);
      }
    });
  }

  // ******************************* FIELD VALIDATIONS  ******************************* //
  // text field validation
  textFieldValidation(validations, childQues) {
    let isValid = true;
    let isNumeric = false;
    validations.map((validateObj, validateKey) => {
    // check for required
      if (validateObj.name === "Require") {
        if (!childQues.answer || !childQues.answer.length) {
          childQues.errMessage = "Field is required";
          isValid = false;
        // return;
        }
      }
      // numeric check
      if (validateObj.name === "Numeric") {
        isNumeric = true;
        if (childQues.answer && childQues.answer.length) {
          let numbers = /^[0-9]+$/;
          if (!childQues.answer.match(numbers)) {
            childQues.errMessage = "Only numbers allowed.";
            isValid = false;
          }
        }
      }
      // for min
      if (validateObj.name === "Min") {
        if (childQues.answer && childQues.answer.length) {
          if (isNumeric) {
          // check with value
            if (parseInt(childQues.answer) < parseInt(validateObj.value)) {
              childQues.errMessage = "Field value should be greater than " + validateObj.value + ".";
              isValid = false;
            }
          } else {
          //   check with length
            if (parseInt(childQues.answer.length) < parseInt(validateObj.value)) {
              childQues.errMessage = "Field length should be greater than " + validateObj.value + ".";
              isValid = false;
            }
          }
        }
      }
    });
    if (!isValid) {
      Alert.error("Please check the fields and try again");
      this.setState({ formValid: false }, function() {

        return isValid;
      });
    } else {
      return isValid;
    }

  }

  radioCheckFieldValidation(validations, childQues) {
    let isValid = true;
    // check for required
    validations.map((validateObj, validateKey) => {
      if (validateObj.name === "Require") {
        if (!childQues.answer || !childQues.answer.length) {
          childQues.errMessage = "Field is required";
          isValid = false;
        // return;
        }
      }
    });

    if (!isValid) {
      Alert.error("Please check the fields and try again");
      this.setState({ formValid: false }, function() {
        return isValid;
      });
    } else {
      return isValid;
    }
  }
  // ******************************* FIELD VALIDATIONS END ******************************* //
  // render dynamic field
  returnField(parentKey, obj, group_key) {

    if (obj.attributes.question_type === "radio") {
      let tmpArr = [];
      return <div className="col-md-8 custom-dynamic-radio"><div>{this.renderRadioField(parentKey, obj)}</div></div>;
    }

    // checkbox
    if (obj.attributes.question_type === "checkbox") {
      let tmpArr = [];
      // let parent_key = parentKey;
      return <div className="col-md-8 custom-dynamic-radio"><div>{this.renderCheckboxField(parentKey, obj)} </div></div>;

    }

    // text area
    if (obj.attributes.question_type === "text_area") {
      let maxLength = null;
      let disabled = (obj.attributes.disabled) ? true : false;

      return <div className="col-md-8 dynamic-text-area health-textarea">
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
          onBlur={(e) => this.handleTextChange(e, parentKey, obj)}
          className="form-control treatment-textarea"
          rows="5"
          disabled = {disabled}
          maxLength={maxLength}/>
      </div>;
    }

    // select box
    if (obj.attributes.question_type === "drop_down") {
      let tmpArr = [];
      obj.attributes.choices.map(function(attr, key) {
        tmpArr.push({ value: attr.id, label: attr.name });
      });
      let defaultValue = null;
      if (obj.attributes.is_multiple) {
        defaultValue = [];
        if (obj.attributes.answer && obj.attributes.answer.length) {
          obj.attributes.answer.map((ans, k) => {
            defaultValue.push(parseInt(ans));
          });
        }
        return <div className="col-sm-8 dynamic-text-area custom-dynamic-radio"> <Field
          name={parentKey + "_" + obj.id}
          options={tmpArr}
          component={renderSelectField}
          multiSelect = {true}
          defaultValue = {defaultValue}
          onChange = {(selected) => this.handleMultiSelectChange(selected, parentKey, obj)}
          className="form-control"/> </div>;
      } else {
        if (obj.attributes.answer && obj.attributes.answer.length && obj.attributes.answer[0]) {
          defaultValue = parseInt(obj.attributes.answer[0]);
        }

        let disabled = (obj.attributes.disabled) ? true : false;

        return <div className="col-sm-8 dynamic-text-area custom-dynamic-radio"> <Field
          name={parentKey + "_" + obj.id}
          options={tmpArr}
          component={renderSelectField}
          defaultValue = {defaultValue}
          disabled={disabled}
          onChange = {(selected) => this.handleSelectChange(selected, parentKey, obj)}
          className="form-control"/> </div>;
      }

    }
    let disabled = (obj.attributes.disabled) ? true : false;

    // if survey type in simple input field
    return <div className="col-sm-8 custom-dynamic-radio custom-dynamic-radio">
      <Field
        name={parentKey + "_" + obj.id}
        type="text"
        defaultValue={(obj.attributes.answer) ? (obj.attributes.answer) : null}
        component={renderInputField}
        onChange={(e) => this.handleTextChange(e, parentKey, obj)}
        placeholder={obj.attributes.place_holder}
        disabled={disabled}
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

  // Function to check validations
  checkForValidations() {

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
      let disabled = (questionOptions.attributes.disabled) ? true : false;
      options.push(
        <label key = {key} className="dynamic-radio">
          <input disabled = {disabled} type="radio" name={parentKey + "_" + questionOptions.id} value={obj.id} checked = {obj.checked} onClick={(e) => this.handleOptionChange(e, parentKey, questionOptions, obj)}/>
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
      let disabled = (questionOptions.attributes.disabled) ? true : false;

      options.push(
        <label key = {key} className="dynamic-radio">
          <input disabled = {disabled} type="checkbox" name={parentKey + "_" + questionOptions.id} value={obj.id} checked = {obj.checked} onClick={(e) => this.handleCheckboxChange(e, parentKey, questionOptions, obj)}/>
          <span className="treatmentLabel"> {obj.name} </span>
        </label>
      );
    }, this);
    return options;
  }

  // common function to save answer
  saveAnswer(finalObj, answer_id) {
    this.props.saveSurvey(this.props.token, finalObj, answer_id);
  }
  // handle on click event on radio buttons
  handleOptionChange(e, parentKey, parentObj, selected) {
    let stateQuesArr = this.state.questions;
    let hierarchyArr = parentObj.attributes.heirarchy;
    let group_id = null;
    let tmpAnsArr = [];
    let tmpQuesArr = [];
    parentObj.attributes.choices.map(function(choice, key) {
      choice.checked = false;
      if (choice.id === selected.id) {
        choice.checked = (choice.checked) ? false : true ;
        if (choice.checked) {
          tmpAnsArr.push(choice.id);
        }
      }
    });
    let choiceIdStr = tmpAnsArr.toString();

    this.props.getChildQuestions(this.props.token, parentObj.attributes.id, choiceIdStr, parentObj.attributes.heirarchy);
    parentObj.attributes.answer = tmpAnsArr;
    let finalObj = { data: [{
      "type": "survey_answers",
      "attributes": {
        "survey_question_id": parentObj.attributes.id,
        "answer": parentObj.attributes.answer,
        "user_id": this.state.userinfo.id,
      },
    }] };
    let answer_id = (parentObj.attributes.answer_id) ? parentObj.attributes.answer_id : null;
    if (answer_id) {
      finalObj = { data: {
        "type": "survey_answers",
        "id": answer_id,
        "attributes": {
          "survey_question_id": parentObj.attributes.id,
          "answer": parentObj.attributes.answer,
          "user_id": this.state.userinfo.id,
        },
      } };
    }
    this.saveAnswer(finalObj, answer_id);
    this.setState({ questions: stateQuesArr });
  }

  // handle on click event on click of checkbox
  handleCheckboxChange(e, parentKey, parentObj, selected) {
    // e.preventDefault();
    let stateQuesArr = this.state.questions;
    let hierarchyArr = parentObj.attributes.heirarchy;
    let group_id = null;
    let tmpAnsArr = [];
    parentObj.attributes.choices.map(function(choice, key) {
      if (choice.id === selected.id) {
        choice.checked = (choice.checked) ? false : true ;

      }
      if (choice.checked) {
        tmpAnsArr.push(choice.id);
      }
    });
    let choiceIdStr = tmpAnsArr.toString();
    this.props.getChildQuestions(this.props.token, parentObj.attributes.id, choiceIdStr, parentObj.attributes.heirarchy);
    // }
    parentObj.attributes.answer = tmpAnsArr;

    // stateQuesArr[group_id] = tmpQuesArr;
    let finalObj = { data: [{
      "type": "survey_answers",
      "attributes": {
        "survey_question_id": parentObj.attributes.id,
        "answer": parentObj.attributes.answer,
        "user_id": this.state.userinfo.id,
      },
    }] };
    let answer_id = (parentObj.attributes.answer_id) ? parentObj.attributes.answer_id : null;
    if (answer_id) {
      finalObj = { data: {
        "type": "survey_answers",
        "id": answer_id,
        "attributes": {
          "survey_question_id": parentObj.attributes.id,
          "answer": parentObj.attributes.answer,
          "user_id": this.state.userinfo.id,
        },
      } };
    }
    // return;
    this.saveAnswer(finalObj, answer_id);
    this.setState({ questions: stateQuesArr });
  }

  // handle change in select box
  handleSelectChange(selected, parentKey, parentObj) {
    let stateQuesArr = this.state.questions;
    let hierarchyArr = parentObj.attributes.heirarchy;
    let group_id = null;
    parentObj.attributes.answer = [];
    if (selected.value) {
      parentObj.attributes.answer.push(selected.value);
    }
    let finalObj = { data: [{
      "type": "survey_answers",
      "attributes": {
        "survey_question_id": parentObj.attributes.id,
        "answer": parentObj.attributes.answer,
        "user_id": this.state.userinfo.id,
      },
    }] };
    let answer_id = (parentObj.attributes.answer_id) ? parentObj.attributes.answer_id : null;
    if (answer_id) {
      finalObj = { data: {
        "type": "survey_answers",
        "id": answer_id,
        "attributes": {
          "survey_question_id": parentObj.attributes.id,
          "answer": parentObj.attributes.answer,
          "user_id": this.state.userinfo.id,
        },
      } };
    }
    this.saveAnswer(finalObj, answer_id);
    this.setState({ questions: stateQuesArr });
    // parentObj.attributes.answer.push()
  }

  // handle multiselect box
  handleMultiSelectChange(selected, parentKey, parentObj) {
    let selectChoices = parentObj.attributes.choices;
    let answerArr = [];
    selectChoices.map((choice, key) => {
      if (selected[key]) {
        answerArr.push(parseInt(selected[key].value));
      }
    });
    let stateQuesArr = this.state.questions;
    let hierarchyArr = parentObj.attributes.heirarchy;
    let group_id = null;

    parentObj.attributes.answer = answerArr;
    let finalObj = { data: [{
      "type": "survey_answers",
      "attributes": {
        "survey_question_id": parentObj.attributes.id,
        "answer": parentObj.attributes.answer,
        "user_id": this.state.userinfo.id,
      },
    }] };
    let answer_id = (parentObj.attributes.answer_id) ? parentObj.attributes.answer_id : null;
    if (answer_id) {
      finalObj = { data: {
        "type": "survey_answers",
        "id": answer_id,
        "attributes": {
          "survey_question_id": parentObj.attributes.id,
          "answer": parentObj.attributes.answer,
          "user_id": this.state.userinfo.id,
        },
      } };
    }

    this.saveAnswer(finalObj, answer_id);
    this.setState({ questions: stateQuesArr });

  }

  // handle input and text area change
  handleTextChange(e, parentKey, parentObj) {
    // let stateQuesArr = this.state.questions;
    parentObj.attributes.answer = e.target.value;
    let answer_id = (parentObj.attributes.answer_id) ? parentObj.attributes.answer_id : null;
    let finalObj = { data: [{
      "type": "survey_answers",
      "attributes": {
        "survey_question_id": parentObj.attributes.id,
        "answer": parentObj.attributes.answer,
        "user_id": this.state.userinfo.id,
      },
    }] };
    if (answer_id) {
      finalObj = { data: {
        "type": "survey_answers",
        "id": answer_id,
        "attributes": {
          "survey_question_id": parentObj.attributes.id,
          "answer": parentObj.attributes.answer,
          "user_id": this.state.userinfo.id,
        },
      } };
    }
    this.saveAnswer(finalObj, answer_id);
  }

  onSubmit(formData) {
  }

  getSubQuestions(e, quesObj) {
    e.preventDefault();
    // token, parent_id, choice_id, heirarchy
    let choice_id = [];
    if (quesObj.question_type === "checkbox" || quesObj.question_type === "radio") {
      quesObj.choices.map((choice, key) => {
        if (choice.checked && choice.sub_questions) {
          choice_id.push(choice.id);
        }
      });
    }
    let choiceIdStr = choice_id.toString();
    if (choice_id.length) {
      this.props.getChildQuestions(this.props.token, quesObj.id, choiceIdStr, quesObj.heirarchy);
    }
  }
  // render questions and their sub questions and so on
  renderQuestions(quesObj, group_key) {
    let quesTmpObj = {};
    let i = 0;
    return quesObj.questionsArr.map((ques, key) => {
      let obj = {};
      obj.id = ques.id;
      obj.attributes = ques;
      i = i + 1;
      return <div className="row col-sm-12" key={key}>
        <div className="col-sm-12 question">
          {obj.attributes.showMore && <label className="add-label" onClick= {(e) => this.getSubQuestions(e, ques)}><i className = "fa fa-plus" title="Show more quesitons"> </i></label>}
          <label htmlFor="inputEmail3" className={obj.attributes.showMore ? "col-sm-12 col-form-label custom-form-label" : "col-sm-12 col-form-label custom-form-label show-more-icon"}>{i}. {obj.attributes.title} {this.returnAstrix(obj)}</label>
          {this.returnField(key, obj, group_key)}
          {obj.attributes.errMessage && <div className="col-md-12"><span className="text-error">{obj.attributes.errMessage}</span></div>}
        </div>
        <div className="col-sm-12 question">
          {obj.attributes.questionsArr.length > 0 && <div className="col-md-12">{this.renderQuestions(obj.attributes, group_key)}</div>}
        </div>
      </div>;
    });
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="col-sm-12">
        {this.state.showLoader && <Loader noPageTop={true}/>}
        {/* <ol className="breadcrumb">
          <li className="breadcrumb-item"></li>
        </ol> */}
        <form noValidate className="editroll" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          {this.state.questions && this.state.questions.map(function(obj, group_key) {
            return <div className="form-group row after-head-row" key={group_key}>
              <div className="top-health-label">
                <div className="col-sm-12">
                  <label className="ques-group-lbl">{obj.name}</label>
                </div>
              </div>
              {obj.help_text && obj.help_text.trim() && <div className="col-sm-12 question help-text">
                {/* <label className="add-label"><i className = "fa fa-exclamation" title="Information Text"> </i></label> */}
                <label className="col-sm-12 col-form-label custom-form-label show-more-icon">{obj.help_text}</label>
              </div>}
              {this.renderQuestions(obj, group_key)}
            </div>;

          }, this)}
          {this.state.questions.length > 0 && <div className="form-group row ">
            <div className="col-sm-12 text-center">
              <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" onClick={(e) => this.validate(e)}>Save</button>
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
    childQues: state.fullProfileChildQues,
    surveyQuestions: state.surveyQuestions,
    // initialValues: setInitialValues(state.fullProfileQues),
  };
}

Tabs = reduxForm({
  form: "TabsForm",
  enableReinitialize: true,
})(Tabs);
export default connect(mapStateToProps, { getTabData, saveSurvey, resetTabQues, resetSurveyQues, resetSaveSurvey, getChildQuestions, resetChildQues })(Tabs);
