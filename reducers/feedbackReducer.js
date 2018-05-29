import { createReducer } from "../utils";
import { FEEDBACK_CONST } from "../actions/constants";
const initialState = {
  isRequesting: false,
  isError: false,
  isSuccess: false,
  data: null,
};

export default createReducer(initialState, {
  [FEEDBACK_CONST.FEEDBACK_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "statusText": null,
    });
  },
  [FEEDBACK_CONST.FEEDBACK_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
    });
  },
  [FEEDBACK_CONST.FEEDBACK_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
    });
  },
  [FEEDBACK_CONST.FEEDBACK_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": false,
      "data": null,
    });
  },
});
