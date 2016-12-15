/* normalStraigthShut.js --- shut one normal ball.
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
    STRAIGHT_LINE_BULLET
} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";

const TWO_BULLET_INTERVAL = 100; // ms
const BULLET_NUM = 5;

let skillFunc = () => {
    let bulletCount = 0;
    let bulletCountMax = BULLET_NUM;

    return skillFramework(TWO_BULLET_INTERVAL, (data, airPlane, angle) => {
        let dirVector = new PVector(
            Math.cos(angle),
            Math.sin(angle)
        );
        let bullet = new Bullet(
            airPlane,
            STRAIGHT_LINE_BULLET,
            angle,
            PVector.add(
              airPlane.locationCurrent,
              PVector.mult(dirVector, airPlane.skin_radius)
            )
        );
        bullet.run = bullet.pathFunc(bullet);
        data.bullet.push(bullet);

        return ++bulletCount < bulletCountMax;
    });
};

export default {
    skillName: "Linear Park",
    skillFunc: skillFunc,
    skillCD: 1800,
};

/* normalStraigthShut.js ends here */
