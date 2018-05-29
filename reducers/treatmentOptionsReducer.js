import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";
const initialState = {
  "isRequesting": false,
  "isError": false,
  "isSuccess": false,
  "data": null,
  "isLegendRequesting": false,
  "isLegendSuccess": false,
  "legends": null,
  "isLegendError": false,
};

export default createReducer(initialState, {
  [PATIENT_CONST.TREATMENT_OPTIONS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": true,
      "isSuccess": false,
      "isError": false,
      "data": null,
    });
  },
  [PATIENT_CONST.TREATMENT_OPTIONS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": true,
      "isError": false,
      "data": payload,
    });
  },
  [PATIENT_CONST.TREATMENT_OPTIONS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": true,
      "data": null,
    });
  },
  [PATIENT_CONST.TREATMENT_OPTIONS_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isRequesting": false,
      "isSuccess": false,
      "isError": false,
      "data": null,
    });
  },
  [PATIENT_CONST.TREATMENT_LEGENDS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isLegendRequesting": true,
      "isLegendSuccess": false,
      "legends": null,
      "isLegendError": false,
    });
  },
  [PATIENT_CONST.TREATMENT_LEGENDS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isLegendRequesting": false,
      "isLegendSuccess": true,
      "legends": payload,
      "isLegendError": false,
    });
  },
  [PATIENT_CONST.TREATMENT_LEGENDS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isLegendRequesting": false,
      "isLegendSuccess": false,
      "legends": null,
      "isLegendError": true,
    });
  },
  [PATIENT_CONST.TREATMENT_LEGENDS_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isLegendRequesting": false,
      "isLegendSuccess": false,
      "legends": null,
      "isLegendError": false,
    });
  },
});
