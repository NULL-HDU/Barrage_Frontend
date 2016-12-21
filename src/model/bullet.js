import Ball from "./ball";
import global from "../global.js";
import PVector from "./Point";
import {
    ALIVE,
    BULLET,
    DISAPPEAR
} from "../constant";
import gamemodel from "./gamemodel.js";

let Count = ((id) => () => id++)(1);

export default class Bullet extends Ball {
    constructor(father, roleId, angle, srclocation, following = false) {
        let bulletResource = gamemodel.resourceRecord.bulletTable;
        let skinResource = gamemodel.resourceRecord.skinTable.bullet;
        if (bulletResource[roleId] === undefined) {
            throw "Invalid bullet roleId!";
        }
        super();
        this.ballType = BULLET;
        this.camp = this.userId;
        this.userId = father.userId;
        this.id = Count();
        this.father = father;
        this.following = following;
        this.attackDir = angle;
        Object.assign(this, bulletResource[roleId]);
        this.roleId = roleId;
        this.radius = skinResource[this.skinId].judge_radius;
        this.skin_radius = skinResource[this.skinId].skin_radius;

        this.srclocation = srclocation;
        this.dLocation = new PVector();
        this.locationCurrent = PVector.mult(this.srclocation, 1);

        this.roleSpeed = this.speed;
        this.speed *= global.GAME_LOOP_INTERVAL / 1000;
        gamemodel.socketCache.newBallInformation.push(this);
    }

    pathCalculate() {
        this.dLocation = PVector.mult(this.run(), 1);
        this.locationCurrent.add(this.dLocation);

        if (this.following) {
            if (this.father.state !== ALIVE) {
                this.state = DISAPPEAR;
                return;
            }
            this.locationCurrent.add(this.father.dLocation);
        } else {
            let distance = PVector.dist(this.srclocation, this.locationCurrent);

            //射程检测
            if (distance >= this.distance) {
                this.state = DISAPPEAR;
            }
        }

        //边界检测
        if (this.locationCurrent.x > 1280 * 2 ||
            this.locationCurrent.x < 0 ||
            this.locationCurrent.y > 800 * 2 ||
            this.locationCurrent.y < 0) {
            this.state = DISAPPEAR;
        }

        //        console.log("x: " + this.locationCurrent.x + "y: " + this.locationCurrent.y);
    }

}
