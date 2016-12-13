/* ball.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */
import {ALIVE} from "../constant.js";

export default class Ball {
    constructor() {
        this.ballType = undefined;
        this.id = 0;
        this.hp = 5000;
        this.damage = 500;
        this.name = "Arthury";
        this.camp = undefined;
        this.userId = undefined;
        this.roleId = 0;
        this.special = undefined;
        this.speed = 100;
        this.attackDir = 0;
        this.state = ALIVE;
        this.hasJudge = false;
        this.locationCurrent = undefined;
    }

}

/*ball.js ends here*/
