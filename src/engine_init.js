/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import gamemodel from "./model/gamemodel";
import engine from "./engine/engine";
import global from "./global"
import Airplane from "./model/airplane";
import {playGame} from "./view/view";
import screenfull from "./engine/screenfull";
import {socketStatusSwitcher} from "./socket/transmitted"
import {
  startGameLoop,
  enableBulletsCollectingEngine
} from "./engine/engine.js";
import {
  configCanvasEventListen,
  changeKeyEventBindings
} from "./engine/keybinding.js";

export const startGame = (userId,userName)=> {
  let airPlane = new Airplane();
  gamemodel.data.engineControlData.airPlane = airPlane;
  gamemodel.data.engineControlData.airPlane.name = userName;
  gamemodel.data.engineControlData.airPlane.userId = userId;
  gamemodel.data.engineControlData.airPlane.id = 0;
  socketStatusSwitcher();
  playGame();
  configCanvasEventListen();
  changeKeyEventBindings();
  startGameLoop();
  enableBulletsCollectingEngine();
};

/*handle_user_input.js ends here*/
