import { Button, Form, FormGroup, FormText, Label } from "reactstrap";
import { Field, reduxForm, reset } from "redux-form";
import React, { Component } from "react";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import { forgotPassword } from "../../actions/LoginActions";
import { Link } from "react-router";
import { renderEmail } from "./renderFields";
import validate from "./validate";
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { email: null };
  }

  componentDidMount() {
    document.title = "Healthtree";
  }

  componentWillReceiveProps(nextProps, props) {

    if (nextProps.statusText !== props.statusText && nextProps.statusText) {
      Alert.success("Please check your email to reset your password.");
    }
  }
  onSubmit(formProps) {
    this.props.dispatch(forgotPassword(formProps));
    let that = this;
    setTimeout(function() {
      that.props.dispatch(reset("ForgotPasswordForm"));
    }, 1500);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Form noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <h3>Forgot password?</h3>
        <p className="notamember reset-pass-lnk">Please enter your email address and we'll send you instructions on how to reset your password.</p>
        <FormText color="success">
          {/* <Label>{this.props.statusText}</Label> */}
        </FormText>
        <Field
          name="email"
          type="email"
          className="icon"
          placeholder="Email"
          value={this.state.email}
          component={renderEmail} />

        <FormGroup className="social_link">
          { this.props.isAuthenticating === true ?
            <Button className="yellow_btn" disabled>Submit...</Button> :
            <Button className="yellow_btn">Submit</Button> }
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
    statusText: state.login.statusText,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

ForgotPassword = reduxForm({
  form: "ForgotPasswordForm",
  fields: ["email", "password"],
  validate,
})(ForgotPassword);
export default connect(mapStateToProps, { forgotPassword })(ForgotPassword);
