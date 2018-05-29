
import { browserHistory, Route, Router } from "react-router";
// Import components to route
import AboutMeComponent from "../components/Patient/Aboutme";
import AddTreatment from "../components/Patient/MyTreatments/addTreatment";
import App from "../App";
import Auths from "../components/Auths";
import ConsentForm from "../components/Patient/MyLabs/consentForm";
import FishTest from "../components/Patient/MyMyelomaGenetics/fish-test";
import GeneExpressionProfileTest from "../components/Patient/MyMyelomaGenetics/gene-expr-profile";
import HealthHistory from "../components/Patient/CompleteHealthHistory";
import LoginComponent from "../components/Logins";
import MyFitnessLevel from "../components/Patient/FitnessLevel";
import MyHealthHistory from "../components/Patient/HealthHistory/health-history";
import MyLabs from "../components/Patient/MyLabs";
import MyLabsInfo from "../components/Patient/MyLabs/info";
import MyMyelomaComponent from "../components/Patient/MyMyeloama/my-myeloma";
import MyMyelomaMoreComponent from "../components/Patient/MyMyeloama/my-myeloma-more";
import MyOutcome from "../components/Patient/MyOutcome";
import MyRemissionStatus from "../components/Patient/RemissionStatus";
import MySideEffects from "../components/Patient/SideEffects";
import MySummary from "../components/Patient/Summary";
import MySurveys from "../components/Patient/MySurveys";
import MyTreatments from "../components/Patient/MyTreatments";

import PatientPortalInfo from "../components/Patient/MyLabs/patientPortalInfo";
import PrivacyPolicy from "../components/Logins/privacyPolicy";
import React from "react";
import RecordsRequest from "../components/Patient/MyLabs/recordsRequest";
import ResetPassword from "../components/Logins/reset-password";
import Settings from "../components/Patient/Settings";
import TermsOfUse from "../components/Logins/termsOfUse";
import TreatmentInfo from "../components/Patient/TreatmentOptions/treatment-info";
import TreatmentOptions from "../components/Patient/TreatmentOptions";
export default(
  <Router history={browserHistory}>
    <Route path="/" component={LoginComponent}>
      <Route path="/reset-password/:id" component={ResetPassword}></Route>
      {/* <Route path="/privacy_policy" component={PrivacyPolicy}></Route> */}
    </Route>
    <Route path="/privacy-policy" component={PrivacyPolicy}></Route>
    <Route path="/terms-of-use" component={TermsOfUse}></Route>
    <Route component={App}>
      <Route path="/about-me" component={Auths(AboutMeComponent)}></Route>
      <Route path="/myeloma-diagnosis" component={Auths(MyMyelomaComponent)}></Route>
      {/* <Route path="/my-myeloma-more" component={Auths(MyMyelomaMoreComponent)}></Route>  */}
      <Route path="/current-history" component={Auths(MyHealthHistory)}></Route>
      {/* <Route path="/fish-test" component={Auths(FishTest)}></Route> */}
      {/* <Route path="/gene-expression-profile-test" component={Auths(GeneExpressionProfileTest)}></Route> */}
      <Route path="/fitness-level" component={Auths(MyFitnessLevel)}></Route>
      <Route path="/treatments-outcomes" component={Auths(MyTreatments)}></Route>
      <Route path="/add-treatment" component={Auths(AddTreatment)}></Route>
      <Route path="/health-profile" component={Auths(HealthHistory)}></Route>
      <Route path="/side-effects" component={Auths(MySideEffects)}></Route>
      <Route path="/remission-status" component={Auths(MyRemissionStatus)}></Route>
      <Route path="/my-outcome" component={Auths(MyOutcome)}></Route>
      <Route path="/clinical-trials" component={Auths(MyLabs)}></Route>
      <Route path="/my-labs-info" component={Auths(MyLabsInfo)}></Route>
      <Route path="/my-patient-portal-info" component={Auths(PatientPortalInfo)}></Route>
      <Route path="/consent-form" component={Auths(ConsentForm)}></Route>
      <Route path="/treatment-options" component={Auths(TreatmentOptions)}></Route>
      <Route path="/surveys" component={Auths(MySurveys)}></Route>
      <Route path="/records-request" component={Auths(RecordsRequest)}></Route>
      <Route path="/summary" component={Auths(MySummary)}></Route>
      <Route path="/treatment-info/:id" component={Auths(TreatmentInfo)}></Route>
      <Route path="/settings" component={Auths(Settings)}></Route>
    </Route>
    <Route path="*" component={LoginComponent}/>
  </Router>
);
