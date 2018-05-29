/**
 * @action        : Outcomes Actions
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, OUTCOME_API, PATIENT_CONST } from "./constants";
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

// actiont to get dynamic listing of all the options of the my health history
export function getOutcomeData(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.OUTCOME_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${OUTCOME_API}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        console.log("success>>>", success);
        dispatch(getSuccess(PATIENT_CONST.OUTCOME_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.OUTCOME_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
