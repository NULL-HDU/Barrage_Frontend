import Ball from "../model/ball"
import PVector from "../engine/Point"
import global from "../engine/global"


export default class Bullet extends Ball{
    constructor() {
        super();
        this.startPoint = {
            x:0,
            y:0,
        };
    };

    pathCalculate() {

            let speed = 3;
            let angel = this.attackDir % (2 * Math.PI);
            this.locationCurrent.x += Math.cos(angel + (3/2)*Math.PI) * speed;
            this.locationCurrent.y += Math.sin(angel + (3/2)*Math.PI) * speed;
            //如果遇到边界或者超出射程就消失
            let a = new PVector(this.startPoint.x,this.startPoint.y);
            let b = new PVector(this.locationCurrent.x,this.locationCurrent.y);
            let distance = PVector.dist(a,b);

            //距离检测，边界检测
            if(distance >= 800){
                this.alive = false;
                this.isKilled = false;
            }
    }

}
