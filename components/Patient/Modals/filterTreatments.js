import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { Component } from "react";
import { getTreatmentData, resetFilterTreatment, toggleFilterTreatment } from "../../../actions/treatmentOptionsActions";
import { connect } from "react-redux";
import Loader from "../../common/loader";
class FilterTreatments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treatmentOptions: this.setFilterData(props.treatmentOptions, props.legends),
      legends: props.legends,
      showLoader: false,
    };
    this.manage_modal = this.manage_modal.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.setFilterData = this.setFilterData.bind(this);
  }

  setFilterData(data, legends) {
    let optionsGroup = [];
    this.optionsLength = data.length;
    let treatment_types = [];
    let treatment_types_obj = {};
    if (!legends) {
      return;
    }
    legends.map((legend, obj) => {
      treatment_types.push(legend.attributes.name);
      treatment_types_obj[legend.attributes.name] = [];
    });
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
    });
    return optionsGroup;
  }
  componentWillReceiveProps(nextProps, props) {
    // console.log("nextProps", nextProps.toggleFilter);
    // if (nextProps.treatmentOptions && !props.treatmentOptions) {
    //   let treatmentOptions = this.setFilterData(nextProps.treatmentOptions, this.state.legends);
    //   this.setState({ treatmentOptions: treatmentOptions });
    // }
    if (nextProps.toggleFilter.isSuccess && nextProps.toggleFilter.data) {
      this.props.resetFilterTreatment();
      // this.props.getTreatmentData();
      this.setState({ showLoader: false });
      let toggleFilter = nextProps.toggleFilter.data;
      let hierarchyObj = toggleFilter.hierarchyObj;
      if (this.state.treatmentOptions) {
        let tmpTreatmentOpt = this.state.treatmentOptions;
        tmpTreatmentOpt[hierarchyObj.parentKey].children[hierarchyObj.type][hierarchyObj.index].favourite_id = (hierarchyObj.isFav) ? toggleFilter.id : null;
        if (hierarchyObj.isFilter) {
          tmpTreatmentOpt[hierarchyObj.parentKey].children[hierarchyObj.type][hierarchyObj.index].marked_as = (hierarchyObj.isFav) ? "Filter" : null;
        } else {
          tmpTreatmentOpt[hierarchyObj.parentKey].children[hierarchyObj.type][hierarchyObj.index].marked_as = (hierarchyObj.isFav) ? "Favorite" : null;
        }
        console.log("treatmentOptions", tmpTreatmentOpt);
        this.setState({ treatmentOptions: tmpTreatmentOpt, showLoader: false });
      }
    }
  }

  setFilter(children, childKey, parentKey, type) {
    let tmpTreatmentOpt = this.state.treatmentOptions;
    this.setState({ showLoader: true });
    if (children.marked_as && children.marked_as === "Filter") {
      let fav_id = children.favourite_id;
      tmpTreatmentOpt[parentKey].children[type][childKey].marked_as = null;
      tmpTreatmentOpt[parentKey].children[type][childKey].favourite_id = null;
      this.setState({ treatmentOptions: tmpTreatmentOpt });
      // call destroy
      this.props.toggleFilterTreatment(this.props.token, null, fav_id);
    } else {
      tmpTreatmentOpt[parentKey].children[type][childKey].marked_as = "Filter";
      this.setState({ treatmentOptions: tmpTreatmentOpt });
      let postData = {
        "data": {
          "type": "patient_treatment_options",
          "attributes": {
            "marked_as": "Filter",
            "user_id": this.props.userId,
            "treatment_option_id": children.id,
          },
        },
      };
      let hierarchyObj = {
        "isFilter": true,
        "parentKey": parentKey,
        "type": type,
        "index": childKey,
      };

      //   // create new entry// create new entry
      // this.setState({ showLoader: true });
      this.props.toggleFilterTreatment(this.props.token, postData, null, hierarchyObj);
    }

  }

  manage_modal() {
    this.props.getTreatmentData(this.props.token);
    // this.setState({ start_date: null, end_date: null, dosageOptions: [], frequencyOptions: [], err: {}, treatment_code: null, cyclesReceived: CYCLES });
    this.props.handle_modal("false");
  }

  showTreatments() {
    let treatmentArr = [];
    this.tabIndex = 1;
    this.state.treatmentOptions.map(function(obj, key) {
      treatmentArr.push(<div className="col-md-4" key={key}>
        <div className="treatment-group">
          <span className="treatment-label-group">{obj.name}</span>
        </div>
        {this.renderTreatmentOptions(obj, key, obj.name, this.tabIndex)}
      </div>);
    }, this);
    return treatmentArr;
  }

  // treatment options
  renderTreatmentOptions(arr, parentKey, parentName, tabIndex) {
    let options = [];
    if (arr.children) {
      for (let key in arr.children) {
        if (arr.children[key]) {
          let childTreatments = arr.children[key];
          tabIndex = tabIndex + 1;
          childTreatments.map((children, childKey) => {
            let isFiltered = (children.marked_as === "Filter") ? true : false;
            if (!children.marked_as || isFiltered) {
              options.push(
                <div className="radio" key={parentName + "_" + key + "_" + children.name}>
                  <label>
                    <input type="checkbox" tabIndex = {tabIndex} name={children.name} value={children.id} checked = {isFiltered} onClick={(e) => this.setFilter(children, childKey, parentKey, key)}/>
                    <span className="treatmentLabel"> {children.name} </span>
                  </label>
                </div>);
            }
          });
        }
      }
      // if (arr.children.Oral && arr.children.Oral.length) {
      //   arr.children.Oral.map(function(oralTreatment) {

      //   });
      // }
    }
    // arr.treatments.map(function(obj, key) {
    //   tabIndex = tabIndex + 1;
    //   options.push(
    //     <div className="radio" key={key}>
    //       <label>
    //         <input type="checkbox" tabIndex = {tabIndex} name={arr.value} value={obj.value} checked = {obj.checked} onClick={(e) => this.handleOptionChange(e, parentKey, key)}/>
    //         <span className="treatmentLabel"> {obj.label} </span>
    //       </label>
    //       {obj.label === "Other" && obj.checked && <Field
    //         name={parentKey + "_" + key + "_" + obj.label}
    //         defaultValue={obj.otherTxt}
    //         component={renderTextArea}
    //         placeholder="Kindly mention any other treatment. "
    //         onChange={(e) => this.handleTextChange(e, parentKey, arr)}
    //         className="form-control treatment-textarea"
    //         rows="5"
    //         maxLength={1000}/>}
    //     </div>
    //   );
    // }, this);
    this.tabIndex = tabIndex;
    return options;
  }
  render() {
    return (
      <Modal isOpen={ this.props.modal_var} toggle={this.manage_modal} className="modal_data modal-lg">
        <ModalHeader toggle={this.manage_modal}>
          <span className="page-title">Filter Treatments </span>
        </ModalHeader>
        <ModalBody>
          {this.state.showLoader && <Loader noPageTop={true} />}
          <div className="container">
            <div className="row">
              <span className="treatment-label-group">Treatment Groups</span>
            </div>
            <div className="row">
              {this.showTreatments()}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {/* <button tabIndex = {this.tabIndex + 1} type="button" className="btn green-btn btn-rt disabled-btn" onClick={(e) => e.preventDefault() }>Save</button> */}
          <button type="button" className="btn green-btn btn-rt green-hvr-bounce-to-top" tabIndex = {this.tabIndex} onClick={ this.manage_modal }>Cancel</button>
        </ModalFooter>
      </Modal>
    );
  }
}
function mapStateToProps(state) {
  return {
    toggleFilter: state.filter,
    // data: state.treatmentOptions.data,
    // isRequesting: state.treatmentOptions.isRequesting,
    // isError: state.treatmentOptions.isError,
    // isSuccess: state.treatmentOptions.isSuccess,
  };
}
export default connect(mapStateToProps, { getTreatmentData, resetFilterTreatment, toggleFilterTreatment })(FilterTreatments);
