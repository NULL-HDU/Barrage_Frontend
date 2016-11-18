 /* airplane.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import Ball from "../model/ball"
import global from "../engine/global"
import constant from "../engine/CommonConstant.js"

export default class Airplane extends Ball {
    constructor() {
        super();
        this.ballType = constant.AIRPLANE;
        this.radius = 5;
    };

    move(vx,vy,vangle) {
        this.locationCurrent.x += vx;
        this.locationCurrent.y += vy;
        this.attackDir += vangle;
    }
}

/*airplane.js ends here*/
