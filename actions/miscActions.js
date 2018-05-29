/**
 * @action        : survey Actions
 * @description   : Handles all the actions that are related to outcomes
 * @Created by    : smartData
 */

import { browserHistory } from "react-router";
import { MISC_CONST } from "./constants";

export function setMisc(PARAM, data) {
  return {
    type: PARAM,
    payload: data,
  };
}

// export function changeSurvey(data) {
//   console.log("changeSurvey", data);
//   return {
//     type: MISC_CONST.SURVEY_PENDING,
//     payload: data,
//   };
// }

// set profile completion
export function changeProfileComplete(data) {
  return function(dispatch) {
    // remove this when login is implemented
    let tmpObj = {};
    let total = 0;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        total += parseInt(data[key]);
      }
    }
    tmpObj.profile_completed = total;
    tmpObj.userModuleWeights = data;
    dispatch(setMisc(MISC_CONST.PROFILE_COMPLETE, tmpObj));
  };
}
// set survey
export function changeSurvey(data) {
  return function(dispatch) {
    dispatch(setMisc(MISC_CONST.SURVEY_PENDING, data));
  };
}

// data to implement side menu options
export function userInterest(data) {
  return function(dispatch) {
    // remove this when login is implemented
    let tmpObj = {};
    tmpObj.interested_in = data.intrested_in;
    dispatch(setMisc(MISC_CONST.USER_INTEREST, tmpObj));
  };
}

export function setModuleCount(data) {
  return function(dispatch) {
    let tmpObj = {};
    tmpObj.clinicalTrial = data.clinical_trials_count;
    tmpObj.treatments = data.treatments_count;
    // set local storge also
    localStorage.setItem("modulecounts", JSON.stringify(tmpObj));
    dispatch(setMisc(MISC_CONST.USER_COUNTS, tmpObj));
  };
}
