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
    MIN_CIRCLE_BULLET,
    CIRCLE_BULLET2,
    CIRCLE_BULLET1,
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
        );

        // centre
        let centre = new Bullet(
            airPlane,
            MAX_STRAIGHT_LINE_BULLET,
            angle,
            srcLocation
        );
        centre.run = centre.pathFunc(centre);
        data.bullet.push(centre);

        let clockdir = 1;
        let dAngle = (30 + 20) / (centre.radius + 50);

        let bulletNum = bulletNumEverWheel / 2;
        let roundAngleRatio = bulletNum / 2;
        for (let i = 0; i < bulletNum; i++) {
            let site_angle = angle + Math.PI / roundAngleRatio * i;
            let dirVector = new PVector(
                Math.cos(site_angle),
                Math.sin(site_angle)
            );
            let bullet = new Bullet(
                centre,
                CIRCLE_BULLET2,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 50)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, clockdir, 50, centre.radius + 50, 1000);
            data.bullet.push(bullet);

            site_angle = angle + Math.PI / roundAngleRatio * i - dAngle;
            dirVector = new PVector(Math.cos(site_angle), Math.sin(site_angle));
            bullet = new Bullet(
                centre,
                CIRCLE_BULLET1,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 50)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, clockdir, 50, centre.radius + 50, 1000);
            data.bullet.push(bullet);

            site_angle = angle + Math.PI / roundAngleRatio * i - 2 * dAngle;
            dirVector = new PVector(Math.cos(site_angle), Math.sin(site_angle));
            bullet = new Bullet(
                centre,
                MIN_CIRCLE_BULLET,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 50)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, clockdir, 50, centre.radius + 50, 1000);
            data.bullet.push(bullet);
        }

        bulletNum = bulletNumEverWheel;
        roundAngleRatio = bulletNum / 2;
        dAngle = dAngle = (30 + 10) / (centre.radius + 120);
        for (let i = 0; i < bulletNum; i++) {
            let site_angle = angle + Math.PI / roundAngleRatio * i;
            let dirVector = new PVector(
                Math.cos(site_angle),
                Math.sin(site_angle)
            );
            let bullet = new Bullet(
                centre,
                CIRCLE_BULLET2,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 50)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, -clockdir, 50, centre.radius + 130, 1000);
            data.bullet.push(bullet);

            site_angle = angle + Math.PI / roundAngleRatio * i + dAngle;
            dirVector = new PVector(Math.cos(site_angle), Math.sin(site_angle));
            bullet = new Bullet(
                centre,
                CIRCLE_BULLET1,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 50)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, -clockdir, 50, centre.radius + 130, 1000);
            data.bullet.push(bullet);

            site_angle = angle + Math.PI / roundAngleRatio * i + 2 * dAngle;
            dirVector = new PVector(Math.cos(site_angle), Math.sin(site_angle));
            bullet = new Bullet(
                centre,
                MIN_CIRCLE_BULLET,
                site_angle + Math.PI,
                PVector.add(srcLocation, PVector.mult(dirVector, 50)),
                true
            );
            bullet.run = bullet.pathFunc(bullet, -clockdir, 50, centre.radius + 130, 1000);
            data.bullet.push(bullet);
        }

        // if bullet_count is less than bulletNumEverWheel, skill end
        // else still to be called in skill process.
        return ++bulletCount < bulletCountMax;
    });
};

export default {

    skillFunc: skillFunc,
    skillCD: 5000,
};

/* fortuneWheel.js ends here */
