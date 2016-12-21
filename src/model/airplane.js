 /* airplane.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import Ball from "../model/ball";
import global from "../global";
import {AIRPLANE} from "../constant";
import PVector from "./Point";
import gamemodel from "./gamemodel";

export default class Airplane extends Ball {
    constructor(roleId) {
        let airplaneResource = gamemodel.resourceRecord.airPlaneTable;
        let skinResource = gamemodel.resourceRecord.skinTable.airplane;
        if(airplaneResource[roleId] === undefined) {
          throw "Invalid airplane roleId!";
        }
        super();
        this.ballType = AIRPLANE;

        Object.assign(this, airplaneResource[roleId]);
        this.roleId = roleId;
        this.radius = skinResource[this.skinId].judge_radius;
        this.skin_radius = skinResource[this.skinId].skin_radius;

        // init skills and its cd.
        // **SkillCount > 0, means this skill is in cd.
        this.CDCount = {};
        this.CD = {};
        for(let skillType in this.skills){
            this.CDCount[skillType] = 0;
            this.CD[skillType] = this.skills[skillType].skillCD / global.GAME_LOOP_INTERVAL;
        }
        // all function in actionSkill while be call in each engine loop;
        this.activeSkillList = [];

        // direction of speed vector
        this.vd = new PVector(0,0);
        this.slowRate = 1;
        this.speed = this.speed * global.GAME_LOOP_INTERVAL / 1000;
        this.vangle = 0;

        this.dLocation = new PVector();
        this.locationCurrent = new PVector(global.LOCAL_WIDTH/2,global.LOCAL_HEIGHT/2);
        this.defense = 1;
        gamemodel.socketCache.newBallInformation.push(this);
    }

    move() {
        let p = PVector.mult(this.vd, this.speed*this.slowRate);

        if((this.locationCurrent.x > 1280 * 2 && p.x > 0) || (this.locationCurrent.x < 0 && p.x < 0)){
            p.x = 0;
        }

        if((this.locationCurrent.y > 800 * 2 && p.y > 0) || (this.locationCurrent.y < 0 && p.y < 0)){
            p.y = 0;
        }

        this.dLocation = p;
        this.locationCurrent.add(this.dLocation);
        this.attackDir += this.vangle;
    }

    skillCountDown() {
        for(let skillType in this.CDCount){
            if(this.CDCount[skillType] > 0) this.CDCount[skillType]--;
        }
    }

    // skillActive call all functions in activeSkillList, those functions may generate
    // bullets but must return a boolean.
    // if the returned boolean is false, the function will be delete from activeSkillList.
    skillActive() {
      this.activeSkillList = this.activeSkillList.filter(f => f(this,this.attackDir + Math.PI*3/2));
    }

    useSkill(skillType) {
        if(this.CDCount[skillType] > 0) return;

        this.CDCount[skillType] = this.CD[skillType];
        this.activeSkillList.push(this.skills[skillType].skillFunc());
    }

}

/*airplane.js ends here*/
