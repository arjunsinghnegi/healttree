import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import { MONTHS } from "../renderFields";
import ReactTooltip from "react-tooltip";
export default class YearWiseListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outcomeArr: props.outcomeArr,
    };
    this.renderCalendar = this.renderCalendar.bind(this);
    this.monthWiseRendering = this.monthWiseRendering.bind(this);
    this.getRemissionDiv = this.getRemissionDiv.bind(this);
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.outcomeArr !== props.outcomeArr) {
      this.setState({ "outcomeArr": nextProps.outcomeArr });
    }
  }
  getRemissionDiv(remissionMonthData, treatments) {
    let remainingActiveDisease = "";
    // let remission = "";
    // let partialResponse = "";
    let vGPR = "";
    let cR = "";
    // let sCR = "";
    // let positiveMRD = "";
    let negativeMRD = "";
    let othrClass = "key_class pointer_cursor";
    let key = 0;
    // remissionMonthData.map(function(remissionMonth, k) {
    //   key = k;
    //   if (remissionMonth.outcome === "Remaining Active Disease") {
    //     remainingActiveDisease = "active-disease-relapse" ;
    //   }
    //   if (remissionMonth.outcome === "Partial Response (PR)") {
    //     remission = "remission" ;
    //   }
    //   if (remissionMonth.outcome === "Very Good Partial Response (VGPR)") {
    //     vGPR = "very-good-partial-remission" ;
    //   }
    //   if (remissionMonth.outcome === "Complete Response (CR)") {
    //     cR = "complete-remission" ;
    //   }
    //   if (remissionMonth.outcome === "Stringent Complete Response (sCR)") {
    //     sCR = "stringent-complete-remission";
    //   }
    //   if (remissionMonth.outcome === "MRD positive (number of cells)") {
    //     positiveMRD = "mrd-positive";
    //   }
    //   if (remissionMonth.outcome === "MRD negative") {
    //     negativeMRD = "mrd-negative";
    //   }

    // });
    // console.log(othrClass + " " + negativeMRD + " " + positiveMRD + " " + sCR + " " + cR + " " + vGPR + " " + remission + " " + remainingActiveDisease);
    let lbl = [];
    { treatments.length && treatments.map(function(row, k) {
      if (row.outcome === "The treatment did not reduce my myeloma") {
        remainingActiveDisease = "active-disease-relapse" ;
      }
      if (row.outcome === "The treatment kept my myeloma under control") {
        vGPR = "very-good-partial-remission" ;
      }
      if (row.outcome === "The treatment eliminated my myeloma (Remission)") {
        cR = "complete-remission" ;
      }
      if (row.outcome === "The treatment completely eliminated my disease and made me minimal disease negative (MRD negative)") {
        negativeMRD = "mrd-negative";
      }
      lbl.push(<label key={k} className="monthyLabel"> <ul> {row.treatment.map(function(data, key) {
        return <li key={k + "treat" + key} data-tip data-for={k + data + key}>
          <span className="outcome-span">{data}</span>
          <ReactTooltip place="right" type="warning" effect="solid" id={k + data + key}>
            <ul>
              <li>{data}</li>
            </ul>
          </ReactTooltip>
        </li>;
      })}</ul></label>);
    }); };
    { !treatments.length && lbl.push(<label className="monthyLabel emptyLbl" key={key}>{}</label>); };
    let returnDiv = <div className={othrClass + " " + negativeMRD + " " + cR + " " + vGPR + " " + remainingActiveDisease} key={key}>{lbl}</div>;

    return returnDiv;

  }

  renderCalendar() {
    let tmpArr = [];
    let This = this;
    this.props.outcomeArr.map(function(obj, key) {
      tmpArr.push(<div className="outcome-row row" key={key}>
        <div className = "col-sm-12">
          <h3 className="year_outcome">{obj.year}</h3>
        </div>
        <div className="month-labels col-sm-12">
          {MONTHS.map((month, key) =>
            <div className="col-sm-1" key={key}><label className="monthName">{month}</label></div>
          )}
        </div>
        <div className="month-labels col-sm-12">
          {MONTHS.map((month, key) =>
            <div className="col-sm-1 lbl_color" key={key}>
              {This.getRemissionDiv(obj.months[month].remission, obj.months[month].treatments)}
              {obj.months[month].sideeffect.length ?
                <div className="side-effect side_class pointer_cursor" data-tip data-for={obj.year + month + "side-effect"}>
                  <ReactTooltip place="bottom" type="dark" effect="solid" id={obj.year + month + "side-effect"}>
                    <ul>
                      {obj.months[month].sideeffect.map((row, i) =>
                        <li key={i}>{row.side_effect}</li>
                      ) }
                    </ul>
                  </ReactTooltip>
                </div> : ""
              }
            </div>
          )}

        </div>
      </div>);
    });
    return tmpArr;
  }

  // get month wise data
  monthWiseRendering(obj) {
    let tmpArr = [];
    tmpArr.push(<div class="outcome-cells col-sm-12">
      <div class="outcome-cell col-sm-1">
        <div class="">{obj.year}</div>
      </div>
    </div>);
    return tmpArr;
  }
  render() {
    return (
      <div id="page-content-wrapper">
        {this.renderCalendar()}
      </div>
    );
  }
}
