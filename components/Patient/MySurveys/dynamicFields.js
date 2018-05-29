/**
 * @fieldDefinition
 * @description : fields constant used in redux form
 * @createdby   : smartData
 */
import "react-datepicker/dist/react-datepicker.css";
import "react-select/dist/react-select.css";
import DatePicker from "react-datepicker";
import { FormGroup } from "reactstrap";
import moment from "moment";
import React from "react";
import Select from "react-select";

// dynamic input field
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
      autoComplete={autoComplete}/>
    {touched && ((error && <span className="text-error">{error}</span>) || (warning && <span className="text-warning">{warning}</span>))}
  </div>
);

// dynamic text area field
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
    {touched && ((error && <span className="text-error">{error}</span>) || (warning && <span className="text-warning">{warning}</span>))}
  </div>
);

// select field 
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
      tabIndex={tabIndex}
      onBlur={() => input.onBlur(input.value) } />
    {touched && ((error && <span className="text-error">{error}</span>) || (warning && <span className="text-warning">{warning}</span>))}
  </div>
);


