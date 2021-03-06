/* airplane_role.js --- roles of airplane.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import {
    EVA01
} from "./roleId.js";
import {
    EVA01_AIRPLANE
} from "../skin/skinId.js";
import LinearPark from "../skills/normalStraightShut.js";
import JudgementPunch from "../skills/judgementPunch.js";
// import PosAndNegWheel from "../skills/posAndNegWheel.js";
import fortuneWheel from "../skills/fortuneWheel.js";
import myhole from "../skills/myhole.js";
import {
    LEFT_SKILL,
    RIGHT_SKILL,
    Q_SKILL,
    E_DEFEND_SKILL
} from "../../constant.js";

export default {
    [EVA01]: {
        skinId: EVA01_AIRPLANE,
        speed: 300,
        viewWidth: 1280,
        viewHeight: 800,
        skills: {
            [LEFT_SKILL]: LinearPark,
            [RIGHT_SKILL]: JudgementPunch,
            [Q_SKILL]: fortuneWheel,
            [E_DEFEND_SKILL]: myhole
        }
    }
};


/* airplane_role.js ends here */
