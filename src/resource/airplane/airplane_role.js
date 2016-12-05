/* airplane_role.js --- roles of airplane.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import {EVA01} from "./roleId.js";
import LinearPark from "../skills/normalStraightShut.js";
import PosAndNegWheel from "../skills/posAndNegWheel.js";

export default {
  [EVA01]: {
    radius: 5,

    normalSkill: LinearPark,
    qSkill: PosAndNegWheel,
  }
};


/* airplane_role.js ends here */
