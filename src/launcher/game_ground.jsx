/* game_ground.jsx --- game page
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import ghostTheme from "./ghostTheme.js";
import {changeHash} from "../utils/url.js";
import gamemodel from "../model/gamemodel.js";
import InfoDialog from "./components/InfoDialog.jsx";

import Data from "./launcher_data.js";
import {
  initEngine,
  initView,
  overEngine,
  overView,
  overSocket,
} from "./bridge.js";

window.dialogs = {};

export default class GameGroundPage extends Component {

  constructor(props){
    super(props);
  }

  getChildContext(){
    return {
      muiTheme: getMuiTheme(ghostTheme)
    };
  }

  componentDidMount() {
      if(!Data.UserId){
          changeHash("/");
          return;
      }
      if(!Data.Name){
          changeHash("/");
          return;
      }

      initView(() => {
          initEngine(Data.UserId, Data.Name);
      });
  }

  componentWillUnmount() {
      Data.UserId = 0;
      Data.Name = "";
      overEngine();
      overView();
      overSocket();
  }

  render() {
    return (
      <div ref={(c)=>gamemodel.gameground = c} id="gameground">
          <InfoDialog ref={(c)=>window.dialogs.info = c}/>
      </div>
    );
  }
}
GameGroundPage.propTypes = {
  style: React.PropTypes.object,
};
GameGroundPage.defaultProps = {
  style: {}
};
GameGroundPage.childContextTypes = {
  muiTheme: React.PropTypes.object
};


/* game_ground.jsx ends here */
