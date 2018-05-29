import React from 'react';



export const renderSelectField = ({ input, label, type,emptyValue, templateList, meta: { touched, error, warning } }) => (
	
  <div>
    <label>{label}</label>
     <div>
      <select {...input}>
	      <option value="">{emptyValue}</option>
			{ 
			  templateList.map((type, index) => {
			    return (<option key={index} value={type._id}>{type.name}</option>)
			  })
			}
	    </select>
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)
