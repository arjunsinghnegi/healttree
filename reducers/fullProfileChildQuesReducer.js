import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  isRequesting: false,
  isError: false,
  isSuccess: false,
  data: null,
};
export default createReducer(initialState, {
  [PATIENT_CONST.CHILD_QUESTION_FETCH_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "isUpdateSuccess": false,
      "data": null,
      "isError": false,
    });
  },
  [PATIENT_CONST.CHILD_QUESTION_FETCH_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "data": payload,
      "isError": false,
    });
  },
  [PATIENT_CONST.CHILD_QUESTION_FETCH_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isUpdateSuccess": false,
      "data": null,
      "isError": true,
    });
  },
  [PATIENT_CONST.CHILD_QUESTION_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isError": false,
      "isSuccess": false,
      "data": payload,
    });
  },
});
