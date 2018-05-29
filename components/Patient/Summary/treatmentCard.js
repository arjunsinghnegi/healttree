import React, { Component } from "react";
import moment from "moment";
import { OUTCOME_CONST } from "../renderFields";
import ReactTooltip from "react-tooltip";

export default class TreatmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: (props.data) ? props.data : [],
      constSideEffects: (props.constSideEffects) ? props.constSideEffects : [],
      outcomeArr: JSON.parse(JSON.stringify(OUTCOME_CONST)),
    };
    this.renderRows = this.renderRows.bind(this);
    this.renderSideEffects = this.renderSideEffects.bind(this);
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.data !== props.data) {
      this.setState({ data: (nextProps.data) ? nextProps.data : [] });
    }
    if (nextProps.constSideEffects !== props.constSideEffects) {
      this.setState({ constSideEffects: (nextProps.constSideEffects) ? nextProps.constSideEffects : [] });
    }
  }
  // renderRows
  renderRows() {
    let row = [];
    if (!this.state.data.length) {
      return row;
    }
    this.state.data.map(function(obj, key) {
      let sub_outcome = null,
        resistant_to = null;
      if (obj.sub_outcome && obj.sub_outcome.indexOf("{") > -1) {
        sub_outcome = JSON.parse(obj.sub_outcome);
      }
      if (obj.resistant && obj.resistant.indexOf("{") > -1) {
        resistant_to = JSON.parse(obj.resistant);
      }
      row.push(
        <div className="summary-treat-parent" key={key}>
          <div className="row treatment-summary treatment-summary-label">
            <div className="col-8 col-sm-1">
              <label className="">Start Date</label>
            </div>
            <div className="col-8 col-sm-1">
              <label className="">End Date</label>
            </div>
            <div className="col-8 col-sm-3">
              <label className="">Treatment</label>
            </div>
            <div className="col-8 col-sm-3">
              <label className="">Stopped Drug</label>
            </div>
            <div className="col-8 col-sm-1 treatment-effect">
              <label className="">Maintenance Therapy</label>
            </div>
            <div className="col-8 col-sm-3">
              <label className="">Side Effects</label>
            </div>
            {/* <div className="col-8 col-sm-2">
            <label className="">Side Effects</label>
          </div> */}
          </div>
          <div className="row treatment-summary treatment-summary-data" >
            <div className="col-8 col-sm-1">
              <label className="">{obj.start_date}</label>
            </div>
            <div className="col-8 col-sm-1">
              <label className="">{(obj.current_treatment) ? "Current Treatment" : obj.end_date}</label>
            </div>
            <div className="col-8 col-sm-3">
              {/* <label className="">{obj.treatment}</label> */}
              <ul>
                {obj.treatment_labels.map(function(treatment, k) {
                  return <li key={k} className="truncate" data-tip data-for={treatment + key}>{treatment}
                    <ReactTooltip place="left" type="dark" effect="solid" id={treatment + key}>
                      <ul>
                        <li className="summary_li">{treatment}</li>
                      </ul>
                    </ReactTooltip>
                  </li>;
                })
                }
              </ul>
            </div>
            <div className="col-8 col-sm-3">
              {/* <label className="">{obj.treatment}</label> */}
              <ul>
                {obj.treatment.map(function(data, k) {
                  if (resistant_to && resistant_to[data]) {
                    let tmpResistant = resistant_to[data];
                    return <li key={key + "li" + k}>
                      <span>
                        {(tmpResistant[1]) ? (tmpResistant[1] === "Intollerable side effects" ? "Side Effects" : "Didn't Work") : "-"}
                        {(tmpResistant[0]) ? " (" + moment(tmpResistant[0], "MM/DD/YYYY").format("MM/DD/YY") + ")" : ""}
                      </span>
                    </li>;

                  } else {
                    return <li key={key + "li" + k}><span></span></li>;
                  }
                })}
              </ul>
            </div>
            <div className="col-8 col-sm-1">
              <label className="">{obj.is_maintenance_therapy}</label>
            </div>
            <div className="col-8 col-sm-3">
              {/* <label className="">{obj.treatment}</label> */}
              <ul>
                {this.renderSideEffects(obj)}
              </ul>
            </div>
          </div>
          <div className="row treatment-summary treatment-summary-resp">
            <div className="col-8 col-sm-1">
              <label className="resp-lbl">Outcome:</label>
            </div>
            <div className="col-8 col-sm-11 summary-resp-data">
              {obj.outcome}
              {/* { sub_outcome && sub_outcome.index && this.state.outcomeArr.map((outcome, k) => {
                if (obj.outcome === outcome.label && outcome.subOptions && outcome.subOptions.length) {
                // <label></label>;
                  return outcome.subOptions.map((subOption, key) => {
                    if (sub_outcome.index.indexOf(subOption.value) > -1 && subOption.label !== "Other") {
                      return <span className="">{(key === 0) ? " because " : ""}{subOption.label} {(key + 1) == outcome.subOptions.length ? ", " : (sub_outcome.other) ? ", " : "."}</span>;
                    }
                  });
                }
              })} */}
              { sub_outcome && sub_outcome.index && this.state.outcomeArr.map((outcome, k) => {
                if (obj.outcome === outcome.label && outcome.subOptions && outcome.subOptions.length) { // <label></label>;
                  let i = 0;
                  return outcome.subOptions.map((subOption, key) => {
                    if (sub_outcome.index.indexOf(subOption.value) > -1 && subOption.label !== "Other") {
                      i++;
                      if (obj.outcome === "My myeloma is now undetectable") {
                        return <span className="">{(i === 1) ? ", " : ""}{subOption.label}{(i) == sub_outcome.index.length ? ". " : ", "}</span>;
                      }
                      if (obj.outcome === "I discontinued this treatment") {
                        return <span className="">{(i === 1) ? " because: " : ""}{subOption.label}{(i) == sub_outcome.index.length ? ". " : ", "}</span>;
                      }
                    // return <span className="">{(i === 1) ? ", " : ""}{subOption.label} {(i) == sub_outcome.index.length ? ((sub_outcome.other) ? ", " : ".") : ", "}</span>;

                    }
                  });
                }
              })}
              {
                (sub_outcome && sub_outcome.other) && <span className="">Other Reason: {sub_outcome.other}.</span>
              }
            </div>
          </div>
        </div>);
    }, this);
    return row;
  }
  renderSideEffects(sideEffectobj) {
    let sideEffectRow = sideEffectobj.side_effects;
    console.log("sideEffectobj", sideEffectobj);
    if (sideEffectRow.length) {
      let tmpArr = [];
      // this.state.constSideEffects.map(function(obj, key) {
      sideEffectobj.side_effects.map(function(sideEffect, k) {
        console.log("obj.attributes", sideEffect);
        // let indexOf = sideEffectRow.indexOf(sideEffect.id);
        let indexKey = k + "_" + sideEffect + "_" + sideEffectobj.id;
        // if (indexOf > -1) {
        let severity = parseInt(sideEffectobj.severity[k]);
        tmpArr.push(<li key={indexKey} className="summarySideEffect" data-tip data-for={indexKey}>
          <span className="truncate-sideEffect">{sideEffect}</span>
          { severity >= 1 && severity <= 38 && <div className="pointer-cursor severity-sideEffect side_severity_tolerable severity-sideEffect">{severity}</div>}
          { severity >= 39 && severity <= 68 && <div className="pointer-cursor severity-sideEffect side_severity_btw severity-sideEffect">{severity}</div>}
          { severity >= 69 && severity <= 100 && <div className="pointer-cursor severity-sideEffect side_severity_stopped severity-sideEffect">{severity}</div>}
          <ReactTooltip place="left" type="dark" effect="solid" id={indexKey}>
            <ul>
              <li>{sideEffect} ({severity})</li>
            </ul>
          </ReactTooltip>
        </li>);
        // }
      });
      // });
      return tmpArr;
    }
  }

  render() {
    return (
      <div className="col summary_div">
        <label className="summaryh2">{this.props.label}</label>
        {this.renderRows()}
      </div>
    );
  }
}
