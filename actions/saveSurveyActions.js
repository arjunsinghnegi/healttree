/**
 * @action        : survey Actions
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, PATIENT_CONST, SAVE_SURVEY_API } from "./constants";
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
export function reset(RESET) {
  return {
    type: RESET,
  };
}

export function saveSurvey(token, data, answer_id) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SAVE_SURVEY_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let APICALL = (answer_id ? AXIOS_INSTANCE.patch(`${SAVE_SURVEY_API}/${answer_id}`, data, config) : AXIOS_INSTANCE.post(SAVE_SURVEY_API, data, config));
    // AXIOS_INSTANCE.post(`${SAVE_SURVEY_API}`, data, config)
    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.SAVE_SURVEY_SUCCESS, success.data));
      })
      .catch(function(error) {
        console.log("error inssv", error);
        dispatch(getFailure(PATIENT_CONST.SAVE_SURVEY_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
export function resetSaveSurvey() {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.SAVE_SURVEY_RESET));
  };
}
