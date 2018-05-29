import React, { Component } from "react";
import { Form, FormGroup, Input } from "reactstrap";

export default class AppFirstPage extends Component {
  render() {
    return (
      <div className="signin-bg">
        <div className="container">
          <div className="col-10 center-div">
            <h1 className="logo text-center"><img alt="logo" src={"./images/logo.png"} /></h1>
            <div className="row">
              <div className="col-sm text-center what-healthtree">
                <h2>What is HealthTree?</h2>
                <p>HealthTree provides data for you to make your very best treatment decisions. Whether you’re a smoldering. Newly diagnosed, high-risk or relapsed/ refractory multiple myeloma patient, HealthTree can help you learn about treatment options that may be right for you.</p>
                <p>With the explosion in treatment combinations in the past decade. Myeloma has become one of the most hopeful yet complex diseases to treat. Because most patients will ultimately relapse (and may relapse several times). Understanding your options...
                </p>
                <span className="more">MORE <i className="fa fa-arrow-right" aria-hidden="true"></i></span>
              </div>
              <div className="col-sm">
                <Form>
                  <FormGroup>
                    <Input type="email" name="email" id="exampleEmail" placeholder="Username" />
                  </FormGroup>
                  <FormGroup>
                    <Input type="password" name="password" id="examplePassword" placeholder="password" />
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
