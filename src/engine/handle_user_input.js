/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import global from "../engine/global"
import engine from "../engine/engine"
import {initGame} from "../view/treasureHunter"

var playerNameInput = document.getElementById('playerNameInput');

var debug = function(args) {
    if (console && console.log) {
        console.log(args);
    }
};

var validNick = function() {
    var regex = /^\w*$/;
    return regex.exec(playerNameInput.value) !== null;
};

function startGame() {
    document.getElementById('gameWrapper').style.opacity = 0;
    initGame();
}

window.onload = function() {

    var inputTextField = document.querySelector('#startMenu input');
    var p = document.getElementsByTagName('p');
    playerNameInput.addEventListener('keyup', function (e) {
        var key = e.which || e.keycode;
        if (validNick()) {
            inputTextField.style.cssText = "border-color: #DCDCDC; box-shadow: 0 0 3px 1px #DDDDDD";
            p[0].style.cssText = "color: white";
            p[1].style.cssText = "color: white";
            p[0].innerHTML = "Hi!";
            p[1].innerHTML = "Press enter and let's fighting";
            if (key === global.KEY_ENTER && playerNameInput.value.length !== 0) {
                debug(engine);
                startGame();
            }
        } else {
            inputTextField.style.cssText = "border-color: red; box-shadow: 0 0 3px 1px red";
            p[0].style.cssText = "color: red";
            p[1].style.cssText = "color: red";
            p[0].innerHTML = "Hey~";
            p[1].innerHTML = "Please tell me your correct name,warrior";
          }
    });
};


/*handle_user_input.js ends here*/
