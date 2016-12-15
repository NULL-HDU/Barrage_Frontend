/* game_ground.jsx --- game page
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";

import Data from "./launcher_data.js";
import {
  initEngine,
  initView,
  initGameModel,
} from "./bridge.js";

export default class GameGroundPage extends Component {

  constructor(props){
    super(props);
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

    initGameModel();

    initView(() => {
      initEngine(Data.UserId, Data.Name);
    });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}
GameGroundPage.propTypes = {
  style: React.PropTypes.object
};
GameGroundPage.defaultProps = {
  style: {}
};


/* game_ground.jsx ends here */
