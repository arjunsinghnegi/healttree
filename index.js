import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import { browserHistory, Router } from "react-router";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import reducers from "./reducers";
import promise from "redux-promise";
import routes from "./router";
import thunkMiddleware from "redux-thunk";

const createStoreWithMiddleware = applyMiddleware(promise, thunkMiddleware)(createStore);

ReactDOM.render(
  <Provider store={ createStoreWithMiddleware(reducers) }>
    <Router history={browserHistory} routes={ routes } />
  </Provider>, document.getElementById("root"));
