/**
 * @reducer       : user reducer
 * @description   : handle all request and response for the user actions
 * @Created by    : smartData
 */

import { createReducer } from "../utils";
import { USER_CONST } from "../actions/constants";

const initialState = {
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusCode: null,
  statusText: null,
  userinfo: [],
  activeLink: null,
  isSaving: false,
  isSaved: false,
  isSavingError: false,
  serverErr: null,
};

export default createReducer(initialState, {
  [USER_CONST.GET_USER_INFO_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "isAuthenticated": false,
      "statusText": null,
      "isSaving": false,
      "isSaved": false,
      "isSavingError": false,
      "serverErr": null,
    });
  },
  [USER_CONST.GET_USER_INFO_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": true,
      "statusText": null,
      "userinfo": payload.response.data,
      "isSaving": false,
      "isSaved": false,
      "isSavingError": false,
      "serverErr": null,
    });
  },
  [USER_CONST.GET_USER_INFO_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": false,
      "statusText": payload,
      "isSaving": false,
      "isSaved": false,
      "isSavingError": false,
      "serverErr": null,
    });
  },
  // save user data
  [USER_CONST.SAVE_USER_INFO_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaving": true,
      "isSaved": false,
      "isSavingError": false,
      "isAuthenticating": false,
      "statusText": null,
      "serverErr": null,
    });
  },
  [USER_CONST.SAVE_USER_INFO_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaving": false,
      "isSaved": true,
      "isSavingError": false,
      "isAuthenticating": false,
      "statusText": null,
      "serverErr": null,
    });
  },
  [USER_CONST.SAVE_USER_INFO_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaving": false,
      "isSaved": false,
      "isSavingError": true,
      "isAuthenticating": false,
      "statusText": null,
      "serverErr": payload,
    });
  },
  [USER_CONST.RESET_USER_INFO]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaving": false,
      "isSaved": false,
      "isSavingError": false,
      "isAuthenticating": false,
      "isAuthenticated": false,
      "statusText": null,
      "serverErr": null,
    });
  },
});
