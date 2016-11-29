
import global from "./global.js";
import {
  straightLinePath,
  circlePath
} from "./pathFunc.js";

export const STRAIGHT_LINE_BULLET = 0;
export const CIRCLE_BULLET = 1;

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
