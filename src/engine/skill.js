import global from "../global";
import gamemodel from "../model/gamemodel";

let skillFlags = {
    engineOn: 0, //0 for enable,1 for disable;
    currentSkillType: null, // which skill user current use.
};

// if skillOnFlag is on and currentSkillType is the same as the skillType parameter,
// it will call skill fucntion, then loop itself.
let checkToCallSkillFuncThenLoop = (skillType) => {
    let data = gamemodel.data.engineControlData;
    if(data.airPlane === undefined){
        return;
    }
    if (skillFlags.engineOn !== 0) {
        skillFlags.currentSkillType = null;
    }
    if (skillFlags.currentSkillType !== skillType) {
        return;
    }

    data.airPlane.useSkill(skillType);
    setTimeout(() => checkToCallSkillFuncThenLoop(skillType), global.SKILL_CHECK_LOOP_INTERVAL);
};

// There are two function to toggle Skill Engine
export const enableSkillEngine = (skillType) => {
    skillFlags.engineOn = 0;

    if (skillFlags.currentSkillType === skillType) return;
    skillFlags.currentSkillType = skillType;
    checkToCallSkillFuncThenLoop(skillType);
};

export const disableSkillEngine = (skillType) => {
    if (skillType === skillFlags.currentSkillType) {
        skillFlags.engineOn = 1;
    }
};
