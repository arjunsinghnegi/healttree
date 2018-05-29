// APP css
import "./assets/css/common.css";
import "./assets/css/simple-sidebar.css";
import "./assets/css/hover.css";
import "./assets/css/responsive.css";
import "./assets/fonts/flaticon.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import React, { Component } from "react";
import Alert from "react-s-alert";
import Footer from "./components/common/footer";
import Header from "./components/common/header";
import Sidemenu from "./components/common/sidemenu";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleState: "",
    };

  }

  componentDidMount() {
    document.title = "Healthtree";
  }

  toggleState() {
    if (this.state.toggleState === "") {
      this.setState({ toggleState: "toggled" });
      document.getElementsByTagName("body")[0].className = "lock";
    } else {
      this.setState({ toggleState: "" });
    }
  }

  onClickOverlay() {
    this.setState({ toggleState: "" });
    document.getElementsByTagName("body")[0].className = "";
    document.getElementById("menu-toggle").classList.remove("close-nav");
  }

  render() {
    return (
      <section className="main-cover">
        <Header wrapperToggle={() => this.toggleState()} props = {this.props} />
        <section id="wrapper" className={this.state.toggleState}>
          <Sidemenu props = {this.props}/>
          {this.props.children}
          <Alert stack={ { limit: 1 } } />
        </section>
        <Footer />
        <div id="overlay" className="show" onClick={(e) => this.onClickOverlay()}></div>

      </section>
    );
  }
}

export default App;
