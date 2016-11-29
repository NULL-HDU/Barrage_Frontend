import Ball from "./ball";
import global from "../global.js";
import PVector from "./Point";
import constant from "../constant";
import gamemodel from "./gamemodel.js";

let bulletResource = gamemodel.resourceRecord.bulletTable;

export default class Bullet extends Ball {
  constructor(father, roleId, angle, srclocation) {
        if(bulletResource[roleId] === undefined) {
          throw "Invalid roleId!";
        }
        super();
        this.ballType = constant.BULLET;
        this.roleId = roleId;
        this.userId = father.userId;
        this.camp = this.userId;
        this.father = father;
        this.attackDir = angle;
        this.startPoint = new PVector(0, 0);
        Object.assign(this, bulletResource[roleId]);
        this.speed *= global.GAME_LOOP_INTERVAL / 1000;
        this.srclocation = srclocation;
        this.locationCurrent = PVector.mult(this.srclocation, 1);
    }

    pathCalculate() {
        this.run();

        let distance = PVector.dist(this.srclocation, this.locationCurrent);

        //距离检测，边界检测
        if (distance >= 800) {
            this.alive = false;
            this.isKilled = false;
        }

        //        console.log("x: " + this.locationCurrent.x + "y: " + this.locationCurrent.y);
    }

}
