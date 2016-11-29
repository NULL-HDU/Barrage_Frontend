 /* airplane.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import Ball from "../model/ball";
import global from "../global.js";
import {AIRPLANE} from "../constant";
import PVector from "./Point";

export default class Airplane extends Ball {
    constructor() {
        super();
        this.ballType = AIRPLANE;
        this.radius = 5;
        this.v = new PVector(0,0);
        this.vangle = 0;
        this.locationCurrent = new PVector(global.LOCAL_WIDTH/2,global.LOCAL_HEIGHT/2);
    };

    move() {
        this.locationCurrent.add(this.v);
        this.attackDir += this.vangle;
    }
}

/*airplane.js ends here*/
