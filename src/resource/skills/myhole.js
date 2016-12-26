/* myhole.js --- shut one big bullet
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

// skill need three attributes
// skillName:
// skillFunc: Function(airplane), the fucntion to implement skill.
// skillCD:   the cd time (millisecond), this will be change to count according to game loop time
//            while airPlane create.
import {
    skillFramework
} from "./utils.js";
import PVector from "../../model/Point.js";
import {
    LAZY_BULLET1,
    LAZY_BULLET2,
    MIN_LAZY_BULLET,
} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";

const TWO_BULLET_INTERVAL = 80; // ms

let skillFunc = () => {
    let bulletDirection = 1;

    return skillFramework(TWO_BULLET_INTERVAL, (data, airPlane, angle) => {
        let dAngle = 30 * 2 / (airPlane.skin_radius + 50);
        let bulletNum = 2 * Math.PI / dAngle;
        let _angle = angle;

        dAngle *= bulletDirection;
        for (let i = 0; i < bulletNum; i++) {
            let srcLocation = PVector.add(
                airPlane.locationCurrent,
                PVector.mult(new PVector(Math.cos(_angle), Math.sin(_angle)), airPlane.skin_radius + 50)
            );

            let bullet = new Bullet(
                airPlane,
                MIN_LAZY_BULLET,
                _angle + Math.PI / 2 * bulletDirection,
                srcLocation
            );
            bullet.run = bullet.pathFunc(bullet, 1000, 800);
            data.bullet.push(bullet);

            bullet = new Bullet(
                airPlane,
                MIN_LAZY_BULLET,
                _angle + Math.PI / 2 * bulletDirection,
                srcLocation
            );
            bullet.run = bullet.pathFunc(bullet, 900, 800);
            data.bullet.push(bullet);

            bullet = new Bullet(
                airPlane,
                LAZY_BULLET1,
                _angle + Math.PI / 2 * bulletDirection,
                srcLocation
            );
            bullet.run = bullet.pathFunc(bullet, 800, 800);
            data.bullet.push(bullet);

            bullet = new Bullet(
                airPlane,
                LAZY_BULLET2,
                _angle + Math.PI / 2 * bulletDirection,
                srcLocation
            );
            bullet.run = bullet.pathFunc(bullet, 650, 800);
            data.bullet.push(bullet);

            _angle += dAngle;
        }

        bulletDirection = bulletDirection < 0 ? 1 : -1;
        return bulletDirection < 0;
    });
};

export default {
    skillName: "My Hole",
    skillFunc: skillFunc,
    skillCD: 6000,
};

/* myhole.js ends here */
