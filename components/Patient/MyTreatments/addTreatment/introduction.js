import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import TableHeader from "./tableHeader";
export default class Inroduction extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  // go to next step
  onContinue() {
    console.log("continue clicked");
  }
  // clicked on back button
  backToTreatment() {
    browserHistory.push("/treatments-outcomes");
  }

  render() {
    return (
      <div className="treatment">
        <div className="myeloma_content">
          <label>There are many different types of treatments for multiple myeloma. We are going to ask you about the treatments you have received. </label>
          <label>This information is very important becuase it allows us to show you a personalized plan of treatment options.</label>
          <label>You will enter treatments for a specific date range in the order you received them. When you are done, it will look something like this:</label>
        </div>
        <form noValidate className="editroll">
          <div className="form-group">
            <div className="outer-mypataient-table">
              <div className= "col-md-12 div-seperator custom-seperator">
                <TableHeader />
                {/* static table data */}
                <div className= "row data-row">
                  <div className="col-md-1 column-seprator align-cntr col-sm-2">Feb, 2017</div>
                  <div className="col-md-1 column-seprator align-cntr col-sm-2">Mar, 2018</div>
                  <div className="col-md-3 column-seprator align-cntr col-sm-3">
                    <ul className="treatment-ul treatment_outcome_height">
                      <li className="treatments-lbl-span">
                        <span data-tip data-for="treatment1" className="pointer-cursor">Empliciti (elotuzumab)</span>
                      </li>
                      <li className="treatments-lbl-span">
                        <span data-tip data-for="treatment2" className="pointer-cursor">
                        Velcade (bortezomib)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-2 column-seprator align-cntr col-sm-1 stopped-drug-panel">
                    <ul className="treatment-ul treatment_outcome_height">
                      <li className="treatments-lbl-span">
                        <span data-tip data-for="treatment1" className="pointer-cursor">
                      Side Effects (Dec, 2018)
                        </span>
                      </li>
                      <li className="treatments-lbl-span">
                        <span data-tip data-for="treatment2" className="pointer-cursor">
                      Didn't Work (Jan, 2018)
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-1 column-seprator align-cntr col-sm-1">Therapy at relapse</div>
                  <div className="col-md-3 column-seprator align-cntr col-sm-2 side-effect-panel">
                    <ul className="side_effects_treatment treatment_outcome_height">
                      <li className="treatments-lbl-span">
                        <span className="pointer-cursor side_effect_li">Low red blood cells (Anemia)</span>
                        <div className="pointer-cursor side_effect_severity side_severity_btw">45</div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-1 column-seprator align-cntr col-sm-1"><span>
                    <button className="btn edit" type="button" onClick = {(e) => e.preventDefault()}><i data-tip data-for="edit-treatments" className="fa fa-stethoscope" aria-hidden="true" ></i></button>
                    <button className="btn edit" type="button" onClick = {(e) => e.preventDefault()}><i data-tip data-for="edit-outcomes" className="fa fa-heartbeat" aria-hidden="true" ></i></button>
                    <button className="btn edit" type="button" onClick = {(e) => e.preventDefault()}><i data-tip data-for="edit-sideeffects" className="fa fa-medkit" aria-hidden="true" ></i></button>
                    <button title="Delete" className="btn delete" type="button" onClick = {(e) => e.preventDefault()}><i className="fa fa-trash-o" aria-hidden="true" data-tip data-for="remove-outcomes" ></i></button>
                  </span>
                  </div>
                </div>
                <div className= "row data-row bottom-row">
                  <div className="col-md-1 resp-lbl">Outcome</div>
                  <div className="col-md-11">
                    <label>My myeloma is now undetectable, I had a stringent complete response (sCR) to the treatment.</label>
                  </div>
                </div>
                {/* !static table data*/}
              </div>
            </div>
          </div>
        </form>
        <div className="form-group">
          <div className="col-sm-12 text-center">
            <button onClick={this.onContinue} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button>
            <button onClick={this.backToTreatment} type="submit" className="btn green-btn btn-rt green-hvr-bounce-to-top">Quit</button>
          </div>
        </div>
      </div>

    );
  }
}
