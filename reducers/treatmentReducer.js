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
  treatmentReq: false,
  treatmentSuccess: false,
  treamentFail: false,
  treatmentList: null,
};

export default createReducer(initialState, {
  [PATIENT_CONST.PATIENT_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      isRequesting: false,
      isError: false,
      isSuccess: false,
      isDeleted: false,
      isDeleting: false,
      isDeleteError: false,
    });
  },
  [PATIENT_CONST.SAVE_MY_TREATMENTS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "isError": false,
      "isSuccess": false,
    });
  },
  [PATIENT_CONST.SAVE_MY_TREATMENTS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
    });
  },
  [PATIENT_CONST.SAVE_MY_TREATMENTS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
    });
  },
  [PATIENT_CONST.DELETE_MY_TREATMENTS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isDeleted": false,
      "isDeleting": true,
      "isDeleteError": false,
    });
  },
  [PATIENT_CONST.DELETE_MY_TREATMENTS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isDeleted": true,
      "isDeleting": false,
      "isDeleteError": false,
      "del_id": payload,
    });
  },
  [PATIENT_CONST.DELETE_MY_TREATMENTS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isDeleted": false,
      "isDeleting": false,
      "isDeleteError": true,
    });
  },
  [PATIENT_CONST.DYNAMIC_TREATMENT_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      treatmentReq: true,
      treatmentSuccess: false,
      treamentFail: false,
      treatmentList: null,
    });
  },
  [PATIENT_CONST.DYNAMIC_TREATMENT_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      treatmentReq: false,
      treatmentSuccess: true,
      treamentFail: false,
      treatmentList: payload,
    });
  },
  [PATIENT_CONST.DYNAMIC_TREATMENT_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      treatmentReq: false,
      treatmentSuccess: false,
      treamentFail: true,
      treatmentList: payload,
    });
  },
});
