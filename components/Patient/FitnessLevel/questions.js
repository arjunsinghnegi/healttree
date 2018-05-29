import { CONST_EXCERCISE_INTENSITY, CONST_EXCERCISE_INTERVAL, CONST_FITNESS_LEVEL, renderInputField, renderRadio, renderSelectField } from "../renderFields";
import { Field, reduxForm } from "redux-form";
import React, { Component } from "react";
import { connect } from "react-redux";
class FitnessQuestions extends Component {
  constructor(props) {
    super(props);
    this.change_status = this.change_status.bind(this);
  }
  // detech change in status
  change_status(e, obj, fitnessArrKey, value) {
    e.preventDefault();
    this.props.changeStatus(e, obj, fitnessArrKey, value);
  }
  render() {
    const { data, fitnessArrKey } = this.props;
    return (
      <div className="form-group fitness-form-group">
        <label htmlFor="inputPassword3" className="col-sm-8 col-md-8 col-lg-6 col-xl-8 col-form-label">{data.label}</label>
        <div className="btn-group toggle-switch" id="status" data-toggle="buttons">
          <label className={ (data.value) ? "btn btn-default btn-on btn-lg active" : "btn btn-default btn-on btn-lg" } onClick={ (e) => this.change_status(e, data, fitnessArrKey, true)} >
            <Field
              name="exercise_six_hour"
              value="true"
              id="fitness-1"
              component={renderRadio}
              checked={ data.value ? true : false } />
                  Yes</label>
          <label className={ (!data.value && data.value !== null) ? "btn btn-default btn-off btn-lg active" : "btn btn-default btn-off btn-lg" } onClick={ (e) => this.change_status(e, data, fitnessArrKey, false)} >
            <Field
              name="exercise_six_hour"
              value="false"
              id="fitness-0"
              component={renderRadio}
              checked={ !data.value ? true : false } />
                  No</label>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(FitnessQuestions);
