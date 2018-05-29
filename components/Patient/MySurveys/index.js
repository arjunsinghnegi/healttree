import { browserHistory, Link } from "react-router";
import { getSurveyQuestions, getSurveys, resetSurveys } from "../../../actions/surveyActions";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import SurveyQuestion from "../Modals/surveyQuestions";
class MySurveys extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      surveyQuestions: [],
      userInfo: null,
      surveys: [],
      "showLoader": false,
      modal: false,
    };
  }

  componentDidMount() {
    this.setState({ showLoader: true });
    this.props.getSurveys(this.props.token);
    this.props.getUserInfo(this.props.token);
    this.modalTitle = "";
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.userInfo !== props.userInfo) {
        console.log("nextProps in surveys", nextProps.userInfo);
        this.setState({ userInfo: nextProps.userInfo });
      }
      if (nextProps.isSuccess && nextProps.surveyData) {
        this.setState({ surveys: nextProps.surveyData, showLoader: false });
        this.props.resetSurveys();
      }

      // for survey questions
      if (nextProps.isQuestionSuccess && nextProps.surveyQuestions) {
        this.setState({ surveyQuestions: nextProps.surveyQuestions, showLoader: false }, function() {
          this.setState({ "modal": true });
        });
        this.props.resetSurveys();
      }
    }
  }

  // function to be called when particular button is clicked
  onClick(e, survey) {
    e.preventDefault();
    this.setState({ showLoader: true });
    this.modalTitle = survey.attributes.name;
    this.surveyId = survey.id;
    this.props.getSurveyQuestions(this.props.token, survey.id);
  }

  // Open modal on add and update department
  open_modal(e) {
    //  e.preventDefault();
    this.setState({
      modal: !this.state.modal,
    });
  }
  /* *************************RENDER FUNCTION******************************* */
  render() {
    const listItems = this.state.surveys.map((obj, key) =>
      <div className="row" key={key}>
        <div className="col-sm-12 survey-div">
          <div className="survey-dv">
            <p className="survey-request"><b>{key + 1}. REQUEST FROM {obj.attributes.creator}</b></p>
            <span className="survey-span">“{obj.attributes.name}”</span>
            {this.state.userInfo && <div className="survey-btn">
              <button onClick={(e) => this.onClick(e, obj)} type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top">Complete Survey</button>
            </div>}
          </div>
        </div>
      </div>
    );
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        {this.state.modal && <SurveyQuestion
          userInfo = {this.state.userInfo}
          token = {this.props.token}
          title= {this.modalTitle}
          surveyId= {this.surveyId}
          modal_var = {this.state.modal}
          questions = {this.state.surveyQuestions}
          handle_modal = { (e) => this.open_modal(e) } />}
        <div className="col-sm-12">
          <h2 className="page-title">Surveys</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"></li>
          </ol>
          {listItems}
        </div>
        <div className="col-sm-12 text-center">
          <Link to="/settings" className="btn green-btn green-hvr-bounce-to-top labs-info-btn btn-rt">Continue</Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isRequesting: state.surveyQuestions.isRequesting,
    isError: state.surveyQuestions.isError,
    isSuccess: state.surveyQuestions.isSuccess,
    surveyData: state.surveyQuestions.data,
    isQuestionRequesting: state.surveyQuestions.isQuestionRequesting,
    isQuestionError: state.surveyQuestions.isQuestionError,
    isQuestionSuccess: state.surveyQuestions.isQuestionSuccess,
    surveyQuestions: state.surveyQuestions.questions,
    userInfo: state.user.userinfo,
    // isUpdateSuccess: state.surveyQuestions.isUpdateSuccess,
  };
}

export default connect(mapStateToProps, { getSurveys, getSurveyQuestions, resetSurveys, getUserInfo })(MySurveys);
