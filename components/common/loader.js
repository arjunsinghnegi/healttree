import React, { Component } from "react";

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noPageTop: (props.noPageTop) ? props.noPageTop : false,
    };
  }
  componentDidMount() {
    if (!this.state.noPageTop) {
      let tesNode = document.getElementById("page-content-wrapper");
      window.scrollTo(tesNode.offsetTop, 0);
    }

    // console.log("tesNode", tesNode);
  }
  handleImageLoaded() {

  }
  render() {
    return (
      <div className="overlay">
        <div className="loader-image"> <img className = "loader_img" src={ require("../../assets/images/squares.gif?12344") } onLoad={this.handleImageLoaded.bind(this)} alt="loading" /> </div>
      </div>
    );
  }
}
