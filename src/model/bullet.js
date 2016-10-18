import Ball from "../model/ball"
import PVector from "../engine/Point"


export default class Bullet extends Ball{
    constructor() {
        super();
        this.startPoint = {
            x:0,
            y:0,
        };
    };


    pathCalculate() {
        let looper = (f, t) => setTimeout(()=>{f();looper(f, t)}, t);
        looper(() => {

            let speed = 3;
            // console.log('angel is ' + this.attackDir);
            let angel = this.attackDir % (2 * Math.PI);
            // console.log(angel);
            this.locationCurrent.x += Math.cos(angel + (3/2)*Math.PI) * speed;
            this.locationCurrent.y += Math.sin(angel + (3/2)*Math.PI) * speed;
            //如果遇到边界或者超出射程就消失
            let a = new PVector(this.startPoint.x,this.startPoint.y);
            let b = new PVector(this.locationCurrent.x,this.locationCurrent.y);
            let distance = PVector.dist(a,b);

            if(distance >= 1000){
                this.alive = false;
                this.isKilled = false;
            }

            //console.log("path looping");
        },(1/120)*1000);
    }
}
