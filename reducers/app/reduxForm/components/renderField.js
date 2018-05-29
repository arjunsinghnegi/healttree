import React from 'react';

export const renderField = ({ plaeholder, input, label, type, fieldValue,value, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
     <div>
      <input {...input} placeholder={plaeholder} type={type} value={value} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)


//export default  renderField;