/**
 * @action        : survey Actions
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, FULL_HEALTH_CHILD, PATIENT_CONST, SURVEY_API } from "./constants";
import { changeProfileComplete, changeSurvey } from "./miscActions.js";
import { checkHttpStatus, parseJSON } from "../utils";
import { browserHistory } from "react-router";
// handle state when request is send and resposen is awaited
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
// reset
export function reset(RESET, error) {
  return {
    type: RESET,
    payload: error,
  };
}

// actiont to get dynamic listing of all the options of the my health history
export function getSurveys(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.SURVEY_FETCH_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${SURVEY_API}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        console.log("Success", success.data);
        dispatch(getSuccess(PATIENT_CONST.SURVEY_FETCH_SUCCESS, success.data));
        // misc actions
        if (success.meta && success.meta.profile_complete_percentage) {
          let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
          dispatch(changeProfileComplete(percentage));
        }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.SURVEY_FETCH_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// reset vars
export function resetSurveys(token) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SURVEY_RESET));
  };
}

// request to get the questions of selected survey
export function getSurveyQuestions(token, survey_id, reqFromFullHealth) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.SURVEY_QUESTION_FETCH_REQUEST));
    let config = { "headers": { "Authorization": token } };

    let axios_instance = (reqFromFullHealth) ? AXIOS_INSTANCE.get(`${FULL_HEALTH_CHILD}/?filter[survey]=${survey_id}`, config) :
      AXIOS_INSTANCE.get(`${SURVEY_API}/${survey_id}/survey_questions`, config);

    axios_instance.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        // is request has come from full health profile
        if (reqFromFullHealth) {
          let dataObj = {};
          dataObj.id = survey_id;
          dataObj.name = "";
          dataObj.questionsArr = [];
          dataObj.rank = 1;
          success.data.map((ques, data) => {
            ques.attributes.id = ques.id;
            ques.attributes.questionsArr = [];
            ques.attributes.disabled = true;
            dataObj.questionsArr[ques.id] = ques.attributes;
            // dataObj.questionsArr.push(ques.attributes);
          });
          let tmpData = [];
          tmpData.push(dataObj);
          console.log("tmp", tmpData);
          success.data = tmpData;
          dispatch(getSuccess(PATIENT_CONST.SURVEY_QUESTION_FETCH_SUCCESS, tmpData));
        } else {
          dispatch(getSuccess(PATIENT_CONST.SURVEY_QUESTION_FETCH_SUCCESS, success.data));
        }


        // misc actions
        if (success.meta && success.meta.profile_complete_percentage) {
          let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
          dispatch(changeProfileComplete(percentage));
        }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.SURVEY_QUESTION_FETCH_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function resetSurveyQues() {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.SURVEY_QUESTION_RESET));
  };
}
