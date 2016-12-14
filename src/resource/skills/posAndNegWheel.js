/* posAndNegWheel.js --- two circle wheel round and round
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import PVector from "../../model/Point.js";
import {
    skillFramework
} from "./utils.js";
import {
    CIRCLE_BULLET
} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";

let bulletNumEverWheel = 6;
const TWO_BULLET_INTERVAL = 200; // ms

let skillFunc = () => {
    let bulletCount = 0;
    let bulletCountMax = 2;

    return skillFramework(TWO_BULLET_INTERVAL, (data, airPlane, angle) => {
        let a_angle = angle + Math.PI / 2;
        let to_circle_center = new PVector(Math.cos(a_angle) * 50, Math.sin(a_angle) * 50);
        let a_location = PVector.add(airPlane.locationCurrent, to_circle_center);
        let roundAngleRatio = bulletNumEverWheel / 2;

        for(let i = 0;i < bulletNumEverWheel;i++){
          let site_angle = a_angle + Math.PI / roundAngleRatio * i;
          let dirVector = new PVector(
            Math.cos(site_angle),
            Math.sin(site_angle)
          );
          let bullet = new Bullet(
            airPlane,
            CIRCLE_BULLET,
            site_angle + Math.PI,
            PVector.add(a_location, PVector.mult(dirVector, 10))
          );
          bullet.run = bullet.pathFunc(bullet, 1, 30);
          data.bullet.push(bullet);
        }

        to_circle_center.mult(-1);
        a_location = PVector.add(airPlane.locationCurrent, to_circle_center);

        for(let i = 0;i < bulletNumEverWheel;i++){
          let site_angle = a_angle + Math.PI / roundAngleRatio * i;
          let dirVector = new PVector(
              Math.cos(site_angle),
              Math.sin(site_angle)
          );
          let bullet = new Bullet(
              airPlane,
              CIRCLE_BULLET,
              site_angle,
              PVector.add(a_location, PVector.mult(dirVector, 10))
          );
          bullet.run = bullet.pathFunc(bullet, -1, 30);
          data.bullet.push(bullet);
        }

        // if bullet_count is less than bulletNumEverWheel, skill end
        // else still to be called in skill process.
        return ++bulletCount < bulletCountMax;
    });
};

export default {
    skillName: "Pos and Neg wheel",
    skillFunc: skillFunc,
    skillCD: 3000,
};

/* posAndNegWheel.js ends here */
