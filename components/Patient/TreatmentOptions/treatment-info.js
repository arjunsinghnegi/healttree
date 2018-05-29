import { getPersonalNote, getTreatmentResource, resetFavTreatment, resetTreatmentResource, toggleFavTreatment } from "../../../actions/treatmentOptionsActions";
import React, { Component } from "react";
import $ from "jquery";
import base64 from "base-64";
import blueHeart from "./images/whiteheart-20.png";
import cancelIcon from "./images/cancel-20.png";
import { connect } from "react-redux";
import filterIcon from "./images/filter-20.png";
import { getUserInfo } from "../../../actions/UserActions";
import html2canvas from "html2canvas";
import Iframe from "react-iframe";
import { Link } from "react-router";
import Loader from "../../common/loader";
import logo1 from "./images/logo.png";
import logo2 from "./images/back.png";
import logo3 from "./images/note.png";
import logo4 from "./images/pdf.png";
import logo5 from "./images/specialist.png";
import logo6 from "./images/video.jpg";
import moment from "moment";
import PersonalNote from "../Modals/personalNote";
import pinkHeart from "./images/pinkheart-20.png";
import ReactPlayer from "react-player";
import ReactTooltip from "react-tooltip";
import { SERVER_URL } from "../../../actions/constants";
import videoIcon from "./images/video_reel.jpg";

class TreatmentInfo extends Component {
  constructor(props) {
    super(props);
    let id = null;
    if (props.params.id) {
      id = props.params.id;
    } else {
      // console.log("redirect to another pahe");
    }
    // set state variable here
    this.state = {
      id: id,
      content: "",
      title: "",
      commonly_used: null,
      rarely_used: null,
      showVideo: false,
      showIframe: false,
      showLink: false,
      playVideo: null,
      videos: [],
      embeds: [],
      links: [],
      modal: false,
      userinfo: null,
      noteData: null,
      marked_as: null,
      patient_treatment_option_id: null,
    };
    this.toggleFav = this.toggleFav.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.changePlayVideo = this.changePlayVideo.bind(this);
    this.onPrint = this.onPrint.bind(this);
    this.props.getTreatmentResource(this.props.token, props.params.id);
    this.props.getUserInfo(this.props.token);
    this.props.getPersonalNote(this.props.token);
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.toggleFav.isSuccess && nextProps.toggleFav.data) {
      this.props.resetFavTreatment();
      let toggleFavData = nextProps.toggleFav.data;
      if (toggleFavData) {
        this.setState({ marked_as: toggleFavData.attributes.marked_as, patient_treatment_option_id: toggleFavData.id });
      }

    }
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
        this.props.resetTreatmentResource();
        let data = nextProps.data.data[0];
        console.log("data", data);
        this.setState({ "content": data.attributes.article, "title": data.attributes.title, "commonly_used": data.attributes.mostly_used, "rarely_used": data.attributes.rarely_used, "marked_as": data.attributes.marked_as, patient_treatment_option_id: data.attributes.patient_treatment_option_id });
        let links = nextProps.data.included;
        let linkArr = [];
        let videosArr = [];
        // let embedArr = [];
        if (links.length) {
          links.map(function(link, key) {
            if (link.attributes.source_type === "video") {
              link.attributes.thumbImage = videoIcon;
              link.attributes.isPlaying = (key === 0) ? true : false;
              if (link.attributes.url.indexOf("youtube") > -1 || link.attributes.url.indexOf("youtu.be") > -1) {
                let reg = new RegExp("(?:https?://)?(?:www\\.)?(?:youtu\\.be/|youtube\\.com(?:/embed/|/v/|/watch\\?v=))([\\w-]{10,12})", "g");
                let videoId = reg.exec(link.attributes.url)[1];
                if (videoId) {
                  link.attributes.thumbImage = `https://img.youtube.com/vi/${videoId}/1.jpg`;
                }
              }

              videosArr.push(link.attributes);
            } else if (link.attributes.source_type === "embed") {
              link.attributes.thumbImage = videoIcon;
              link.attributes.isPlaying = (key === 0) ? true : false;
              if (link.attributes.url.indexOf("youtube") > -1) {
                let reg = new RegExp("(?:https?://)?(?:www\\.)?(?:youtu\\.be/|youtube\\.com(?:/embed/|/v/|/watch\\?v=))([\\w-]{10,12})", "g");
                let videoId = reg.exec(link.attributes.url)[1];
                if (videoId) {
                  link.attributes.thumbImage = `https://img.youtube.com/vi/${videoId}/1.jpg`;

                }
              }
              videosArr.push(link.attributes);
            } else {
              linkArr.push(link.attributes);
            }
          });
        }

        if (videosArr.length) {
          this.setState({ "showVideo": true, "videos": videosArr, "showLoader": false, playVideo: videosArr[0] }, function() {
            this.setState({ "showLoader": false });
          });
        }

        if (linkArr.length) {
          this.setState({ showLink: true, links: linkArr }, function() {
            this.setState({ "showLoader": false });
          });
        }
      }
    }

    if (nextProps.noteData && nextProps.noteData !== props.noteData) {
      if (nextProps.noteData.note_id) {
        console.log("noteData", nextProps.noteData);
        this.setState({ noteData: nextProps.noteData });
      }
    }
  }
  toggleFav(event, fav) {
    event.preventDefault();
    console.log("dav", this.state.userinfo);
    console.log("<<>>>", this.state.patient_treatment_option_id);
    if (fav && this.state.patient_treatment_option_id) {
      let fav_id = this.state.patient_treatment_option_id;
      this.setState({ patient_treatment_option_id: null, marked_as: null }, function() {
        console.log(this.state.marked_as);
      });
      this.props.toggleFavTreatment(this.props.token, null, fav_id);
      // this.props.toggleFavTreatment(this.props.token, null, null);
    } else {
      let postData = {
        "data": {
          "type": "patient_treatment_options",
          "attributes": {
            "marked_as": "Favorite",
            "user_id": this.state.userinfo.id,
            "treatment_option_id": this.state.id,
          },
        },
      };
      this.setState({ marked_as: "Favorite" });
      this.props.toggleFavTreatment(this.props.token, postData, null);
    }
  }
  toggleFilter(event, fav) {
    event.preventDefault();
    if (fav && this.state.patient_treatment_option_id) {
      let fav_id = this.state.patient_treatment_option_id;
      this.setState({ patient_treatment_option_id: null, marked_as: null }, function() {
        console.log(this.state.marked_as);
      });
      this.props.toggleFavTreatment(this.props.token, null, fav_id);
      // this.props.toggleFavTreatment(this.props.token, null, null);
    } else {
      let postData = {
        "data": {
          "type": "patient_treatment_options",
          "attributes": {
            "marked_as": "Filter",
            "user_id": this.state.userinfo.id,
            "treatment_option_id": this.state.id,
          },
        },
      };
      this.setState({ marked_as: "Filter" });
      this.props.toggleFavTreatment(this.props.token, postData, null);
    }
  }
  // on print function
  onPrint() {
    // canvas.width,canvas.height
    console.log("this.state.userinfo", this.state.userinfo);
    let token = encodeURI(base64.encode(base64.encode(this.props.token + "--token")));
    let id = encodeURI(base64.encode(base64.encode(this.state.userinfo.id + "--id")));
    let treatment_id = encodeURI(base64.encode(base64.encode(this.state.id + "--treatment_detail")));
    let url = `${SERVER_URL}/pdfs/${id}/${token}/${treatment_id}/treatment_detail.pdf`;
    console.log("i am in print", url);
    window.open(url);
    // this.setState({ "showLoader": true });
    // $(".top-icons").css("display", "none");
    // $(".video-section").css("display", "none");
    // $(".support-dv").css("display", "none");
    // $(".video-section-links").css("display", "block");
    // $(".article-section-links").css("display", "block");
    // html2canvas(document.getElementById("treatment_resource_print"), {
    //   onrendered: function(canvas) {
    //     $(".top-icons").css("display", "block");
    //     $(".video-section").css("display", "block");
    //     $(".support-dv").css("display", "block");
    //     $(".video-section-links").css("display", "none");
    //     $(".article-section-links").css("display", "none");
    //     console.log("canvas", canvas);
    //     var canvasImg = canvas.toDataURL("image/jpg");
    //     $("#treatment_resource_hidden").html("<img src=\"" + canvasImg + "\" alt=\"\">");
    //     setTimeout(function() {
    //       window.print();
    //       this.setState({ "showLoader": false });
    //     }.bind(this), 3000);

    //   }.bind(this),
    // });
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
  changePlayVideo(e, obj, index) {
    e.preventDefault();
    console.log("index", index);
    let videosArr = this.state.videos;
    videosArr.map((video, key) => {
      videosArr[key].isPlaying = false;
      if (parseInt(index) === parseInt(key)) {
        videosArr[key].isPlaying = true;;
      }
    });
    this.setState({ playVideo: obj, videos: videosArr });
  }
  render() {
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        <div className="col-sm-12">
          <div className="right-section" id="treatment_resource_print">
            <h2>Treatment Option Details</h2>
            <div className="top-icons col-sm-12">
              <div className="icon-dv">
                {/* <img src={logo2}/>
                <p>Back To Tratement<span> Options</span> </p> */}
                <Link to="/treatment-options" className="resource_back">
                  <img alt="Back To Treatement" className="img-fluid" src={logo2}/>
                  <p>Back to Treatment<span> Options</span> </p>
                </Link>
              </div>
              <div className="icon-dv">
                <img alt="Add Personal Notes" className="img-fluid" src={logo3} onClick={ (e) => this.open_modal(e) } />
                <p onClick={ (e) => this.open_modal(e) }>Add Personal <span>Notes</span></p>
              </div>
              <div className="icon-dv" onClick={ (e) => this.onPrint(e) }>
                <img src={logo4}/>
                <p>Print PDF<span> Page</span></p>
              </div>
              <div className="icon-dv">
                <a href="https://www.myelomacrowd.org/myeloma-directory/" target="_blank">
                  <img src={logo5}/>
                  <p>Find a Myeloma <span>Speciality Treatment Center Near You</span></p>
                </a>
              </div>
            </div>
            <div className="head-dv">
              <h1>
                {this.state.title}
                {!this.state.marked_as && <img className="heart-icon-resource" data-tip data-for="whiteheart1" src={blueHeart} onClick={(e) => this.toggleFav(e)}/>}
                {!this.state.marked_as && <img className="heart-icon-resource" data-tip data-for="filter1" src={filterIcon} onClick={(e) => this.toggleFilter(e)}/>}
                {this.state.marked_as && this.state.marked_as === "Favorite" && <img data-tip data-for="pinkheart1" className="heart-icon-resource" alt="click to mark fav" src={pinkHeart} onClick={(e) => this.toggleFav(e, "Favorite")}/>}
                {this.state.marked_as && this.state.marked_as === "Filter" && <img data-tip data-for="cancel1" className="heart-icon-resource" alt="click to mark fav" src={cancelIcon} onClick={(e) => this.toggleFilter(e, "Favorite")}/>}
              </h1>
              <ReactTooltip place="bottom" type="dark" effect="solid" id="whiteheart1">
                <ul>
                  <li className="summary_li">Click to Mark as Favorite</li>
                </ul>
              </ReactTooltip>
              <ReactTooltip place="bottom" type="dark" effect="solid" id="pinkheart1">
                <ul>
                  <li className="summary_li">Click to Remove as Favorite</li>
                </ul>
              </ReactTooltip>
              <ReactTooltip place="bottom" type="dark" effect="solid" id="filter1">
                <ul>
                  <li className="summary_li">Click to Filter</li>
                </ul>
              </ReactTooltip>
              <ReactTooltip place="bottom" type="dark" effect="solid" id="cancel1">
                <ul>
                  <li className="summary_li">Marked as filtered</li>
                </ul>
              </ReactTooltip>
              {/*  */}
            </div>
            <div className="row clearfix">
              <div className="col-sm-7 brdr-right">
                <div className="left-inner-content resource-dynamic">
                  {/* <h2>Summary</h2> */}
                  <h2 className="custom-pad-b helvetica-nue-info">Summary</h2>
                  <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
                  {this.state.noteData && <div>
                    <hr />
                    <h2 className="custom-pad-b helvetica-nue-info">Personal Notes</h2>
                    <p>{this.state.noteData.personal_note}</p>
                  </div>}
                </div>
              </div>
              <div className="col-sm-5">
                <div className="left-inner-content">
                  <h2 className="custom-pad-b helvetica-nue-info">Usage at a Glance</h2>
                  <div className="glance-dv">
                    <p>Commonly Used For:</p>
                    <span>{this.state.commonly_used}</span>
                  </div>
                  <div className="glance-dv">
                    <p>Rarely Used For:</p>
                    <span>{this.state.rarely_used}</span>
                  </div>
                  <hr/>
                  <div className="support-dv video-section-links">
                    <h2 className="helvetica-nue-info">Videos</h2>
                    <hr/>
                    {this.state.videos.map((obj, i) =>
                      <a href={obj.url} className="resource_link" target = "_blank" key={i}>
                        {obj.url}
                      </a>
                    )}
                  </div>
                  {this.state.videos.length > 0 && <div className="video-section">
                    <h2 className="custom-pad-b custom-pad-t custom-sec">Videos</h2>
                    <div className="row">
                      <div className="col-sm-12">
                        {this.state.playVideo && this.state.playVideo.source_type === "video" && this.state.playVideo.url.indexOf("youtu.be") > -1 && <ReactPlayer url={this.state.playVideo.url} height="300px" width="420px" />}
                        {this.state.playVideo && this.state.playVideo.source_type === "video" && this.state.playVideo.url.indexOf("youtu.be") < 0 && <Iframe url={this.state.playVideo.url}
                          width="420px"
                          height="300px"
                          display="initial"
                          position="relative"
                          frameborder="0"
                        />}
                        { this.state.playVideo && this.state.playVideo.source_type === "embed" && <div dangerouslySetInnerHTML={{ __html: this.state.playVideo.url }} />}
                        <span className = "playVideoTitle">{this.state.playVideo.title}</span>
                        {/* <ReactPlayer url={obj.url} height="300px" />*/}
                        {/* {this.state.playVideo.indexOf("youtu.be") < 0 && <Iframe url={this.state.playVideo}
                      width="240px"
                      height="200px"
                      display="initial"
                      position="relative"
                      frameborder="0"
                    />} */}


                      </div>
                    </div>
                    <div className="row videos-row">
                      {this.state.videos.map((obj, i) =>
                        <div key = {i} className="col-sm-4" onClick={(e) => this.changePlayVideo(e, obj, i)}>
                          {/* {obj.url.indexOf("youtu.be") > -1 && <img src="https://img.youtube.com/vi/jdytgW5wKa4/1.jpg"/>}
                          {obj.url.indexOf("youtube") > -1 && <img src="https://img.youtube.com/vi/jdytgW5wKa4/1.jpg"/>} */}
                          {obj.isPlaying && <div className="thumb-resource-img"><img className = "resource-img-border" src={obj.thumbImage} /> <span className = "videoTitle">{obj.title}</span></div>}
                          {!obj.isPlaying && <div className="thumb-resource-img"><img src={obj.thumbImage} /> <span className = "videoTitle">{obj.title}</span></div>}
                        </div>
                      )}
                    </div>
                  </div>
                  }

                  {this.state.videos.length > 0 && <hr/>}
                  <div className="support-dv custom-support-dv">
                    <h2 className="custom-pad-b helvetica-nue-info">Supporting Research</h2>
                    {this.state.links.map((obj, i) =>
                      <a href={obj.url} className="resource_link" target = "_blank" key={i}>
                        {obj.title}

                      </a>
                    ) }
                  </div>
                  <div className="support-dv article-section-links">
                    <h2 className="helvetica-nue-info">Supporting Research</h2>
                    {this.state.links.map((obj, i) =>
                      <a href={obj.url} className="resource_link" target = "_blank" key={i}>
                        {obj.url}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="treatment_resource_hidden">
          </div>
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
    "toggleFav": state.favorite,
  };
}
export default connect(mapStateToProps, { getTreatmentResource, getUserInfo, getPersonalNote, resetFavTreatment, toggleFavTreatment, resetTreatmentResource })(TreatmentInfo);
