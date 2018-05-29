/**
 * @reducer       : FullHealthHistoryReducer
 * @description   : handle all request and response for the user actions
 * @Created by    : smartData
 */

import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";

const initialState = {
  "isRequesting": false,
  "isError": false,
  "isSuccess": false,
  "data": null,
};

export default createReducer(initialState, {
  [PATIENT_CONST.FULL_PROFILE_GROUP_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "statusText": null,
      "isError": false,
      "isSuccess": false,
    });
  },
  [PATIENT_CONST.FULL_PROFILE_GROUP_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
      "isError": false,
    });
  },
  [PATIENT_CONST.FULL_PROFILE_GROUP_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
      "data": null,
    });
  },
  [PATIENT_CONST.FULL_PROFILE_GROUP_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": false,
      "data": null,
    });
  },
});
