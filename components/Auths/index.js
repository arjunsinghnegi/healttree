/**
 * @class  AuthenticatedComponent
 * @description   : Handles application Login authentication
 * @Created by    : smartData
 */
import { AUTH_CONST, LOCALS_STORAGE_AUTHTOKEN } from "../../actions/constants";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { getSuccess } from "../../actions/LoginActions";
import React from "react";
export default function requireAuths(Component) {
  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.checkAuth(this.props.isAuthenticated);
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps.isAuthenticated);
    }

    checkAuth(isAuthenticated) {

    // @TODO Token lost on refresh page - token comes here once login user
    // 1. Token lost on refresh page

      if (!isAuthenticated) {
        let token = localStorage.getItem("authToken"); // this.props.token ? this.props.token : LOCALS_STORAGE_AUTHTOKEN;
        if (token) {
          let data = { key: token, user: this.props.userinfo };
          this.props.getSuccess(AUTH_CONST.LOGIN_SUCCESS, {
            response: {
              statusCode: 200,
              statusText: "You are logged in successfully.",
              data: data,
            },
          });

        } else {
        // let redirectAfterLogin = this.props.location.pathname;
        // console.log(redirectAfterLogin);
          browserHistory.push("/");
        }
      }
    }

    render() {
      return (
        <div>
          { this.props.isAuthenticated === true
            ? <Component {...this.props} />
            : null
          }
        </div>
      );
    }
  }

  const mapStateToProps = (state) => ({
    token: state.login.token,
    isAuthenticated: state.login.isAuthenticated,
    dtree: state.login.dtree,
    userinfo: state.login.userinfo,
  });

  return connect(mapStateToProps, { getSuccess })(AuthenticatedComponent);
}
