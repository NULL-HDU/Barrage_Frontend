/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import gamemodel from "./model/gamemodel";
import engine from "./engine/engine";
import Airplane from "./model/airplane";
import {playGame} from "./view/view";
import screenfull from "./engine/screenfull.js";
import {
  startGameLoop,
  enableBulletsCollectingEngine
} from "./engine/engine.js";
import {
  configCanvasEventListen,
  changeKeyEventBindings
} from "./engine/keybinding.js";

let startGame = ()=> {
  playGame();
  configCanvasEventListen();
  changeKeyEventBindings();
  startGameLoop();
  enableBulletsCollectingEngine();
};

let debug = () =>{
    if (console && console.log) {
        //console.log(args);
    }
};

window.onload = ()=> {
    let airPlane = new Airplane();
    gamemodel.data.engineControlData.airPlane = airPlane;

    debug(engine);
    if (screenfull.enabled) {
      screenfull.request();
    }
    startGame();
};

/*handle_user_input.js ends here*/
