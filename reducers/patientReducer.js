/**
 * @reducer       : user reducer
 * @description   : handle all request and response for the user actions
 * @Created by    : smartData
 */

import { createReducer } from "../utils";
import { PATIENT_CONST } from "../actions/constants";

const initialState = {
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusCode: null,
  statusText: null,
  myelomaCenters: [],
  isAuthenticatingMyelomaCenter: false,
  isFetching: false,
  isError: false,
  isSuccess: false,
  isSavingSuccess: false,
};

export default createReducer(initialState, {
  [PATIENT_CONST.PATIENT_RESET]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": null,
      "isSavingSuccess": false,
      "isSuccess": false,
      "isAuthenticated": false,
      "isFetching": false,
      "isError": false,
    });
  },
  [PATIENT_CONST.GET_PATIENT_INFO_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "statusText": null,
      "patientinfo": null,
      "isSavingSuccess": false,
      "isSuccess": false,
      "isAuthenticated": false,
    });
  },
  [PATIENT_CONST.GET_PATIENT_INFO_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": null,
      "patientinfo": payload,
      "isSavingSuccess": false,
      "isSuccess": true,
      "isAuthenticated": true,
    });
  },
  [PATIENT_CONST.GET_PATIENT_INFO_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": payload,
      "isSavingSuccess": false,
      "isSuccess": true,
      "isAuthenticated": false,
    });
  },
  [PATIENT_CONST.SAVE_PATIENT_INFO_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "statusText": null,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.SAVE_PATIENT_INFO_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": null,
      "isSavingSuccess": true,
    });
  },
  [PATIENT_CONST.SAVE_PATIENT_INFO_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": payload,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.GET_MYELOMA_CENTERS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticatingMyelomaCenter": true,
      "statusText": null,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.GET_MYELOMA_CENTERS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticatingMyelomaCenter": false,
      "statusText": null,
      "myelomaCenters": payload,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.GET_MYELOMA_CENTERS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticatingMyelomaCenter": false,
      "statusText": payload,
    });
  },
  [PATIENT_CONST.GET_MYMYELOMA_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "statusText": null,
      "myMyeloma": payload,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.GET_MYMYELOMA_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "statusText": null,
      "myMyeloma": typeof(payload) === "object" ? payload.attributes : {},
      "myMyelomaId": typeof(payload) === "object" ? payload.id : null,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.GET_MYMYELOMA_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "statusText": payload,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.SAVE_MYMYELOMA_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "statusText": null,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.SAVE_MYMYELOMA_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": null,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.SAVE_MYMYELOMA_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": payload,
      "isSavingSuccess": false,
    });
  },
  [PATIENT_CONST.GET_FITNESS_LEVEL_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticatingFitnessLevel": true,
      "statusText": null,
      "fitnessLevel": payload,
    });
  },
  [PATIENT_CONST.GET_FITNESS_LEVEL_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticatingFitnessLevel": false,
      "statusText": null,
      "fitnessLevel": typeof(payload) === "object" ? payload.attributes : {},
      "fitnessLevelId": typeof(payload) === "object" ? payload.id : null,
    });
  },
  [PATIENT_CONST.GET_FITNESS_LEVEL_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticatingFitnessLevel": false,
      "statusText": payload,
    });
  },
  [PATIENT_CONST.SAVE_FITNESS_LEVEL_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": true,
      "statusText": null,
    });
  },
  [PATIENT_CONST.SAVE_FITNESS_LEVEL_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": false,
      "isSuccess": true,
      "sideEffects": payload,
    });
  },
  [PATIENT_CONST.SAVE_FITNESS_LEVEL_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isAuthenticating": false,
      "statusText": payload,
    });
  },
  [PATIENT_CONST.GET_MY_SIDE_EFFECTS_API]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": true,
      "statusText": null,
    });
  },
  [PATIENT_CONST.GET_MY_SIDE_EFFECTS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": false,
      "isSuccess": true,
      "sideEffects": payload,
    });
  },
  [PATIENT_CONST.GET_MY_SIDE_EFFECTS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": false,
      "isSuccess": true,
      "isError": true,
    });
  },
  [PATIENT_CONST.GET_MY_TREATMENTS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": true,
      "statusText": null,
    });
  },
  [PATIENT_CONST.GET_MY_TREATMENTS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": false,
      "statusText": null,
      "treatments": payload,
    });
  },
  [PATIENT_CONST.GET_MY_TREATMENTS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": false,
      "isSuccess": false,
      "isError": true,
    });
  },
  [PATIENT_CONST.GET_REMISSION_STATUS_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": true,
      "statusText": null,
    });
  },
  [PATIENT_CONST.GET_REMISSION_STATUS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": false,
      "statusText": null,
      "remissions": payload,
    });
  },
  [PATIENT_CONST.GET_REMISSION_STATUS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      "isFetching": false,
      "isSuccess": false,
      "isError": true,
    });
  },
  // [PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_REQUEST]: (state, payload) => {
  //   return Object.assign({}, state, {
  //     "isFetching": true,
  //     "statusText": null,
  //   });
  // },
  // [PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_SUCCESS]: (state, payload) => {
  //   return Object.assign({}, state, {
  //     "isFetching": false,
  //     "isSuccess": true,
  //     "statusText": null,
  //   });
  // },
  // [PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_FAILURE]: (state, payload) => {
  //   return Object.assign({}, state, {
  //     "isFetching": false,
  //     "isSuccess": true,
  //     "isError": true,
  //     "statusText": payload,
  //   });
  // },
});
