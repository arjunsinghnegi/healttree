import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { browserHistory, Link } from "react-router";
import { getTreatmentData, getTreatmentLegends, resetFavTreatment, resetTreatmentData, resetTreatmentLegends, toggleFavTreatment } from "../../../actions/treatmentOptionsActions";
import React, { Component } from "react";
import $ from "jquery";
// import BackLink from "../../common/backButton";
import { connect } from "react-redux";
import FilterWindow from "../Modals/filterTreatments";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/loader";
import OrgChart from "orgchart";
import ReactTooltip from "react-tooltip";
import Transition from "react-transition-group";
import TransitionGroup from "react-addons-transition-group";
import TreatmentName from "./treatmentName";

const newLocal = "patient_treatment_options";
class TreatmentOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: null,
      originalData: null,
      renderTable: false,
      showLoader: true,
      legends: null,
      treatment_types: [],
      openFilter: false,
      userId: null,
    };
    this.optionsLength = 0;
    // functions
    this.renderChart = this.renderChart.bind(this);
    // this.renderLegends = this.renderLegends.bind(this);
    this.renderSubOptions = this.renderSubOptions.bind(this);
    this.props.getTreatmentLegends(this.props.token);
    this.open_filter = this.open_filter.bind(this);
    this.setFavourite = this.setFavourite.bind(this);
    this.props.getUserInfo(props.token);
  }

  componentDidMount() {
    // this.setState({ showLoader: false });
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.toggleFav.isSuccess && nextProps.toggleFav.data) {
        this.props.resetFavTreatment();
        this.props.getTreatmentData(this.props.token);
        let toggleFavData = nextProps.toggleFav.data;
        let hierarchyObj = toggleFavData.hierarchyObj;
        // if (this.state.tableData) {
        //   let tmpTreatmentOpt = this.state.tableData;
        //   tmpTreatmentOpt[hierarchyObj.parentKey].children[hierarchyObj.type][hierarchyObj.index].favourite_id = (hierarchyObj.isFav) ? toggleFavData.id : null;
        //   tmpTreatmentOpt[hierarchyObj.parentKey].children[hierarchyObj.type][hierarchyObj.index].marked_as = (hierarchyObj.isFav) ? "Favorite" : null;
        //   this.setState({ tableData: tmpTreatmentOpt });
        // }
      }
      if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
        let userinfo = nextProps.userinfo;
        this.setState({ userId: userinfo.id });
      }
      // for legends
      if (nextProps.isLegendSuccess || nextProps.isLegendError) {
        this.setState({ "showLoader": false });
      }
      if (nextProps.legends && nextProps.isLegendSuccess) {
        this.setState({ legends: nextProps.legends }, function() {
          this.props.resetTreatmentLegends(this.props.token);
          this.props.getTreatmentData(this.props.token);
        });


      }
      if (nextProps.legends && nextProps.isLegendSuccess) {
        this.setState({ legends: nextProps.legends });

      }
      // for treatment options
      if (nextProps.isRequesting) {
        this.setState({ "showLoader": true });
      }
      if (nextProps.isSuccess || nextProps.isError) {
        this.setState({ "showLoader": false });
      }
      if (nextProps.data && nextProps.isSuccess && nextProps.data !== props.data) {
        let data = nextProps.data;
        this.props.resetTreatmentData();
        let treatment_types = [];
        let treatment_types_obj = {};

        if (!this.state.legends) {
          return;
        }
        this.state.legends.map((legend, obj) => {
          treatment_types.push(legend.attributes.name);
          treatment_types_obj[legend.attributes.name] = [];
        });
        this.setState({ treatment_types: treatment_types });
        // this.setState({ "data": data });
        let optionsGroup = [];
        this.optionsLength = data.length;
        data.map(function(obj, key) {
          let tableObj = {};
          let length = parseInt(optionsGroup.length);
          let options = {};
          options.id = obj.id;
          options.name = obj.attributes.name;
          options.treatment_option_type = obj.attributes.treatment_option_type;
          options.link = obj.attributes.is_clickable;
          options.marked_as = (obj.attributes.marked_as) ? obj.attributes.marked_as : null;
          options.favourite_id = (obj.attributes.patient_treatment_option_id) ? obj.attributes.patient_treatment_option_id : null;
          // console.log("obj.attributes.marked_as", obj.attributes.marked_as);
          if (obj.attributes.marked_as && obj.attributes.marked_as === "Filter") {
            return;
          }
          if (length && optionsGroup[length - 1].name == obj.attributes.treatment_option_group) {
            if (options.treatment_option_type) {
              optionsGroup[length - 1].children[options.treatment_option_type].push(options);
            } else {
              // optionsGroup[length - 1].children["Others"].push(options);
            }
          } else {
            let tmpObj = {};
            tmpObj.name = obj.attributes.treatment_option_group;
            tmpObj.className = "";
            tmpObj.className = "treatment-group-org";
            tmpObj.colorCode = obj.attributes.color_code;
            tmpObj.children = JSON.parse(JSON.stringify(treatment_types_obj));
            if (options.treatment_option_type) {
              tmpObj.children[options.treatment_option_type].push(options);
            } else {
              // tmpObj.children["Others"].push(options);
            }
            optionsGroup.push(tmpObj);
          }
        }
        );
        this.setState({ tableData: optionsGroup, originalData: data });
      }
    }
  }

  setFavourite(obj, index, parentKey, type) {
    let tmpTreatmentOpt = this.state.tableData;
    if (obj.marked_as && obj.marked_as === "Favorite") {
      let fav_id = obj.favourite_id;
      tmpTreatmentOpt[parentKey].children[type][index].marked_as = null;
      tmpTreatmentOpt[parentKey].children[type][index].favourite_id = null;
      this.setState({ tableData: tmpTreatmentOpt });
      // call destroy
      this.props.toggleFavTreatment(this.props.token, null, fav_id);
    } else {
      tmpTreatmentOpt[parentKey].children[type][index].marked_as = "Favorite";
      this.setState({ tableData: tmpTreatmentOpt });
      let postData = {
        "data": {
          "type": "patient_treatment_options",
          "attributes": {
            "marked_as": "Favorite",
            "user_id": this.state.userId,
            "treatment_option_id": obj.id,
          },
        },
      };
      let hierarchyObj = {
        "isFilter": true,
        "parentKey": parentKey,
        "type": type,
        "index": index,
      };

      // create new entry// create new entry
      this.props.toggleFavTreatment(this.props.token, postData, null, hierarchyObj);
    }

  }
  renderSubOptions(childValues, uniqueKey) {
    let typeLength = this.state.treatment_types.length;
    let returnArr = [];
    for (let i = typeLength - 1 ; i >= 0 ; i--) {
      let type = this.state.treatment_types[i];
      if (childValues[type]) {
        if (i + 1 === typeLength) {
          // last element
          if (childValues[type].length) {
            returnArr.push(<td className="outer-dv1" key={uniqueKey + "_" + i} >
              <div className="max-widths">
                <span className="inner-nav-span-last"></span>
                <table className="blue-dv1" >
                  <tbody>
                    {childValues[type].map((treatment, key) => {
                      let split_str = treatment.name.split("(");
                      let path = "javascript:void(0)";
                      if (treatment.link) {
                        path = "/treatment-info/" + treatment.id;
                      }
                      if (parseInt(key + 1) === parseInt(childValues[type].length)) {
                        return <tr key = {key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav = {this.setFavourite} parentKey={uniqueKey} type={type}/>
                            <span className="last-span"></span>
                          </td>
                        </tr>;
                      } else {
                        return <tr key = {key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav = {this.setFavourite} parentKey={uniqueKey} type={type}/>
                          </td>
                        </tr>;
                      }

                    })}

                  </tbody>
                </table>
              </div>
            </td>);
          } else {
            returnArr.push(<td className="outer-dv-no-data" key={uniqueKey + "_" + i} ></td>);
          }

        } else {
          let show_blue_line = false;
          for (let j = i + 1 ; j < typeLength ; j++) {
            let prevElem = this.state.treatment_types[j];
            if (childValues[prevElem].length) {
              show_blue_line = true;
            }
          }
          if (show_blue_line) {
            returnArr.push(<td className="outer-dv1" key={uniqueKey + "_" + i}>
              <div className="max-widths">
                <table className="blue-dv1">
                  <tbody>
                    {childValues[type].map((treatment, key) => {
                      let split_str = treatment.name.split("(");
                      let path = "javascript:void(0)";
                      if (treatment.link) {
                        path = "/treatment-info/" + treatment.id;
                      }
                      if (parseInt(key + 1) === parseInt(childValues[type].length)) {
                        return <tr key = {key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav = {this.setFavourite} parentKey={uniqueKey} type={type}/>
                            <span className="last-span"></span>
                          </td>
                        </tr>;
                      } else {
                        return <tr key = {key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav = {this.setFavourite} parentKey={uniqueKey} type={type}/>
                          </td>
                        </tr>;
                      }

                    })}

                  </tbody>
                </table>
              </div>
            </td>);
          } else {
            returnArr.push(<td className="outer-dv1" key={uniqueKey + "_" + i}>
              <div className="max-widths">
                <span className="inner-nav-span-last"></span>
                <table className="blue-dv1" >
                  <tbody>
                    {childValues[type].map((treatment, key) => {
                      let split_str = treatment.name.split("(");
                      let path = "javascript:void(0)";
                      if (treatment.link) {
                        path = "/treatment-info/" + treatment.id;
                      }
                      if (parseInt(key + 1) === parseInt(childValues[type].length)) {
                        return <tr key = {key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav = {this.setFavourite} parentKey={uniqueKey} type={type}/>
                            <span className="last-span"></span>
                          </td>
                        </tr>;
                      } else {
                        return <tr key = {key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav = {this.setFavourite} parentKey={uniqueKey} type={type}/>
                          </td>

                        </tr>;
                      }

                    })}
                  </tbody>
                </table>
              </div>
            </td>);
          }
        }
      }

    }
    returnArr = returnArr.reverse();
    return returnArr;
  }

  renderChart(tbldata, key) {
    let uniqueKey = key;
    return <tr className="child-tr" key={key}>
      <td>
        <span className="inner-nav-span"></span>
        <div className="blue-dv">{tbldata.name}</div>
      </td>
      {/* <td></td> */}

      {this.renderSubOptions(tbldata.children, uniqueKey)}
    </tr>;
  }

  open_filter() {
    this.setState({
      openFilter: !this.state.openFilter,
    });
  }

  /* ***** */
  render() {
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader noPageTop={true} />}
        <div className="col-sm-12">
          <h2 className="page-title">Treatment Options
          </h2>

          <div className="myeloma_content"><label> This page lists the different treatment options available for you. Clicking on each drug will take you to a page that gives you details about the selected drug.
          You can save this drug to a favorites or click the filter button and remove this drug from your view.. </label></div>
          <div className="filter_treatment_options">
            <button
              onClick={ (e) => this.open_filter(e) }
              type="button"
              className="btn blue_btn text-center hvr-bounce-to-top">
              <i className="flaticon-clipboard"></i><span>Filter</span>
            </button>
          </div>
          {this.state.openFilter && this.state.originalData && this.state.originalData.length && <FilterWindow
            token = {this.props.token}
            // patientInfo = {this.state.patientInfo}          
            treatmentOptions = {this.state.originalData}
            userId = {this.state.userId}
            legends = {this.state.legends}
            modal_var = {this.state.openFilter}
            handle_modal = { (e) => this.open_filter(e) } />}
          <div className="tree-structure">
            <div className="clt outer-main">
              <table className="wdtbl-100">
                <tbody>
                  <tr className="top-nav">
                    <td width="150" height="98"></td>
                    {this.state.treatment_types.map((type, key) => {
                      return <td key={key}>{type}</td>;
                    })}
                  </tr>

                  {/* start the chart here */}
                  {this.state.tableData && this.state.tableData.map((tblData, key) => {
                    return this.renderChart(tblData, key);
                  })}
                  {/* create clinical trails */}
                  {/* <tr className="child-tr">
                    <td width="150" height="98">
                      <span className="inner-nav-span"></span>
                      <div className="blue-dv">Clinical Trials</div>
                    </td>
     
                    <td className="outer-dv1">
                      <div className="max-widths">
                        <span className="inner-nav-span-last"></span>
                        <table className="blue-dv1" >
                          <tbody>
                            <tr>
                              <td class="outer-bluedv">
                                <span className="span-bluedv">
                                  <span className="truncate-option treatment-name treatment-anchor">
                                    <Link to="/clinical-trials" >Go to Clinical Trials</Link>
                                  </span>
                                </span>
                                <span className="last-span"></span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>

                  </tr> */}
                </tbody>
              </table>
            </div>
            {/*  */}
          </div>

          <div className="form-group">
            <div className="col-sm-12 text-center treatment-op-continue">
              {/* <button onClick={this.onContinue} type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top">Continue</button> */}
              <Link to="/clinical-trials" className="btn green-btn green-hvr-bounce-to-top labs-info-btn btn-rt">Continue</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    patientInfo: state.patient.patientinfo,
    data: state.treatmentOptions.data,
    isRequesting: state.treatmentOptions.isRequesting,
    isError: state.treatmentOptions.isError,
    isSuccess: state.treatmentOptions.isSuccess,
    legends: state.treatmentOptions.legends,
    userinfo: state.user.userinfo,
    toggleFav: state.favorite,
    isLegendRequesting: state.treatmentOptions.isLegendRequesting,
    isLegendSuccess: state.treatmentOptions.isLegendSuccess,
    isLegendError: state.treatmentOptions.isLegendError,
  };
}
export default connect(mapStateToProps, { getTreatmentData, getTreatmentLegends, resetTreatmentLegends, toggleFavTreatment, getUserInfo, resetFavTreatment, resetTreatmentData })(TreatmentOptions);
