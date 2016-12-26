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
    MIN_UNIFORMLY_RETARDED_BULLET,
    UNIFORMLY_RETARDED_BULLET1,
    UNIFORMLY_RETARDED_BULLET2
} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";
import randomRanger from "../../utils/random.js";

const TWO_BULLET_INTERVAL = 80; // ms
const BULLET_NUM = 7;
const RANGER = Math.PI / 6;

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
            MIN_UNIFORMLY_RETARDED_BULLET,
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
    skillCD: 2500,
};

/* judgementPunch.js ends here */
