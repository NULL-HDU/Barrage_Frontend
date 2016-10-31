/* ball.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */
import global from "../engine/global"

export default class Ball {
    constructor() {
        this.ballType = undefined;
        this.id = 0;
        this.hp = 10000;
        this.damage = 100;
        this.name = 'Arthury';
        this.camp = undefined;
        this.userId = undefined;
        this.roleId = 0;
        this.special = undefined;
        this.speed = 100;
        this.attackDir = 0;
        this.alive = true;
        this.isKilled = false;
        this.hasJudge = false;
        this.locationCurrent = {
            x:global.LOCAL_WIDTH/2,
            y:global.LOCAL_HEIGHT/2,
        };
    }

    pathCalculate(){
    }

}

/*ball.js ends here*/
