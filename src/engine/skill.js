import global from "../global";
import gamemodel from "../model/gamemodel";

let data = gamemodel.data.engineControlData;

let skillFlags = {
    engineOn: 0, //0 for enable,1 for disable;
    currentSkillType: null, // which skill user current use.
};

let eSkillFunc = () => {

    if (skillFlags.eSkillCDFlag === 1) return;

    skillFlags.eSkillCDFlag = 1;

    gamemodel.data.engineControlData.airPlane.defense = 0.5;

    setTimeout(() => {
        gamemodel.data.engineControlData.airPlane.defense = 1;
    }, global.E_SKILL_DURATION);

    setTimeout(() => {
        skillFlags.eSkillCDFlag = 0;
    }, global.E_SKILL_CD);
};

let qSkillFunc = () => {
    let airPlane = data.airPlane;
    airPlane.useQSkill();
};

// skill: shoot normal bullet
// every skillFunc should include a timer and a flag to implement skill cold.
let normalSkillFunc = () => {
    let airPlane = data.airPlane;
    airPlane.useNormalSkill();
};

// if skillOnFlag is on and currentSkillType is the same as the skillTpye parameter,
// it will call skill fucntion, then loop itself.
let checkToCallSkillFuncThenLoop = (skillTpye) => {
    if(data.airPlane === undefined){
        return;
    }
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
        case global.Q_SKILL:
            qSkillFunc();
            break;
        case global.E_DEFEND_SKILL:
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
