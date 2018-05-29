/**
 * @action        : survey Actions
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, MISC_CONST, MODULE_WEIGHTS } from "./constants";
import { checkHttpStatus, parseJSON, setModuleWeights } from "../utils";
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

// Function to get standard weight of the modules for the purpose of side menu flow

export function getModuleWeights(token) {
  return function(dispatch) {

    dispatch(getRequest(MISC_CONST.MODULE_WEIGHTS_REQUEST));
    // let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${MODULE_WEIGHTS}`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(setModuleWeights)
      .then(function(success) {
        dispatch(getSuccess(MISC_CONST.MODULE_WEIGHTS_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(MISC_CONST.MODULE_WEIGHTS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
