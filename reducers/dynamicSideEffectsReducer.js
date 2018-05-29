import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  "isRequesting": false,
  "isError": false,
  "isSuccess": false,
  "data": null,
};

export default createReducer(initialState, {
  [PATIENT_CONST.DYNAMIC_SIDE_EFFECTS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "statusText": null,
    });
  },
  [PATIENT_CONST.DYNAMIC_SIDE_EFFECTS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
    });
  },
  [PATIENT_CONST.DYNAMIC_SIDE_EFFECTS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
    });
  },
});
