/* fortuneWheel.js --- two circle wheel round and round
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import PVector from "../../model/Point.js";
import {
    skillFramework
} from "./utils.js";
import {
    MAX_STRAIGHT_LINE_BULLET,
    CIRCLE_BULLET,
} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";

let bulletNumEverWheel = 6;
const TWO_BULLET_INTERVAL = 200; // ms

let skillFunc = () => {
    let bulletCount = 0;
    let bulletCountMax = 1;

    return skillFramework(TWO_BULLET_INTERVAL, (data, airPlane, angle) => {
        let srcLocation = PVector.add(
            airPlane.locationCurrent,
            PVector.mult(new PVector(Math.cos(angle), Math.sin(angle)), airPlane.skin_radius)
        )

        // centre
        let centre = new Bullet(
            airPlane,
            MAX_STRAIGHT_LINE_BULLET,
            angle,
            srcLocation
        );
        centre.run = centre.pathFunc(centre);
        data.bullet.push(centre);

        let roundAngleRatio = bulletNumEverWheel / 2;

        for (let i = 0; i < bulletNumEverWheel; i++) {
            let site_angle = angle + Math.PI / roundAngleRatio * i;
            let dirVector = new PVector(
                Math.cos(site_angle),
                Math.sin(site_angle)
            );
            let bullet = new Bullet(
                centre,
                CIRCLE_BULLET,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 5)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, 1, 15, centre.radius + 40, 1000);
            data.bullet.push(bullet);
        }

        for (let i = 0; i < bulletNumEverWheel; i++) {
            let site_angle = angle + Math.PI / roundAngleRatio * i;
            let dirVector = new PVector(
                Math.cos(site_angle),
                Math.sin(site_angle)
            );
            let bullet = new Bullet(
                centre,
                CIRCLE_BULLET,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 5)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, -1, 15, centre.radius + 20, 1000);
            data.bullet.push(bullet);
        }

        // if bullet_count is less than bulletNumEverWheel, skill end
        // else still to be called in skill process.
        return ++bulletCount < bulletCountMax;
    });
};

export default {
    skillName: "Fortune Wheel",
    skillFunc: skillFunc,
    skillCD: 3000,
};

/* fortuneWheel.js ends here */
