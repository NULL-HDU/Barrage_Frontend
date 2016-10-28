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
import {playGame} from "../view/view"
import transmitted from "../socket/transmitted.js"
import screenfull from "../engine/screenfull.js"
import Quadtree from "../engine/quadtree"
import PVector from "../engine/Point"
// Global Alias

var playerNameInput = document.getElementById('playerNameInput');
var airPlane = new Airplane();
var vx = 0, vy = 0, vangle = 0;
var quad = new Quadtree({x:0,y:0,width:global.LOCAL_WIDTH,height:global.LOCAL_HEIGHT});
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

//配置测试敌机
function configTestEnemyPlanes() {
    var enemyPlane0 = new Airplane();
    gamemodel.data.backendControlData.airPlane.push(enemyPlane0);
    enemyPlane0.locationCurrent.x = 100;
    enemyPlane0.locationCurrent.y = 100;
    enemyPlane0.attackDir = 1;
}

function enemyBulletMakerLoop() {
    setTimeout(function () {
        let bullet = new Bullet();
        let angel = gamemodel.data.backendControlData.airPlane[0].attackDir % (2 * Math.PI);
        bullet.camp = 1;
        bullet.locationCurrent.x = gamemodel.data.backendControlData.airPlane[0].locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * 50;
        bullet.locationCurrent.y = gamemodel.data.backendControlData.airPlane[0].locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * 50;
        bullet.startPoint.x = gamemodel.data.backendControlData.airPlane[0].locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * bullet.radius;
        bullet.startPoint.y = gamemodel.data.backendControlData.airPlane[0].locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * bullet.radius;
        bullet.attackDir = gamemodel.data.backendControlData.airPlane[0].attackDir;
        gamemodel.data.backendControlData.bullet.push(bullet);
        enemyBulletMakerLoop();
    }, global.BULLET_MAKER_DEMO_LOOP_INTERVAL);
}

function bulletMakerLoop() {
    setTimeout(function () {
        let bullet = new Bullet();
        let angel = airPlane.attackDir;
        bullet.camp = 0;
        bullet.locationCurrent.x = airPlane.locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * 50;
        bullet.locationCurrent.y = airPlane.locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * 50;
        bullet.startPoint.x = airPlane.locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * 50;
        bullet.startPoint.y = airPlane.locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * 50;
        bullet.attackDir = airPlane.attackDir;
        gamemodel.data.engineControlData.bullet.push(bullet);
        if (bulletMakerStartFlag === 0) {
            bulletMakerLoop();
        }
    }, global.BULLET_MAKER_LOOP_INTERVAL);
}

function sBulletMakerLoop() {
    setTimeout(function () {
        let l_bullet = new Bullet();
        let m_bullet = new Bullet();
        let r_bullet = new Bullet();
        l_bullet.camp = 0;
        m_bullet.camp = 0;
        r_bullet.camp = 0;
        l_bullet.locationCurrent.x = airPlane.locationCurrent.x;
        l_bullet.locationCurrent.y = airPlane.locationCurrent.y;
        l_bullet.startPoint.x = airPlane.locationCurrent.x;
        l_bullet.startPoint.y = airPlane.locationCurrent.y;
        l_bullet.attackDir = airPlane.attackDir-1;
        gamemodel.data.engineControlData.bullet.push(l_bullet);

        m_bullet.locationCurrent.x = airPlane.locationCurrent.x;
        m_bullet.locationCurrent.y = airPlane.locationCurrent.y;
        m_bullet.startPoint.x = airPlane.locationCurrent.x;
        m_bullet.startPoint.y = airPlane.locationCurrent.y;
        m_bullet.attackDir = airPlane.attackDir;
        gamemodel.data.engineControlData.bullet.push(m_bullet);

        r_bullet.locationCurrent.x = airPlane.locationCurrent.x;
        r_bullet.locationCurrent.y = airPlane.locationCurrent.y;
        r_bullet.startPoint.x = airPlane.locationCurrent.x;
        r_bullet.startPoint.y = airPlane.locationCurrent.y;
        r_bullet.attackDir = airPlane.attackDir+1;
        gamemodel.data.engineControlData.bullet.push(r_bullet);

        if (bulletMakerStartFlag === 0) {
            sBulletMakerLoop();
        }
    },global.BULLET_MAKER_LOOP_INTERVAL);
}


function enableBulletEnigne(){
    bulletMakerStartFlag = 0;
    //sBulletMakerLoop();
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

    let j = gamemodel.data.backendControlData.bullet.length;
    while (j--){
        let bullet =  gamemodel.data.backendControlData.bullet[j];
        if(bullet.alive === false){
            gamemodel.data.backendControlData.bullet.splice(j,1);
        }
    }

}

function configCanvasEventListen(){
    //屏蔽右键菜单
    document.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);

    let canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown",mousePress);
    canvas.addEventListener("mouseup",mouseRelease);
    canvas.addEventListener("mousemove",mouseMove);
}

function mouseMove(e){
    let oppositeSide = e.screenX - global.LOCAL_WIDTH/2;
    let limb = e.screenY - global.LOCAL_HEIGHT/2;
    let A = Math.atan2(limb,oppositeSide) + Math.PI / 2;
    airPlane.attackDir = A;
}

function mouseRelease(e){
    if(e.which === 3){
        console.log("right click");
    }else if(e.which === 1){
//        console.log("left click");
        disableBulletEngine();
    }
}

function mousePress(e){
    if(e.which === 3){
        console.log("right click");
    }else if(e.which === 1){
  //      console.log("left click");
        enableBulletEnigne();
    }
}

function startGame() {
    let tm = new transmitted();
    document.getElementById('gameWrapper').style.display = "none";
    playGame();
    configCanvasEventListen();
    gamemodel.data.engineControlData.airPlane = airPlane;
    //init socket
    tm.login(airPlane);
    // tm.communitate(airPlane);
    changeKeyEventBindings();
    startGameLoop();
    enableBulletsCollectingEngine();
//    enableCollisionDetectionEngine();

    //测试
    configTestEnemyPlanes();
    enemyBulletMakerLoop();
}

function enableCollisionDetectionEngine(){
    /*
      1.将要检测碰撞的球体加入四叉树
      2.对每个球体进行碰撞检测，检测到的就进行标记
      3.碰撞效果和伤害检测处理之后清空四叉树，进行下一轮碰撞检测
    */
//    looper(() => {
        let selfBullets = gamemodel.data.engineControlData.bullet;
        let enemyBullets = gamemodel.data.backendControlData.bullet;
        let bulletsBank = selfBullets.concat(enemyBullets);
        let i,j;
        quad.clear();
        for(i=0;i<bulletsBank.length;i++){
            quad.insert(bulletsBank[i]);
        }
        i=0;
        while(i < selfBullets.length){
            let collidors = quad.retrieve(selfBullets[i]);
            for(j=0;j<collidors.length;j++){
                if(collidors[j].hasJudge || selfBullets[i] == collidors[j]){
                    continue;
                }
                let a = new PVector(selfBullets[i].locationCurrent.x,selfBullets[i].locationCurrent.y);
                let b = new PVector(collidors[j].locationCurrent.x,collidors[j].locationCurrent.y);
                let distance = PVector.dist(a,b);
                if(distance <= collidors[j].radius + selfBullets[i].radius && collidors[j].camp !== selfBullets[i].camp){
                    //碰撞处理和伤害计算
                    collidors[j].alive = false;
                    collidors[j].isKilled = true;
                    selfBullets[i].alive = false;
                    selfBullets[i].isKilled = true;
                    break;
                }
            }

            selfBullets[i].hasJudge = true;
            i++;
        }

//    },global.BULLET_COLLISION_DETECTION_INTERVAL);
    
}

function enableBulletsCollectingEngine() {
    looper(() => {
        uselessBulletsCollect();
    },global.BULLET_COLLECTING_INTERVAL);
}

function startGameLoop() {
    looper(() => {
        //gamemodel.data.backendControlData.airPlane[0].attackDir += 0.05;
        airPlane.move(vx,vy,vangle);
        //airPlane.attackDir += 0.05;
        //自主机子弹
        gamemodel.data.engineControlData.bullet.map(function(bullet){
            bullet.pathCalculate();
            return bullet;
        });
        //敌机子弹
        gamemodel.data.backendControlData.bullet.map(function(bullet){
            bullet.pathCalculate();
            return bullet;
        });

        enableCollisionDetectionEngine();
    },global.GAME_LOOP_INTERVAL);
}


function reductAngle(angle) {
    let a = angle % (2 * Math.PI);
    //斜边速度
    let bevelEdge = global.AIRPLANE_SPEED;
    vx = Math.cos(a + (3/2)*Math.PI) * bevelEdge;
    vy = Math.sin(a + (3/2)*Math.PI) * bevelEdge;
}

let looper = (f, t) => setTimeout(()=>{f();looper(f, t)}, t);
let bulletMakerEngine = (f, t) => window.bulletMaker = setTimeout(() => {f();bulletMakerEngine(f,t)},t )

function changeKeyEventBindings() {

    playerNameInput.removeEventListener('keyup',bindNameInputEvent);

    let left = keyboard(global.KEY_A),
        up = keyboard(global.KEY_W),
        right = keyboard(global.KEY_D),
        down = keyboard(global.KEY_S),
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
        //  reductAngle(airPlane.attackDir);
        vy = -global.AIRPLANE_SPEED;
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
        // reductAngle(airPlane.attackDir);
        // vx = -vx;
        // vy = -vy;
        vy = global.AIRPLANE_SPEED;
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
        //vangle = -Math.PI / 180 * 3;
        vx = -global.AIRPLANE_SPEED;
    };


    left.release = function() {
        if( test==1 )
            console.log('left release');
        if(right.isUp){
            //vangle = 0;
            vx = 0;
            vy = 0;
        }else{
            right.press();
        };
    };

    right.press = function() {
        if( test==1 )
            console.log('right press');
        //vangle = Math.PI / 180 * 3;
        vx = global.AIRPLANE_SPEED;
    };

    right.release = function() {
        if( test==1 )
            console.log('right release');
        if(left.isUp){
            //vangle = 0;
            vx = 0;
            vy = 0;
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
