 /* airplane.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import Ball from "../model/ball";
import constant from "../constant.js";

export default class Airplane extends Ball {
    constructor() {
        super();
        this.ballType = constant.AIRPLANE;
        this.radius = 5;
        this.vx = 0;
        this.vy = 0;
        this.vangle = 0;
    };

    move() {
        this.locationCurrent.x += this.vx;
        this.locationCurrent.y += this.vy;
        this.attackDir += this.vangle;
    }
}

/*airplane.js ends here*/
