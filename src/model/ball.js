/* ball.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

export default class Ball {
    constructor() {
        this.ballType = null;
        this.id = 0;
        this.hp = 10000;
        this.damage = 100;
        this.name = 'Arthury';
        this.camp = null;
        this.roleId = 0;
        this.special = null;
        this.speed = 100;
        this.attackDir = Math.PI;
        this.alive = true;
        this.isKilled = false;
        this.locationCurrent = {
            x:0,
            y:0,
        };
    }
}

/*ball.js ends here*/
