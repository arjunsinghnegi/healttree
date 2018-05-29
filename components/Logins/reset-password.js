import { Button, Form, FormGroup, FormText, Label } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { renderPassword } from "./renderFields";
import { resetPassword } from "../../actions/LoginActions";
import validate from "./validate";

class ResetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = { token: this.props.uniqueId };
  }

  componentDidMount() {
    document.title = "Healthtree";
  }

  componentWillMount() {
    console.log(this.props);
    // let urlSearch = window.location.search;
    // let token = urlSearch !== "" ? urlSearch.substring(7) : null;
    // this.setState({ token: token });
  }

  onSubmit(formProps) {
    this.props.dispatch(resetPassword(this.state.token, formProps));
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <h3>Create password</h3>
        <FormText color={this.props.statusCode === "200" ? "success" : "warning"}>
          <Label>{this.props.statusText}</Label>
        </FormText>
        <Field
          name="password"
          type="password"
          className="icon"
          placeholder="New Password"
          component={renderPassword} />
        <Field
          name="confirm_password"
          type="password"
          className="icon"
          placeholder="Confirm Password"
          component={renderPassword} />


        <FormGroup className="social_link">
          { this.props.isAuthenticating === true ?
            <Button className="yellow_btn" disabled>Create Password...</Button> :
            <Button className="yellow_btn">Create Password</Button> }
          <div className="clearfix"></div>
          <div className="notamember reset-pass-lnk">
            <span>Back to signin?</span>
            <span className="create"><Link to={"/signin"}>Click Here</Link></span>
          </div>
        </FormGroup>

      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticating: state.login.isAuthenticating,
    statusCode: state.login.statusCode,
    statusText: state.login.statusText,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

ResetPassword = reduxForm({
  form: "ResetPasswordForm",
  fields: ["password", "confirm_password"],
  validate,
})(ResetPassword);
export default connect(mapStateToProps, { resetPassword })(ResetPassword);
