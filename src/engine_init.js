/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import gamemodel from "./model/gamemodel";
import Airplane from "./model/airplane";

import {
  startEngine
} from "./engine/engine.js";
import {
  configCanvasEventListen,
  changeKeyEventBindings
} from "./engine/keybinding.js";

export const startGame = (userId,userName)=> {
  let airPlane = new Airplane();
  airPlane.name = userName;
  airPlane.userId = userId;
  airPlane.id = 0;
  gamemodel.data.engineControlData.airPlane = airPlane;

  configCanvasEventListen();
  changeKeyEventBindings();
  startEngine();
};

/*handle_user_input.js ends here*/
