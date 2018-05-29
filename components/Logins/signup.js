import { Button, Form, FormGroup, FormText, Label } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import { patientRegister, statusUpdate } from "../../actions/LoginActions";
import React, { Component } from "react";
import { renderEmail, renderInputField, renderPassword } from "./renderFields";
import { connect } from "react-redux";
import { Link } from "react-router";
import ReactTooltip from "react-tooltip";
import validate from "./validate";

class Signup extends Component {

  componentDidMount() {
    document.title = "Healthtree";
  }

  componentWillMount() {
    console.log("signup");
    this.props.dispatch(statusUpdate());
  }

  onSubmit(formProps) {
    console.log("formprops>>>", formProps);
    this.props.dispatch(patientRegister(formProps));
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))} autoComplete="off">
        <h3>Sign Up</h3>
        <div >
          <Field
            name="username"
            type="text"
            className="icon signup_username"
            placeholder="Username"
            maxLength={20}
            datafor= "username_1"
            autoComplete="off"
            serverErr = {(this.props.statusText && this.props.statusText.usernameErr && this.props.statusText.usernameErr) ? this.props.statusText.usernameErr : null }
            component={renderInputField} />
        </div>
        <ReactTooltip event="focus click" eventOff="focusout" place="top" type="info" effect="solid" id="username_1" className="email_tooltip">
          <ul className="tooltip-p">
            <li>1. Username cannot be an email address</li>
            <li>2. Username should always start with letter </li>
            <li>3. Username can only consist of letters, numbers, and _ </li>
          </ul>
        </ReactTooltip>
        { /*  <FormText color="warning">
          {this.props.statusText && this.props.statusText.usernameErr && <span >{this.props.statusText.usernameErr}</span>}
        </FormText> */}
        <Field
          name="email"
          type="email"
          className="icon"
          placeholder="Email"
          datafor= "email_1"
          autoComplete="off"
          serverErr = {(this.props.statusText && this.props.statusText.emailErr && this.props.statusText.emailErr) ? this.props.statusText.emailErr : null }
          component={renderEmail} />
        <ReactTooltip event="focus click hover" eventOff="focusout" place="top" type="info" effect="solid" id="email_1" className="email_tooltip"> <p className="tooltip-p">Email should be a valid email address.</p></ReactTooltip>
        { /* <FormText color="warning">
          {this.props.statusText && this.props.statusText.emailErr && <span>{this.props.statusText.emailErr}</span>}
        </FormText>*/}
        <Field
          name="password"
          type="password"
          className="icon"
          placeholder="Password"
          datafor= "password"
          component={renderPassword} />
        <ReactTooltip event="focus click hover" eventOff="focusout" place="top" type="info" effect="solid" id="password" className="email_tooltip"> <p className="tooltip-p">Password must be between 6 and 12 characters.</p></ReactTooltip>
        <Field
          name="confirm_password"
          type="password"
          className="icon"
          placeholder="Confirm Password"
          datafor= "confirm_password"
          component={renderPassword} />
        <ReactTooltip event="focus click hover" eventOff="focusout" place="top" type="info" effect="solid" id="confirm_password" className="email_tooltip"> <p className="tooltip-p">Confirm password should be same as password.</p></ReactTooltip>
        <FormGroup className="social_link">
          { this.props.isAuthenticating === true ?
            <Button type="submit" className="yellow_btn" disabled>Sign Up...</Button> :
            <Button type="submit" className="yellow_btn">Sign Up</Button> }
          <div className="clearfix"></div>
          <div className="notamember">
            <span>Already have an account?</span>
            <span className="create"><Link to={"/signin"}>Sign In</Link></span>
          </div>
        </FormGroup>

        { /* <div className="notamember">
          <span>already have an account?</span>
          <span className="create"><Link to={"/signin"}>Signin</Link></span>
        </div>*/}
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusText: state.login.statusText,
    isAuthenticating: state.login.isAuthenticating,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

Signup = reduxForm({
  form: "SignupForm",
  fields: ["username", "email", "password"],
  validate,
})(Signup);
export default connect(mapStateToProps, { patientRegister, statusUpdate })(Signup);
