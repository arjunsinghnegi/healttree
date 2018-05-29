import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  isRequesting: false,
  isError: false,
  isSuccess: false,
  data: null,
  isUpdateSuccess: false,
};
export default createReducer(initialState, {
  [PATIENT_CONST.GET_HLTH_HISTRY_OPTIONS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "statusText": null,
      "isUpdateSuccess": false,
    });
  },
  [PATIENT_CONST.GET_HLTH_HISTRY_OPTIONS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
      "isUpdateSuccess": false,
    });
  },
  [PATIENT_CONST.GET_HLTH_HISTRY_OPTIONS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
      "isUpdateSuccess": false,
    });
  },
  [PATIENT_CONST.HLTH_HISTRY_UPDATE_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "updatedata": payload,
      "isUpdateSuccess": true,
    });
  },
  [PATIENT_CONST.HLTH_HISTRY_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isError": false,
      "isSuccess": false,
      "data": payload,
      "isUpdateSuccess": false,
    });
  },
});
