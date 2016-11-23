/* ball.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */
import global from "../global";
import PVector from "./Point.js";

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
        this.alive = true;
        this.isKilled = false;
        this.hasJudge = false;
        this.locationCurrent = new PVector(global.LOCAL_WIDTH/2, global.LOCAL_HEIGHT/2);
    }

}

/*ball.js ends here*/
