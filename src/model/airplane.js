 /* airplane.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import Ball from "../model/ball";
import {AIRPLANE} from "../constant";
import PVector from "./Point";

export default class Airplane extends Ball {
    constructor() {
        super();
        this.ballType = AIRPLANE;
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
