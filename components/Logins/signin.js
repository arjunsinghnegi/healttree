import { Button, Form, FormGroup, FormText, Label } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import { patientLogin, statusUpdate } from "../../actions/LoginActions";
import React, { Component } from "react";
import { renderInputField, renderPassword } from "./renderFields";
import { connect } from "react-redux";
import { Link } from "react-router";


import validate from "./validate";

class Signin extends Component {

  componentDidMount() {
    document.title = "Healthtree - Signin";
  }

  componentWillMount() {
    // console.log("signin");
    this.props.dispatch(statusUpdate());
  }

  onSubmit(formProps) {
    this.props.dispatch(patientLogin(formProps));
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <h3>Sign In</h3>
        <FormText color="warning">
          <Label>{this.props.statusText}</Label>
        </FormText>
        <Field
          name="username"
          type="text"
          className="icon"
          placeholder="Username"
          component={renderInputField} />
        <Field
          name="password"
          type="password"
          className="pass_wrd1 icon"
          placeholder="Password"
          component={renderPassword} />
        <FormGroup>
          <input id="checkbox-1" className="checkbox-custom" name="checkbox-1" type="checkbox" />
          {/* <Label for="checkbox-1" className="remeber checkbox-custom-label">Remember me</Label> */}
          <span className="forgot">
            <Link to={"/forgot-password"}>Forgot Password?</Link> </span>
          <div className="clearfix"></div>
        </FormGroup>
        <FormGroup className="social_link">
          { this.props.isAuthenticating === true ?
            <Button type="submit" className="yellow_btn" disabled>Sign In...</Button> :
            <Button type="submit" className="yellow_btn">Sign In</Button> }

          <div className="clearfix"></div>
          <div className="notamember">
            <span>Not a member?</span>
            <span className="create"><Link to={"/signup"}>Create Account</Link></span>
          </div>
        </FormGroup>

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

Signin = reduxForm({
  form: "SigninForm",
  fields: ["username", "password"],
  validate,
})(Signin);
export default connect(mapStateToProps, { patientLogin, statusUpdate })(Signin);
