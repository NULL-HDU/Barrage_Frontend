import global from "../global";
import {
  STRAIGHT_LINE_BULLET,
  CIRCLE_BULLET
} from "../bullet_role.js";
import gamemodel from "../model/gamemodel";
import Bullet from "../model/bullet";
import PVector from "../model/Point.js";

let data = gamemodel.data.engineControlData;

let skillFlags = {
    engineOn: 0, //0 for enable,1 for disable;
    currentSkillType: null, // which skill user current use.
    normalSkillCDFlag: 0,// 0 for not in cd, 1 for in cd;
    eSkillCDFlag: 0,// 0 for not in cd, 1 for in cd;
};
// skill: shoot normal bullet
// every skillFunc should include a timer and a flag to implement skill cold.

let eSkillFunc = () => {
    if (skillFlags.eSkillCDFlag === 1) return;

    skillFlags.eSkillCDFlag = 1;
    let airPlane = data.airPlane;
    let a_angle = airPlane.attackDir;
    let to_circle_center = new PVector( Math.cos(a_angle) * 50, Math.sin(a_angle) * 50);
    let a_location = PVector.add(airPlane.locationCurrent, to_circle_center);
    for(let i=0;i<6;i++){
      let angle = a_angle + Math.PI/3 * i;
      let dirVector = new PVector(
          Math.cos(angle),
          Math.sin(angle)
      );
      let bullet = new Bullet(
        airPlane,
        CIRCLE_BULLET,
        angle+Math.PI,
        PVector.add(a_location, PVector.mult(dirVector, 10))
      );
      bullet.run = bullet.pathFunc(bullet, 1, 50);
      data.bullet.push(bullet);
    }
    to_circle_center.mult(-1);
    a_location = PVector.add(airPlane.locationCurrent, to_circle_center);
    for(let i=0;i<6;i++){
      let angle = a_angle + Math.PI/3 * i;
      let dirVector = new PVector(
        Math.cos(angle),
        Math.sin(angle)
      );
      let bullet = new Bullet(
        airPlane,
        CIRCLE_BULLET,
        angle,
        PVector.add(a_location, PVector.mult(dirVector, 10))
      );
      bullet.run = bullet.pathFunc(bullet, -1, 50);
      data.bullet.push(bullet);
    }

    setTimeout(() => {
       skillFlags.eSkillCDFlag = 0;
    }, global.E_SKILL_CD);
};

// skill: shoot normal bullet
// every skillFunc should include a timer and a flag to implement skill cold.
let normalSkillFunc = () => {
    if (skillFlags.normalSkillCDFlag === 1) return;
    skillFlags.normalSkillCDFlag = 1;

    let airPlane = data.airPlane;
    let angle = airPlane.attackDir + Math.PI*3/2;

    let dirVector = new PVector(
      Math.cos(angle),
      Math.sin(angle)
    );
    let bullet = new Bullet(
      airPlane,
      STRAIGHT_LINE_BULLET,
      angle,
      PVector.add(airPlane.locationCurrent, PVector.mult(dirVector, 100))
    );
    bullet.run = bullet.pathFunc(bullet);
    data.bullet.push(bullet);

    setTimeout(() => {
       skillFlags.normalSkillCDFlag = 0;
    }, global.NORMAL_SKILL_CD);
};

// if skillOnFlag is on and currentSkillType is the same as the skillTpye parameter,
// it will call skill fucntion, then loop itself.
let checkToCallSkillFuncThenLoop = (skillTpye) => {
    if (skillFlags.engineOn !== 0) {
        skillFlags.currentSkillType = null;
    }
    if (skillFlags.currentSkillType !== skillTpye) {
        return;
    }

    switch (skillTpye) {
        case global.NORMAL_SKILL:
            normalSkillFunc();
            break;
        case global.E_SKILL:
            eSkillFunc();
            break;
        default:
            return;
    }

    setTimeout(() => checkToCallSkillFuncThenLoop(skillTpye), global.SKILL_CHECk_LOOP_INTERVAL);
};

// There are two function to toggle Skill Engine
export const enableSkillEngine = (skillTpye) => {
    skillFlags.engineOn = 0;

    if (skillFlags.currentSkillType === skillTpye) return;
    skillFlags.currentSkillType = skillTpye;
    checkToCallSkillFuncThenLoop(skillTpye);
};

export const disableSkillEngine = (skillTpye) => {
    if (skillTpye === skillFlags.currentSkillType) {
        skillFlags.engineOn = 1;
    }
};
