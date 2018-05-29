import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link, browserHistory } from 'react-router';
import validate from '../validate';
import { renderInputField } from '../renderFields';

class FishTest extends Component {

  constructor (props) {
    super(props)
    this.state = {
      fishTestActive: null
    };
  }

  onContinue(formData) {
    browserHistory.push('/gene-expression-profile-test');
  }

  render() {
    //const { handleSubmit } = this.props;
    return (
      <div id="page-content-wrapper">
      <div className="col-sm-12">
        <h2 className="page-title">FISH TEST</h2>
        <span className="back"><Link to="/health-history"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Back</Link></span>
        <ol className="breadcrumb">
          <li className="breadcrumb-item active"><Link to="/about-me">About Me</Link></li>
          <li className="breadcrumb-item">Fish Test</li>
        </ol>
        <form>
        <div className="form-group row align-items-center">
          <label htmlFor="inputPassword3" className="col-sm-12 col-md-12 col-lg-6 col-form-label"> Do you want to manually enter the results from your specific myeloma genetic features according to the FISH (fluorescence in situ hybridization) test?</label>
          <div className="col-sm-12 col-md-12 col-lg-6">
            <div className="btn-group toggle-switch" id="status" data-toggle="buttons">
              <label className={this.state.fishTestActive === 'y' ? 'btn btn-default btn-on btn-lg active' : 'btn btn-default btn-on btn-lg'}>
              <Field
                name="fishTest[module_id][status]"
                component="input"
                type="radio"
                value="y"
                checked={this.state.fishTestActive === 'y' ? true : false }
                onClick={(e)=>this.setState({ fishTestActive: 'y' })} />
                Yes</label>
              <label className={this.state.fishTestActive === 'n' ? 'btn btn-default btn-off btn-lg active' : 'btn btn-default btn-off btn-lg'}>
              <Field
                name="fishTest[module_id][status]"
                component="input"
                type="radio"
                value="n"
                checked={this.state.fishTestActive === 'n' ? true : false }
                onClick={(e)=>this.setState({ fishTestActive: 'n' })} />
                No</label>
            </div>
          </div>
        </div>
        <div className={this.state.fishTestActive === 'n' ? 'form-group row align-items-center' : 'form-group row align-items-center hide-div'}>
        <p>You can upload a PDF document with your test results, ask your healthcare team to fill out a questionnaire with answers you can manually enter, or download it from your online medical record.</p>
        <div className="form-group row align-items-center upload_btn">
          <div className="static-col">
            <button className="btn hvr-bounce-to-top"><i className="flaticon-arrows"></i>Upload Pdf</button>
          </div>
          <div className="static-col">
            <button className="btn hvr-bounce-to-top"><i className="flaticon-question-mark-cursor"></i>Ask my healthcare team</button>
          </div>
          <div className="static-col">
            <button className="btn hvr-bounce-to-top"><i className="flaticon-arrows-1"></i>Pull it from my online medical record</button>
          </div>
        </div>
      </div>
      <div className={this.state.fishTestActive === 'y' ? 'form-group row align-items-center' : 'form-group row align-items-center hide-div'}>
        <label htmlFor="inputPassword3" className="col-sm-12 col-form-label"> Enter your positive results</label>
          <div className="form-check col-sm-12">
            <input id="checkbox-1" className="checkbox-custom" name="checkbox-1" type="checkbox" />
            <label htmlFor="checkbox-1" className="checkbox-custom-label label-sm">t12, 16</label>
          </div>
          <div className="form-check col-sm-12">
            <input id="checkbox-2" className="checkbox-custom" name="checkbox-2" type="checkbox" />
            <label htmlFor="checkbox-2" className="checkbox-custom-label label-sm">t14, 20</label>
          </div>
          <div className="form-check col-sm-12">
            <input id="checkbox-3" className="checkbox-custom" name="checkbox-3" type="checkbox" />
            <label htmlFor="checkbox-3" className="checkbox-custom-label label-sm">t11, 14</label>
          </div>
          <div className="form-check col-sm-12">
            <input id="checkbox-4" className="checkbox-custom" name="checkbox-4" type="checkbox" />
            <label htmlFor="checkbox-4" className="checkbox-custom-label label-sm">t4, 14</label>
          </div>
          <div className="form-check col-sm-12">
            <input id="checkbox-5" className="checkbox-custom" name="checkbox-5" type="checkbox" />
            <label htmlFor="checkbox-5" className="checkbox-custom-label label-sm">t14, 16</label>
          </div>
          <div className="form-check col-sm-12">
            <input id="checkbox-6" className="checkbox-custom" name="checkbox-6" type="checkbox" />
            <label htmlFor="checkbox-6" className="checkbox-custom-label label-sm">t14, 20</label>
          </div>

            <label htmlFor="inputPassword3" className="col-sm-4 col-md-4 col-lg-3 col-xl-2 col-form-label">MyPRS score</label>
            <div className="col-sm-8 col-md-8 col-lg-6">
                <Field
                    name="prs_score"
                    type="text"
                    className="form-control"
                    id="prs_score"
                    placeholder="MyPRS score"
                    component={renderInputField} />
            </div>
      </div>

        <div className="form-group row">
          <div className="col-sm-12 text-center">
            <button onClick={this.onContinue} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
          </div>
        </div>
      </form>
      </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return{
//     statusText : state.login.statusText,
//     isAuthenticating : state.login.isAuthenticating
//   }
// }

// connect: first agrument is mapStateToProps, 2nd argument is mapDispatchToProps
// reduxForm: first is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

FishTest =  reduxForm({
    form: 'MyeloamaMoreForm',
    fields: ['first_name', 'last_name', 'gender', 'dob', 'race', 'zip_code'],
    validate
})( FishTest );
export default connect(null, null)(FishTest);
