/**
 * @action        : Health History Actions
 * @description   : Handles all the actions that are related to health history
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, GET_HEALTH_HISTORY_OPTIONS_API, HEALTH_HISTORY_SUB_OPTIONS_API, PATIENT_CONST } from "./constants";
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

export function reset(RESET) {
  return {
    type: RESET,
  };
}

export function resetHealthHistory(token) {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.HLTH_HISTRY_RESET));
  };
}
// actiont to get dynamic listing of all the options of the my health history
export function getHealthHistoryOptions(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.GET_HLTH_HISTRY_OPTIONS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(`${GET_HEALTH_HISTORY_OPTIONS_API}`, config)
      .then(checkHttpStatus)
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
        dispatch(getSuccess(PATIENT_CONST.GET_HLTH_HISTRY_OPTIONS_SUCCESS, success.data));

      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.GET_HLTH_HISTRY_OPTIONS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/* ******************************************************************************************************************************
*****************************************************************************************************************************/

// actiont to save options of the my health history
export function saveHealthHistoryOptions(token, data) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.HLTH_HISTRY_UPDATE_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.put(`${GET_HEALTH_HISTORY_OPTIONS_API}/${data.data.id}`, data, config)
      .then(checkHttpStatus)
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
        dispatch(getSuccess(PATIENT_CONST.HLTH_HISTRY_UPDATE_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.HLTH_HISTRY_UPDATE_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
// actiont to save options of the my health history
export function saveHealthHistorySubOptions(token, data) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.HLTH_HISTRY_SUBOPTION_UPDATE_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.put(`${HEALTH_HISTORY_SUB_OPTIONS_API}/${data.data.id}`, data, config)
      .then(checkHttpStatus)
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
        dispatch(getSuccess(PATIENT_CONST.HLTH_HISTRY_SUBOPTION_UPDATE_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.HLTH_HISTRY_SUBOPTION_UPDATE_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

