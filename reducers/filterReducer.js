import { createReducer } from "../utils";
import { FILTER_CONST } from "../actions/constants";
const initialState = {
  isRequesting: false,
  isError: false,
  isSuccess: false,
  data: null,
};

export default createReducer(initialState, {
  [FILTER_CONST.FILTER_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "isSuccess": false,
      "isError": false,
      "data": null,
    });
  },
  [FILTER_CONST.FILTER_SUCCESS]: (state, payload) => {
    console.log("i am here")
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "isError": false,
      "data": payload,
    });
  },
  [FILTER_CONST.FILTER_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
      "data": null,
    });
  },
  [FILTER_CONST.FILTER_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": false,
      "data": null,
    });
  },
});
