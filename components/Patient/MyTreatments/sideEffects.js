import { Field, reduxForm } from "redux-form";
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Slider from "rc-slider";
// const style = { width: 400, margin: 50 };
const marks = {
  1: "",
  50: "",
  100: "",
};
class SideEffects extends Component {
  constructor(props) {
    super(props);
    // console.log("sideEffectsArr*****", props.sideEffects);
    this.state = {
      sideEffectsArr: this.props.sideEffects,
    };
    this.showSideEffects = this.showSideEffects.bind(this);
    this.handleSideEffectChange = this.handleSideEffectChange.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.tabIndex = 0;
  }


  showSideEffects() {
    let sideEffectsArr = [];
    let tabIndex = 0;
    this.state.sideEffectsArr.map(function(obj, key) {
      sideEffectsArr.push(<div className="col-md-6" key={key}>
        <div className="treatment-group">
          <span className="treatment-label-group">{obj.attributes.label}</span>
        </div>
        {this.renderOptions(obj, key, tabIndex)}
      </div>);
    }, this);
    return sideEffectsArr;
  }

  // render side effects
  renderOptions(arr, parentKey, tabIndex) {
    let options = [];
    console.log("tabIndex", tabIndex);
    arr.attributes.side_effects.map(function(obj, key) {
      tabIndex = tabIndex + 1;
      options.push(
        <div className="radio" key={key}>
          <label>
            <input tabIndex={tabIndex} type="checkbox" name= {`outcome_${obj.label}`} value={obj.label} checked = {obj.checked} onClick={(e) => this.handleSideEffectChange(e, parentKey, key)}/>
            <span className="severityLabel"> {obj.label} </span>
          </label>
          {obj.checked && <div className="col-md-12 severity-indv-sld">
            <div className="col-md-2 pull-left">
              <span className="fnt_12">Tolerable</span>
            </div>
            <div className="col-md-5 pull-left">
              <div className="severity-slider">
                <Slider min={1} marks={marks} step={1} included={false} defaultValue={obj.severity} max={100} onAfterChange={(val) => this.onSliderChange(val, parentKey, key)}/>
              </div>
            </div>
            <div className="col-md-5 pull-left">
              <span className="fnt_12">Stopped treatment</span>
            </div>
          </div>}
        </div>
      );
    }, this);
    this.tabIndex = tabIndex;
    return options;
  }
  // show outcomes
  // showSideEffects1() {
  //   let sideEffectsArr = [];
  //   this.state.sideEffectsArr.map(function(obj, key) {
  //     sideEffectsArr.push(
  //       <div className="col-md-6 severity-indv" key={key}>
  //         <div className="radio side_effects_radio" >
  //           <label>
  //             <input type="radio" name= {`outcome_${obj.value}`} value={obj.value} checked = {obj.checked} onClick={(e) => this.handleSideEffectChange(e, key)}/>
  //             <span className="severityLabel"> {obj.label} </span>
  //           </label>
  //         </div>
  //         {/* <div className="col-md-12">
  //           <span className="treatment-label-group"> Side Effect Severity ?</span>
  //         </div> */}
  //         {obj.checked && <div className="col-md-12 severity-indv-sld">
  //           {/* <div className="mui-select custom-box"> */}
  //           <div className="col-md-2 pull-left">
  //             <span className="fnt_12">Tolerable</span>
  //           </div>
  //           <div className="col-md-5 pull-left">
  //             <div className="severity-slider">
  //               <Slider min={1} marks={marks} step={1} included={false} defaultValue={obj.severity} max={100} onAfterChange={(val) => this.onSliderChange(val, key)}/>
  //             </div>
  //           </div>
  //           <div className="col-md-5 pull-left">
  //             <span className="fnt_12">Stopped treatment</span>
  //           </div>
  //           {/* </div> */}
  //         </div>}
  //       </div>);
  //   }, this);
  //   return sideEffectsArr;
  // }

  // handle change event
  // start from here
  handleSideEffectChange(changeEvent, parentKey, key) {
    // this.setState({ serverErr: null });
    let selectedVal = changeEvent.target.value;
    let tmpsideEffectsArr = this.state.sideEffectsArr;
    // let tmpsideEffectsArr = this.state.sideEffectsArr;
    tmpsideEffectsArr[parentKey].attributes.side_effects[key].checked = !tmpsideEffectsArr[parentKey].attributes.side_effects[key].checked;
    tmpsideEffectsArr[parentKey].attributes.side_effects[key].severity = 0;
    // tmpsideEffectsArr[parentKey].attributes.side_effects.map(function(obj, key) {
    //   console.log("tsestt*****", obj);
    //   let tmpObj = obj;
    //   if (obj.value === selectedVal) {
    //     tmpObj.checked = !tmpObj.checked;
    //     tmpObj.severity = 0;
    //   }
    //   tmpsideEffectsArr[key] = tmpObj;
    // });
    console.log("tmpsideEffectsArr", tmpsideEffectsArr);
    this.setState({ outcomeArr: tmpsideEffectsArr });
    this.props.check_side_effects(tmpsideEffectsArr);
  }

  onSliderChange(val, parentKey, key) {
    let tmpsideEffectsArr = this.state.sideEffectsArr;
    tmpsideEffectsArr[parentKey].attributes.side_effects[key].severity = val;
    // tmpsideEffectsArr[key].severity = val;
    console.log("tmpsideEffectsArr", tmpsideEffectsArr);
    this.setState({ outcomeArr: tmpsideEffectsArr });
    this.props.check_side_effects(tmpsideEffectsArr);
    // this.props.check_severity(val);
  }
  render() {
    const { severity } = this.state;
    return (
      <div className="container">
        <div className="row add-treatment">
          <div className="col-md-12">
            <div className="col-md-12 clearBoth">
              <span className="severity-label-group">Select all the side effects experienced for the specific treatment combination you're entering or editing.</span>
              {/* <span className="treatmentGroupClear" onClick={(e) => this.clearOutcome(e)}><i className="fa fa-times" aria-hidden="true"></i> Clear</span>  */}
            </div>
            {/* start outcome options here */}
            <div className="row clearBoth">
              {this.showSideEffects()}
            </div>
          </div>

        </div>

      </div>
    );
  }
}
export default connect(null, null)(SideEffects);
