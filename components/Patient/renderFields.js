/**
 * @fieldDefinition
 * @description : fields constant used in redux form
 * @createdby   : smartData
 */
import "react-datepicker/dist/react-datepicker.css";
import "react-select/dist/react-select.css";
import { browserHistory, Link } from "react-router";
import DatePicker from "react-datepicker";
import { FormGroup } from "reactstrap";
import MaskedInput from "react-maskedinput";
import moment from "moment";
import React from "react";
import Select from "react-select";


export const renderInputField = ({ input,
  placeholder,
  type,
  className,
  maxLength,
  onKeyUp,
  autoComplete,
  ref,
  autoFocus,
  tabIndex,
  id,
  min,
  max,
  step,
  meta: { touched, error, warning },
}) => (
  <div>
    <input {...input}
      autoFocus={autoFocus}
      type={type}
      ref={ref}
      id={id}
      className={className}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyUp={onKeyUp}
      tabIndex={tabIndex}
      min={min}
      max={max}
      step={step}
      autoComplete={autoComplete}/>
    {touched && ((error && <span className="text-error">{error}</span>) ||
      (warning && <span className="text-warning">{warning}</span>))}
  </div>
);


/* normalize  */
export const normalizePhone = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "")
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 3) {
      return onlyNums + "-";
    }
    if (onlyNums.length === 6) {
      return onlyNums.slice(0, 3) + "-" + onlyNums.slice(3) + "-";
    }
  }
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  if (onlyNums.length <= 6) {
    return onlyNums.slice(0, 3) + "-" + onlyNums.slice(3);
  }
  return onlyNums.slice(0, 3) + "-" + onlyNums.slice(3, 6) + "-" + onlyNums.slice(6, 10);
}

/* normalize finished */
export const renderNumberField = ({ input,
  placeholder,
  type,
  className,
  maxLength,
  onKeyUp,
  autoComplete,
  ref,
  autoFocus,
  tabIndex,
  id,
  val,
  name,
  size,
  onChange,
  meta: { touched, error, warning },
}) => (
  <div>
    <MaskedInput tabIndex={tabIndex} type="text" mask="11.11" name={name} size={size} value={val} className={className} onChange={onChange}/>
    {/* <input {...input}
    onChange={this._onChange}
      autoFocus={autoFocus}
      type={type}
      ref={ref}
      id={id}
      className={className}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyUp={onKeyUp}
      tabIndex={tabIndex}
      min={min}
      max={max}
      step={step}
      autoComplete={autoComplete}/>
    {touched && ((error && <span className="text-error">{error}</span>) ||
      (warning && <span className="text-warning">{warning}</span>))} */}
  </div>
);
export const renderTextArea = ({ input,
  placeholder,
  type,
  className,
  maxLength,
  onKeyUp,
  autoComplete,
  rows,
  cols,
  tabIndex,
  meta: { touched, error, warning },
}) => (
  <div>
    <textarea {...input}
      type={type}
      className={className}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyUp={onKeyUp}
      autoComplete={autoComplete}
      rows={rows}
      tabIndex={tabIndex}
    />
    {touched &&
                            ((error && <span className="text-error">{error}</span>) ||
                              (warning && <span className="text-warning">{warning}</span>))}
  </div>
);

export const renderSelectField = ({ input, name, value, selected, options, placeholderText, onChange, tabIndex, meta: { touched, error, warning } }) => (
  <div>
    <Select
      {...input}
      name={name}
      options={options}
      value={input.value}
      selected={selected}
      placeholder={placeholderText}
      onChange={(e) => input.onChange(e)}
      tabIndex={tabIndex.toString()}
      onBlur={() => input.onBlur(input.value) } />
    {touched &&
       ((error && <span className="text-error">{error}</span>) ||
         (warning && <span className="text-warning">{warning}</span>))}
  </div>
);

export const renderMultiSelectField = ({ input, name, value, selected, options, placeholderText, onChange, meta: { touched, error, warning } }) => (
  <div>
    <Select
      {...input}
      name={name}
      options={options}
      value={input.value}
      selected={selected}
      placeholder={placeholderText}
      onChange={(e) => input.onChange(e)}
      multi
      onBlur={() => input.onBlur(input.value) } />
    {touched &&
       ((error && <span className="text-error">{error}</span>) ||
         (warning && <span className="text-warning">{warning}</span>))}
  </div>
);

export const renderCheckbox = ({ input, label, isLink, name, id, className, tabIndex, htmlFor, meta: { touched, error, warning } }) => (
  <div>
    <input {...input}
      type="checkbox"
      id={id}
      className={className}
      tabIndex={tabIndex}
      name={name} />
    {!isLink && <label htmlFor={htmlFor} className="checkbox-custom-label label-sm">{label}</label>}
    {isLink && <label htmlFor={htmlFor} className="checkbox-custom-label label-sm">By checking this box, I agree to the HealthTree <a href="/terms-of-use" target="_blank">Terms of Use</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a> .</label>}
    {touched &&
      ((error && <span className="text-error">{error}</span>) ||
        (warning && <span className="text-warning">{warning}</span>))}
  </div>
);

export const renderRadio = ({ input, name, id, value, checked, tabIndex, label, getRadioButtonValue, templateList, meta: { touched, error, warning } }) => (
  <div>
    <input {...input}
      name="exercise"
      type="radio"
      className="radio-custom"
      value={value}
      tabIndex={tabIndex}
      onClick={(e) => getRadioButtonValue(e.target.value)} />
  </div>
);

export const renderDynamicRadio = ({ input, label, checked, className, getRadioButtonValue, templateList, meta: { touched, error, warning } }) => (
  <div>
    {
      templateList.map((obj, index) => {
        return (
          <div key={index}>
            <input {...input}
              name="fieldName"
              type="radio"
              id={`radio-${index}`}
              className={`${className} radio-custom`}
              value={obj.value}
              checked={checked == obj.value ? true : false}
              onClick={(e) => getRadioButtonValue(e.target.value)} />
            <label htmlFor={`radio-${index}`} className="radio-custom-label">{obj.label}</label>
          </div>
        );
      })
    }
  </div>
);

// export const renderDateField = ({ input, showYearFlag, label, onDateChange, selected, minDate, maxDate, className, placeholder, minDateVal, maxDateVal, showMonthFlag, readOnly, onChangeRaw, meta: { touched, error, warning } }) => {
//   return (
//     <div>
//       <DatePicker
//         selected={selected}
//         minDate={minDate}
//         maxDate={maxDate}
//         onChange={onDateChange}
//         onClick={onDateChange}
//         className={className}
//         placeholderText={placeholder}
//         dateFormat="MM/DD/YYYY"
//         showYearDropdown={showYearFlag ? true : false }
//         dropdownMode="select"
//         readOnly = {readOnly || false}
//         onChangeRaw={onChangeRaw}
//         showMonthDropdown={showMonthFlag ? true : false} />
//       {touched &&
//           ((error && <span className="text-error">{error}</span>) ||
//             (warning && <span className="text-warning">{warning}</span>))}
//     </div>
//   );
// };

export const renderDateField = ({ input, showYearFlag, label, onDateChange, tabIndex, selected, minDate, maxDate, className, placeholder, minDateVal, maxDateVal, showMonthFlag, readOnly, onChangeRaw, meta: { touched, error, warning } }) => {
  return (
    <div>
      <DatePicker
        selected={selected}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onDateChange}
        onClick={onDateChange}
        className={className}
        placeholderText={placeholder}
        tabIndex={tabIndex}
        dateFormat="MM/DD/YYYY"
        // scrollableYearDropdown
        showYearDropdown={showYearFlag ? true : false }
        // yearDropdownItemNumber={0}
        readOnly = {readOnly || false}
        onChangeRaw={onChangeRaw}
        showMonthDropdown={showMonthFlag ? true : false} />
      {touched &&
          ((error && <span className="text-error">{error}</span>) ||
            (warning && <span className="text-warning">{warning}</span>))}
    </div>
  );
};
// export const raceArr = [
//   { value: "ANI", label: "American Indian / Native American" },
//   { value: "ASN", label: "Asian" },
//   { value: "BAA", label: "Black / African American" },
//   { value: "HLA", label: "Hispanic/Latino" },
//   { value: "WCA", label: "White / Caucasian (non-Hispanic)" },
//   { value: "PIA", label: "Pacific Islander" },
//   { value: "NTA", label: "I Prefer Not To Answer" },
//   { value: "OTR", label: "Other" },
// ];
export const raceArr = [
  { value: "American Indian / Native American", label: "American Indian / Native American" },
  { value: "Asian", label: "Asian" },
  { value: "Black / African American", label: "Black / African American" },
  { value: "Hispanic/Latino", label: "Hispanic/Latino" },
  { value: "White / Caucasian (non-Hispanic)", label: "White / Caucasian (non-Hispanic)" },
  { value: "Pacific Islander", label: "Pacific Islander" },
  { value: "I Prefer Not To Answer", label: "I Prefer Not To Answer" },
  { value: "Other", label: "Other" },
];

export const initialDiagnosisArr = [
  { value: "1", label: "MGUS (monoclonal gammopathy of undetermined significance)" },
  { value: "2", label: "Smoldering myeloma" },
  { value: "3", label: "High-risk smoldering myeloma" },
  { value: "4", label: "Multiple myeloma" },
  { value: "5", label: "Multiple myeloma and amyloidosis" },
  { value: "6", label: "Primary Plasma Cell Leukemia (PCL)" },
  { value: "7", label: "Multiple myeloma and Secondary Plasma Cell Leukemia" },
  { value: "9", label: "Plasmacytoma" },
  { value: "8", label: "I don't know" },
];


export const imagingLesionsArr = [
  { value: "0", label: "No lesions" },
  { value: "1", label: "5 or less" },
  { value: "2", label: "More than 5" },
  { value: "3", label: "I don't know" },
];

export const REMISSION_STATUS_OUTCOMES = [
  { value: "0", label: "Remaining Active Disease" },
  { value: "1", label: "Partial Response (PR)" },
  { value: "2", label: "Very Good Partial Response (VGPR)" },
  { value: "3", label: "Complete Response (CR)" },
  { value: "4", label: "Stringent Complete Response (sCR)" },
  { value: "5", label: "MRD positive" },
  { value: "6", label: "MRD negative" },
];
export const OUTCOMES_STATUS = [
  { value: "0", label: "The treatment did not reduce my myeloma." },
  { value: "1", label: "The treatment kept my myeloma under control." },
  { value: "2", label: "The treatment eliminated my myeloma (Remission)." },
  { value: "3", label: "The treatment completely eliminated my disease and made me minimal disease negative (MRD negative)." },
  { value: "4", label: "My Myeloma returned requiring treatment." },
];
// export const REMISSION_STATUS_OUTCOMESS = [
//   { value: "1", label: "Complete Response (CR)" },
//   { value: "2", label: "MRD negative" },
//   { value: "3", label: "MRD positive" },
//   { value: "4", label: "Partial Response (PR)" },
//   { value: "5", label: "Stringent Complete Response (sCR)" },
//   { value: "6", label: "Remaining Active Disease" },
//   { value: "7", label: "Very Good Partial Response (VGPR)" },
// ];
export const farLiveArr = [
  { value: "50_miles_or_less", label: "50 miles or less" },
  { value: "20_to_40_miles", label: "20 to 40 miles" },
  { value: "10_to_20_miles", label: "10 to 20 miles" },
  { value: "5_to_10_miles", label: "5 to 10 miles" },
  { value: "5_miles_or_less", label: "5 miles or less" },
];

export const monthOptions = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

export function yearOptions() {
  let start = new Date().getFullYear();
  let end = 1900;
  let optn = [];
  for (let year = start ; year >= end; year--) {
    optn.push({ value: year, label: year });
  }
  return optn;
}

export function parseJSON(response) {
  return response.data;
}

export const CONST_EXCERCISE_INTERVAL = [
  { value: 1, label: "Never Exercise Regularly" },
  { value: 2, label: "1-2 times per week" },
  { value: 3, label: "3-4 times per week" },
  { value: 4, label: "5-7 times per week" },
];

export const CONST_EXCERCISE_INTENSITY = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

export const CONST_FITNESS_LEVEL = [
  { value: 1, label: "Frail" },
  { value: 2, label: "Unfit" },
  { value: 3, label: "Moderately Fit" },
  { value: 4, label: "Very Fit" },
];
// treamtments grouped new
// 24/10/2017
export const TREATMENTS_CONST = [
  { value: "Group1", label: "Stem Cell Transplant Induction Treatments", treatments: [
    { value: "D-PACE", label: "D-PACE (Dexamethasone, Platinum, Adriamycin, Cytoxan, Etoposide)", checked: false },
    { value: "D-PACE-MORE", label: "DT-PACE (Dexamethasone, Thalidomide, Platinum, Adriamycin, Cytoxan, Etoposide)", checked: false },
    { value: "VDT-PACE", label: "VDT-PACE (Velcade, dex, Platinum, Adriamycin, Cytoxan, Etoposide)", checked: false },
  ] },
  { value: "Group2", label: "Chemotherapies", treatments: [
    { value: "Mel", label: "Alkeran (melphalan)", checked: false },
    { value: "Doxo", label: "Doxil (doxorubicin)", checked: false },
    { value: "Cyt", label: "Cytoxan   (cyclophosphamide)", checked: false },
    { value: "Ida", label: "Zavedos (idarubicin)", checked: false },
    { value: "TRE", label: "TREANDA (bendamustine)", checked: false },
  ] },
  { value: "Group3", label: "Proteasome Inhibitors", treatments: [
    { value: "Vel", label: "Velcade (bortezomib)", checked: false },
    { value: "Nin", label: "Ninlaro (ixazomib)", checked: false },
    { value: "Kyp", label: "Kyprolis (carfilzomib)", checked: false },
  ] },
  { value: "Group4", label: "Immunomodulators", treatments: [
    { value: "Rev", label: "Revlimid (lenalidomide)", checked: false },
    { value: "Pom", label: "Pomalyst (pomalidomide)", checked: false },
    { value: "Thal", label: "Thalomid or Synovir (thalidomide)", checked: false },
  ] },
  { value: "Group5", label: "Steroids", treatments: [
    { value: "Dex", label: "Dexamethasone", checked: false },
    { value: "Pred", label: "Prednisone", checked: false },
  ] },
  { value: "Group6", label: "Immunotherapies", treatments: [
    { value: "Dar", label: "Darzalex (daratumumab)", checked: false },
    { value: "Emp", label: "Empliciti (elotuzumab)", checked: false },
  ] },
  { value: "Group7", label: "Other Inhibitors", treatments: [
    { value: "Fary", label: "Farydak (panobinostat)", checked: false },
  ] },
  { value: "Group8", label: "Antibiotics", treatments: [
    { value: "Bia", label: "Biaxin (clarithromycin)", checked: false },
  ] },
  { value: "Group9", label: "Bone Strengtheners", treatments: [
    { value: "Are", label: "Aredia", checked: false },
    { value: "Zom", label: "Zometa", checked: false },
  ] },
];

// manish (old)
export const CONST_TREATMENTS = [
  { value: "Group1", label: "Stem Cell Transplant Induction Treatments", disabled: true },
  { value: "D-PACE", label: "D-PACE (Dexamethasone, Platinum, Adriamycin, Cytoxan, Etoposide)" },
  { value: "D-PACE-MORE", label: "DT-PACE (Dexamethasone, Thalidomide, Platinum, Adriamycin, Cytoxan, Etoposide)" },
  { value: "VDT-PACE", label: "VDT-PACE (Velcade, dex, Platinum, Adriamycin, Cytoxan, Etoposide)" },
  { value: "Group2", label: "Chemotherapies", disabled: true },
  { value: "Mel", label: "Alkeran (melphalan)" },
  { value: "Doxo", label: "Doxil (doxorubicin)" },
  { value: "Cyt", label: "Cytoxan   (cyclophosphamide)" },
  { value: "Ida", label: "Zavedos (idarubicin)" },
  { value: "TRE", label: "TREANDA (bendamustine)" },
  { value: "Group3", label: "Proteasome Inhibitors" },
  { value: "Vel", label: "Velcade (bortezomib)" },
  { value: "Nin", label: "Ninlaro (ixazomib)" },
  { value: "Kyp", label: "Kyprolis (carfilzomib)" },
  { value: "Group4", label: "Immunomodulators", disabled: true },
  { value: "Rev", label: "Revlimid (lenalidomide)" },
  { value: "Pom", label: "Pomalyst (pomalidomide)" },
  { value: "Thal", label: "Thalomid or Synovir (thalidomide)" },
  { value: "Group5", label: "Steroids", disabled: true },
  { value: "Dex", label: "Dexamethasone" },
  { value: "Pred", label: "Prednisone" },
  { value: "Group6", label: "Immunotherapies", disabled: true },
  { value: "Dar", label: "Darzalex (daratumumab)" },
  { value: "Emp", label: "Empliciti (elotuzumab)" },
  { value: "Group7", label: "Other Inhibitors", disabled: true },
  { value: "Fary", label: "Farydak (panobinostat)" },
  { value: "Group8", label: "Antibiotics", disabled: true },
  { value: "Bia", label: "Biaxin (clarithromycin)" },
  { value: "Group9", label: "Bone Strengtheners", disabled: true },
  { value: "Are", label: "Aredia" },
  { value: "Zom", label: "Zometa" },
];

export const CONST_DOSAGE =
  {
    "D-PACE": [{ value: "Not Applicable", label: "Not Applicable" }],
    "D-PACE-MORE": [{ value: "Not Applicable", label: "Not Applicable" }],
    "VDT-PACE": [{ value: "Not Applicable", label: "Not Applicable" }],
    "Mel": [{ value: "100 mg/m2", label: "100 mg/m2" }, { value: "200 mg/m2", label: "200 mg/m2" }],
    "Vel": [
      { value: "Infusion 1.3 mg/m2", label: "Infusion 1.3 mg/m2" },
      { value: "Infusion 1.5 mg/m2", label: "Infusion 1.5 mg/m2" },
      { value: "SubQ 2.5 mg/m2", label: "SubQ 2.5 mg/m2" },
      { value: "SubQ 1.5 mg/m2", label: "SubQ 1.5 mg/m2" },
      { value: "SubQ 1.3 mg/m2", label: "SubQ 1.3 mg/m2" },
      { value: "SubQ 1.0 mg/m2", label: "SubQ 1.0 mg/m2" },
    ],
    "Nin": [
      { value: "4 mg", label: "4 mg" },
      { value: "3 mg", label: "3 mg" },
      { value: "2.3 mg", label: "2.3 mg" },
    ],
    "Kyp": [
      { value: "70 mg/m2", label: "70 mg/m2" },
      { value: "56 mg/m2", label: "56 mg/m2" },
      { value: "36 mg/m2", label: "36 mg/m2" },
      { value: "27 mg/m2", label: "27 mg/m2" },
    ],
    "Rev": [
      { value: "2.5 mg", label: "2.5 mg" },
      { value: "5 mg", label: "5 mg" },
      { value: "10 mg", label: "10 mg" },
      { value: "15 mg", label: "15 mg" },
      { value: "20 mg", label: "20 mg" },
      { value: "25 mg", label: "25 mg" },
    ],
    "Pom": [
      { value: "4 mg", label: "4 mg" },
    ],
    "Thal": [
      { value: "50 mg", label: "50 mg" },
      { value: "100 mg", label: "100 mg" },
      { value: "150 mg", label: "150 mg" },
      { value: "200 mg", label: "200 mg" },
    ],

    "Dex": [
      { value: "40 mg", label: "40 mg" },
      { value: "20 mg", label: "20 mg" },
    ],

    "Dar": [
      { value: "16 mg/kg of body weight", label: "16 mg/kg of body weight" },
    ],

    "Emp": [
      { value: "10 mg/kg of body weight", label: "10 mg/kg of body weight" },
    ],

    "Fary": [
      { value: "20 mg", label: "20 mg" },
    ],
    "Are": [
      { value: "90 mg", label: "90 mg" },
      { value: "60 mg", label: "60 mg" },
    ],

    "Zom": [
      { value: "4 mg", label: "4 mg" },
      { value: "5 mg", label: "5 mg" },
    ],
  };

export const CONST_FREQUENCY =
  {
    "D-PACE": [
      { value: "One cycle", label: "One cycle" },
      { value: "Two cycles", label: "Two cycles" },
    ],
    "DT-PACE": [
      { value: "One cycle", label: "One cycle" },
      { value: "Two cycles", label: "Two cycles" },
    ],
    "VDT-PACE": [
      { value: "One cycle", label: "One cycle" },
      { value: "Two cycles", label: "Two cycles" },
    ],
    "Mel": [
      { value: "Once", label: "Once" },
    ],
    "Vel": [
      { value: "Once weekly (continuous)", label: "Once weekly (continuous)" },
      { value: "Once weekly (1 week on, 1 week off)", label: "Once weekly (1 week on, 1 week off)" },
      { value: "Once weekly (1 week on, 2 weeks off)", label: "Once weekly (1 week on, 2 weeks off)" },
      { value: "Once weekly (3 weeks on, 1 week off)", label: "Once weekly (3 weeks on, 1 week off)" },
      { value: "Twice weekly (One week on, one week off)", label: "Twice weekly (One week on, one week off)" },
      { value: "Twice weekly (1 week on, 2 weeks off)", label: "Twice weekly (1 week on, 2 weeks off)" },
      { value: "Twice weekly continuously", label: "Twice weekly continuously" },
    ],
    "Nin": [
      { value: "Once weekly (3 weeks on, 1 week off)", label: "Once weekly (3 weeks on, 1 week off)" },
    ],
    "Kyp": [
      { value: "Once weekly", label: "Once weekly" },
      { value: "Twice weekly", label: "Twice weekly" },
    ],
    "Rev": [
      { value: "Once daily (21 days on, 7 days off)", label: "Once daily (21 days on, 7 days off)" },
    ],
    "Pom": [
      { value: "Once daily (21 days on, 7 days off)", label: "Once daily (21 days on, 7 days off)" },
    ],
    "Thal": [
      { value: "Once daily", label: "Once daily" },
    ],

    "Dex": [
      { value: "Twice weekly", label: "Twice weekly" },
      { value: "Once weekly", label: "Once weekly" },
      { value: "Days 1-4 every three weeks", label: "Days 1-4 every three weeks" },
      { value: "Days 1-4 and 15-18 every 28 days", label: "Days 1-4 and 15-18 every 28 days" },
    ],

    "Dar": [
      { value: "Once weekly (weeks 1-8), then once every two week (weeks 9-24), then once every four weeks", label: "Once weekly (weeks 1-8), then once every two week (weeks 9-24), then once every four weeks" },
    ],

    "Emp": [
      { value: "Once weekly for two cycles, then every two weeks", label: "Once weekly for two cycles, then every two weeks" },
    ],

    "Fary": [
      { value: "Three times weekly then once every other day for weeks 1 and 2 of 21 day cycle", label: "Three times weekly then once every other day for weeks 1 and 2 of 21 day cycle" },
    ],

    "Are": [
      { value: "Weekly", label: "Weekly" },
      { value: "Monthly", label: "Monthly" },
      { value: "Quarterly", label: "Quarterly" },
      { value: "Annually", label: "Annually" },
    ],

    "Zom": [
      { value: "Weekly", label: "Weekly" },
      { value: "Monthly", label: "Monthly" },
      { value: "Quarterly", label: "Quarterly" },
      { value: "Annually", label: "Annually" },
    ],
  };

export const CONST_SIDE_EFFECT = [
  { value: "Nausea", label: "Nausea" },
  { value: "Vomiting", label: "Vomiting" },
  { value: "Diarrhea", label: "Diarrhea" },
  { value: "Constipation", label: "Constipation" },
  { value: "High blood pressure", label: "High blood pressure" },
  { value: "Low blood pressure", label: "Low blood pressure" },
  { value: "Cardiac involvement", label: "Cardiac involvement" },
  { value: "Neuropathy (numbness and tingling in extremities)", label: "Neuropathy (numbness and tingling in extremities)" },
];

// export const OUTCOME_LABEL_KEYS = [
//   {
//     label: "Active Disease / Relapse",
//     className: "active-disease-relapse",
//   },
//   {
//     label: "Stringent Complete Response (sCR)",
//     className: "stringent-complete-remission",
//   },
//   {
//     label: "Partial Response (PR)",
//     className: "remission",
//   },
//   {
//     label: "MRD Positive",
//     className: "mrd-positive",
//   },
//   {
//     label: "Very Good Partial Response (VGPR)",
//     className: "very-good-partial-remission",
//   },
//   {
//     label: "MRD Negative",
//     className: "mrd-negative",
//   },
//   {
//     label: "Complete Response (CR)",
//     className: "complete-remission",
//   },
//   {
//     label: "Side Effects",
//     className: "side-effect",
//   },


// ];

// poonam 3 Nov 2017
export const OUTCOME_LABEL_KEYS = [
  {
    label: "Active Disease / Relapse",
    className: "active-disease-relapse",
  },
  {
    label: "MRD Negative",
    className: "mrd-negative",
  },
  {
    label: "Very Good Partial Response (VGPR) / Partial Response (PR)",
    className: "very-good-partial-remission",
  },
  {
    label: "Side Effects",
    className: "side-effect",
  },
  {
    label: "Complete Response (CR) / Stringent Complete Response (sCR)",
    className: "complete-remission",
  },


];
/* OUTCOME CONST SECTION */
let treatmentElimination = [
  {
    value: 5,
    label: "I had a complete response (CR) to the treatment",
    infoText: "No M-protein on monoclonal protein test, no M-protein on blood or urine immunofixation test, no plasmacytomas or lesions out of the bone marrow, less than 5% plasma cells in the bone marrow.",
    checked: false,
  },
  {
    value: 6,
    label: "I had a stringent complete response (sCR) to the treatment",
    infoText: "No M-protein on monoclonal protein test, no M-protein on blood or urine immunofixation test, no plasmacytomas or lesions out of the bone marrow, less than 5% plasma cells in the bone marrow, a normal kappa-lambda serum free light chain ratio and no signs of abnormal plasma cells in the bone marrow.",
    checked: false,
  },
  {
    value: 7,
    label: "I have been tested as negative for minimal residual disease (MRD)",
    infoText: "This is a flow cytometry or Next Generation Sequencing MRD test that shows how many myeloma cells per hundred thousand or per million can be found in the biopsy sample",
    checked: false,
  },
  {
    value: 8,
    label: "I don’t know the details of my response",
    infoText: null,
    checked: false,
    data: null,
  },
];

let treatmentDiscontinuation = [
  {
    value: 9,
    label: "Severity of the side effects",
    checked: false,
  },
  {
    value: 10,
    label: "Cost of the treatment",
    checked: false,
  },
  {
    value: 11,
    label: "Too much travel",
    checked: false,
  },
  {
    value: 12,
    label: "Too much time in the clinic",
    checked: false,
  },
  {
    value: 13,
    label: "Other",
    checked: false,
    suboptions: [{
      "value": null,
    },
    ],
  },
];

export const OUTCOME_CONST = [
  {
    value: 0,
    checked: false,
    label: "The treatment did not reduce my myeloma",
    ref: "Active Disease / Relapse",
  },
  {
    value: 1,
    checked: false,
    label: "The treatment reduced my myeloma and kept my myeloma under control",
    ref: "VGPR or PR",
  },
  {
    value: 3,
    checked: false,
    label: "The treatment initially reduced my myeloma but my myeloma began to increase and required a treatment change",
    ref: "CR or sCR",
  },
  {
    value: 2,
    checked: false,
    // label: "The treatment eliminated my myeloma",
    label: "My myeloma is now undetectable",
    ref: "MRD negative",
    subOptions: treatmentElimination,
    inputType: "radio",
    subOptionsText: "There are various levels to determine the level of your remission",
  },
  {
    value: 4,
    checked: false,
    inputType: "checkbox",
    label: "I discontinued this treatment",
    ref: "",
    subOptions: treatmentDiscontinuation,
    subOptionsText: "I discontinued this treatment for the following reasons (select all that apply)",
  },
];
export const TREATMENT_TYPE_CONST = [
  {
    value: 0,
    checked: false,
    label: "Induction",
    infoText: "Induction therapy is typically combination treatment given before a stem cell transplant.",
  },
  {
    value: 2,
    checked: false,
    label: "Stem cell transplant",
  },
  {
    value: 3,
    checked: false,
    label: "Consolidation",
    infoText: "Consolidation therapy is typically treatment given immediately following a stem cell transplant to deepen remissions.",
  },
  {
    value: 1,
    checked: false,
    label: "Maintenance Therapy",
    infoText: "Maintenance therapy is typically given after initial treatment to extend the time in remission.",
  },
  {
    value: 4,
    checked: false,
    label: "General",
    infoText: "General myeloma therapy would include any myeloma care with no planned stem cell transplant for newly diagnosed patients.",
  },
  {
    value: 5,
    checked: false,
    label: "Therapy at relapse",
  },
  {
    value: 6,
    checked: false,
    label: "I'm not sure",
  },
];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// No. of cycles received
function formCycleArray() {
  let tmpArr = [];
  for (let i = 0; i <= 50; i++) {
    let obj = { value: i, label: i };
    if (i === 0) {
      obj = { value: i, label: "Don't Know" };
    }
    tmpArr.push(obj);
  }
  return tmpArr;
}
export const CYCLES = formCycleArray();
