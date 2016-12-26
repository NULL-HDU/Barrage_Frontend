/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import gamemodel from "./model/gamemodel";
import Airplane from "./model/airplane";
import {EVA01} from "./resource/airplane/roleId.js";

import {
  startEngine
} from "./engine/engine.js";
import {
  configCanvasEventListen,
  changeKeyEventBindings
} from "./engine/keybinding.js";

export const startGame = (userId,userName)=> {

  configCanvasEventListen();
  changeKeyEventBindings();
  gamemodel.userId = userId;
  gamemodel.userName = userName;

  let airPlane = undefined;

  //check if it is admin or not
  if (userName === "admin") {
      gamemodel.gameMode = 0;
  }else{
      gamemodel.gameMode = 1;
      airPlane = new Airplane(EVA01);
      airPlane.name = userName;
      airPlane.userId = userId;
  }
  
  gamemodel.data.engineControlData.airPlane = airPlane;

  startEngine();
};

/*handle_user_input.js ends here*/
