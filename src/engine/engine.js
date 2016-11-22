/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import global from "./global";
import constant from "./CommonConstant";
import gamemodel from "../model/gamemodel";
import Bullet from "../model/bullet";
import Quadtree from "./quadtree";
import PVector from "./Point";
import {
  keyboard,
  shiftLikeEvent
} from "./helper.js";

let data = gamemodel.data.engineControlData;

//airPlane.ballType = constant.AIRPLANE;
let vx = 0, vy = 0, vangle = 0;
let test = 0;
let quad = new Quadtree({x:0,y:0,width:global.LOCAL_WIDTH,height:global.LOCAL_HEIGHT});

let skillFlags = {
  engineOn: 0, //0 for enable,1 for disable;
  currentSkillType: null, // which skill user current use.
};
let normalSkillCDFlag = 0; // 0 for not in cd, 1 for in cd;

window.bulletMaker = undefined;

let looper = (f, t) => setTimeout(()=>{f();looper(f, t);}, t);
let bulletMakerEngine = (f, t) => window.bulletMaker = setTimeout(() => {f();bulletMakerEngine(f,t);},t );

// skill: shoot normal bullet
// every skillFunc should include a timer and a flag to implement skill cold.
let normalSkillFunc = ()=> {
    if(normalSkillCDFlag === 1) return;

    normalSkillCDFlag = 1;
    let airPlane = data.airPlane;
    let bullet = new Bullet();
    //bullet.ballType = "Bullet";
    let angel = airPlane.attackDir;
    bullet.camp = 0;
    bullet.locationCurrent.x = airPlane.locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * 100;
    bullet.locationCurrent.y = airPlane.locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * 100;
    bullet.startPoint.x = airPlane.locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * 50;
    bullet.startPoint.y = airPlane.locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * 50;
    bullet.attackDir = airPlane.attackDir;
    data.bullet.push(bullet);

    setTimeout( ()=> {
      normalSkillCDFlag = 0;
    }, global.NORMAL_SKILL_CD);
};

// if skillOnFlag is on and currentSkillType is the same as the skillTpye parameter,
// it will call skill fucntion, then loop itself.
let checkToCallSkillFuncThenLoop = (skillTpye) => {
  if(skillFlags.engineOn !== 0){
      skillFlags.currentSkillType = null;
  }
  if(skillFlags.currentSkillType !== skillTpye) {
    return;
  }

  switch(skillTpye){
  case global.NORMAL_SKILL:
    normalSkillFunc();break;
  default:
    return;
  }

  setTimeout(() => checkToCallSkillFuncThenLoop(skillTpye), global.SKILL_CHECk_LOOP_INTERVAL);
};

// There are two function to toggle Skill Engine
let enableSkillEngine=(skillTpye)=>{
    skillFlags.engineOn = 0;

    if(skillFlags.currentSkillType === skillTpye) return;
    skillFlags.currentSkillType = skillTpye;
    checkToCallSkillFuncThenLoop(skillTpye);
};

let disableSkillEngine=()=>{
    skillFlags.engineOn = 1;
};

let uselessBulletsCollect=()=>{
    gamemodel.data.engineControlData.bullet.map((bullet)=>{
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
};

let mouseMove=(e)=>{
    let oppositeSide = e.screenX - global.LOCAL_WIDTH/2;
    let limb = e.screenY - global.LOCAL_HEIGHT/2;
    let A = Math.atan2(limb,oppositeSide) + Math.PI / 2;
    data.airPlane.attackDir = A;
};


let mouseRelease=(e)=>{
    if(e.which === 3){
        // console.log("right click");
    }else if(e.which === 1){
//        console.log("left click");
        disableSkillEngine();
    }
};

let mousePress=(e)=>{
    if(e.which === 3){
        // console.log("right click");
    }else if(e.which === 1){
       // console.log("left click");
        enableSkillEngine(0);
    }
};

export const changeKeyEventBindings = () => {
    let left = keyboard(global.KEY_A),
        up = keyboard(global.KEY_W),
        right = keyboard(global.KEY_D),
        down = keyboard(global.KEY_S),
        shift = shiftLikeEvent("shift"),
        space = keyboard(global.KEY_SPACE);


    shift.press = function() {
        if( test==1 )
            console.log("shift press");
        if(up.isDown){
            vy = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
        if(down.isDown){
            vy = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
        if(left.isDown){
            vx = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
        if(right.isDown){
            vx = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
    };

    shift.release = function() {
        if( test==1 )
            console.log("shift release");
        if(up.isDown){
            vy = -global.AIRPLANE_SPEED;
        }
        if(down.isDown){
            vy = global.AIRPLANE_SPEED;
        }
        if(left.isDown){
            vx = -global.AIRPLANE_SPEED;
        }
        if(right.isDown){
            vx = global.AIRPLANE_SPEED;
        }
    };

    space.press = function() {
        if( test==1 )
            console.log('space press');
        enableSkillEngine();
    };

   space.release = function() {
        if( test==1 )
            console.log('space release');
        disableSkillEngine();
    };

    up.press = function() {
        if( test==1 )
            console.log('up press');
        if(shift.isDown){
            vy = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            vy = -global.AIRPLANE_SPEED;
        }

    };

    up.release = function() {
        if( test==1 )
            console.log('up release');
        if(down.isUp){
             vy = 0;
        }else{
             down.press();
        }
    };

    down.press = function() {
        if( test==1 )
            console.log('down press');
        if(shift.isDown){
            vy = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            vy = global.AIRPLANE_SPEED;
        }

    };

    down.release = function() {
        if( test==1 )
            console.log('down release');
        if(up.isUp){
            vy = 0;
        }else{
            up.press();
        }
    };


    left.press = function() {
        if (test==1)
            console.log('left press');
        if(shift.isDown){
            vx = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            vx = -global.AIRPLANE_SPEED;
        }

    };


    left.release = function() {
        if( test==1 )
            console.log('left release');
        if(right.isUp){
            vx = 0;
        }else{
            right.press();
        }
    };

    right.press = function() {
        if( test==1 )
            console.log('right press');
        if(shift.isDown){
            vx = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            vx = global.AIRPLANE_SPEED;
        }

    };

    right.release = function() {
        if( test==1 )
            console.log('right release');
        if(left.isUp){
            vx = 0;
        }else{
            left.press();
        }
    };

};


export const enableCollisionDetectionEngine = () => {
    /*
      1.将要检测碰撞的球体加入四叉树
      2.对每个球体进行碰撞检测，检测到的就进行标记
      3.碰撞效果和伤害检测处理之后清空四叉树，进行下一轮碰撞检测
    */
    let airPlane = data.airPlane;
    let selfBullets = data.bullet.concat(airPlane);
    let enemyBullets = gamemodel.data.backendControlData.bullet.concat(gamemodel.data.backendControlData.airPlane);
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
                    if(collidors[j].ballType === constant.BULLET){
                        collidors[j].alive = false;
                        collidors[j].isKilled = true;
                    }

                    if(selfBullets[i].ballType === constant.BULLET){
                        selfBullets[i].alive = false;
                        selfBullets[i].isKilled = true;
                    }

                    //不管碰撞的是子弹和子弹，还是子弹和飞机都需要加入碰撞信息中
                    //暂未处理飞机撞击飞机的情况
                    let damageInformation = {
                        collision1:collidors[j].id,
                        collision2:selfBullets[i].id,
                        damageValue:[collidors[j].damageValue,selfBullets[i].damageValue],
                        isAlive:[collidors[j].alive,selfBullets[i].alive],
                        willDisappear:[!collidors[j].alive,!selfBullets[i].alive],
                    };
                    gamemodel.socketCache.damageInformation.push(damageInformation);

                    //只判断两个相撞
                    break;
                }
            }

            selfBullets[i].hasJudge = true;
            i++;
        }
};

export const enableBulletsCollectingEngine=()=> {
    looper(() => {
        uselessBulletsCollect();
    },global.BULLET_COLLECTING_INTERVAL);
};

export const startGameLoop=()=> {
    let airPlane = data.airPlane;
    looper(() => {
        //gamemodel.data.backendControlData.airPlane[0].attackDir += 0.05;
        airPlane.move(vx,vy,vangle);
        //airPlane.attackDir += 0.05;
        //自主机子弹
        // console.log(gamemodel.data.engineControlData.bullet);
        gamemodel.data.engineControlData.bullet.map((bullet)=>{
            bullet.pathCalculate();
            return bullet;
        });
        //敌机子弹
        gamemodel.data.backendControlData.bullet.map((bullet)=>{
            bullet.pathCalculate();
            return bullet;
        });

//        if(gamemodel.data.engineControlData.bullet.length !== 0){
            enableCollisionDetectionEngine();
//        }
    },global.GAME_LOOP_INTERVAL);
};

export const configCanvasEventListen=()=>{
  //屏蔽右键菜单
  document.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
  }, false);

  let canvas = document.getElementById("canvas");
  canvas.addEventListener("mousedown",mousePress);
  canvas.addEventListener("mouseup",mouseRelease);
  canvas.addEventListener("mousemove",mouseMove);
};
