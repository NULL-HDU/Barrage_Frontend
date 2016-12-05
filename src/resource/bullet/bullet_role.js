/* bullet_role --- define bullets.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import global from "../../global.js";
import straightLinePath from "../pathFunc/straightLine.js";
import circlePath from "../pathFunc/circlePath.js";
import {
  STRAIGHT_LINE_BULLET,
  CIRCLE_BULLET,
} from "./roleId.js";

export default {
  [STRAIGHT_LINE_BULLET]: {
    radius: 7.5,
    pathFunc: straightLinePath,
    hp: 100,
    damage: 50,
    speed: global.BULLET_SPEED, // px / s
  },
  [CIRCLE_BULLET]: {
    radius: 7.5,
    pathFunc: circlePath,
    hp: 100,
    damage: 50,
    speed: global.BULLET_SPEED, // px / s
  }
};


/* bullet_role ends here */
