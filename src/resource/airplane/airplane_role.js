/* airplane_role.js --- roles of airplane.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import {EVA01} from "./roleId.js";
import {EVA01_AIRPLANE} from "../skin/skinId.js";
import LinearPark from "../skills/normalStraightShut.js";
import JudgementPunch from "../skills/judgementPunch.js";
// import PosAndNegWheel from "../skills/posAndNegWheel.js";
import fortuneWheel from "../skills/fortuneWheel.js";
import {
  LEFT_SKILL,
  RIGHT_SKILL,
  Q_SKILL,
}from "../../constant.js";

export default {
  [EVA01]: {
    skinId: EVA01_AIRPLANE,
    speed: 230,
    viewWidth: 1200,
    viewHeight: 900,
    skills: {
      [LEFT_SKILL]: LinearPark,
      [RIGHT_SKILL]: JudgementPunch,
      [Q_SKILL]: fortuneWheel,
    }
  }
};


/* airplane_role.js ends here */
