import Ball from "./ball";
import global from "../global.js";
import PVector from "./Point";
import {BULLET, DISAPPEAR} from "../constant";
import gamemodel from "./gamemodel.js";

let Count = ((id) => () => id++ )(1);

export default class Bullet extends Ball {
  constructor(father, roleId, angle, srclocation) {
        let bulletResource = gamemodel.resourceRecord.bulletTable;
        let skinResource = gamemodel.resourceRecord.skinTable.bullet;
        if(bulletResource[roleId] === undefined) {
          throw "Invalid bullet roleId!";
        }
        super();
        this.ballType = BULLET;
        this.camp = this.userId;
        this.userId = father.userId;
        this.id = Count();
        this.father = father;
        this.attackDir = angle;
        Object.assign(this, bulletResource[roleId]);
        this.roleId = roleId;
        this.radius = skinResource[this.skinId].judge_radius;
        this.skin_radius = skinResource[this.skinId].skin_radius;

        this.srclocation = srclocation;
        this.locationCurrent = PVector.mult(this.srclocation, 1);

       this.speed *= global.GAME_LOOP_INTERVAL / 1000;
      gamemodel.socketCache.newBallInformation.push(this);
    }

    pathCalculate() {
        this.run();

        let distance = PVector.dist(this.srclocation, this.locationCurrent);

        //距离检测，边界检测
        if (distance >= 800) {
          this.state = DISAPPEAR;
        }

        //        console.log("x: " + this.locationCurrent.x + "y: " + this.locationCurrent.y);
    }

}
