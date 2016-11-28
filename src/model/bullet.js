import Ball from "./ball";
import PVector from "./Point";
import global from "../global.js"
import gamemodel from "./gamemodel.js";
import constant from "../constant";

let bulletResource = gamemodel.resourceRecord.bulletTable;

export default class Bullet extends Ball{
    constructor(userId, roleId, angle) {
        super();
        //console.log("bullet roleId is ");
        //console.log(roleId);
        if(bulletResource[roleId] === undefined) {
            throw "Invalid roleId!";
        }
        this.ballType = constant.BULLET;
        this.roleId = roleId;
        this.userId = userId;
        this.camp = userId;
        this.attackDir = angle;
        this.startPoint = new PVector(0, 0);
        this.speed *= global.GAME_LOOP_INTERVAL / 1000;
        Object.assign(this, bulletResource[roleId]);
        this.run = this.pathFunc(this);
        this.pathCalculate = this.pathCalculate.bind(this);
    }

    pathCalculate() {
            this.run();

            //如果遇到边界或者超出射程就消失
            let a = new PVector(this.startPoint.x,this.startPoint.y);
            let b = new PVector(this.locationCurrent.x,this.locationCurrent.y);
            let distance = PVector.dist(a,b);

            //距离检测，边界检测
        if(distance >= 800){

//                gamemodel.data.disappearBulletInformation.push(this.id);
                this.alive = false;
                this.isKilled = false;
                
            }

//        console.log("x: " + this.locationCurrent.x + "y: " + this.locationCurrent.y);
    }

}
