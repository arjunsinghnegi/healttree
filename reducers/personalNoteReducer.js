import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  isRequesting: false,
  isError: false,
  isSuccess: false,
  data: null,
  isGetRequest: false,
  isGetSuccess: false,
  isGetError: false,
  noteData: null,
};

export default createReducer(initialState, {
  [PATIENT_CONST.TREATMENT_NOTE_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "statusText": null,
    });
  },
  [PATIENT_CONST.TREATMENT_NOTE_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
    });
  },
  [PATIENT_CONST.TREATMENT_NOTE_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
    });
  },
  [PATIENT_CONST.TREATMENT_PRSNLNOTE_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isError": false,
      "isSuccess": false,
      "data": null,
      "isGetRequest": true,
      "isGetSuccess": false,
      "isGetError": false,
      "noteData": null,
    });
  },
  [PATIENT_CONST.TREATMENT_PRSNLNOTE_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isError": false,
      "isSuccess": false,
      "data": null,
      "isGetRequest": false,
      "isGetSuccess": true,
      "isGetError": false,
      "noteData": payload,
    });
  },
  [PATIENT_CONST.TREATMENT_PRSNLNOTE_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isError": false,
      "isSuccess": false,
      "data": null,
      "isGetRequest": false,
      "isGetSuccess": false,
      "isGetError": true,
      "noteData": null,
    });
  },
});
