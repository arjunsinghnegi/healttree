/**
 * @reducer       : login reducer
 * @description   :
 * @Created by    : smartData
 */


import { AUTH_CONST } from "../actions/constants";
import { createReducer } from "../utils";

const initialState = {
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusCode: null,
  statusText: null,
  email: null,
  password: null,
  homeContent: null,
  dtree: false,
  userinfo: [],
};

export default createReducer(initialState, {
  [AUTH_CONST.REGISTER_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "isAuthenticated": false,
      "statusText": null,
      "token": null,
      "dtree": false,
    });
  },
  [AUTH_CONST.REGISTER_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": true,
      "token": payload.response.data ? payload.response.data.key : null,
      "userinfo": payload.response.data ? payload.response.data.user : null,
      "statusText": null,
      "dtree": true,
    });
  },
  [AUTH_CONST.REGISTER_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": false,
      "statusText": payload.error.statusText,
      "token": null,
      "dtree": false,
    });
  },
  [AUTH_CONST.LOGIN_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "isAuthenticated": false,
      "statusText": null,
      "token": null,
    });
  },
  [AUTH_CONST.LOGIN_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": true,
      "statusText": null,
      "token": payload.response.data ? payload.response.data.key : null,
      "userinfo": payload.response.data ? payload.response.data.user : null,
    });
  },
  [AUTH_CONST.LOGIN_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": false,
      "statusText": payload.error.statusText,
      "token": null,
    });
  },
  [AUTH_CONST.LOGOUT]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": true,
      "token": null,
      "statusText": null,
      "dtree": false,
    });
  },
  [AUTH_CONST.FORGOT_PASSWORD_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "isAuthenticated": false,
      "statusText": null,
      "token": null,
    });
  },
  [AUTH_CONST.FORGOT_PASSWORD_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": true,
      "statusText": payload.response.statusText,
    });
  },
  [AUTH_CONST.FORGOT_PASSWORD_FAILURE]: (state, payload) => {
    console.log("mm-----", payload);
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": false,
      "statusText": payload.error.statusText,
    });
  },
  [AUTH_CONST.RESET_PASSWORD_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "isAuthenticated": false,
      "statusCode": null,
      "statusText": null,
    });
  },
  [AUTH_CONST.RESET_PASSWORD_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": true,
      "statusCode": payload.response.statusCode,
      "statusText": payload.response.statusText,
    });
  },
  [AUTH_CONST.RESET_PASSWORD_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "isAuthenticated": false,
      "statusCode": payload.error.statusCode,
      "statusText": payload.error.statusText,
    });
  },
  [AUTH_CONST.STATUS_UPDATE]: (state, payload) => {
    return Object.assign({}, state, {
      "statusText": null,
    });
  },
  [AUTH_CONST.GET_HOME_CONTENT_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "statusCode": null,
      "homeContent": null,
    });
  },
  [AUTH_CONST.GET_HOME_CONTENT_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "statusCode": payload.response.statusCode,
      "homeContent": payload.response.data,
    });
  },
  [AUTH_CONST.GET_HOME_CONTENT_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "statusCode": payload.error.statusCode,
      "homeContent": null,
    });
  },
});
