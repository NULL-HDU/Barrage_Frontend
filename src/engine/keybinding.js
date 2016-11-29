import global from "../global";
import {KEY} from "../constant.js";
import gamemodel from "../model/gamemodel";
import {
  disableSkillEngine,
  enableSkillEngine
} from "./skill.js";

let data = gamemodel.data.engineControlData;
let test = 1;

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
    disableSkillEngine(global.NORMAL_SKILL);
  }
};

let mousePress=(e)=>{
  if(e.which === 3){
    // console.log("right click");
  }else if(e.which === 1){
    // console.log("left click");
    enableSkillEngine(global.NORMAL_SKILL);
  }
};

//shift like event detect
let shiftLikeEvent=(desc)=> {
    let key = {};
    key.desc = desc;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    if(key.desc === "shift"){
        key.downHandler = (event)=> {
            if(event.shiftKey){
                //console.log("down detect");
                if(key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        key.upHandler = (event)=> {
            if(!event.shiftKey){
                //console.log("up detect");
                if(key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };
    }

    window.addEventListener("keydown",key.downHandler.bind(key),false);
    window.addEventListener("keyup",key.upHandler.bind(key),false);

    return key;

};

//keyboard
let keyboard=(keyCode)=> {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = (event)=> {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = (event)=> {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;

        event.preventDefault();
        }
    };

    //Attach event listeners
    window.addEventListener( "keydown", key.downHandler.bind(key), false);
    window.addEventListener( "keyup", key.upHandler.bind(key), false);

    return key;
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

export const changeKeyEventBindings = () => {
  let ap = gamemodel.data.engineControlData.airPlane;
    let left = keyboard(KEY.A),
        up = keyboard(KEY.W),
        right = keyboard(KEY.D),
        down = keyboard(KEY.S),
        skill1 = keyboard(KEY.E),
        shift = shiftLikeEvent("shift"),
        space = keyboard(KEY.SPACE);


    shift.press = function() {
        if( test==1 )
            console.log("shift press");
        if(up.isDown){
            ap.v.y = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
        if(down.isDown){
            ap.v.y = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
        if(left.isDown){
            ap.v.x = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
        if(right.isDown){
            ap.v.x = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }
    };

    shift.release = function() {
        if( test==1 )
            console.log("shift release");
        if(up.isDown){
            ap.v.y = -global.AIRPLANE_SPEED;
        }
        if(down.isDown){
            ap.v.y = global.AIRPLANE_SPEED;
        }
        if(left.isDown){
            ap.v.x = -global.AIRPLANE_SPEED;
        }
        if(right.isDown){
            ap.v.x = global.AIRPLANE_SPEED;
        }
    };

    space.press = function() {
        if( test==1 )
            console.log('space press');
        enableSkillEngine(global.NORMAL_SKILL);
    };

   space.release = function() {
        if( test==1 )
            console.log('space release');
        disableSkillEngine(global.NORMAL_SKILL);
    };

    up.press = function() {
        if( test==1 )
            console.log('up press');
        if(shift.isDown){
            ap.v.y = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            ap.v.y = -global.AIRPLANE_SPEED;
        }

    };

    up.release = function() {
        if( test==1 )
            console.log('up release');
        if(down.isUp){
             ap.v.y = 0;
        }else{
             down.press();
        }
    };

    down.press = function() {
        if( test==1 )
            console.log('down press');
        if(shift.isDown){
            ap.v.y = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            ap.v.y = global.AIRPLANE_SPEED;
        }

    };

    down.release = function() {
        if( test==1 )
            console.log('down release');
        if(up.isUp){
            ap.v.y = 0;
        }else{
            up.press();
        }
    };


    left.press = function() {
        if (test==1)
            console.log('left press');
        if(shift.isDown){
            ap.v.x = -global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            ap.v.x = -global.AIRPLANE_SPEED;
        }

    };


    left.release = function() {
        if( test==1 )
            console.log('left release');
        if(right.isUp){
            ap.v.x = 0;
        }else{
            right.press();
        }
    };

    right.press = function() {
        if( test==1 )
            console.log('right press');
        if(shift.isDown){
            ap.v.x = global.AIRPLANE_SPEED * global.AIRPLANE_SLOW_RATE;
        }else{
            ap.v.x = global.AIRPLANE_SPEED;
        }

    };

    right.release = function() {
        if( test==1 )
            console.log('right release');
        if(left.isUp){
            ap.v.x = 0;
        }else{
            left.press();
        }
    };

    skill1.press = function() {
      enableSkillEngine(global.E_SKILL);
    };

    skill1.release = function() {
      disableSkillEngine(global.E_SKILL);
    }
};
