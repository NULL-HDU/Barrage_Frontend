import Ball from "./ball";
import global from "../global.js";
import PVector from "./Point";
import constant from "../constant";
import gamemodel from "./gamemodel.js";

let bulletResource = gamemodel.resourceRecord.bulletTable;

export default class Bullet extends Ball {
  constructor(userId, roleId, angle) {
        if(bulletResource[roleId] === undefined) {
          throw "Invalid roleId!";
        }
        super();
        this.ballType = constant.BULLET;
        this.roleId = roleId;
        this.userId = userId;
        this.camp = userId;
        this.attackDir = angle;
        this.startPoint = new PVector(0, 0);
        Object.assign(this, bulletResource[roleId]);
        this.speed *= global.GAME_LOOP_INTERVAL / 1000;
        this.run = this.pathFunc(this);
    }

    pathCalculate() {
        this.run();

        //如果遇到边界或者超出射程就消失
        let a = new PVector(this.startPoint.x, this.startPoint.y);
        let b = new PVector(this.locationCurrent.x, this.locationCurrent.y);
        let distance = PVector.dist(a, b);

        //距离检测，边界检测
        if (distance >= 800) {
            this.alive = false;
            this.isKilled = false;
        }

        //        console.log("x: " + this.locationCurrent.x + "y: " + this.locationCurrent.y);
    }

}
