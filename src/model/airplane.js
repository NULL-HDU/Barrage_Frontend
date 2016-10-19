 /* airplane.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import Ball from "../model/ball"

export default class Airplane extends Ball {
    constructor() {
        super();
    };

    move(vx,vy,vangle) {
        this.locationCurrent.x += vx;
        this.locationCurrent.y += vy;
        this.attackDir += vangle;
    }
}

/*airplane.js ends here*/
