/* game_ground.jsx --- game page
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import ghostTheme from "./ghostTheme.js";
import InfoDialog from "./components/InfoDialog.jsx";

import Data from "./launcher_data.js";
import {
  initEngine,
  initView,
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
      window.location.hash = "/";
      window.location.reload();
      return;
    }
    if(!Data.Name){
      window.location.hash = "/";
      return;
    }

    initView(() => {
        initEngine(Data.UserId, Data.Name);
    });
  }

  render() {
    return (
      <div>
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
