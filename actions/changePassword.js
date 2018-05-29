import { AUTH_CONST,
  AXIOS_INSTANCE,
  CHANGE_PWD_API,
} from "./constants";
import { checkHttpStatus, parseJSON } from "../utils";

export function resetProps(RESET) {
  return {
    type: RESET,
  };
}
// handle state when request is send and resposen is awaited
export function getRequest(REQUEST) {
  console.log("I am here in request");
  return {
    type: REQUEST,
  };
}

// handle state incase of success
export function getSuccess(SUCCESS, data) {

  return {
    type: SUCCESS,
    payload: data,
  };
}
// handle state in case of failure of change password
export function getFailure(FAILURE, error) {
  return {
    type: FAILURE,
    payload: error,
  };
}

export function changePassword(formData, token) {
  console.log("firmDAta", formData, AUTH_CONST);
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.CHANGE_PASSWORD_REQUEST));
    let postData = formData;
    let config = { "headers": { "Authorization": token } };
    AXIOS_INSTANCE.post(CHANGE_PWD_API, postData, config)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(function(success) {
        dispatch(getSuccess(AUTH_CONST.CHANGE_PASSWORD_SUCCESS, success.data));
      })
      .catch(function(error) {
        let errObj = {};
        if (error.response && error.response.status === 403) {
          errObj.status = error.response.status;
          errObj.msg = "Current password is incorrect. Kindly check and try again.";
        } else if (error.response && error.response.status === 422) {
          errObj.status = error.response.status;
          errObj.msg = "Current password and new password cannot be same. Kindly check and try again.";
        } else {
          errObj.status = 500;
          errObj.msg = "Something went wrong. Please try again later.";
        }
        console.log("error", errObj);
        dispatch(getFailure(AUTH_CONST.CHANGE_PASSWORD_FAILURE, errObj));
      });
  };


}

// reset all modal var
export function resetModalVal() {
  return function(dispatch) {
    dispatch(getRequest(AUTH_CONST.CHANGE_PASSWORD_RESET));
  };
}
