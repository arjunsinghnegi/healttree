/**
 * @constants
 * @description  : Hold CONSTANTS and APIs
 * @Created by   : smartData
 */

import axios from "axios";

/* ****************************** Define Pagination Constants *****************************/

export const PAGINATION_DEFAULT_LIMIT = "10";

/* ****************************** Define and Export Constants ****************************/

export const MENU_LINK = { UPDATE_ACTIVE_LINK: "UPDATE_ACTIVE_LINK" };

export const AUTH_CONST = {
  REGISTER_REQUEST: "REGISTER_REQUEST",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",

  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",

  LOGOUT: "LOGOUT",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  FORGOT_PASSWORD_REQUEST: "FORGOT_PASSWORD_REQUEST",
  FORGOT_PASSWORD_SUCCESS: "FORGOT_PASSWORD_SUCCESS",
  FORGOT_PASSWORD_FAILURE: "FORGOT_PASSWORD_FAILURE",

  RESET_PASSWORD_REQUEST: "RESET_PASSWORD_REQUEST",
  RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",
  RESET_PASSWORD_FAILURE: "RESET_PASSWORD_FAILURE",

  GET_HOME_CONTENT_REQUEST: "GET_HOME_CONTENT_REQUEST",
  GET_HOME_CONTENT_SUCCESS: "GET_HOME_CONTENT_SUCCESS",
  GET_HOME_CONTENT_FAILURE: "GET_HOME_CONTENT_FAILURE",

  CHANGE_PASSWORD_REQUEST: "CHANGE_PASSWORD_REQUEST",
  CHANGE_PASSWORD_SUCCESS: "CHANGE_PASSWORD_SUCCESS",
  CHANGE_PASSWORD_FAILURE: "CHANGE_PASSWORD_FAILURE",
  CHANGE_PASSWORD_RESET: "CHANGE_PASSWORD_RESET",

  STATUS_UPDATE: "STATUS_UPDATE",

};

export const USER_CONST = {
  GET_USER_INFO_REQUEST: "GET_USER_INFO_REQUEST",
  GET_USER_INFO_SUCCESS: "GET_USER_INFO_SUCCESS",
  GET_USER_INFO_FAILURE: "GET_USER_INFO_FAILURE",
  SAVE_USER_INFO_REQUEST: "SAVE_USER_INFO_REQUEST",
  SAVE_USER_INFO_SUCCESS: "SAVE_USER_INFO_SUCCESS",
  SAVE_USER_INFO_FAILURE: "SAVE_USER_INFO_FAILURE",
  RESET_USER_INFO: "RESET_USER_INFO",
};

export const PATIENT_CONST = {
  GET_PATIENT_INFO_REQUEST: "GET_PATIENT_INFO_REQUEST",
  GET_PATIENT_INFO_SUCCESS: "GET_PATIENT_INFO_SUCCESS",
  GET_PATIENT_INFO_FAILURE: "GET_PATIENT_INFO_FAILURE",
  PATIENT_RESET: "PATIENT_RESET",

  SAVE_PATIENT_INFO_REQUEST: "SAVE_PATIENT_INFO_REQUEST",
  SAVE_PATIENT_INFO_SUCCESS: "SAVE_PATIENT_INFO_SUCCESS",
  SAVE_PATIENT_INFO_FAILURE: "SAVE_PATIENT_INFO_FAILURE",

  GET_MYELOMA_CENTERS_REQUEST: "GET_MYELOMA_CENTERS_REQUEST",
  GET_MYELOMA_CENTERS_SUCCESS: "GET_MYELOMA_CENTERS_SUCCESS",
  GET_MYELOMA_CENTERS_FAILURE: "GET_MYELOMA_CENTERS_FAILURE",

  GET_MYMYELOMA_REQUEST: "GET_MYMYELOMA_REQUEST",
  GET_MYMYELOMA_SUCCESS: "GET_MYMYELOMA_SUCCESS",
  GET_MYMYELOMA_FAILURE: "GET_MYMYELOMA_FAILURE",

  SAVE_MYMYELOMA_REQUEST: "SAVE_MYMYELOMA_REQUEST",
  SAVE_MYMYELOMA_SUCCESS: "SAVE_MYMYELOMA_SUCCESS",
  SAVE_MYMYELOMA_FAILURE: "SAVE_MYMYELOMA_FAILURE",

  GET_FITNESS_LEVEL_REQUEST: "GET_FITNESS_LEVEL_REQUEST",
  GET_FITNESS_LEVEL_SUCCESS: "GET_FITNESS_LEVEL_SUCCESS",
  GET_FITNESS_LEVEL_FAILURE: "GET_FITNESS_LEVEL_FAILURE",

  SAVE_FITNESS_LEVEL_REQUEST: "SAVE_FITNESS_LEVEL_REQUEST",
  SAVE_FITNESS_LEVEL_SUCCESS: "SAVE_FITNESS_LEVEL_SUCCESS",
  SAVE_FITNESS_LEVEL_FAILURE: "SAVE_FITNESS_LEVEL_FAILURE",


  SAVE_MY_SIDE_EFFECTS_REQUEST: "SAVE_MY_SIDE_EFFECTS_REQUEST",
  SAVE_MY_SIDE_EFFECTS_SUCCESS: "SAVE_MY_SIDE_EFFECTS_SUCCESS",
  SAVE_MY_SIDE_EFFECTS_FAILURE: "SAVE_MY_SIDE_EFFECTS_FAILURE",

  DELETE_SIDE_EFFECT_REQUEST: "DELETE_SIDE_EFFECT_REQUEST",
  DELETE_SIDE_EFFECT_SUCCESS: "DELETE_SIDE_EFFECT_SUCCESS",
  DELETE_SIDE_EFFECT_FAILURE: "DELETE_SIDE_EFFECT_FAILURE",

  GET_MY_TREATMENTS_REQUEST: "GET_MY_TREATMENTS_REQUEST",
  GET_MY_TREATMENTS_SUCCESS: "GET_MY_TREATMENTS_SUCCESS",
  GET_MY_TREATMENTS_FAILURE: "GET_MY_TREATMENTS_FAILURE",

  SAVE_MY_TREATMENTS_REQUEST: "SAVE_MY_TREATMENTS_REQUEST",
  SAVE_MY_TREATMENTS_SUCCESS: "SAVE_MY_TREATMENTS_SUCCESS",
  SAVE_MY_TREATMENTS_FAILURE: "SAVE_MY_TREATMENTS_FAILURE",

  DELETE_MY_TREATMENTS_REQUEST: "DELETE_MY_TREATMENTS_REQUEST",
  DELETE_MY_TREATMENTS_SUCCESS: "DELETE_MY_TREATMENTS_SUCCESS",
  DELETE_MY_TREATMENTS_FAILURE: "DELETE_MY_TREATMENTS_FAILURE",

  GET_REMISSION_STATUS_REQUEST: "GET_REMISSION_STATUS_REQUEST",
  GET_REMISSION_STATUS_SUCCESS: "GET_REMISSION_STATUS_SUCCESS",
  GET_REMISSION_STATUS_FAILURE: "GET_REMISSION_STATUS_FAILURE",

  SAVE_REMISSION_STATUS_REQUEST: "SAVE_REMISSION_STATUS_REQUEST",
  SAVE_REMISSION_STATUS_SUCCESS: "SAVE_REMISSION_STATUS_SUCCESS",
  SAVE_REMISSION_STATUS_FAILURE: "SAVE_REMISSION_STATUS_FAILURE",

  DELETE_REMISSION_STATUS_REQUEST: "DELETE_REMISSION_STATUS_REQUEST",
  DELETE_REMISSION_STATUS_SUCCESS: "DELETE_REMISSION_STATUS_SUCCESS",
  DELETE_REMISSION_STATUS_FAILURE: "DELETE_REMISSION_STATUS_FAILURE",

  GET_HLTH_HISTRY_OPTIONS_REQUEST: "GET_HLTH_HISTRY_OPTIONS_REQUEST",
  GET_HLTH_HISTRY_OPTIONS_SUCCESS: "GET_HLTH_HISTRY_OPTIONS_SUCCESS",
  GET_HLTH_HISTRY_OPTIONS_FAILURE: "GET_HLTH_HISTRY_OPTIONS_FAILURE",

  HLTH_HISTRY_UPDATE_REQUEST: "HLTH_HISTRY_UPDATE_REQUEST",
  HLTH_HISTRY_UPDATE_SUCCESS: "HLTH_HISTRY_UPDATE_SUCCESS",
  HLTH_HISTRY_UPDATE_FAILURE: "HLTH_HISTRY_UPDATE_FAILURE",
  HLTH_HISTRY_RESET: "HLTH_HISTRY_UPDATE_RESET",

  OUTCOME_REQUEST: "OUTCOME_REQUEST",
  OUTCOME_SUCCESS: "OUTCOME_SUCCESS",
  OUTCOME_FAILURE: "OUTCOME_FAILURE",

  FORM_REQUEST: "FORM_REQUEST",
  FORM_SUCCESS: "FORM_SUCCESS",
  FORM_FAILURE: "FORM_FAILURE",

  CONSENT_FORM_REQUEST: "CONSENT_FORM_REQUEST",
  CONSENT_FORM_SUCCESS: "CONSENT_FORM_SUCCESS",
  CONSENT_FORM_FAILURE: "CONSENT_FORM_FAILURE",

  PRIVACY_POLICY_REQUEST: "PRIVACY_POLICY_REQUEST",
  PRIVACY_POLICY_SUCCESS: "PRIVACY_POLICY_SUCCESS",
  PRIVACY_POLICY_FAILURE: "PRIVACY_POLICY_FAILURE",

  SUMMARY_REQUEST: "SUMMARY_REQUEST",
  SUMMARY_SUCCESS: "SUMMARY_SUCCESS",
  SUMMARY_FAILURE: "SUMMARY_FAILURE",
  SUMMARY_RESET: "SUMMARY_RESET",

  TREATMENT_OPTIONS_REQUEST: "TREATMENT_OPTIONS_REQUEST",
  TREATMENT_OPTIONS_SUCCESS: "TREATMENT_OPTIONS_SUCCESS",
  TREATMENT_OPTIONS_FAILURE: "TREATMENT_OPTIONS_FAILURE",
  TREATMENT_OPTIONS_RESET: "TREATMENT_OPTIONS_RESET",

  TREATMENT_RESOURCE_REQUEST: "TREATMENT_RESOURCE_REQUEST",
  TREATMENT_RESOURCE_SUCCESS: "TREATMENT_RESOURCE_SUCCESS",
  TREATMENT_RESOURCE_FAILURE: "TREATMENT_RESOURCE_FAILURE",
  TREATMENT_RESOURCE_RESET: "TTREATMENT_RESOURCE_RESET",

  TREATMENT_NOTE_REQUEST: "TREATMENT_NOTE_REQUEST",
  TREATMENT_NOTE_SUCCESS: "TREATMENT_NOTE_SUCCESS",
  TREATMENT_NOTE_FAILURE: "TREATMENT_NOTE_FAILURE",

  TREATMENT_PRSNLNOTE_REQUEST: "TREATMENT_PRSNLNOTE_REQUEST",
  TREATMENT_PRSNLNOTE_SUCCESS: "TREATMENT_PRSNLNOTE_SUCCESS",
  TREATMENT_PRSNLNOTE_FAILURE: "TREATMENT_PRSNLNOTE_FAILURE",

  SURVEY_FETCH_REQUEST: "SURVEY_FETCH_REQUEST",
  SURVEY_FETCH_SUCCESS: "SURVEY_FETCH_SUCCESS",
  SURVEY_FETCH_FAILURE: "SURVEY_FETCH_FAILURE",
  SURVEY_RESET: "SURVEY_RESET",

  SURVEY_QUESTION_FETCH_REQUEST: "SURVEY_QUESTION_FETCH_REQUEST",
  SURVEY_QUESTION_FETCH_SUCCESS: "SURVEY_QUESTION_FETCH_SUCCESS",
  SURVEY_QUESTION_FETCH_FAILURE: "SURVEY_QUESTION_FETCH_FAILURE",
  SURVEY_QUESTION_RESET: "SURVEY_QUESTION_RESET",


  DYNAMIC_TREATMENT_REQUEST: "DYNAMIC_TREATMENT_REQUEST",
  DYNAMIC_TREATMENT_SUCCESS: "DYNAMIC_TREATMENT_SUCCESS",
  DYNAMIC_TREATMENT_FAILURE: "DYNAMIC_TREATMENT_FAILURE",
  DYNAMIC_TREATMENT_RESET: "DYNAMIC_TREATMENT_RESET",

  // MODAL_CLOSE_REQUEST: "MODAL_CLOSE_REQUEST",
  // MODAL_CLOSE_SUCCESS: "MODAL_CLOSE_SUCCESS",
  // MODAL_CLOSE_FAILURE: "MODAL_CLOSE_FAILURE",

  SAVE_SURVEY_REQUEST: "SAVE_SURVEY_REQUEST",
  SAVE_SURVEY_SUCCESS: "SAVE_SURVEY_SUCCESS",
  SAVE_SURVEY_FAILURE: "SAVE_SURVEY_FAILURE",
  SAVE_SURVEY_RESET: "SAVE_SURVEY_RESET",

  TREATMENT_LEGENDS_REQUEST: "TREATMENT_LEGENDS_REQUEST",
  TREATMENT_LEGENDS_SUCCESS: "TREATMENT_LEGENDS_SUCCESS",
  TREATMENT_LEGENDS_FAILURE: "TREATMENT_LEGENDS_FAILURE",
  TREATMENT_LEGENDS_RESET: "TREATMENT_LEGENDS_RESET",

  FULL_PROFILE_GROUP_REQUEST: "FULL_PROFILE_GROUP_REQUEST",
  FULL_PROFILE_GROUP_SUCCESS: "FULL_PROFILE_GROUP_SUCCESS",
  FULL_PROFILE_GROUP_FAILURE: "FULL_PROFILE_GROUP_FAILURE",
  FULL_PROFILE_GROUP_RESET: "FULL_PROFILE_GROUP_RESET",

  FULL_PROFILE_QUES_REQUEST: "FULL_PROFILE_QUES_REQUEST",
  FULL_PROFILE_QUES_SUCCESS: "FULL_PROFILE_QUES_SUCCESS",
  FULL_PROFILE_QUES_FAILURE: "FULL_PROFILE_QUES_FAILURE",
  FULL_PROFILE_QUES_RESET: "FULL_PROFILE_QUES_RESET",

  CHILD_QUESTION_FETCH_REQUEST: "CHILD_QUESTION_FETCH_REQUEST",
  CHILD_QUESTION_FETCH_SUCCESS: "CHILD_QUESTION_FETCH_SUCCESS",
  CHILD_QUESTION_FETCH_FAILURE: "CHILD_QUESTION_FETCH_FAILURE",
  CHILD_QUESTION_RESET: "CHILD_QUESTION_RESET",

  DYNAMIC_SIDE_EFFECTS_REQUEST: "DYNAMIC_SIDE_EFFECTS_REQUEST",
  DYNAMIC_SIDE_EFFECTS_SUCCESS: "DYNAMIC_SIDE_EFFECTS_SUCCESS",
  DYNAMIC_SIDE_EFFECTS_FAILURE: "DYNAMIC_SIDE_EFFECTS_FAILURE",

  DYNAMIC_OUTCOMES_REQUEST: "DYNAMIC_OUTCOMES_REQUEST",
  DYNAMIC_OUTCOMES_SUCCESS: "DYNAMIC_OUTCOMES_SUCCESS",
  DYNAMIC_OUTCOMES_FAILURE: "DYNAMIC_OUTCOMES_FAILURE",

  CLINICAL_TRIALS_REQUEST: "CLINICAL_TRIALS_REQUEST",
  CLINICAL_TRIALS_SUCCESS: "CLINICAL_TRIALS_SUCCESS",
  CLINICAL_TRIALS_FAILURE: "CLINICAL_TRIALS_FAILURE",

  CLINICAL_TRIALS_SAVE_REQUEST: "CLINICAL_TRIALS_SAVE_REQUEST",
  CLINICAL_TRIALS_SAVE_SUCCESS: "CLINICAL_TRIALS_SAVE_SUCCESS",
  CLINICAL_TRIALS_SAVE_FAILURE: "CLINICAL_TRIALS_SAVE_FAILURE",
  CLINICAL_TRIALS_SAVE_RESET: "CLINICAL_TRIALS_SAVE_RESET",

  HLTH_HISTRY_SUBOPTION_UPDATE_REQUEST: "HLTH_HISTRY_SUBOPTION_UPDATE_REQUEST",
  HLTH_HISTRY_SUBOPTION_UPDATE_SUCCESS: "HLTH_HISTRY_SUBOPTION_UPDATE_SUCCESS",
  HLTH_HISTRY_SUBOPTION_UPDATE_FAILURE: "HLTH_HISTRY_SUBOPTION_UPDATE_FAILURE",
};
// MISC
export const MISC_CONST = {
  PROFILE_COMPLETE: "PROFILE_COMPLETE",
  SURVEY_PENDING: "SURVEY_PENDING",
  USER_INTEREST: "USER_INTEREST",
  MODULE_WEIGHTS_REQUEST: "MODULE_WEIGHTS_REQUEST",
  MODULE_WEIGHTS_SUCCESS: "MODULE_WEIGHTS_SUCCESS",
  MODULE_WEIGHTS_FAILURE: "MODULE_WEIGHTS_FAILURE",
  USER_COUNTS: "USER_COUNTS",
};
// MYELOMA DIAGNOSIS FACILITIES
export const FACILITIES_CONST = {
  FACILITY_REQUEST: "FACILITY_REQUEST",
  FACILITY_SUCCESS: "FACILITY_SUCCESS",
  FACILITY_FAILURE: "FACILITY_FAILURE",
};
// FEEDBACK CONST
// MYELOMA DIAGNOSIS FACILITIES
export const FEEDBACK_CONST = {
  FEEDBACK_REQUEST: "FEEDBACK_REQUEST",
  FEEDBACK_SUCCESS: "FEEDBACK_SUCCESS",
  FEEDBACK_FAILURE: "FEEDBACK_FAILURE",
  FEEDBACK_RESET: "FEEDBACK_RESET",
};

export const FAVORITE_CONST = {
  FAVORITE_REQUEST: "FAVORITE_REQUEST",
  FAVORITE_SUCCESS: "FAVORITE_SUCCESS",
  FAVORITE_FAILURE: "FAVORITE_FAILURE",
  FAVORITE_RESET: "FAVORITE_RESET",
};
export const FILTER_CONST = {
  FILTER_REQUEST: "FILTER_REQUEST",
  FILTER_SUCCESS: "FILTER_SUCCESS",
  FILTER_FAILURE: "FILTER_FAILURE",
  FILTER_RESET: "FILTER_RESET",
};
// react-idle-times
export const IDLESTATUS_AWAY = "AWAY";
export const IDLESTATUS_INACTIVE = "INACTIVE";
export const IDLESTATUS_EXPIRED = "EXPIRED";

export const IDLE_STATUSES = [IDLESTATUS_AWAY, IDLESTATUS_INACTIVE, IDLESTATUS_EXPIRED];


/* ************************************ API CONSTANTS ***************************************/

// creating global instance for the axios to call apis
export const AXIOS_INSTANCE = axios.create();
AXIOS_INSTANCE.defaults.headers["Accept"] = "application/vnd.api+json";
AXIOS_INSTANCE.defaults.headers["Content-Type"] = "application/vnd.api+json";
export const LOCALS_STORAGE_AUTHTOKEN = localStorage.getItem("authToken");

// --------------------------------------------------------------------------------------------

// Define APIS

// export const SERVER_URL = "https://healthtreecrowdcare.herokuapp.com";
export const SERVER_URL = "https://a0d1940a.ngrok.io";
export const DOWNLOAD_FORM_URL = `${SERVER_URL}/customs/download`;
const API_SLUG = `${SERVER_URL}/api/v1`;
export const LOGIN_API = `${API_SLUG}/auth`; // POST - Get access token for the application on login
export const REGISTRATION_API = `${API_SLUG}/registration`; // POST patient registration
export const FORGOT_PWD_API = `${API_SLUG}/password/forgot`; // POST
export const CHANGE_PWD_API = `${API_SLUG}/password/change`; // POST 
export const DYNAMIC_OUTCOMES = `${API_SLUG}/treatment_outcomes`;
export const RESET_PWD_API = `${API_SLUG}/password/reset`;
export const HOME_CONTENT_API = `${API_SLUG}/pages`; // GET
export const GET_USER_INFO_API = `${API_SLUG}/users`; // GET
export const GET_ABOUT_ME_API = `${API_SLUG}/patient_infos`; // GET - patient_infos - used in about me page
export const GET_MYELOMA_CENTERS_API = `${API_SLUG}/clinics`; // GET
export const GET_MYELOMA_API = `${API_SLUG}/myelomas`; // GET
export const GET_FITNESS_LEVEL_API = `${API_SLUG}/users_fitness_level_questions`; // GET
export const GET_MY_SIDE_EFFECTS_API = `${API_SLUG}/side_effects`; // GET
export const GET_MY_TREATMENTS_API = `${API_SLUG}/patient_treatments`; // GET
export const GET_REMISSION_STATUS_API = `${API_SLUG}/remissions`;
export const SURVEY_API = `${API_SLUG}/surveys`;
export const SAVE_SURVEY_API = `${API_SLUG}/survey_answers`;
export const TREATMENTS_LIST = `${API_SLUG}/treatments`; // dynamic listing of the treatments to be used in treatment and outcomes page
export const HIDE_START_MODAL = `${API_SLUG}/read_myeloma`;
export const TREATMENT_LEGENDS_API = `${API_SLUG}/treatment_options_types`;
export const HEALTH_HISTORY_SUB_OPTIONS_API = `${API_SLUG}/users_rules`;
/* MY HEALTH HISTORY*/
// get dynamic listing of health history options
export const GET_HEALTH_HISTORY_OPTIONS_API = `${API_SLUG}/users_health_conditions`;
/* OUTCOME*/
// get dynamic listing of outcomes
export const OUTCOME_API = `${API_SLUG}/outcomes`;
/* FORM DOWNLOAD*/
export const FORM_UPLOAD_API = `${API_SLUG}/attachments`;
/* SUMMARY API*/
export const SUMMARY_API = `${API_SLUG}/summary`;
/* TREATMENT OPTIONS API */
export const TREATMENT_OPTIONS_API = `${API_SLUG}/treatment_options`;
/* TREATMENT RESOURCE API*/
export const TREATMENT_RESOURCE_API = `${API_SLUG}/treatment_options_resources`;
/* SAVE PERSONAL NOTE */
export const TREATMENT_NOTE_API = `${API_SLUG}/user_treatment_option_notes`;
/* FULL HEALTH PROFILE */ 
export const FULL_HEALTH_PROFILE = `${API_SLUG}/health_categories`;
export const FULL_HEALTH_CHILD = `${API_SLUG}/survey_questions`;
/* DYNAMIC SIDE EFFECTS  */ 
export const DYNAMIC_SIDE_EFFECTS = `${API_SLUG}/side_effects`;
/* CLINICAL_TRIALS_API */
export const CLINICAL_TRIALS_API = `${API_SLUG}/clinical_trials`;
/* GET DIAGNOSTIC FACILITES NAME*/
export const DIAGNOSE_FACILITY = `${API_SLUG}/addresses`;
/* GET MODULE WEIGHTS*/
export const MODULE_WEIGHTS = `${API_SLUG}/module_weights`;
/* SAVE FEEDBACK */
export const FEEDBACK = `${API_SLUG}/patient_feedbacks`;
/* TOGGLE FAVORITE TREATMENT*/ 
export const FAVORITE = `${API_SLUG}/patient_treatment_options`;

