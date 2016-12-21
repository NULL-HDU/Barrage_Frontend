/* airplane_role.js --- roles of airplane.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import {EVA01} from "./roleId.js";
import {EVA01_AIRPLANE} from "../skin/skinId.js";
import LinearPark from "../skills/normalStraightShut.js";
import JudgementPunch from "../skills/judgement_punch.js";
import PosAndNegWheel from "../skills/posAndNegWheel.js";
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
      [Q_SKILL]: PosAndNegWheel,
    }
  }
};


/* airplane_role.js ends here */
