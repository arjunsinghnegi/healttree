import { AUTH_CONST } from "../actions/constants";
import { createReducer } from "../utils";
const initialState = {
  isRequesting: false,
  isError: false,
  isSuccess: false,
  data: null,
  errMessage: null,
};

export default createReducer(initialState, {
  [AUTH_CONST.CHANGE_PASSWORD_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "isSuccess": false,
      "isError": false,
      "data": null,
      "errMessage": null,
    });
  },
  [AUTH_CONST.CHANGE_PASSWORD_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "isError": false,
      "data": payload,
      "errMessage": null,
    });
  },
  [AUTH_CONST.CHANGE_PASSWORD_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
      "data": null,
      "errMessage": payload,
    });
  },
  [AUTH_CONST.CHANGE_PASSWORD_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": false,
      "data": null,
      "errMessage": null,
    });
  },
});
