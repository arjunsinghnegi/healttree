/**
 * @action        : Outcomes Actions
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, CLINICAL_TRIALS_API, PATIENT_CONST } from "./constants";
import { changeProfileComplete, changeSurvey } from "./miscActions.js";
import { checkHttpStatus, parseJSON } from "../utils";
import { browserHistory } from "react-router";
import { getUserInfo } from "./UserActions.js";
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
export function getCinicalTrials(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.CLINICAL_TRIALS_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${CLINICAL_TRIALS_API}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.CLINICAL_TRIALS_SUCCESS, success.data));
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

        dispatch(getFailure(PATIENT_CONST.CLINICAL_TRIALS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}


// Save clinical trials data

export function saveClinicalTrial(token, clinicalId, formData) {

  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.CLINICAL_TRIALS_SAVE_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let APICALL = (clinicalId) ?
      AXIOS_INSTANCE.patch(`${CLINICAL_TRIALS_API}/${clinicalId}`, formData, config) :
      AXIOS_INSTANCE.post(CLINICAL_TRIALS_API, formData, config);

    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.CLINICAL_TRIALS_SAVE_SUCCESS, success.data));
        // misc actions
        // if (success.meta && success.meta.profile_complete_percentage) {
        //   let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
        //   dispatch(changeProfileComplete(percentage));
        // }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
        dispatch(getUserInfo(token));
        // if (refPage === "MYELOMA_MORE") {
        //   dispatch(getMyMyeloma(token));
        //   browserHistory.push("/my-myeloma-more");
        // }
        // if (refPage === "health-history") {
        // browserHistory.push("/current-history");
        // }
      })
      .catch(function(error) {
        console.log("error ->>>>> ", error.response.data);
        let errObj = [];
        if (error.response && error.response.data && error.response.data.errors) {
          errObj = error.response.data.errors;
        }
        dispatch(getFailure(PATIENT_CONST.CLINICAL_TRIALS_SAVE_FAILURE, errObj));

      });
  };
}

// reset all the states 
export function resetClinicalTrials(token) {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.CLINICAL_TRIALS_SAVE_RESET));
  };
}
