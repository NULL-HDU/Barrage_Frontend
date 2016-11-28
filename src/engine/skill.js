import global from "../global";
import {STRAIGHT_LINE_BULLET} from "../bullet_role.js";
import gamemodel from "../model/gamemodel";
import Bullet from "../model/bullet";
import PVector from "../model/Point.js";

let data = gamemodel.data.engineControlData;

let skillFlags = {
    engineOn: 0, //0 for enable,1 for disable;
    currentSkillType: null, // which skill user current use.
};
let normalSkillCDFlag = 0; // 0 for not in cd, 1 for in cd;

window.bulletMaker = undefined;

// skill: shoot normal bullet
// every skillFunc should include a timer and a flag to implement skill cold.

var Count = (function () {
    var counter = 0,    //私有静态属性
        NewCount;

    NewCount = function () {    //新构造函数
        counter += 1;
    }
    NewCount.prototype.getLastCount = function () {
        return counter;
    }

    return NewCount;    //覆盖构造函数
}());

let normalSkillFunc = () => {
    if (normalSkillCDFlag === 1) return;

    normalSkillCDFlag = 1;
    let airPlane = data.airPlane;
    let angle = airPlane.attackDir;
    let bullet = new Bullet(airPlane.userId, STRAIGHT_LINE_BULLET, angle);
    var count = new Count();
    bullet.id = count.getLastCount();
    gamemodel.socketCache.newBallInformation.push(bullet);
    
    let dirVector = new PVector(
        Math.cos(angle + (3 / 2) * Math.PI),
        Math.sin(angle + (3 / 2) * Math.PI)
    );
    bullet.locationCurrent = PVector.add(airPlane.locationCurrent, PVector.mult(dirVector, 100));
    bullet.startPoint = PVector.add(airPlane.locationCurrent, PVector.mult(dirVector, 50));
    data.bullet.push(bullet);

    setTimeout(() => {
        normalSkillCDFlag = 0;
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
