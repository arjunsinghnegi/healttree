
import { browserHistory } from "react-router";

export function createConstants(...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}

export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer ? reducer(state, action.payload) : state;
  };
}

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function handleLoginRedirect(token) {
  localStorage.setItem("authToken", token);
  browserHistory.push("/about-me");
}

export function handleLogoutRedirect() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("index");
  localStorage.removeItem("modulecounts");
  browserHistory.push("/signin");
}

export function parseJSON(response) {
  return response.data;
}

export function setModuleWeights(response) {
  localStorage.setItem("moduleWeights", JSON.stringify(response.data));
  return response;
}
// export function handleRedirect() {
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("index");
//   browserHistory.push("/signin");
// }
