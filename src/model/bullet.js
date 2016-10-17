import Ball from "../model/ball"

export default class Bullet extends Ball{
    constructor() {
        super();
        // this.pathCalculate = this.pathCalculate.bind(this)
    };


    pathCalculate() {
        let looper = (f, t) => setTimeout(()=>{f();looper(f, t)}, t);
        looper(() => {
            this.locationCurrent.x += 1;
            this.locationCurrent.y += 1;
            console.log("path looping");
        },(1/120)*1000);
    }
}
