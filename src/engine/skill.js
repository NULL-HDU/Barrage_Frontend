
import global from "../model/global";
import gamemodel from "../model/gamemodel";
import Bullet from "../model/bullet";

let data = gamemodel.data.engineControlData;

let skillFlags = {
  engineOn: 0, //0 for enable,1 for disable;
  currentSkillType: null, // which skill user current use.
};
let normalSkillCDFlag = 0; // 0 for not in cd, 1 for in cd;

window.bulletMaker = undefined;

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
export const enableSkillEngine=(skillTpye)=>{
    skillFlags.engineOn = 0;

    if(skillFlags.currentSkillType === skillTpye) return;
    skillFlags.currentSkillType = skillTpye;
    checkToCallSkillFuncThenLoop(skillTpye);
};

export const disableSkillEngine=()=>{
    skillFlags.engineOn = 1;
};
