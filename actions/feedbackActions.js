/**
 * @action        : My myeloma Actions
 * @description   : Handles all the actions that are related to my myeloma section
 * @Created by    : smartData
 */

import { AXIOS_INSTANCE, FEEDBACK, FEEDBACK_CONST } from "./constants";
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
// reset all the variables
export function reset(RESET) {
  return {
    type: RESET,
  };
}

// actiont to get dynamic listing of all the options of the my health history
export function saveFeedback(token, data) {
  return function(dispatch) {
    dispatch(getRequest(FEEDBACK_CONST.FEEDBACK_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.post(`${FEEDBACK}`, data, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(FEEDBACK_CONST.FEEDBACK_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(FEEDBACK_CONST.FEEDBACK_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// reset all the states 
export function resetFeedback(token) {
  return function(dispatch) {
    dispatch(reset(FEEDBACK_CONST.FEEDBACK_RESET));
  };
}
