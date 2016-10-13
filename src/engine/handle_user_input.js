/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import global from "../engine/global"
import gamemodel from "../model/gamemodel"
import Airplane from "../model/airplane"
import engine from "../engine/engine"
import {initScenes} from "../view/view"

// Global Alias

var playerNameInput = document.getElementById('playerNameInput');
var airPlane = new Airplane();

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
    initScenes();
    gamemodel.data.engineControlData.airPlane = airPlane;
    changeKeyEventBindings();
}

function changeKeyEventBindings() {
    playerNameInput.removeEventListener('keyup',bindNameInputEvent);
    var left = keyboard(global.KEY_LEFT),
        up = keyboard(global.KEY_UP),
        right = keyboard(global.KEY_RIGHT),
        down = keyboard(global.KEY_DOWN);

    up.press = function() {
        console.log('up press');
        airPlane.locationCurrent.y += 5;
        console.log(gamemodel.data.engineControlData.airPlane);
    };

    up.release = function() {
        console.log('up release');
    };

    down.press = function() {
        console.log('down press');
        airplane.locationCurrent.y -= 5;
    };

    down.release = function() {
        console.log('down release');
    };

    left.press = function() {
        console.log('left press');
        airplane.locationCurrent.x -= 5;
    };

    left.release = function() {
        console.log('left release');
    };

    right.press = function() {
        console.log('right press');
        airplane.locationCurrent += 5;
    };

    right.release = function() {
        console.log('right release');
    };
    
}

function bindNameInputEvent(e){
    var p = document.getElementsByTagName('p');
    //test area
    // gamemodel.background = 'seat';
    // console.log(gamemodel);
    // console.log(airplane);

    var key = e.which || e.keycode;
    if (validNick()) {
        playerNameInput.style.cssText = "color: white; border-color: white;";
        p[0].style.cssText = "color: white";
        p[1].style.cssText = "color: white";
        p[0].innerHTML = "Hi!";
        p[1].innerHTML = "Press enter and let's fighting";
        if (key === global.KEY_ENTER && playerNameInput.value.length !== 0) {
            debug(engine);
            startGame();
        }
    } else {
        playerNameInput.style.cssText = "color: red; border-color: red;";
        p[0].style.cssText = "color: red";
        p[1].style.cssText = "color: red";
        p[0].innerHTML = "Hey~";
        p[1].innerHTML = "Please tell me your correct name, warrior";
    }
}

window.onload = function() {
    playerNameInput.addEventListener('keyup', bindNameInputEvent);
};

//helper functions

//keyboard
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener( "keydown", key.downHandler.bind(key), false);
    window.addEventListener( "keyup", key.upHandler.bind(key), false);

    return key;
}


/*handle_user_input.js ends here*/
