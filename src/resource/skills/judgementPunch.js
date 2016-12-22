/* judgementPunch.js --- shut one big bullet
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
    UNIFORMLY_RETARDED_BULLET1,
    UNIFORMLY_RETARDED_BULLET2
} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";

const TWO_BULLET_INTERVAL = 80; // ms
const BULLET_NUM = 7;
const RANGER = Math.PI / 6;

let randomRanger = (min, max) => {
    return Math.random() * (max - min) + min;
};

let skillFunc = () => {
    let bulletCount = 0;
    let bulletCountMax = BULLET_NUM;

    return skillFramework(TWO_BULLET_INTERVAL, (data, airPlane, angle) => {
        let _angle = randomRanger(angle - RANGER, angle + RANGER);
        let dirVector = new PVector(
            Math.cos(angle),
            Math.sin(angle)
        );
        let bullet = new Bullet(
            airPlane,
            UNIFORMLY_RETARDED_BULLET1,
            _angle,
            PVector.add(
                airPlane.locationCurrent,
                PVector.mult(dirVector, airPlane.skin_radius)
            )
        );
        bullet.run = bullet.pathFunc(bullet, 4, 500);
        data.bullet.push(bullet);

        bullet = new Bullet(
            airPlane,
            UNIFORMLY_RETARDED_BULLET1,
            2 * angle - _angle,
            PVector.add(
                airPlane.locationCurrent,
                PVector.mult(dirVector, airPlane.skin_radius)
            )
        );
        bullet.run = bullet.pathFunc(bullet, 4, 500);
        data.bullet.push(bullet);

        _angle = randomRanger(angle - RANGER, angle + RANGER);
        bullet = new Bullet(
            airPlane,
            UNIFORMLY_RETARDED_BULLET2,
            _angle,
            PVector.add(
                airPlane.locationCurrent,
                PVector.mult(dirVector, airPlane.skin_radius)
            )
        );
        bullet.run = bullet.pathFunc(bullet, 4, 500);
        data.bullet.push(bullet);

        return ++bulletCount < bulletCountMax;
    });
};

export default {
    skillName: "Judgement Punch",
    skillFunc: skillFunc,
    skillCD: 1800,
};

/* judgementPunch.js ends here */
