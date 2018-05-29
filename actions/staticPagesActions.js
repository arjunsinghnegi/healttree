/**
 * @action        : Health History Actions
 * @description   : Handles all the actions that are related to health history
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, GET_ABOUT_ME_API, HIDE_START_MODAL, HOME_CONTENT_API, PATIENT_CONST } from "./constants";
import { changeProfileComplete, changeSurvey } from "./miscActions.js";
import { checkHttpStatus, parseJSON } from "../utils";
import { browserHistory } from "react-router";
import { userInterest } from "./miscActions.js";

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
export function getConsentFormRequest(token = null) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.CONSENT_FORM_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(`${HOME_CONTENT_API}?filter[slug]=consent-form`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.CONSENT_FORM_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.CONSENT_FORM_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// hide get started modal
export function hideGetStartedModal(token, saveObj) {
  let config = { "headers": { "Authorization": token } };
  return function(dispatch) {
    let postData = { data: saveObj };
    // dispatch(getRequest(PATIENT_CONST.MODAL_CLOSE_REQUEST));
    AXIOS_INSTANCE.put(HIDE_START_MODAL, postData, config)
      .then(function(success) {
        dispatch(userInterest(success.data.meta));
        dispatch(getSuccess(PATIENT_CONST.MODAL_CLOSE_SUCCESS, success.data));
      })
      .catch(function(error) {
        // dispatch(getFailure(PATIENT_CONST.MODAL_CLOSE_FAILURE, {
        //   // response: {
        //   //   statusCode: 403,
        //   //   statusText: null,
        //   // } 
        // }));
      });
  };
}

export function saveUserInterest(token, data, patientInfo, userId) {
  return function(dispatch) {
    // dispatch(getRequest(PATIENT_CONST.SAVE_PATIENT_INFO_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let postData = {};
    if (patientInfo.id) {
      postData = { data: {
        type: "patient_infos",
        id: (patientInfo.id),
        attributes: data,
      },
      };
    } else {
      postData = { data: {
        type: "patient_infos",
        id: (patientInfo.id),
        attributes: data,
        "relationships": {
          "user": {
            "data": { "type": "users", "id": userId },
          },
        },
      },
      };
    }


    let APICALL = patientInfo.id ? AXIOS_INSTANCE.put(`${GET_ABOUT_ME_API}/${patientInfo.id}`, postData, config) : AXIOS_INSTANCE.post(GET_ABOUT_ME_API, postData, config) ;

    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(userInterest(success.meta));
      })
      .catch(function(error) {
      // console.log("error - ", error);
        // dispatch(getFailure(PATIENT_CONST.SAVE_PATIENT_INFO_FAILURE, {
        //   response: {
        //     statusCode: 403,
        //     statusText: null,
        //   } }));
      });
  };
}

// actiont to get dynamic listing of all the options of the my health history
export function getPrivacyPolicy(token = null) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.PRIVACY_POLICY_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${HOME_CONTENT_API}?filter[slug]=privacy-policy`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.PRIVACY_POLICY_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.PRIVACY_POLICY_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function getTermsOfUse(token = null) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.PRIVACY_POLICY_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${HOME_CONTENT_API}?filter[slug]=terms-of-use`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.PRIVACY_POLICY_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.PRIVACY_POLICY_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

