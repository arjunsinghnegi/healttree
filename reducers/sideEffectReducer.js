import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  isRequesting: false,
  isError: false,
  isSuccess: false,
  data: null,
  isDeleted: false,
  isDeleting: false,
  isDeleteError: false,
};

export default createReducer(initialState, {
  [PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "statusText": null,
    });
  },
  [PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
    });
  },
  [PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
    });
  },
  [PATIENT_CONST.DELETE_SIDE_EFFECT_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isDeleted": false,
      "isDeleting": true,
      "isDeleteError": false,
    });
  },
  [PATIENT_CONST.DELETE_SIDE_EFFECT_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isDeleted": true,
      "isDeleting": false,
      "isDeleteError": false,
      "del_id": payload,
    });
  },
  [PATIENT_CONST.DELETE_SIDE_EFFECT_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isDeleted": false,
      "isDeleting": false,
      "isDeleteError": true,
    });
  },
});
