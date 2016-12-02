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
import gamemodel from "../../model/gamemodel";
import PVector from "../../model/Point.js";
import {STRAIGHT_LINE_BULLET} from "../bullet/roleId.js";
import Bullet from "../../model/bullet.js";

let data = gamemodel.data.engineControlData;

let skillFunc = (airPlane, angle) => {
  let dirVector = new PVector(
    Math.cos(angle),
    Math.sin(angle)
  );
  for(let i=10; i< 110 ;i+= 20){
    let bullet = new Bullet(
      airPlane,
      STRAIGHT_LINE_BULLET,
      angle,
      PVector.add(airPlane.locationCurrent, PVector.mult(dirVector, i))
    );
    bullet.run = bullet.pathFunc(bullet);
    data.bullet.push(bullet);
  }
};

export default {
  skillName: "Linear Park",
  skillFunc: skillFunc,
  skillCD: 1000,
};

/* normalStraigthShut.js ends here */
