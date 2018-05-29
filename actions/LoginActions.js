/**
 * @action        : LoginActions
 * @description   : Handles signup, signin, forget and reset password actions
 * @Created by    : smartData
 */


import { AUTH_CONST,
  AXIOS_INSTANCE,
  FORGOT_PWD_API,
  HOME_CONTENT_API,
  LOGIN_API,
  REGISTRATION_API,
  RESET_PWD_API,
} from "./constants";
import { changeProfileComplete, changeSurvey } from "./miscActions.js";
import { checkHttpStatus, handleLoginRedirect, handleLogoutRedirect, parseJSON } from "../utils";

// handle state when request is send and resposen is awaited
export function getRequest(REQUEST) {
  return {
    type: REQUEST,
  };
}

// handle state and redirection if user is successfully logged in
export function getSuccess(SUCCESS, data) {

  return {
    type: SUCCESS,
    payload: data,
  };
}

// handle state in case of failure of user login
export function getFailure(FAILURE, error) {
  return {
    type: FAILURE,
    payload: error,
  };
}

// Custom context - "userbrowser-currentDate" concatination
function contextGenerator() {
  let currentDate = new Date();
  let context = `${navigator.userAgent}-${currentDate}`;
  return context;
}

/**
 * [patientRegister description]
 * @param  {[type]} formData [description]
 * @return {[type]}          [description]
 */
export function patientRegister(formData) {
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.REGISTER_REQUEST));
    let context = contextGenerator();
    const postData = { data:
      { type: "patients",
        attributes: {
          email: formData.email,
          password: formData.password,
          context: context,
          password_confirmation: formData.confirm_password,
          user_name: formData.username,
        },
      },
    };
    let config = { "headers": { "Content-Type": "application/vnd.api+json" } };
    AXIOS_INSTANCE.post(REGISTRATION_API, postData, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(response) {
        let authToken = response.data.attributes ? response.data.attributes.key : null;
        dispatch(getSuccess(AUTH_CONST.REGISTER_SUCCESS, {
          response: {
            statusCode: 200,
            statusText: "You are logged in successfully.",
            data: response.data.attributes,
          },
        }));
        dispatch(changeProfileComplete({}));
        handleLoginRedirect(authToken);
      })
      .catch(function(error) {
        // console.log("error>>>", error);
        // console.log("error response", error.response.data);
        let error_message = error.response.data;
        let obj = {};
        if (error_message.errors) {
          if (error_message.errors.email) {
            let email_err = "Email address already exists in Healthtree, please use a different email address.";
            obj.emailErr = email_err;
          }
          if (error_message.errors.user_name) {
            let username_err = "Username address already exists in Healthtree, please use a different username.";
            if (error_message.errors.user_name.length) {
              if (error_message.errors.user_name["is is invalid"]) {
                username_err = "Please enter valid username. It can only contain '_' and alphanumeric values.";
              }
            }

            obj.usernameErr = username_err;
          }
        }
        dispatch(getFailure(AUTH_CONST.REGISTER_FAILURE, {
          error: {
            statusCode: 422,
            statusText: obj,
            data: null,
          },
        }));
      });
  };
}

/**
 * [patientLogin description]
 * @param  {[type]} formData [description]
 * @return {[type]}          [description]
 */
export function patientLogin(formData) {
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.LOGIN_REQUEST));
    // Custom context - "userbrowser-currentDate" concatination
    let context = contextGenerator();
    const postData = { data:
                          {
                            email: formData.username,
                            context: context,
                            password: formData.password,
                          } };

    let config = { "headers": { "Content-Type": "application/vnd.api+json" } };
    AXIOS_INSTANCE.post(LOGIN_API, postData, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(response) {
        let authToken = response.data.attributes ? response.data.attributes.key : null;
        dispatch(getSuccess(AUTH_CONST.LOGIN_SUCCESS, {
          response: {
            statusCode: 200,
            statusText: "You are logged in successfully.",
            data: response.data.attributes,
          },
        }));
        console.log("here after login");
        dispatch(changeProfileComplete({}));
        handleLoginRedirect(authToken);
      })
      .catch(function(error) {
        dispatch(getFailure(AUTH_CONST.LOGIN_FAILURE, {
          error: {
            statusCode: 403,
            statusText: "Invalid username or password, please try again!",
            data: null,
          } }));
      });
  };
}

/**
 * [logout description]
 * @return {[type]} [description]
 */
export function logout() {
  console.log("i am here in actions logout");
  return function(dispatch) {
    dispatch(getSuccess(AUTH_CONST.LOGOUT, {
      response: {
        statusCode: 200,
        statusText: "You have been logged out successfully.",
        data: null,
      } }));
    handleLogoutRedirect();
  };
}

/**
 * [forgotPassword description]
 * @param  {[type]} formData       [description]
 * @param  {String} [redirect="/"] [description]
 * @return {[type]}                [description]
 */
export function forgotPassword(formData, redirect = "/") {
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.FORGOT_PASSWORD_REQUEST));
    const postData = { "data": {
      "email": formData.email,
    } };

    let config = { "headers": { "Content-Type": "application/vnd.api+json" } };
    AXIOS_INSTANCE.post(FORGOT_PWD_API, postData, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(AUTH_CONST.FORGOT_PASSWORD_SUCCESS, {
          response: {
            statusCode: 200,
            statusText: "Please check your email to reset your password.",
          } }));
      // browserHistory.push("/login");
      })
      .catch(function(error) {
        dispatch(getFailure(AUTH_CONST.FORGOT_PASSWORD_FAILURE, {
          response: {
            statusCode: 200,
            statusText: "Please check your email to reset your password.",
          } }));
      });
  };
}

/**
 * [resetPassword description]
 * @param {[type]} token    [description]
 * @param {[type]} formData [description]
 */
export function resetPassword(token, formData) {
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.RESET_PASSWORD_REQUEST));
    const postData = { "data": {
      "reset_password_token": token,
      "password": formData.password,
      "password_confirmation": formData.confirm_password,
    } };

    let config = { "headers": { "Content-Type": "application/vnd.api+json" } };
    AXIOS_INSTANCE.post(RESET_PWD_API, postData, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(AUTH_CONST.RESET_PASSWORD_SUCCESS, {
          response: {
            statusCode: 200,
            statusText: "Your password has been successfully updated.",
          } }));

        // browserHistory.push("/login");
      })
      .catch(function(error) {
        dispatch(getFailure(AUTH_CONST.RESET_PASSWORD_FAILURE, {
          error: {
            statusCode: 403,
            statusText: "Invalid token ! Please try again.",
          } }));
      });
  };
}

/**
 * [statusUpdate description]
 * @return {[type]} [description]
 */
export function statusUpdate() {
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.STATUS_UPDATE));
  };
}

/**
 * [loginPageContent description]
 * @return {[type]} [description]
 */
export function loginPageContent() {
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.GET_HOME_CONTENT_REQUEST));
    // let config = { "headers" : { "Content-Type": "application/vnd.api+json" } };
    AXIOS_INSTANCE.get(HOME_CONTENT_API)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(AUTH_CONST.GET_HOME_CONTENT_SUCCESS, {
          response: {
            statusCode: 200,
            data: success.data,
          } }));

        // browserHistory.push("/login");
      })
      .catch(function(error) {
        dispatch(getFailure(AUTH_CONST.GET_HOME_CONTENT_FAILURE, {
          error: {
            statusCode: 403,
            statusText: "Forbidden.",
          } }));
      });
  };
}
