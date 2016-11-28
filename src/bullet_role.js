import global from "./global.js";
import {testPath} from "./pathFunc.js";

export const STRAIGHT_LINE_BULLET = 0;

export default {
    [STRAIGHT_LINE_BULLET]: {
        radius: 5,
        pathFunc: testPath,
        hp: 100,
        damage: 50,
        speed: global.BULLET_SPEED,
    }
}