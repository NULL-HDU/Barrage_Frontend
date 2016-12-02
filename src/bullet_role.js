
import global from "./global.js";
import {
  straightLinePath,
    circlePath,
    uniformlyRetardedPath,
    crawlPath
} from "./pathFunc.js";

export const STRAIGHT_LINE_BULLET = 0;
export const CIRCLE_BULLET = 1;
export const UNIFORMLY_RETARDED_BULLET = 2;
export const CRAWL_BULLET = 3;

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
  },
  [UNIFORMLY_RETARDED_BULLET]: {
      radius: 7.5,
      pathFunc: uniformlyRetardedPath,
      hp: 100,
      damage: 50,
      speed: global.BULLET_SPEED, // px / s
  },
  [CRAWL_BULLET]: {
      radius: 7.5,
      pathFunc: crawlPath,
      hp: 100,
      damage: 50,
      speed: global.BULLET_SPEED, // px / s
  },
};
