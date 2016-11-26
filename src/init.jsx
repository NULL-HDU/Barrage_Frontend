/* init.jsx --- init socket and user name input page.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from "react-router";

import UsernameInputPage from "./launcher/user_name_input.jsx";
import ShowErrorPage from "./launcher/error.jsx";
import GameGroundPage from "./launcher/game_ground.jsx";

import {initSocket} from "./launcher/bridge.js";
import Data from "./launcher/launcher_data.js";

window.onload = () => {
  initSocket((err, userId) => {
    if(err !== null){
      window.location.hash = `error?error=${err.toString()}`;
      return;
    }
    Data.UserId = userId;

  });

  ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/"  component={() => (<UsernameInputPage />)} />
      <Route path="/game" component={() => <GameGroundPage />} />
      <Route path="/error" component={ShowErrorPage} />
    </Router>,
    document.getElementById("app"));
};


/* init.jsx ends here */
