/* ball.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */
import global from "../global.js";
import PVector from "./Point.js";
import {ALIVE} from "../constant.js";

export default class Ball {
    constructor() {
        this.ballType = undefined;
        this.id = 0;
        this.hp = 10000;
        this.damage = 100;
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
