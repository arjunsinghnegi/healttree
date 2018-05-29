import { browserHistory, Link } from "react-router";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getOutcomeData } from "../../../actions/outcomeActions";
import LabelCell from "./labelCell";
import Loader from "../../common/loader";
import moment from "moment";
import { MONTHS } from "../renderFields";
import YearWiseListing from "./yearWiseListing";
class MyOutcomeCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "outcomeArr": [],
      "showLoader": true,
      "rawOutcomeData": [],
    };
    this.props.getOutcomeData(props.token);
    this.createOutcomeArr = this.createOutcomeArr.bind(this);
    this.createYearArr = this.createYearArr.bind(this);
    // this.renderCalendar = this.renderCalendar.bind(this);
    this.getFinalData = this.getFinalData.bind(this);
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.outcomes !== props.outcomes) {
      if (nextProps.outcomes.data && nextProps.outcomes.data.attributes) {
        this.setState({ "rawOutcomeData": nextProps.outcomes.data, showLoader: false });
        this.createOutcomeArr(nextProps.outcomes.data);
      }

    }
  }
  createOutcomeArr(rawOutcomeData) {
    let start_year = moment().format("YYYY");
    let end_year = moment().format("YYYY");
    // let remissionData = rawOutcomeData.attributes.remissions;
    let side_effectsData = rawOutcomeData.attributes.side_effects;
    let treatmentsData = rawOutcomeData.attributes.treatments;
    // if (remissionData.length) {
    //   let remission_start_year = moment(remissionData[0].start_date, "YYYY-MM-DD").format("YYYY");
    //   if (remission_start_year < start_year) {
    //     start_year = remission_start_year;
    //     // console.log("start_date remissionData", start_year);
    //   }

    //   remissionData.map(function(obj, key) {
    //     let remission_end_year = moment(obj.end_date, "YYYY-MM-DD").format("YYYY");
    //     if (remission_end_year > end_year) {
    //       end_year = remission_end_year;
    //     }
    //   });
    // }
    // treatments
    if (treatmentsData.length) {
      let treatments_start_year = moment(treatmentsData[0].start_date, "YYYY-MM-DD").format("YYYY");
      if (treatments_start_year < start_year) {
        start_year = treatments_start_year;
      }
      treatmentsData.map(function(obj, key) {
        let treatments_end_year = moment().format("YYYY");
        if (obj.end_date) {
          treatments_end_year = moment(obj.end_date, "YYYY-MM-DD").format("YYYY");
        }
        if (treatments_end_year > end_year) {
          end_year = treatments_end_year;
        }
      });
    }
    if (side_effectsData.length) {
      let side_effects_start_year = moment(side_effectsData[0].start_date, "YYYY-MM-DD").format("YYYY");
      if (side_effects_start_year < start_year) {
        start_year = side_effects_start_year;
        // console.log("start_date side_effectsData", start_year);
      }

      side_effectsData.map(function(obj, key) {
        let side_effects_end_year = moment(obj.end_date, "YYYY-MM-DD").format("YYYY");
        if (side_effects_end_year > end_year) {
          end_year = side_effects_end_year;
        }
      });
    }

    // rawOutcomeData.attributes.map(function(obj, key) {

    this.createYearArr(parseInt(start_year), parseInt(end_year));
    // });
  }
  createYearArr(startYear, endYear) {
    let tmpYearArr = [];
    for (let i = startYear; i <= endYear; i++) {
      let tmpObj = {};
      tmpObj.year = i;
      tmpObj.months = [];
      MONTHS.map(function(month, key) {
        tmpObj.months[month] = {
          remission: [],
          treatments: [],
          sideeffect: [],
        };
      });
      tmpYearArr[i] = tmpObj;
    }
    this.setState({ "outcomeArr": tmpYearArr }, function() {

      this.getFinalData();
    });

  }
  // render Calendar
  getFinalData() {
    let calendarArr = this.state.outcomeArr;
    // remission
    // if (this.state.rawOutcomeData.attributes.remissions.length) {
    //   let rawRemission = this.state.rawOutcomeData.attributes.remissions;
    //   rawRemission.map(function(obj, key) {
    //     let momentStartDate = moment(obj.start_date, "YYYY-MM-DD");
    //     let momentEndDate = moment(obj.end_date, "YYYY-MM-DD");
    //     let startYear = momentStartDate.format("YYYY");
    //     // let startMonth = momentStartDate.format("MMM");
    //     let startMonthNum = momentStartDate.format("MM");
    //     let endYear = momentEndDate.format("YYYY");
    //     // let endMonth = momentEndDate.format("MMM");
    //     let endMonthNum = momentEndDate.format("MM");
    //     // // console.log("startMonth", startMonth, "endMonth", endMonth);
    //     if (startYear === endYear) {
    //       for (let i = startMonthNum; i <= endMonthNum; i++) {
    //         let tmpmonth = moment(i, "MM").format("MMM");
    //         calendarArr[startYear].months[tmpmonth].remission.push(obj);
    //       }
    //     } else if (startYear < endYear) {
    //       for (let j = startYear; j <= endYear; j++) {
    //         if (j === startYear) {
    //           // start year start month calculation
    //           for (let i = startMonthNum; i <= 12; i++) {
    //             let tmpmonth = moment(i, "MM").format("MMM");
    //             calendarArr[startYear].months[tmpmonth].remission.push(obj);
    //           }
    //         } else if (j === parseInt(endYear)) {
    //           // end year end month calculation
    //           for (let i = 1; i <= endMonthNum; i++) {
    //             let tmpmonth = moment(i, "MM").format("MMM");
    //             calendarArr[endYear].months[tmpmonth].remission.push(obj);
    //           }
    //         } else {
    //           for (let i = 1; i <= 12; i++) {
    //             let tmpmonth = moment(i, "MM").format("MMM");
    //             calendarArr[j].months[tmpmonth].remission.push(obj);
    //           }
    //         }
    //       }
    //     } else {
    //       console.log("Remission start year is greater than end year");
    //     }
    //   });
    // }

    // treatments
    if (this.state.rawOutcomeData.attributes.treatments.length) {
      let rawTreatment = this.state.rawOutcomeData.attributes.treatments;
      rawTreatment.map(function(obj, key) {
        let momentStartDate = moment(obj.start_date, "YYYY-MM-DD");
        let startYear = momentStartDate.format("YYYY");
        let startMonthNum = momentStartDate.format("MM");
        // for end date
        let momentEndDate = moment();
        let endYear = momentEndDate.format("YYYY");
        // console.log("endYear", endYear);
        let endMonthNum = momentEndDate.format("MM");
        if (obj.end_date) {
          momentEndDate = moment(obj.end_date, "YYYY-MM-DD");
          endYear = momentEndDate.format("YYYY");
          // console.log("endYear", endYear);
          endMonthNum = momentEndDate.format("MM");
        }

        if (startYear === endYear) {
          for (let i = startMonthNum; i <= endMonthNum; i++) {
            let tmpmonth = moment(i, "MM").format("MMM");
            calendarArr[startYear].months[tmpmonth].treatments.push(obj);
          }
        } else if (startYear < endYear) {
          for (let j = startYear; j <= endYear; j++) {
            if (j === startYear) {
              // start year start month calculation
              for (let i = startMonthNum; i <= 12; i++) {
                let tmpmonth = moment(i, "MM").format("MMM");
                calendarArr[startYear].months[tmpmonth].treatments.push(obj);
              }
            } else if (j === parseInt(endYear)) {
              // end year end month calculation
              for (let i = 1; i <= endMonthNum; i++) {
                let tmpmonth = moment(i, "MM").format("MMM");
                calendarArr[endYear].months[tmpmonth].treatments.push(obj);
              }
            } else {
              for (let i = 1; i <= 12; i++) {
                let tmpmonth = moment(i, "MM").format("MMM");
                calendarArr[j].months[tmpmonth].treatments.push(obj);
              }
            }
          }
        } else {
          console.log("Treatments start year is greater than end year");
        }
      });
    }

    // side effects
    if (this.state.rawOutcomeData.attributes.side_effects.length) {
      let rawTreatment = this.state.rawOutcomeData.attributes.side_effects;
      rawTreatment.map(function(obj, key) {
        let momentStartDate = moment(obj.start_date, "YYYY-MM-DD");
        let momentEndDate = moment(obj.end_date, "YYYY-MM-DD");
        let startYear = momentStartDate.format("YYYY");
        // let startMonth = momentStartDate.format("MMM");
        let startMonthNum = momentStartDate.format("MM");
        let endYear = momentEndDate.format("YYYY");
        // let endMonth = momentEndDate.format("MMM");
        let endMonthNum = momentEndDate.format("MM");
        // // console.log("startMonth", startMonth, "endMonth", endMonth);
        if (startYear === endYear) {
          for (let i = startMonthNum; i <= endMonthNum; i++) {
            let tmpmonth = moment(i, "MM").format("MMM");
            calendarArr[startYear].months[tmpmonth].sideeffect.push(obj);
          }
        } else if (startYear < endYear) {
          for (let j = startYear; j <= endYear; j++) {
            if (j === startYear) {
              // start year start month calculation
              for (let i = startMonthNum; i <= 12; i++) {
                let tmpmonth = moment(i, "MM").format("MMM");
                calendarArr[startYear].months[tmpmonth].sideeffect.push(obj);
              }
            } else if (j === parseInt(endYear)) {
              // end year end month calculation
              for (let i = 1; i <= endMonthNum; i++) {
                let tmpmonth = moment(i, "MM").format("MMM");
                calendarArr[endYear].months[tmpmonth].sideeffect.push(obj);
              }
            } else {
              for (let i = 1; i <= 12; i++) {
                let tmpmonth = moment(i, "MM").format("MMM");
                calendarArr[j].months[tmpmonth].sideeffect.push(obj);
              }
            }
          }

        } else {
          console.log("Side Effect start year is greater than end year");
        }
      });
    }
    this.setState({ "outcomeArr": calendarArr });
  }

  render() {
    return (
      <div className="outcome-chart">
        {this.state.showLoader && <Loader />}
        <YearWiseListing outcomeArr = {this.state.outcomeArr} />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    outcomes: state.outcomeData,
  };
}
export default connect(mapStateToProps, { getOutcomeData })(MyOutcomeCalendar);
