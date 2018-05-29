/**
 * @action        : 
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, FULL_HEALTH_CHILD, FULL_HEALTH_PROFILE, PATIENT_CONST } from "./constants";
import { checkHttpStatus, handleLoginRedirect, handleLogoutRedirect, parseJSON } from "../utils";
import { browserHistory } from "react-router";
import { getSurveyQuestions } from "./surveyActions";
export function getRequest(REQUEST) {
  return {
    type: REQUEST,
  };
}

// handle state in case of resposen is success
export function getSuccess(SUCCESS, data) {
  return {
    type: SUCCESS,
    payload: data,
  };
}

// handle state in case of resposen is failure
export function getFailure(FAILURE, error) {
  return {
    type: FAILURE,
    payload: error,
  };
}
// handle state in case of resposen is failure
// FULL_PROFILE_QUES_RESET
export function reset(RESET) {
  return {
    type: RESET,
  };
}

// ACTION TO GET TABS OF FULL HEALTH PROFILE
export function getTabs(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.FULL_PROFILE_GROUP_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(`${FULL_HEALTH_PROFILE}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.FULL_PROFILE_GROUP_SUCCESS, success.data));
      })
      .catch(function(error) {
        console.log("error", error);
        dispatch(getFailure(PATIENT_CONST.FULL_PROFILE_GROUP_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// ACTION TO GET TABS OF FULL HEALTH PROFILE
export function getTabData(token, tab_id, survey_id) {
  // :health_category_id/survey_questions
  return function(dispatch) {
    // /question_groups?include=survey_questions
    dispatch(getRequest(PATIENT_CONST.FULL_PROFILE_QUES_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(`${FULL_HEALTH_PROFILE}/${tab_id}/question_groups?include=survey_questions`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        let mainObj = [];
        if (success.data.length) {
          mainObj = setQuesData(success);
        }
        // mainObj[group.id] = groupTmpObj;
        dispatch(getSuccess(PATIENT_CONST.FULL_PROFILE_QUES_SUCCESS, mainObj));
        if (survey_id) {
          console.log("i am here");
          dispatch(getSurveyQuestions(token, survey_id, true));
        }
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.FULL_PROFILE_QUES_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// get child questions
// request to get the questions of selected survey
export function getChildQuestions(token, ques_id, choice_id, heirarchy) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.CHILD_QUESTION_FETCH_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${FULL_HEALTH_CHILD}/?filter[ancestry]=${ques_id}&filter[survey_question_choice_id]=${choice_id}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        success.heirarchy = JSON.parse(JSON.stringify(heirarchy));
        success.heirarchy.parents.push(ques_id);
        let mainObj = [];
        if (success.data.length) {
          mainObj = setChildQuesData(success, heirarchy, ques_id);

        }
        success.data = mainObj;
        dispatch(getSuccess(PATIENT_CONST.CHILD_QUESTION_FETCH_SUCCESS, success));

        // misc actions
        // if (success.meta && success.meta.profile_complete_percentage) {
        //   let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
        //   dispatch(changeProfileComplete(percentage));
        // }
        // if (success.meta && success.meta.avail_surveys) {
        //   dispatch(changeSurvey(success.meta.avail_surveys));
        // }
      })
      .catch(function(error) {
        console.log("error getChildQuestions", error);
        dispatch(getFailure(PATIENT_CONST.CHILD_QUESTION_FETCH_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function resetTab() {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.FULL_PROFILE_GROUP_RESET));
  };
}

export function resetTabQues() {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.FULL_PROFILE_QUES_RESET));
  };
}
export function resetChildQues() {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.CHILD_QUESTION_RESET));
  };
}

function setQuesData(success) {
  let includeArr = (success.included && success.included.length) ? success.included : [];
  let mainObj = [];

  if (success.data.length) {
    success.data.map((group, group_key) => {
      console.log("group", group);
      // question groups
      let groupTmpObj = {};
      groupTmpObj.id = group.id;
      groupTmpObj.help_text = group.attributes.help_text;
      groupTmpObj.name = group.attributes.name;
      groupTmpObj.rank = group.attributes.rank;
      groupTmpObj.questionsArr = [];
      let questionsId = group.relationships.survey_questions.data;
      if (questionsId) {
        questionsId.map((questionId, quesKey) => {
          let letQuestionsObj = {};
          let showMore = false;

          // letQuestionsObj.id = questionId.id;
          includeArr.map((includeObj, includeKey) => {
            if (questionId.id === includeObj.id) {
              includeObj.attributes.id = includeObj.id;
              letQuestionsObj = includeObj.attributes;
              // if question has already answer and question_type is eirther radio or checkbox
              if (includeObj.attributes.answer && includeObj.attributes.answer.length) {
                if ((includeObj.attributes.question_type === "radio" || includeObj.attributes.question_type === "checkbox")) {
                  letQuestionsObj.choices.map((quesChoice, quesKey) => {
                    let indexOfAns = includeObj.attributes.answer.indexOf(quesChoice.id);
                    if (indexOfAns > -1 && quesChoice.sub_questions) {
                      showMore = true;
                    }
                  });
                }
              }
              includeObj.attributes.showMore = showMore;
              groupTmpObj.showMoreIcon = true;
              includeObj.attributes.heirarchy = {};
              includeObj.attributes.questionsArr = [];
              includeObj.attributes.heirarchy.group_id = group.id;
              includeObj.attributes.heirarchy.parents = [];
              // includeObj.attributes.heirarchy.push({ group_id: group.id });
              // includeObj.attributes.heirarchy.push({ parents: [] });
              groupTmpObj.questionsArr[questionId.id] = letQuestionsObj;
            }
          });
        });

      }


      // set questions
      mainObj[group.id] = groupTmpObj;
    });

    return mainObj;
  }
}

function setChildQuesData(success, heirarchy, quesId) {
  let includeArr = (success.included && success.included.length) ? success.included : [];
  let mainObj = [];

  if (success.data.length) {
    let mainObj = [];
    success.data.map((group, group_key) => {
      // question groups
      let groupTmpObj = {};
      groupTmpObj = group.attributes;
      groupTmpObj.id = group.id;
      let showMore = false;
      if (group.attributes.answer && group.attributes.answer.length) {
        if ((group.attributes.question_type === "radio" || group.attributes.question_type === "checkbox")) {
          group.attributes.choices.map((quesChoice, quesKey) => {
            let indexOfAns = group.attributes.answer.indexOf(quesChoice.id);
            if (indexOfAns > -1 && quesChoice.sub_questions) {
              showMore = true;
            }
          });
        }
      }
      groupTmpObj.showMore = showMore;
      groupTmpObj.showMoreIcon = true;
      groupTmpObj.questionsArr = [];
      groupTmpObj.heirarchy = JSON.parse(JSON.stringify(heirarchy));
      groupTmpObj.heirarchy.parents.push(quesId);
      // groupTmpObj.questionsArr = [];
      // let questionsId = group.relationships.survey_questions.data;

      // // set questions
      mainObj[group.id] = groupTmpObj;
    });

    return mainObj;
  }
}
