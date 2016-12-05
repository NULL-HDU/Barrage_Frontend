/* posAndNegWheel.js --- two circle wheel round and round
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import gamemodel from "../../model/gamemodel";
import PVector from "../../model/Point.js";
import {CIRCLE_BULLET} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";

let bulletNumEverWheel = 12;

let data = gamemodel.data.engineControlData;
let roundAngleRatio = bulletNumEverWheel / 2;

let skillFunc = (airPlane, angle) => {
    let a_angle = angle+Math.PI/2;
    let to_circle_center = new PVector( Math.cos(a_angle) * 50, Math.sin(a_angle) * 50);
    let a_location = PVector.add(airPlane.locationCurrent, to_circle_center);
    for(let i=0;i<bulletNumEverWheel;i++){
      let angle = a_angle + Math.PI/roundAngleRatio * i;
      let dirVector = new PVector(
          Math.cos(angle),
          Math.sin(angle)
      );
      let bullet = new Bullet(
        airPlane,
        CIRCLE_BULLET,
        angle+Math.PI,
        PVector.add(a_location, PVector.mult(dirVector, 10))
      );
      bullet.run = bullet.pathFunc(bullet, 1, 30);
      data.bullet.push(bullet);
    }
    to_circle_center.mult(-1);
    a_location = PVector.add(airPlane.locationCurrent, to_circle_center);
    for(let i=0;i<bulletNumEverWheel;i++){
      let angle = a_angle + Math.PI/roundAngleRatio * i;
      let dirVector = new PVector(
        Math.cos(angle),
        Math.sin(angle)
      );
      let bullet = new Bullet(
        airPlane,
        CIRCLE_BULLET,
        angle,
        PVector.add(a_location, PVector.mult(dirVector, 10))
      );
      bullet.run = bullet.pathFunc(bullet, -1, 30);
      data.bullet.push(bullet);
    }
};

export default {
  skillName: "Pos and Neg wheel",
  skillFunc: skillFunc,
  skillCD: 1500,
};

/* posAndNegWheel.js ends here */
