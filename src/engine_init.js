/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import gamemodel from "./model/gamemodel";
import engine from "./engine/engine";
import global from "./global"
import Airplane from "./model/airplane";
import {initView} from "./view/Nview";
import screenfull from "./engine/screenfull";
import transmitted from "./socket/transmitted.js"
import {
  startGameLoop,
  enableBulletsCollectingEngine
} from "./engine/engine.js";
import {
  configCanvasEventListen,
  changeKeyEventBindings
} from "./engine/keybinding.js";

//let tm = new transmitted();

//let playerNameInput = document.getElementById('playerNameInput');


export const startGame = ()=> {
//  document.getElementById('gameWrapper').style.display = "none";
  let airPlane = new Airplane();
  gamemodel.data.engineControlData.airPlane = airPlane;
  gamemodel.data.engineControlData.airPlane.name = "Arthury";
  initView();
  configCanvasEventListen();

  changeKeyEventBindings();
  startGameLoop();
  enableBulletsCollectingEngine();
};

// let debug = () =>{
//     if (console && console.log) {
//         //console.log(args);
//     }
// };

// var validNick = function() {
//     var regex = /^\w*$/;
//     return regex.exec(playerNameInput.value) !== null;
// };

// function bindNameInputEvent(e){
//     var p = document.getElementsByTagName('p');
//     var key = e.which || e.keycode;
//     if (validNick()) {
//         playerNameInput.style.cssText = "color: white; border-color: white;";
//         p[0].style.cssText = "color: white";
//         p[1].style.cssText = "color: white";
//         p[0].innerHTML = "Hi!";
//         p[1].innerHTML = "Press enter and let's fighting";
//         if (key === global.KEY_ENTER && playerNameInput.value.length !== 0) {
//             debug(engine);
//             if (screenfull.enabled) {
//                 screenfull.request();
//             }
//             console.log("validNick");
//             startGame();
//         }
//     } else {
        
//         playerNameInput.style.cssText = "color: red; border-color: red;";
//         p[0].style.cssText = "color: red";
//         p[1].style.cssText = "color: red";
//         p[0].innerHTML = "Hey~";
//         p[1].innerHTML = "Please tell me your correct name, warrior";
//     }
// }

// window.onload = ()=> {
//     let airPlane = new Airplane();
//     gamemodel.data.engineControlData.airPlane = airPlane;
//     playerNameInput.addEventListener('keyup', bindNameInputEvent);

// };

/*handle_user_input.js ends here*/
