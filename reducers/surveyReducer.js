import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  "isRequesting": false,
  "isError": false,
  "isSuccess": false,
  "data": null,
  "isQuestionRequesting": false,
  "isQuestionError": false,
  "isQuestionSuccess": false,
  "questions": null,
};

export default createReducer(initialState, {
  [PATIENT_CONST.SURVEY_FETCH_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "isSuccess": false,
      "isError": false,
      "data": null,
    });
  },
  [PATIENT_CONST.SURVEY_FETCH_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "isError": false,
      "data": payload,
    });
  },
  [PATIENT_CONST.SURVEY_FETCH_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
      "data": null,
    });
  },
  [PATIENT_CONST.SURVEY_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": false,
      "isQuestionRequesting": false,
      "isQuestionError": false,
      "isQuestionSuccess": false,
    });
  },
  [PATIENT_CONST.SURVEY_QUESTION_FETCH_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isQuestionRequesting": true,
      "isQuestionError": false,
      "isQuestionSuccess": false,
      "questions": null,
    });
  },
  [PATIENT_CONST.SURVEY_QUESTION_FETCH_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isQuestionRequesting": false,
      "isQuestionError": false,
      "isQuestionSuccess": true,
      "questions": payload,
    });
  },
  [PATIENT_CONST.SURVEY_QUESTION_FETCH_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isQuestionRequesting": false,
      "isQuestionError": true,
      "isQuestionSuccess": false,
      "questions": null,
    });
  },
  [PATIENT_CONST.SURVEY_QUESTION_RESET]: (state, payload) => {
    console.log("i survey reset");
    return Object.assign({}, state, {
      "isQuestionRequesting": false,
      "isQuestionError": false,
      "isQuestionSuccess": false,
      "isRequesting": false,
      "isError": false,
      "isSuccess": false,
      "data": null,
      // "questions": null,
    });
  },
});
