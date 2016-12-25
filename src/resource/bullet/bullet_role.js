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
    BULLET1,
    BULLET2,
    BULLET3,
    BULLET4,
    MIN_BULLET,
    MAX_BULLET
} from "../skin/skinId.js";
import {
    STRAIGHT_LINE_BULLET1,
    STRAIGHT_LINE_BULLET2,
    STRAIGHT_LINE_BULLET3,
    STRAIGHT_LINE_BULLET4,
    MAX_STRAIGHT_LINE_BULLET,
    MIN_STRAIGHT_LINE_BULLET,
    CIRCLE_BULLET1,
    CIRCLE_BULLET2,
    CIRCLE_BULLET3,
    CIRCLE_BULLET4,
    MAX_CIRCLE_BULLET,
    MIN_CIRCLE_BULLET,
    UNIFORMLY_RETARDED_BULLET3,
    UNIFORMLY_RETARDED_BULLET2,
    UNIFORMLY_RETARDED_BULLET1,
    MIN_UNIFORMLY_RETARDED_BULLET,
    MAX_UNIFORMLY_RETARDED_BULLET,
} from "./roleId.js";

// TODO: optimize bullet skin and funcPath method

export default {
    [STRAIGHT_LINE_BULLET1]: {
        skinId: BULLET1,
        pathFunc: straightLinePath,
        hp: 10,
        damage: 50,
        distance: 900,
        speed: global.BULLET_SPEED * 1.5, // px / s
    }, [STRAIGHT_LINE_BULLET2]: {
        skinId: BULLET2,
        pathFunc: straightLinePath,
        hp: 20,
        damage: 50,
        distance: 850,
        speed: global.BULLET_SPEED * 1.5, // px / s
    }, [STRAIGHT_LINE_BULLET3]: {
        skinId: BULLET3,
        pathFunc: straightLinePath,
        hp: 30,
        damage: 50,
        distance: 800,
        speed: global.BULLET_SPEED * 1.5, // px / s
    }, [MAX_STRAIGHT_LINE_BULLET]: {
        skinId: MAX_BULLET,
        pathFunc: straightLinePath,
        hp: 100,
        damage: 50,
        distance: 1200,
        speed: global.BULLET_SPEED, // px / s
    }, [MIN_STRAIGHT_LINE_BULLET]: {
        skinId: MIN_BULLET,
        pathFunc: straightLinePath,
        hp: 10,
        damage: 50,
        distance: 900,
        speed: global.BULLET_SPEED * 1.5, // px / s
    }, [MIN_UNIFORMLY_RETARDED_BULLET]: {
        skinId: MIN_BULLET,
        pathFunc: uniformlyRetardedPath,
        hp: 10,
        damage: 50,
        distance: 900,
        speed: global.BULLET_SPEED, // px / s
    }, [UNIFORMLY_RETARDED_BULLET1]: {
        skinId: BULLET1,
        pathFunc: uniformlyRetardedPath,
        hp: 20,
        damage: 50,
        distance: 800,
        speed: global.BULLET_SPEED, // px / s
    }, [UNIFORMLY_RETARDED_BULLET2]: {
        skinId: BULLET2,
        pathFunc: uniformlyRetardedPath,
        hp: 30,
        damage: 50,
        distance: 800,
        speed: global.BULLET_SPEED, // px / s
    }, [UNIFORMLY_RETARDED_BULLET3]: {
        skinId: BULLET3,
        pathFunc: uniformlyRetardedPath,
        hp: 40,
        damage: 50,
        distance: 800,
        speed: global.BULLET_SPEED, // px / s
    },[MAX_UNIFORMLY_RETARDED_BULLET]: {
        skinId: MAX_BULLET,
        pathFunc: uniformlyRetardedPath,
        hp: 100,
        damage: 50,
        distance: 700,
        speed: global.BULLET_SPEED, // px / s
    }, [CIRCLE_BULLET1]: {
        skinId: BULLET1,
        pathFunc: circlePath,
        hp: 10,
        damage: 50,
        distance: 850,
        speed: global.BULLET_SPEED, // px / s
    }, [CIRCLE_BULLET2]: {
        skinId: BULLET2,
        pathFunc: circlePath,
        hp: 20,
        damage: 50,
        distance: 800,
        speed: global.BULLET_SPEED, // px / s
    }, [MAX_CIRCLE_BULLET]: {
        skinId: MAX_BULLET,
        pathFunc: circlePath,
        hp: 60,
        damage: 50,
        distance: 700,
        speed: global.BULLET_SPEED, // px / s
    }, [MIN_CIRCLE_BULLET]: {
        skinId: MIN_BULLET,
        pathFunc: circlePath,
        hp: 10,
        damage: 50,
        distance: 900,
        speed: global.BULLET_SPEED, // px / s
    }
};

/* bullet_role ends here */
