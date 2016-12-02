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
        if(airplaneResource[roleId] === undefined) {
          throw "Invalid airplane roleId!";
        }
        super();
        this.ballType = AIRPLANE;

        this.roleId = roleId;
        Object.assign(this, airplaneResource[roleId]);

        // init skills and its cd.
        // **SkillCount > 0, means this skill is in cd.
        this.normalSkillCount = 0;
        this.normalSkillCD = this.normalSkill.skillCD / global.GAME_LOOP_INTERVAL;
        this.qSkillCount = 0;
        this.qSkillCD = this.qSkill.skillCD / global.GAME_LOOP_INTERVAL;

        this.v = new PVector(0,0);
        this.vangle = 0;
        this.locationCurrent = new PVector(global.LOCAL_WIDTH/2,global.LOCAL_HEIGHT/2);
        gamemodel.socketCache.newBallInformation.push(this);
    }

    move() {
        this.locationCurrent.add(this.v);
        this.attackDir += this.vangle;
    }

    skillCountDown() {
        if(this.qSkillCount > 0) this.qSkillCount--;
        if(this.normalSkillCount > 0) this.normalSkillCount--;
    }

    useQSkill() {
      if (this.qSkillCount > 0) return;

      this.qSkillCount = this.qSkillCD;
      this.qSkill.skillFunc(this, this.attackDir + Math.PI*3/2);
    }

    useNormalSkill() {
      if (this.normalSkillCount > 0) return;

      this.normalSkillCount = this.normalSkillCD;
      this.normalSkill.skillFunc(this, this.attackDir + Math.PI*3/2);
    }
}

/*airplane.js ends here*/
