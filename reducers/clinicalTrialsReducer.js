import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  "isRequesting": false,
  "isError": false,
  "isSuccess": false,
  "data": null,
  "isSaveRequesting": false,
  "isSaveError": false,
  "isSaveSuccess": false,
  "errData": null,

};

export default createReducer(initialState, {
  [PATIENT_CONST.CLINICAL_TRIALS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "statusText": null,
      "errData": null,
    });
  },
  [PATIENT_CONST.CLINICAL_TRIALS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
      "errData": null,
    });
  },
  [PATIENT_CONST.CLINICAL_TRIALS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
      "errData": null,
    });
  },
  [PATIENT_CONST.CLINICAL_TRIALS_SAVE_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaveRequesting": true,
      "isSaveError": false,
      "isSaveSuccess": false,
      "errData": null,
    });
  },
  [PATIENT_CONST.CLINICAL_TRIALS_SAVE_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaveRequesting": false,
      "isSaveError": false,
      "isSaveSuccess": true,
      "data": payload,
      "errData": null,
    });
  },
  [PATIENT_CONST.CLINICAL_TRIALS_SAVE_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaveRequesting": false,
      "isSaveError": true,
      "isSaveSuccess": false,
      "errData": payload,
      "data": null,
    });
  },
  [PATIENT_CONST.CLINICAL_TRIALS_SAVE_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isSaveRequesting": false,
      "isSaveError": false,
      "isSaveSuccess": false,
      "isRequesting": false,
      "isError": false,
      "isSuccess": false,
      "errData": null,
    });
  },
});
