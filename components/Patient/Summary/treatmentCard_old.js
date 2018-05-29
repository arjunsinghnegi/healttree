import React, { Component } from "react";
import moment from "moment";
import ReactTooltip from "react-tooltip";
export default class TreatmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: (props.data) ? props.data : [],
      constSideEffects: (props.constSideEffects) ? props.constSideEffects : [],
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
      row.push(
        <div className="outer-summary-treat-parent" key={key}>
          <div className="summary-treat-parent" >
            <div className="row treatment-summary treatment-summary-label">
              <div className="col-8 col-sm-1 treatment-start">
                <label className="">Start Date</label>
              </div>
              <div className="col-8 col-sm-1 treatment-end">
                <label className="">End Date</label>
              </div>
              <div className="col-8 col-sm-4 treatment-resist">
                <div className="row summary-treat-resist">
                  <div className="col-sm-8 summary-treat">
                    <label className="">Treatment</label>
                  </div>
                  <div className="col-sm-4 summary-resist">
                    <label className="">Stopped Drug</label>
                  </div>
                </div>
              </div>
              {/* <div className="col-8 col-sm-1">
              <label className="">Resistant</label>
            </div> */}
              <div className="col-8 col-sm-2 treatment-effect">
                <label className="">Maintenance Therapy</label>
              </div>
              <div className="col-8 col-sm-3 treatment-effect">
                <label className="">Side Effects</label>
              </div>
              {/* <div className="col-8 col-sm-2">
            <label className="">Side Effects</label>
          </div> */}
            </div>
            <div className="row treatment-summary treatment-summary-data" >
              <div className="col-8 col-sm-1  treatment-start">
                <label className="">{obj.start_date}</label>
              </div>
              <div className="col-8 col-sm-1 treatment-end">
                <label className="">{(obj.current_treatment) ? "Current Treatment" : obj.end_date}</label>
              </div>
              <div className="col-8 col-sm-4 summary-border-none treatment-resist">
                {/* <label className="">{obj.treatment}</label> truncate*/}
                <ul>
                  {obj.treatment_labels.map(function(treatment, k) {
                    return <li key={k} className="" data-tip data-for={treatment + key}>
                      <div className="row">
                        <div className="col-sm-8 summary-treat-val summary-treat">
                          <i className="fa fa-circle"></i> {treatment}
                        </div>
                        <div className="col-sm-4 summary-resist-val summary-resist">
                          {/* {obj.resistant.indexOf(obj.treatment[k]) === -1 && <span className="summary_span"></span>} */}
                          {/* {obj.resistant.indexOf(obj.treatment[k]) !== -1 && <span className="summary_span"><i className="fa fa-check" aria-hidden="true"></i></span>} */}
                        </div>
                      </div>


                      <ReactTooltip place="bottom" type="dark" effect="solid" id={treatment + key}>
                        <ul>
                          <li className="summary_li">{treatment}</li>
                        </ul>
                      </ReactTooltip>
                    </li>;
                  })
                  }
                </ul>
              </div>
              {/* <div className="col-8 col-sm-1">
           
              <ul>
                {obj.treatment.map(function(data, k) {
                  if (obj.resistant.indexOf(data) === -1) {
                    return <li key={key + "li" + k} className="summary_li"><span className="summary_span"></span></li>;
                  } else {
                    return <li key={key + "li" + k} className="summary_li"><span className="summary_span"><i className="fa fa-check" aria-hidden="true"></i></span></li>;
                  }
                })}
              </ul>
            </div> */}
              <div className="col-8 col-sm-2">
                <label className="">{obj.is_maintenance_therapy}</label>

              </div>
              <div className="col-8 col-sm-3 treatment-effect">
                {/* <label className="">{obj.treatment}</label> */}
                <ul>
                  {this.renderSideEffects(obj)}
                </ul>
              </div>
            </div>
            <div className="row treatment-summary treatment-summary-resp">
              <div className="col-8 col-sm-1 outcome-dv">
                <label className="resp-lbl">Outcome:</label>
              </div>
              <div className="col-8 col-sm-11 summary-resp-data resp-dv">
                {obj.outcome}
              </div>
            </div>
          </div></div>);
    }, this);
    return row;
  }
  renderSideEffects(sideEffectobj) {
    let sideEffectRow = sideEffectobj.side_effects;
    if (sideEffectRow.length && this.state.constSideEffects.length) {
      let tmpArr = [];
      this.state.constSideEffects.map(function(obj, key) {
        obj.attributes.side_effects.map(function(sideEffect, k) {
          let indexOf = sideEffectRow.indexOf(sideEffect.id);
          let indexKey = key + "_" + k;
          if (indexOf > -1) {
            let severity = parseInt(sideEffectobj.severity[indexOf]);
            tmpArr.push(<li key={indexKey} className="summarySideEffect" data-tip data-for={sideEffect.label + key + k + sideEffectobj.id}>
              <span className="truncate-sideEffect">{sideEffect.label}</span>
              { severity >= 1 && severity <= 38 && <div className="pointer-cursor severity-sideEffect side_severity_tolerable severity-sideEffect">{severity}</div>}
              { severity >= 39 && severity <= 68 && <div className="pointer-cursor severity-sideEffect side_severity_btw severity-sideEffect">{severity}</div>}
              { severity >= 69 && severity <= 100 && <div className="pointer-cursor severity-sideEffect side_severity_stopped severity-sideEffect">{severity}</div>}
              <ReactTooltip place="bottom" type="dark" effect="solid" id={sideEffect.label + key + k + sideEffectobj.id}>
                <ul>
                  <li>{sideEffect.label} ({severity})</li>
                </ul>
              </ReactTooltip>
            </li>);
          }
        });
      });
      return tmpArr;
    }
  }
  render() {
    return (
      <div className="col summary_div custom-summary">
        <label className="summaryh2">{this.props.label}</label>
        {this.renderRows()}
      </div>
    );
  }
}
