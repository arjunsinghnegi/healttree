/**
 * @action        : Health History Actions
 * @description   : Handles all the actions that are related to health history
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, DYNAMIC_OUTCOMES, DYNAMIC_SIDE_EFFECTS, GET_MY_TREATMENTS_API, PATIENT_CONST, TREATMENTS_LIST } from "./constants";
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
// reset all the variables
export function reset(RESET) {
  return {
    type: RESET,
  };
}

// reset all the states 
export function resetPatient(token) {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.PATIENT_RESET));
  };
}

// action to get dynamic listing of all the options of the my health history
export function saveTreatments(token, formData, treatmentId) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SAVE_MY_TREATMENTS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let postData = {
      data: formData };
    let APICALL = (treatmentId ? AXIOS_INSTANCE.patch(`${GET_MY_TREATMENTS_API}/${treatmentId}`, postData, config) : AXIOS_INSTANCE.post(GET_MY_TREATMENTS_API, postData, config));
    // let APICALL = AXIOS_INSTANCE.post(GET_MY_TREATMENTS_API, postData, config);
    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        // misc actions
        // if (success.meta && success.meta.profile_complete_percentage) {
        //   let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
        //   dispatch(changeProfileComplete(percentage));
        // }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
        dispatch(getSuccess(PATIENT_CONST.SAVE_MY_TREATMENTS_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.SAVE_MY_TREATMENTS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };

}

// action to get dynamic listing of all the options of the my health history
export function getDynamicTreatments(token, formData, treatmentId) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.DYNAMIC_TREATMENT_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let postData = {
      data: formData };
    // let APICALL = (treatmentId ? AXIOS_INSTANCE.patch(`${TREATMENTS_LIST}`, postData, config) : AXIOS_INSTANCE.post(GET_MY_TREATMENTS_API, postData, config));
    let APICALL = AXIOS_INSTANCE.get(TREATMENTS_LIST, config);
    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        // misc actions
        if (success.meta && success.meta.profile_complete_percentage) {
          let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
          dispatch(changeProfileComplete(percentage));
        }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
        dispatch(getSuccess(PATIENT_CONST.DYNAMIC_TREATMENT_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.DYNAMIC_TREATMENT_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };

}

// action to get dynamic listing of side effects
export function getDynamicSideEffects(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.DYNAMIC_SIDE_EFFECTS_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${DYNAMIC_SIDE_EFFECTS}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.DYNAMIC_SIDE_EFFECTS_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.DYNAMIC_SIDE_EFFECTS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// actiont to get dynamic listing of side effects
export function getDynamicOutcomes(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.DYNAMIC_OUTCOMES_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${DYNAMIC_OUTCOMES}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.DYNAMIC_OUTCOMES_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.DYNAMIC_OUTCOMES_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

