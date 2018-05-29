import "react-datepicker/dist/react-datepicker.css";
import { Field, reduxForm } from "redux-form";
import { getMyMyeloma, saveMyMyeloma } from "../../../actions/PatientsActions";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import validate from "../validate";


class MyMyeloamaMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fishTestPerformedActive: 2,
      expressionProfileTestActive: 2,
      geneticsTestsActive: 2,
    };
  }

  componentWillMount() {
    this.props.dispatch(getMyMyeloma(this.props.token));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues && this.props.initialValues !== nextProps.initialValues) {
      let myMyeloma = nextProps.initialValues;
      if (myMyeloma.fish_test !== null) {
        this.setState({
          fishTestPerformedActive: myMyeloma.fish_test === "No" ? 0 :
            myMyeloma.fish_test === "Yes" ? 1 :
              myMyeloma.fish_test === "Dont Know" ? 2 : null,
        });
      }
      if (myMyeloma.gene_expression !== null) {
        this.setState({
          expressionProfileTestActive: myMyeloma.gene_expression === "No" ? 0 :
            myMyeloma.gene_expression === "Yes" ? 1 :
              myMyeloma.gene_expression === "Dont Know" ? 2 : null,
        });
      }
      if (myMyeloma.next_generation !== null) {
        this.setState({
          geneticsTestsActive: myMyeloma.next_generation === "No" ? 0 :
            myMyeloma.next_generation === "Yes" ? 1 :
              myMyeloma.next_generation === "Dont Know" ? 2 : null,
        });
      }
    }
  }

  onSubmit(formData) {
    formData["fish_test"] = this.state.fishTestPerformedActive;
    formData["gene_expression"] = this.state.expressionProfileTestActive;
    formData["next_generation"] = this.state.geneticsTestsActive;
    let userId = this.props.userinfo ? this.props.userinfo.id : null;
    this.props.dispatch(saveMyMyeloma(this.props.token, this.props.myMyelomaId, formData, userId, "MYELOMA_MORE"));
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div id="page-content-wrapper">
        <div className="col-sm-12">
          <h2 className="page-title">My Myeloma</h2>
          <span className="back"><Link to="/my-myeloma"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Back</Link></span>
          <ol className="breadcrumb">
            <li className="breadcrumb-item active"><Link to="/about-me">About Me</Link></li>
            <li className="breadcrumb-item">My Myeloma</li>
          </ol>
          <div className="myeloma_content">
            <h5>Thank you for the effort you have spent so far.</h5>
            <p>We understand that gathering all of this information takes time, but it is necessary so that HealthTree can provide you with the most complete tree of customized treatments specifically for you.</p>
            <p>Lets keep going with some specific genetic testing that you may have had done.</p>
          </div>
          <form className="mt-30" noValidate onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="form-group row align-items-center">
              <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label"> Have you ever had a FISH (fluorescence in situ hybridization) test performed? </label>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <div className="btn-group toggle-switch dnt-kn" id="status" data-toggle="buttons">
                  <label className={this.state.fishTestPerformedActive === 1 ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"}>
                    <Field
                      name="fish_test"
                      component="input"
                      type="radio"
                      value="1"
                      checked={this.state.fishTestPerformedActive === 1 ? true : false }
                      onClick={(e) => this.setState({ fishTestPerformedActive: 1 })} />
                    Yes</label>
                  <label className={this.state.fishTestPerformedActive === 0 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"}>
                    <Field
                      name="fish_test"
                      component="input"
                      type="radio"
                      value="0"
                      checked={this.state.fishTestPerformedActive === 0 ? true : false }
                      onClick={(e) => this.setState({ fishTestPerformedActive: 0 })} />
                    No</label>
                  <label className={this.state.fishTestPerformedActive === 2 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"}>
                    <Field
                      name="fish_test"
                      component="input"
                      type="radio"
                      value="2"
                      checked={this.state.fishTestPerformedActive === 2 ? true : false }
                      onClick={(e) => this.setState({ fishTestPerformedActive: 2 })} />
                    Don"t Know</label>
                </div>
              </div>
            </div>
            <div className="form-group row align-items-center">
              <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label"> Have you ever had gene expression profile test performed? The name of the test may be Signal Genetics, MyPRS or Skyline-92.</label>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <div className="btn-group toggle-switch dnt-kn" id="status" data-toggle="buttons">
                  <label className={this.state.expressionProfileTestActive === 1 ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"}>
                    <Field
                      name="gene_expression"
                      component="input"
                      type="radio"
                      value="1"
                      checked={this.state.expressionProfileTestActive === 1 ? true : false }
                      onClick={(e) => this.setState({ expressionProfileTestActive: 1 })} />
                    Yes</label>
                  <label className={this.state.expressionProfileTestActive === 0 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"}>
                    <Field
                      name="gene_expression"
                      component="input"
                      type="radio"
                      value="0"
                      checked={this.state.expressionProfileTestActive === 0 ? true : false }
                      onClick={(e) => this.setState({ expressionProfileTestActive: 0 })} />
                    No</label>
                  <label className={this.state.expressionProfileTestActive === 2 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"}>
                    <Field
                      name="gene_expression"
                      component="input"
                      type="radio"
                      value="2"
                      checked={this.state.expressionProfileTestActive === 2 ? true : false }
                      onClick={(e) => this.setState({ expressionProfileTestActive: 2 })} />
                    Don"t Know</label>
                </div>
              </div>
            </div>
            <div className="form-group row align-items-center">
              <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label">Have you ever had Next Generation Sequencing genetics
                tests performed?</label>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <div className="btn-group toggle-switch dnt-kn" id="status" data-toggle="buttons">
                  <label className={this.state.geneticsTestsActive === 1 ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg"}>
                    <Field
                      name="next_generation"
                      component="input"
                      type="radio"
                      value="1"
                      checked={this.state.geneticsTestsActive === 1 ? true : false }
                      onClick={(e) => this.setState({ geneticsTestsActive: 1 })} />
                    Yes</label>
                  <label className={this.state.geneticsTestsActive === 0 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"}>
                    <Field
                      name="next_generation"
                      component="input"
                      type="radio"
                      value="0"
                      checked={this.state.geneticsTestsActive === 0 ? true : false }
                      onClick={(e) => this.setState({ geneticsTestsActive: 0 })} />
                    No</label>
                  <label className={this.state.geneticsTestsActive === 2 ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg"}>
                    <Field
                      name="next_generation"
                      component="input"
                      type="radio"
                      value="2"
                      checked={this.state.geneticsTestsActive === 2 ? true : false }
                      onClick={(e) => this.setState({ geneticsTestsActive: 2 })} />
                    Don"t Know</label>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticating: state.patient.isAuthenticating,
    userinfo: state.user.userinfo,
    initialValues: state.patient.myMyeloma,
    myMyelomaId: state.patient.myMyelomaId,
  };
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

MyMyeloamaMore = reduxForm({
  form: "MyMyeloamaMoreForm",
  validate,
})(MyMyeloamaMore);
export default connect(mapStateToProps, { getMyMyeloma, saveMyMyeloma })(MyMyeloamaMore);
