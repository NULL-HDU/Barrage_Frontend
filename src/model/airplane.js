 /* airplane.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import Ball from "../model/ball";
import constant from "../constant.js";
import PVector from "./Point.js";

export default class Airplane extends Ball {
    constructor() {
        super();
        this.ballType = constant.AIRPLANE;
        this.radius = 5;
        this.v = new PVector(0,0);
        this.vangle = 0;
    };

    move() {
        this.locationCurrent.add(this.v);
        this.attackDir += this.vangle;
    }
}

/*airplane.js ends here*/
