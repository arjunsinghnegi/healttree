import React, { Component } from "react";
import { connect } from "react-redux";
import { getTreatmentResource } from "../../../actions/treatmentOptionsActions";
import { getUserInfo } from "../../../actions/UserActions";
import Iframe from "react-iframe";
import { Link } from "react-router";
import Loader from "../../common/loader";
import moment from "moment";
import PersonalNote from "../Modals/personalNote";
import ReactPlayer from "react-player";


class TreatmentInfo extends Component {
  constructor(props) {
    super(props);
    let id = null;
    if (props.params.id) {
      id = props.params.id;
    } else {
      console.log("redirect to another pahe");
    }
    // set state variable here
    this.state = {
      id: id,
      content: "",
      title: "",
      showVideo: false,
      showIframe: false,
      showLink: false,
      videos: [],
      embeds: [],
      links: [],
      modal: false,
      userinfo: null,
    };
    this.props.getTreatmentResource(this.props.token, props.params.id);
    this.props.getUserInfo(this.props.token);
  }
  componentWillReceiveProps(nextProps, props) {
    console.log("nextProps.patientInfo", nextProps.data);
    if (nextProps.patientInfo) {
      this.setState({ "userinfo": nextProps.patientInfo });
    }
    if (nextProps.data !== props.data) {
      if (nextProps.isRequesting) {
        this.setState({ "showLoader": true });
      }
      if (nextProps.isError) {
        this.setState({ "showLoader": false });
      }
      if (nextProps.data && nextProps.isSuccess) {
        // console.log("nextProps%%%%", nextProps.data.data[0]);
        let data = nextProps.data.data[0];
        this.setState({ "content": data.attributes.article, "title": data.attributes.title });
        let links = nextProps.data.included;
        let linkArr = [];
        let videosArr = [];
        let embedArr = [];
        if (links.length) {
          links.map(function(link, key) {
            console.log("link.attributes.source_type", link.attributes.source_type);
            if (link.attributes.source_type === "audio/video") {
              videosArr.push(link.attributes);
            } else if (link.attributes.source_type === "embed") {
              videosArr.push(link.attributes);
            } else {
              linkArr.push(link.attributes);
            }
          });
        }
        // showVideo: false,
        // showLink: false,
        // videos: [],
        // links: [],
        // set state for links

        if (videosArr.length) {
          this.setState({ "showVideo": true, "videos": videosArr, "showLoader": false }, function() {
            this.setState({ "showLoader": false });
          });
        }
        // if (embedArr.length) {
        //   this.setState({ "showIframe": true, "embeds": embedArr, "showLoader": false }, function() {
        //     this.setState({ "showLoader": false });
        //   });
        // }
        if (linkArr.length) {
          this.setState({ showLink: true, links: linkArr }, function() {
            this.setState({ "showLoader": false });
          });
        }
      }
    }
  }
  // Open modal on add and update department
  open_modal(e) {
    this.setState({
      modal: !this.state.modal,
    });
  }
  iframe(obj) {
    return {
      __html: obj.url,
    };
  }
  render() {
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <h2 className="page-title">Treatment Options</h2>
        <div className="col-sm-12 summary_div resource-links">
          <div className="row">
            <div className= "col-sm-3 label_parent resource_logo">
              <Link to="/treatment-options" className="resource_back">
                <img alt="question-pic" className="img-fluid" src={require("../../../assets/images/back.png")}/>
                <span className="resource-span">Back to Treatment Options</span>
              </Link>
            </div>
            <div className= "col-sm-3 label_parent resource_logo">
              <img alt="question-pic" className="img-fluid" src={require("../../../assets/images/edit_notes.png")} onClick={ (e) => this.open_modal(e) } />
              <span className="resource-span" onClick={ (e) => this.open_modal(e) }>Add Personal Notes</span>
            </div>
            <div className= "col-sm-3 label_parent resource_logo">
              <img alt="question-pic" className="img-fluid" src={require("../../../assets/images/download_pdf.png")}/>
              <span className="resource-span">Print PDF</span>
            </div>
            <div className= "col-sm-3 label_parent resource_logo">
              <img alt="question-pic" className="img-fluid" src={require("../../../assets/images/stethoscope.png")}/>
              <span className="resource-span">Find a Myeloma Specialist</span>
            </div>
            {/* <div className= "col-sm-2 label_parent resource_logo">
              <img alt="question-pic" className="img-fluid" src={require("../../../assets/images/chat_bubbles.png")}/>
              <span className="resource-span">Join This Treatment Forum</span>
            </div>*/}
          </div>
        </div>
        <div className="row resource-links">
          <div className= "col-sm-12 treatment-resource-label">
            <h3 className="resourceh3">{this.state.title}</h3>

          </div>
          <div className="col-sm-12 myeloma_content treatment-resource-label">
            <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
          </div>
          { this.state.showLink && <div className= "col-sm-12 treatment-resource-label">
            <h3 className="resourceh3">Links to research papers</h3>
            <ul className="treatment_info_ul">
              {this.state.links.map((obj, i) =>
                <li key={i}>
                  <a href={obj.url} className="resource_link" target = "_blank">
                    {obj.title}
                  </a>
                </li>
              ) }
            </ul>
          </div>}
          {(this.state.showVideo || this.state.showIframe) && <div className= "col-sm-12 treatment-resource-label">
            <h3 className="resourceh3">Videos</h3>
          </div>}
          { this.state.showVideo && <div className= "col-sm-12 treatment-resource-label">
            {this.state.videos.map((obj, i) =>
              <div key={i} className="col-sm-12 treatment-resource-label">
                {obj.url.indexOf("youtu.be") > -1 && <ReactPlayer url={obj.url} height="400px" width="560px" />}
                {/* <ReactPlayer url={obj.url} height="300px" />*/}
                {obj.url.indexOf("youtu.be") < 0 && <Iframe url={obj.url}
                  width="600px"
                  height="400px"
                  display="initial"
                  position="relative"
                  frameborder="0"
                />}
              </div>
            )}
          </div>}
          { this.state.showIframe && <div className= "col-sm-12 treatment-resource-label">
            {this.state.embeds.map((obj, i) =>
              <div key={i} className="col-sm-12 treatment-resource-label" dangerouslySetInnerHTML={ this.iframe(obj) }>
                {/* <ReactPlayer url={obj.url} height="300px" />*/}

              </div>
            )}
          </div>}
        </div>

        {this.state.modal && <PersonalNote
          modal_var = {this.state.modal}
          handle_modal = { (e) => this.open_modal(e) }
          userinfo={this.state.userinfo}
          token={this.props.token}
          props={this.props}
          title= "Add Personal Notes"
          treatment_id = {this.state.id}
        />}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    "patientInfo": state.user.userinfo,
    "data": state.treatmentResource.data,
    "isRequesting": state.treatmentResource.isRequesting,
    "isError": state.treatmentResource.isError,
    "isSuccess": state.treatmentResource.isSuccess,
    "isGetRequest": state.personalNote.isGetRequest,
    "isGetSuccess": state.personalNote.isGetSuccess,
    "isGetError": state.personalNote.isGetError,
    "noteData": state.personalNote.noteData,
  };
}
export default connect(mapStateToProps, { getTreatmentResource, getUserInfo })(TreatmentInfo);
