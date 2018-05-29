
/**
 * @action        : PatientsActions
 * @description   : Handles Patient actions
 * @Created by    : smartData
 */

import { AXIOS_INSTANCE,
  FORM_UPLOAD_API,
  GET_ABOUT_ME_API,
  GET_FITNESS_LEVEL_API,
  GET_MY_SIDE_EFFECTS_API,
  GET_MY_TREATMENTS_API,
  GET_MYELOMA_API,
  GET_MYELOMA_CENTERS_API,
  GET_REMISSION_STATUS_API,
  PATIENT_CONST,
} from "./constants";
import { changeProfileComplete, changeSurvey } from "./miscActions.js";
import { checkHttpStatus, parseJSON } from "../utils";

import base64 from "base-64";
import { browserHistory } from "react-router";
import moment from "moment";

// handle state when request is send and resposen is awaited
export function getRequest(REQUEST) {
  return {
    type: REQUEST,
  };
}

// handle state in case of resposen is success
export function getSuccess(SUCCESS, data) {
  return {
    type: SUCCESS,
    payload: data,
  };
}

// handle state in case of resposen is failure
export function getFailure(FAILURE, error) {
  return {
    type: FAILURE,
    payload: error,
  };
}
export function reset(RESET) {
  return {
    type: RESET,
  };
}

export function resetPatient(token) {
  return function(dispatch) {
    dispatch(reset(PATIENT_CONST.PATIENT_RESET));
  };
}

/**
 * [getPatientInfo - get patient information]
 * @param  {[type]} token [access token]
 * @return {[type]}       [description]
 */
export function getPatientInfo(token) {
  return function(dispatch) {

    dispatch(getRequest(PATIENT_CONST.GET_PATIENT_INFO_REQUEST));
    let config = { "headers": { "Authorization": token } };

    AXIOS_INSTANCE.get(GET_ABOUT_ME_API, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        if (success.meta && success.meta.profile_complete_percentage) {
          let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
          dispatch(changeProfileComplete(percentage));
        }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
        let patientAttributes = success.data[0].attributes;
        patientAttributes.gender = (patientAttributes.gender) ? patientAttributes.gender : "female";
        patientAttributes.ssn = (success.data[0].attributes.ssn) ? base64.decode(base64.decode(success.data[0].attributes.ssn)) : 0;
        patientAttributes.portal_url = (success.data[0].attributes.portal_url) ? base64.decode(base64.decode(success.data[0].attributes.portal_url)) : "";
        patientAttributes.portal_username = (success.data[0].attributes.portal_username) ? base64.decode(base64.decode(success.data[0].attributes.portal_username)) : "";
        patientAttributes.portal_password = "";
        let patientId = success.data[0].id;
        patientAttributes["id"] = patientId;
        console.log("patientAttributes", patientAttributes);
        dispatch(getSuccess(PATIENT_CONST.GET_PATIENT_INFO_SUCCESS, patientAttributes));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.GET_PATIENT_INFO_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/**
 * [savePatientInfo - save and update patient"s basic information - About me page]
 * @param  {[type]} token       [access token]
 * @param  {[type]} formData    [first_name, last_name, gender etc.]
 * @param  {[type]} patientInfo [for already saved patient data - to update patient]
 * @param  {[type]} userId      [login user's id]
 * @return {[type]}             [description]
 */
export function savePatientInfo(token, data, patientInfo, userId) {

  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SAVE_PATIENT_INFO_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let postData = {};
    if (patientInfo.id) {
      postData = { data: {
        type: "patient_infos",
        id: (patientInfo.id),
        attributes: data,
      },
      };
    } else {
      postData = { data: {
        type: "patient_infos",
        id: (patientInfo.id),
        attributes: data,
        "relationships": {
          "user": {
            "data": { "type": "users", "id": userId },
          },
        },
      },
      };
    }


    let APICALL = patientInfo.id ? AXIOS_INSTANCE.put(`${GET_ABOUT_ME_API}/${patientInfo.id}`, postData, config) : AXIOS_INSTANCE.post(GET_ABOUT_ME_API, postData, config) ;

    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.SAVE_PATIENT_INFO_SUCCESS, {
          response: {
            statusCode: 200,
            statusText: null,
            data: success.data,
          } }));

      })
      .catch(function(error) {
      // console.log("error - ", error);
        dispatch(getFailure(PATIENT_CONST.SAVE_PATIENT_INFO_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/**
 * [getMyelomaCenters - get myeloma centers based on zipcode]
 * @param  {[type]} token   [access token]
 * @param  {[type]} zipcode [description]
 * @return {[type]}         [description]
 */
export function getMyelomaCenters(token, zipcode) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.GET_MYELOMA_CENTERS_REQUEST));
    let config = { "headers": { "Authorization": token } };

    let axios = (zipcode) ? AXIOS_INSTANCE.get(`${GET_MYELOMA_CENTERS_API}?filter[zipcode]=${zipcode}`, config)
      : AXIOS_INSTANCE.get(`${GET_MYELOMA_CENTERS_API}`, config);
    axios.then(checkHttpStatus)
      .then(parseJSON)
      .then(function (success) {
        dispatch(getSuccess(PATIENT_CONST.GET_MYELOMA_CENTERS_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.GET_MYELOMA_CENTERS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}


/**
 * [getMyMyeloma - get my-myeloma page data]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
export function getMyMyeloma(token) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.GET_MYMYELOMA_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(GET_MYELOMA_API, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        let tmpData = {
          "attributes": {
            "first_diagnosed_date": null,
            "initial_diagnosis": null,
            "bone_lesions": "0",
          },

        };
        let myelomaData = success.data.length > 0 ? success.data[0] : tmpData;
        dispatch(getSuccess(PATIENT_CONST.GET_MYMYELOMA_SUCCESS, myelomaData));
        // misc actions
        if (success.meta && success.meta.profile_complete_percentage) {
          let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
          dispatch(changeProfileComplete(percentage));
        }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.GET_MYMYELOMA_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/**
 * [saveMyMyeloma description]
 * @param  {[type]} token       [description]
 * @param  {[type]} myMyelomaId [description]
 * @param  {[type]} formData    [description]
 * @param  {[type]} userId      [description]
 * @param  {[type]} refPage     [description]
 * @return {[type]}             [description]
 */
export function saveMyMyeloma(token, myMyelomaId, formData, userId, refPage) {

  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SAVE_MYMYELOMA_REQUEST));
    let config = { "headers": { "Authorization": token } };

    let postData = {
      data: {
        type: "myelomas",
        id: myMyelomaId,
        attributes: formData,
        relationships: {
          user: {
            data: {
              id: userId,
              type: "users",
            } } } } };

    let APICALL = (myMyelomaId === undefined) ? AXIOS_INSTANCE.post(GET_MYELOMA_API, postData, config) :
      AXIOS_INSTANCE.patch(`${GET_MYELOMA_API}/${myMyelomaId}`, postData, config);
    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.SAVE_MYMYELOMA_SUCCESS, {
          response: {
            statusCode: 200,
            statusText: null,
            data: success.data,
          } }));
        // if (refPage === "MYELOMA_MORE") {
        //   dispatch(getMyMyeloma(token));
        //   browserHistory.push("/my-myeloma-more");
        // }
        // if (refPage === "health-history") {
        browserHistory.push("/current-history");
        // }
      })
      .catch(function(error) {
        console.log("error - ", error);
        dispatch(getFailure(PATIENT_CONST.SAVE_MYMYELOMA_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/**
 * [getFitnessLevel description]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
export function getFitnessLevel(token) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.GET_FITNESS_LEVEL_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(GET_FITNESS_LEVEL_API, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        // 0=> false, 1=>true, 3=>hide

        let data = success.data;
        let tmpData = {};
        let tmpArr = [];
        if (success.data.length) {
          data.map(function(obj, key) {
            if (parseInt(key) === 0) {
              obj.attributes.isVisible = true;
            } else {
              if (obj.attributes.value === null) {
                obj.attributes.isVisible = false;
              } else {
                obj.attributes.isVisible = true;
              }
            }
            obj.attributes.id = obj.id;
            tmpArr.push(obj.attributes);
          });

          tmpData = {
            "attributes": {
              fitnessLevel: tmpArr,
            },

          };
        }
        // console.log("**** tmpData ****", tmpData);
        // let myelomaData = success.data.length > 0 ? success.data[0] : tmpData;
        dispatch(getSuccess(PATIENT_CONST.GET_FITNESS_LEVEL_SUCCESS, tmpData));

        // misc actions
        if (success.meta && success.meta.profile_complete_percentage) {
          let percentage = (success.meta.profile_complete_percentage) ? success.meta.profile_complete_percentage : {};
          dispatch(changeProfileComplete(percentage));
        }
        if (success.meta && success.meta.avail_surveys) {
          dispatch(changeSurvey(success.meta.avail_surveys));
        }
      })
      .catch(function(error) {
        console.log("**** error ****", error);
        dispatch(getFailure(PATIENT_CONST.GET_FITNESS_LEVEL_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/**
 * [saveFitnessLevel -- save FitnessLevel form data]
 * @param  {[type]} token       [access token]
 * @param  {[type]} myMyelomaId [description]
 * @param  {[type]} formData    [description]
 * @param  {[type]} userId      [description]
 * @param  {[type]} refPage     [description]
 * @return {[type]}             [description]
 */
export function saveFitnessLevel(token, fitnessLevelId, formData, userId, refPage) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SAVE_FITNESS_LEVEL_REQUEST));
    let config = { "headers": { "Authorization": token } };
    // let postData = {
    //   data: {
    //     type: "fitness_levels",
    //     attributes: formData,
    //     relationships: {
    //       user: {
    //         data: {
    //           id: userId,
    //           type: "users",
    //         },
    //       },
    //     },
    //   },
    // };
    // if (fitnessLevelId && fitnessLevelId !== null) {
    //   postData.data.id = fitnessLevelId;
    // }
    let postData = formData;
    let APICALL = (!fitnessLevelId || fitnessLevelId === null) ? AXIOS_INSTANCE.post(GET_FITNESS_LEVEL_API, postData, config) :
      AXIOS_INSTANCE.put(`${GET_FITNESS_LEVEL_API}/${fitnessLevelId}`, postData, config);
    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.SAVE_FITNESS_LEVEL_SUCCESS, {
          response: {
            statusCode: 200,
            statusText: null,
            data: success.data,
          } }));
        // dispatch(getMyMyeloma(token));
        browserHistory.push(refPage);
      })
      .catch(function(error) {
        console.log("error - ", error);
        dispatch(getFailure(PATIENT_CONST.SAVE_FITNESS_LEVEL_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function getTreatments(token) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.GET_MY_TREATMENTS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(GET_MY_TREATMENTS_API, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.GET_MY_TREATMENTS_SUCCESS, success.data));
      })
      .catch(function(error) {
        console.log("errroro", error);
        dispatch(getFailure(PATIENT_CONST.GET_MY_TREATMENTS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function removeTreatments(token, id) {
  // console.log(token, " inside remove my treatments", id);
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.DELETE_MY_TREATMENTS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.delete(`${GET_MY_TREATMENTS_API}/${id}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.DELETE_MY_TREATMENTS_SUCCESS, id));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.DELETE_MY_TREATMENTS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}


export function getMySideEffects(token) {
  // console.log("GET_MY_SIDE_EFFECTS_API", GET_MY_SIDE_EFFECTS_API);
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.GET_MY_SIDE_EFFECTS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(GET_MY_SIDE_EFFECTS_API, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.GET_MY_SIDE_EFFECTS_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.GET_MY_SIDE_EFFECTS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function saveMySideEffects(token, sideEffectId, formData, userId, refPage) {

  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let postData = {
      data: {
        type: "side_effects",
        attributes: {
          start_date: moment(formData.start_date).format("YYYY-MM-DD"),
          end_date: moment(formData.end_date).format("YYYY-MM-DD"),
          side_effect: formData.side_effect_code.value,
          severity: formData.severity,
          patient_treatment_id: formData.patient_treatment_id,
        },
        relationships: {
          user: {
            data: {
              id: userId,
              type: "users",
            } } } } };
    if (sideEffectId) {
      postData["data"]["id"] = sideEffectId;
    }

    let APICALL = (sideEffectId ? AXIOS_INSTANCE.patch(`${GET_MY_SIDE_EFFECTS_API}/${sideEffectId}`, postData, config) : AXIOS_INSTANCE.post(GET_MY_SIDE_EFFECTS_API, postData, config));

    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_SUCCESS, success.data));
        if (refPage === "MYELOMA") {
          dispatch(getMyMyeloma(token));
          browserHistory.push("/my-myeloma-more");
        }
        if (refPage === "health-history") {
          browserHistory.push("/health-history");
        }
      })
      .catch(function(error) {
        console.log("error - ", error);
        dispatch(getFailure(PATIENT_CONST.SAVE_MY_SIDE_EFFECTS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/* Delete my side effects start */
export function removeMySideEffect(token, id) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.DELETE_SIDE_EFFECT_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.delete(`${GET_MY_SIDE_EFFECTS_API}/${id}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.DELETE_SIDE_EFFECT_SUCCESS, id));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.DELETE_SIDE_EFFECT_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}
/* Delete my side effects end */

export function getRemissionStatus(token) {
  // console.log("GET_MY_SIDE_EFFECTS_API", GET_MY_SIDE_EFFECTS_API);
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.GET_REMISSION_STATUS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.get(GET_REMISSION_STATUS_API, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.GET_REMISSION_STATUS_SUCCESS, success.data));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.GET_REMISSION_STATUS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function saveRemissionStatus(token, sideEffectId, formData, userId, refPage) {

  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.SAVE_REMISSION_STATUS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    let postData = {
      data: {
        type: "remissions",
        attributes: {
          start_date: moment(formData.start_date).format("YYYY-MM-DD"),
          end_date: moment(formData.end_date).format("YYYY-MM-DD"),
          outcome: parseInt(formData.outcome_code),
          cells_no: formData.cells_no,
        },
        relationships: {
          user: {
            data: {
              id: userId,
              type: "users",
            } } } } };
    if (sideEffectId) {
      postData["data"]["id"] = sideEffectId;
    }

    let APICALL = (sideEffectId ? AXIOS_INSTANCE.patch(`${GET_REMISSION_STATUS_API}/${sideEffectId}`, postData, config) : AXIOS_INSTANCE.post(GET_REMISSION_STATUS_API, postData, config));

    APICALL.then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.SAVE_REMISSION_STATUS_SUCCESS, success.data));
        if (refPage === "MYELOMA") {
          dispatch(getMyMyeloma(token));
          browserHistory.push("/my-myeloma-more");
        }
        if (refPage === "health-history") {
          browserHistory.push("/health-history");
        }
      })
      .catch(function(error) {
        console.log("error - ", error);
        dispatch(getFailure(PATIENT_CONST.SAVE_REMISSION_STATUS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

/* Delete my side effects start */
export function removeRemissionStatus(token, id) {
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.DELETE_REMISSION_STATUS_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.delete(`${GET_REMISSION_STATUS_API}/${id}`, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.DELETE_REMISSION_STATUS_SUCCESS, id));
      })
      .catch(function(error) {
        dispatch(getFailure(PATIENT_CONST.DELETE_REMISSION_STATUS_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}


/* Upload treament questionnaire form */
export function uploadForm(token, attributes) {
  let postData = {
    data: {
      "type": "attachments",
      "attributes": attributes,
    } };
  return function(dispatch) {
    dispatch(getRequest(PATIENT_CONST.FORM_REQUEST));
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.post(`${FORM_UPLOAD_API}/`, postData, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(PATIENT_CONST.FORM_SUCCESS, success.data));
      })
      .catch(function(error) {
        console.log("error", error);
        dispatch(getFailure(PATIENT_CONST.FORM_FAILURE, {
          response: {
            statusCode: 403,
            statusText: null,
          } }));
      });
  };
}

export function changeFields(formData) {
  // console.log("aaaaaaaaa---", formData);

  return function(dispatch) {
    formData.care_giver_email = "";
    formData.care_giver_name = "";
    formData.care_giver_phone = "";
    dispatch(getSuccess(PATIENT_CONST.GET_PATIENT_INFO_SUCCESS, formData));
  };
}
