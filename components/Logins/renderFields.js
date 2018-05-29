/**
 * @fieldDefinition
 * @description : fields constant used in redux form
 * @createdby   : smartData
 */

import { FormGroup, FormText, Input } from "reactstrap";
import React from "react";
export const renderInputField = ({
  input,
  className,
  type,
  placeholder,
  serverErr,
  maxLength,
  datafor,
  autoComplete,
  meta: { touched, error },
}) => (
  <FormGroup className={className}>
    <Input type={type} placeholder={placeholder} maxLength={maxLength} {...input} data-tip
      data-for= {datafor} autoComplete={autoComplete}/>
    <i className="fa fa-user-circle" aria-hidden="true"></i>
    <FormText color="warning">
      {touched && error && <span>{error}</span>}
      {serverErr}
    </FormText>
  </FormGroup>
);

export const renderEmail = ({
  input,
  className,
  type,
  placeholder,
  serverErr,
  datafor,
  autoComplete,
  meta: { touched, error },
}) => (
  <FormGroup className={className}>
    <Input type={type} placeholder={placeholder} maxLength="100" {...input} data-tip
      data-for= {datafor} autoComplete={autoComplete}/>
    <i className="fa fa-envelope" aria-hidden="true"></i>
    <FormText color="warning">
      {touched && error && <span>{error}</span>}
      {serverErr}
    </FormText>
  </FormGroup>
);

export const renderPassword = ({
  input,
  className,
  type,
  placeholder,
  datafor,
  meta: { touched, error },
}) => (
  <FormGroup className={className}>
    <Input type={type} placeholder={placeholder} maxLength="12" {...input}  data-tip
      data-for= {datafor}/>
    <i className="fa fa-lock" aria-hidden="true"></i>
    <FormText color="warning">
      {touched && error && <span>{error}</span>}
    </FormText>
  </FormGroup>
);
