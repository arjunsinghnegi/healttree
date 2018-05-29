/**
 * @action        : Outcomes Actions
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */
import { AXIOS_INSTANCE, DYNAMIC_SIDE_EFFECTS, FAVORITE, FAVORITE_CONST, FILTER_CONST, PATIENT_CONST, TREATMENT_LEGENDS_API, TREATMENT_NOTE_API, TREATMENT_OPTIONS_API, TREATMENT_RESOURCE_API } from "./constants";
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


// actiont to get dynamic listing of all the options of the my health history
export function getTreatmentData(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.TREATMENT_OPTIONS_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${TREATMENT_OPTIONS_API}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.TREATMENT_OPTIONS_SUCCESS, success.data));
        // misc actions
        let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
        if (success.meta && success.meta.profile_complete_percentage) {
          dispatch(changeProfileComplete(percentage));
        }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.TREATMENT_OPTIONS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
export function resetTreatmentData() {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.TREATMENT_OPTIONS_RESET));
  };
}

// action
export function getTreatmentResource(token, resourceId) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.TREATMENT_RESOURCE_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${TREATMENT_RESOURCE_API}?filter[treatment_option_id]=${resourceId}&include=research_links`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.TREATMENT_RESOURCE_SUCCESS, success));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.TREATMENT_RESOURCE_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
export function resetTreatmentResource() {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.TREATMENT_RESOURCE_RESET));
  };
}

// save personal note
// action
export function savePersonalNote(token, data, note_id) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.TREATMENT_NOTE_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let postData = { data: {
      type: "user_treatment_option_notes",
      attributes: data,
    },
    };
    if (note_id) {
      postData.data.id = note_id;
    }


    let APICALL = note_id ? AXIOS_INSTANCE.put(`${TREATMENT_NOTE_API}/${note_id}`, postData, config) : AXIOS_INSTANCE.post(TREATMENT_NOTE_API, postData, config) ;
    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.TREATMENT_NOTE_SUCCESS, success));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.TREATMENT_NOTE_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// actiont to get dynamic listing of all the options of the my health history
export function getPersonalNote(token) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.TREATMENT_PRSNLNOTE_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${TREATMENT_NOTE_API}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        let returnObj = { "personal_note": "" };
        if (success && success.data.length) {
          returnObj.personal_note = (success.data[0].attributes.content) ? success.data[0].attributes.content : null;
          returnObj.note_id = (success.data[0].id) ? success.data[0].id : null;
        }

        dispatch(getSuccess(PATIENT_CONST.TREATMENT_PRSNLNOTE_SUCCESS, returnObj));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.TREATMENT_PRSNLNOTE_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// actiont to get dynamic listing of all the options of the my health history
export function getTreatmentLegends(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.TREATMENT_LEGENDS_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(`${TREATMENT_LEGENDS_API}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.TREATMENT_LEGENDS_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.TREATMENT_LEGENDS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

// function to reset treatment options legend
export function resetTreatmentLegends() {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.TREATMENT_LEGENDS_RESET));
  };
}

export function toggleFavTreatment(token, data, fav_id, hierarchyObj) {
  return function(dispatch) {
    dispatch(getRequest(FAVORITE_CONST.FAVORITE_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let apiCall = (fav_id) ? AXIOS_INSTANCE.delete(`${FAVORITE}/${fav_id}`, config) : AXIOS_INSTANCE.post(`${FAVORITE}`, data, config);
    apiCall.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        console.log(hierarchyObj, "success>>>>", success.data);
        // if (!fav_id) {
        if (hierarchyObj) {
          if (success.data) {
            success.data.hierarchyObj = hierarchyObj;
          }
          if (hierarchyObj.isFilter) {
            success.data.hierarchyObj.isFav = (!fav_id) ? "Filter" : null;
          } else {
            success.data.hierarchyObj.isFav = (!fav_id) ? "Favorite" : null;
          }

        }
        dispatch(getSuccess(FAVORITE_CONST.FAVORITE_SUCCESS, (success.data) ? success.data : {}));
        // }

      })
      .catch(function(error) {
        dispatch(getFailure(FAVORITE_CONST.FAVORITE_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
export function resetFavTreatment() {
  return function(dispatch) {
    dispatch(getRequest(FAVORITE_CONST.FAVORITE_RESET));
  };
}

// for filete
export function toggleFilterTreatment(token, data, fav_id, hierarchyObj) {
  return function(dispatch) {
    dispatch(getRequest(FILTER_CONST.FILTER_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let apiCall = (fav_id) ? AXIOS_INSTANCE.delete(`${FAVORITE}/${fav_id}`, config) : AXIOS_INSTANCE.post(`${FAVORITE}`, data, config);
    apiCall.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        console.log(hierarchyObj, "<<<<<<<success>>>>", success.data);
        // if (!fav_id) {
        if (hierarchyObj) {
          if (success.data) {
            success.data.hierarchyObj = hierarchyObj;
          }
          if (hierarchyObj.isFilter) {
            success.data.hierarchyObj.isFav = (!fav_id) ? "Filter" : null;
          } else {
            success.data.hierarchyObj.isFav = (!fav_id) ? "Favorite" : null;
          }

        }
        dispatch(getSuccess(FILTER_CONST.FILTER_SUCCESS, (success.data) ? success.data : {}));
        // }

      })
      .catch(function(error) {
        dispatch(getFailure(FILTER_CONST.FILTER_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
export function resetFilterTreatment() {
  return function(dispatch) {
    dispatch(getRequest(FILTER_CONST.FILTER_RESET));
  };
}
