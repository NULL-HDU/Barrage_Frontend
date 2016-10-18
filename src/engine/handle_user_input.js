/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import global from "../engine/global"
import gamemodel from "../model/gamemodel"
import Airplane from "../model/airplane"
import Bullet from "../model/bullet"
import engine from "../engine/engine"
import {initScenes} from "../view/view"
import transmitted from "../socket/transmitted.js"
import screenfull from "../engine/screenfull.js"
// Global Alias

var playerNameInput = document.getElementById('playerNameInput');
var airPlane = new Airplane();
var vx = 0, vy = 0, vangle = 0;
var test = 1;        //0 for view,1 for engine,2 for socket
var bulletMakerStartFlag = 0; //0 for enable,1 for disable;

var bulletMaker = undefined;

var debug = function(args) {
    if (console && console.log) {
        console.log(args);
    }
};

var validNick = function() {
    var regex = /^\w*$/;
    return regex.exec(playerNameInput.value) !== null;
};

function bulletMakerLoop() {
    setTimeout(function () {
        let bullet = new Bullet();
        bullet.locationCurrent.x = airPlane.locationCurrent.x;
        bullet.locationCurrent.y = airPlane.locationCurrent.y;
        bullet.startPoint.x = airPlane.locationCurrent.x;
        bullet.startPoint.y = airPlane.locationCurrent.y;
        bullet.attackDir = airPlane.attackDir;
        bullet.pathCalculate();
        gamemodel.data.engineControlData.bullet.push(bullet);
        console.log(gamemodel.data.engineControlData.bullet);
        if (bulletMakerStartFlag === 0) {
            bulletMakerLoop();
        }
    }, (1/10)*1000);
}

function enableBulletEnigne(){
    bulletMakerStartFlag = 0;
    bulletMakerLoop();
}
  
function disableBulletEngine(){
    bulletMakerStartFlag = 1;
}

function uselessBulletsCollect(){
    gamemodel.data.engineControlData.bullet.map(function(bullet){
        if (bullet.alive === false && bullet.isKilled === true){
            gamemodel.deadCache.push(bullet);
        }else if(bullet.alive === false && bullet.isKilled === false){
            gamemodel.disappearCache.push(bullet);
        }
        return bullet;
    });

    let i = gamemodel.data.engineControlData.bullet.length;
    while (i--){
        let bullet =  gamemodel.data.engineControlData.bullet[i];
        if(bullet.alive === false){
            gamemodel.data.engineControlData.bullet.splice(i,1);
        }
    }
}

function startGame() {
    document.getElementById('gameWrapper').style.opacity = 0;
    initScenes();
    gamemodel.data.engineControlData.airPlane = airPlane;
    //init socket
    let tm = new transmitted();
    tm.login(airPlane);
    changeKeyEventBindings();
    startGameLoop();
    enableBulletsCollectingEngine();
}

function enableBulletsCollectingEngine() {
    looper(() => {
        uselessBulletsCollect();
    },(1/30)*1000);
}

function startGameLoop() {
    looper(() => {
        airPlane.locationCurrent.x += vx;
        airPlane.locationCurrent.y += vy;
        airPlane.attackDir += vangle;
    },(1/120)*1000);
}

function reductAngle(angle) {
    let a = angle % (2 * Math.PI);
    //斜边速度
    let bevelEdge = 5;
    vx = Math.cos(a + (3/2)*Math.PI) * bevelEdge;
    vy = Math.sin(a + (3/2)*Math.PI) * bevelEdge;
}

let looper = (f, t) => setTimeout(()=>{f();looper(f, t)}, t);
let bulletMakerEngine = (f, t) => window.bulletMaker = setTimeout(() => {f();bulletMakerEngine(f,t)},t )

function changeKeyEventBindings() {

    playerNameInput.removeEventListener('keyup',bindNameInputEvent);

    let left = keyboard(global.KEY_LEFT),
        up = keyboard(global.KEY_UP),
        right = keyboard(global.KEY_RIGHT),
        down = keyboard(global.KEY_DOWN),
        space = keyboard(global.KEY_SPACE);

    space.press = function() {
        if( test==1 )
            console.log('space press');
        enableBulletEnigne();
    };

    space.release = function() {
        if( test==1 )
            console.log('space release');
        disableBulletEngine();
    };

    up.press = function() {
        if( test==1 )
            console.log('up press');
        reductAngle(airPlane.attackDir);
    };

    up.release = function() {
        if( test==1 )
            console.log('up release');
        if(down.isUp){
             vx = 0;
             vy = 0;
        }else{
            down.press();
        };
    };

    down.press = function() {
        if( test==1 )
            console.log('down press');
        reductAngle(airPlane.attackDir);
        vx = -vx;
        vy = -vy;
    };

    down.release = function() {
        if( test==1 )
            console.log('down release');
        if(up.isUp){
            vx = 0
            vy = 0;
        }else{
            up.press();
        };
    };

    
    left.press = function() {
        if (test==1)
            console.log('left press');
        vangle = -Math.PI / 180 * 3;
    };


    left.release = function() {
        if( test==1 )
            console.log('left release');
        if(right.isUp){
            vangle = 0;
        }else{
            right.press();
        };
    };

    right.press = function() {
        if( test==1 )
            console.log('right press');
        vangle = Math.PI / 180 * 3;
    };

    right.release = function() {
        if( test==1 )
            console.log('right release');
        if(left.isUp){
            vangle = 0;
        }else{
            left.press();
        };
    };

}

function bindNameInputEvent(e){
    var p = document.getElementsByTagName('p');
    var key = e.which || e.keycode;
    if (validNick()) {
        playerNameInput.style.cssText = "color: white; border-color: white;";
        p[0].style.cssText = "color: white";
        p[1].style.cssText = "color: white";
        p[0].innerHTML = "Hi!";
        p[1].innerHTML = "Press enter and let's fighting";
        if (key === global.KEY_ENTER && playerNameInput.value.length !== 0) {
            debug(engine);
            if (screenfull.enabled) {
                screenfull.request();
            }
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

//mouse event
function mouse(){
    var mouse = {};
    mouse.move = undefined;
    mouse.up = undefined;
    mouse.down = undefined;
    mouse.over = undefined;

    mouse.upHandler = function(event) {
        event.preventDefault();
    }
}

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
