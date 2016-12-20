/* bullet_role --- define bullets.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import global from "../../global.js";
import straightLinePath from "../pathFunc/straightLine.js";
import circlePath from "../pathFunc/circlePath.js";
import uniformlyRetardedPath from "../pathFunc/uniformlyRetardedPath.js";
import {
    MIN_BULLET,
    MAX_BULLET
} from "../skin/skinId.js";
import {
    STRAIGHT_LINE_BULLET,
    CIRCLE_BULLET,
    MAX_UNIFORMLY_RETARDED_BULLET,
} from "./roleId.js";

export default {
    [STRAIGHT_LINE_BULLET]: {
        skinId: MIN_BULLET,
        pathFunc: straightLinePath,
        hp: 100,
        damage: 50,
        speed: global.BULLET_SPEED, // px / s
    }, [MAX_UNIFORMLY_RETARDED_BULLET]: {
        skinId: MAX_BULLET,
        pathFunc: uniformlyRetardedPath,
        hp: 300,
        damage: 50,
        speed: global.BULLET_SPEED, // px / s
    }, [CIRCLE_BULLET]: {
        skinId: MIN_BULLET,
        pathFunc: circlePath,
        hp: 100,
        damage: 50,
        speed: global.BULLET_SPEED, // px / s
    }
};

/* bullet_role ends here */
