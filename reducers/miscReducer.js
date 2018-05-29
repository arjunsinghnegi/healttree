/**
 * @reducer       : user reducer
 * @description   : handle all request and response for the user actions
 * @Created by    : smartData
 */

import { createReducer } from "../utils";
import { MISC_CONST } from "../actions/constants";

const initialState = {
  // profileComplete: null,
  profileComplete: 0,
  surveyPending: 0,
  userInterest: null,
};

export default createReducer(initialState, {
  [MISC_CONST.PROFILE_COMPLETE]: (state, payload) => {
    return Object.assign({}, state, {
      profileComplete: payload,
    });
  },
  [MISC_CONST.SURVEY_PENDING]: (state, payload) => {
    return Object.assign({}, state, {
      surveyPending: payload,
    });
  },
  [MISC_CONST.USER_INTEREST]: (state, payload) => {
    return Object.assign({}, state, {
      userInterest: payload,
    });
  },
  [MISC_CONST.USER_COUNTS]: (state, payload) => {
    return Object.assign({}, state, {
      moduleCounts: payload,
    });
  },
});
