/**
 * @fieldDefinition
 * @description : fields constant used in redux form
 * @createdby   : smartData
 */
import "react-datepicker/dist/react-datepicker.css";
import "react-select/dist/react-select.css";
import { Input, TextArea } from "react-input-component";
import DatePicker from "react-datepicker";
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
  onClick,
  autoComplete,
  ref,
  autoFocus,
  tabIndex,
  id,
  disabled,
  defaultValue,
  readOnly,
  meta: { touched, error, warning },
}) => (
  <div>
    <Input {...input}
      autoFocus={autoFocus}
      type={type}
      ref={ref}
      id={id}
      className={className}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyUp={onKeyUp}
      onClick={onClick}
      tabIndex={tabIndex}
      value={defaultValue}
      readOnly={disabled}
      // getRef={(input) => (this.username = input)}
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
  defaultValue,
  disabled,
  meta: { touched, error, warning },
}) => (
  <div>
    <TextArea {...input}
      type={type}
      className={className}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyUp={onKeyUp}
      autoComplete={autoComplete}
      rows={rows}
      tabIndex={tabIndex}
      value={defaultValue}
      disabled={disabled}
    />
    {touched && ((error && <span className="text-error">{error}</span>) || (warning && <span className="text-warning">{warning}</span>))}
  </div>
);

// select field 
export const renderSelectField = ({ defaultValue, input, name, value, selected, options, placeholderText, onChange, tabIndex, multiSelect,
  disabled, meta: { touched, error, warning } }) => (
  <div>
    <Select
      {...input}
      name={name}
      options={options}
      value={defaultValue}
      selected={selected}
      placeholder={placeholderText}
      onChange={(e) => input.onChange(e)}
      tabIndex={tabIndex}
      multi={multiSelect}
      disabled={disabled}
      onBlur={() => input.onBlur(input.value) } />
    {touched && ((error && <span className="text-error">{error}</span>) || (warning && <span className="text-warning">{warning}</span>))}
  </div>
);


