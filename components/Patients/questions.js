/**
 * @class         :	Questions
 * @description   : Dynamic form - JSON Fields used to display questions.
 * @Created by    : smartData
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { map, each, keys } from 'lodash';

const FIELDS = {
  title: {
    type: 'input',
    label: 'Title for the post'
  },
  categories: {
    type: 'input',
    label: 'Enter some categories for this post'
  },
  content: {
    type: 'textarea',
    label: 'Post Content'
  }
};

class QuestionsComponent extends Component {

    // constructor(props) {
    //     super(props);
    // }

    static contextTypes = {
  		router:PropTypes.object
  	}

    onSubmit(props) {
      console.log("Post Submitted : ", props);
      //  let response = this.props.forgotPassword(props);
      //  this.context.router.push('/');
    }

    renderField(fieldConfig, field) {
      const fieldHelper = this.props.fields[field];
      console.log(this.props.fields);
      return (
        <div className={`form-group ${fieldHelper.touched && fieldHelper.invalid ? 'has-danger' : '' }`}>
          <label>{fieldConfig.label}</label>
          <fieldConfig.type type="text" className="form-control" {...fieldHelper} />
          <div className="text-help">
            {fieldHelper.touched ? fieldHelper.error : '' }
          </div>
        </div>
      );
    }

    render() {
        const { handleSubmit } = this.props;
        return(
            <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
                {map(FIELDS, this.renderField.bind(this))}
                <button className="btn blue-btn sign-btn">Save</button>
            </form>
        );
    }
}

function validate(values) {
    const error = {};

    each(FIELDS, (type, field) => {
      if(!values[field]) {
        error[field] = `Enter a ${field}`;
      }
    });
    return error;
}

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

export default reduxForm({
    form: 'DynamicForm',
    fields: keys(FIELDS),
    validate
})(QuestionsComponent);
