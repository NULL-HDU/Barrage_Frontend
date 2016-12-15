/* bullet_role --- define bullets.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import global from "../../global.js";
import straightLinePath from "../pathFunc/straightLine.js";
import circlePath from "../pathFunc/circlePath.js";
import {MIN_BULLET} from "../skin/skinId.js";
import {
  STRAIGHT_LINE_BULLET,
  CIRCLE_BULLET,
} from "./roleId.js";

export default {
  [STRAIGHT_LINE_BULLET]: {
    skinId: MIN_BULLET,
    pathFunc: straightLinePath,
    hp: 100,
    damage: 50,
    speed: global.BULLET_SPEED, // px / s
  },
  [CIRCLE_BULLET]: {
    skinId: MIN_BULLET,
    pathFunc: circlePath,
    hp: 100,
    damage: 50,
    speed: global.BULLET_SPEED, // px / s
  }
};


/* bullet_role ends here */
