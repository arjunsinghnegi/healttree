import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';
import 'react-s-alert/dist/s-alert-css-effects/flip.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
 

class Header extends Component {
  render() {
    return (
      <div>
       <Alert stack={{ limit: 3}} position="top-right" timeout={3000} effect="slide" />

        <h1>React Redux Starter Kit</h1>
        <IndexLink to="/" activeClassName={classes.activeRoute}>
          Home
        </IndexLink>
        {' · '}
        <Link to="/quote" activeClassName={classes.activeRoute}>
          Quote
        </Link>
        {' · '}
        <Link to="/users" activeClassName={classes.activeRoute}>
          User
        </Link>

        {' · '}
        <Link to="/quote/add" activeClassName={classes.activeRoute}>
          Add Quote
        </Link>
      </div>
    )
  }
}

// class Header extends Component {
//   render() {
//     return (
//       <header>
//         <div className="container-fluid">
//           <div className="row align-items-center">
//             <div className="col">
//               <h1 className="logo"><img alt="logo" src={require('../assets/images/logo.png')} /></h1>
//             </div>
//             <div className="col"> <a href="#menu-toggle" className="hidden-md-up toggle-sm" id="menu-toggle"><i className="flaticon-menu"></i> <i className="flaticon-cancel"></i> </a>
//               <button className="btn blue_btn text-center hvr-bounce-to-top"><span>Logout</span><i className="fa fa-sign-out" aria-hidden="true"></i></button>
//             </div>
//           </div>
//         </div>
//       </header>
//     )
//   }
// }

export default Header
