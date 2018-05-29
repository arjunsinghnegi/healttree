/**
 * @reducer       : index reducer
 * @description   :
 * @Created by    : smartData
 */
import ChangePassword from "./changePasswordReducer";
import ClinicalTrials from "./clinicalTrialsReducer";
import { combineReducers } from "redux";
import DynamicSideEffects from "./dynamicSideEffectsReducer";
import FeedbackReducer from "./feedbackReducer";
import FavoriteReducer from "./favoriteReducer";
import FilterReducer from "./filterReducer";
import { reducer as formReducer } from "redux-form"; // SAYING use redux form reducer as reducer
import FullProfileChildQues from "./fullProfileChildQuesReducer";
import FullProfileQuesReducer from "./fullProfileQuesReducer";
import FullProfileTabReducer from "./fullProfileTabReducer";
import HealthHistory from "./healthHistoryReducer";
import LoginReducer from "./loginReducer";
import MiscReducer from "./miscReducer";
import ModuleWeightReducer from "./moduleWeightReducer";
import MyelomaReducer from "./myelomaReducer";
import OutcomeReducer from "./outcomeReducer";
import PatientReducer from "./patientReducer";
import PersonalNoteReducer from "./personalNoteReducer";
import PrivacyPolicyReducer from "./privacyPolicyReducer";
import QuestionnaireReducer from "./questionnaireReducer";
import RemissionStatusReducer from "./remissionStatusReducer";
import saveSurveyReducer from "./saveSurveyReducer";
import SideEffectReducer from "./sideEffectReducer";
import StaticPageReducer from "./staticPagesReducer";
import SummaryReducer from "./summaryReducer";
import SurveyReducer from "./surveyReducer";
import TreatmentOptionsReducer from "./treatmentOptionsReducer";
import TreatmentReducer from "./treatmentReducer";
import TreatmentResourceReducer from "./treatmentResourceReducer";
import UserReducer from "./userReducer";


const rootReducer = combineReducers({
  favorite: FavoriteReducer,
  feedback: FeedbackReducer,
  filter: FilterReducer,
  form: formReducer,
  login: LoginReducer,
  user: UserReducer,
  patient: PatientReducer,
  sideEffect: SideEffectReducer,
  treatment: TreatmentReducer,
  remission: RemissionStatusReducer,
  healthHistoryOptions: HealthHistory,
  dynamicOutcome: OutcomeReducer,
  questionnaire: QuestionnaireReducer,
  consentForm: StaticPageReducer,
  summary: SummaryReducer,
  treatmentOptions: TreatmentOptionsReducer,
  treatmentResource: TreatmentResourceReducer,
  personalNote: PersonalNoteReducer,
  changePassword: ChangePassword,
  surveyQuestions: SurveyReducer,
  saveSurvey: saveSurveyReducer,
  metaData: MiscReducer,
  tabsFullProfile: FullProfileTabReducer,
  fullProfileQues: FullProfileQuesReducer,
  fullProfileChildQues: FullProfileChildQues,
  dynamicSideEffects: DynamicSideEffects,
  clinicalTrials: ClinicalTrials,
  facilities: MyelomaReducer,
  moduleWeights: ModuleWeightReducer,
  privacyPolicy: PrivacyPolicyReducer,
});

export default rootReducer;
