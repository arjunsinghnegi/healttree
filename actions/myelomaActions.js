/**
 * @action        : My myeloma Actions
 * @description   : Handles all the actions that are related to my myeloma section
 * @Created by    : smartData
 */

import { AXIOS_INSTANCE, DIAGNOSE_FACILITY, FACILITIES_CONST } from "./constants";
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
export function getFacilities(token) {
  return function(dispatch) {

    dispatch(getRequest(FACILITIES_CONST.FACILITY_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${DIAGNOSE_FACILITY}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(FACILITIES_CONST.FACILITY_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(FACILITIES_CONST.FACILITY_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
