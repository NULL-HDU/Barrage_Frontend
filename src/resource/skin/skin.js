/* skin.js --- skin resource for balls
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import {
    EVA01_AIRPLANE,
    MIN_BULLET,
    MAX_BULLET
} from "../skin/skinId.js";

const RP = "/static/view/imgs/";
let IMG_MIN_BULLET = RP + "MIN_BULLET.png",
    MIN_B = RP + "MIN_B.png",
    MIN_R = RP + "MIN_R.png";
let EVA01 = RP + "EVA01.png",
    EVA01_B = RP + "EVA01_B.png",
    EVA01_R = RP + "EVA01_R.png";

export const IMAGES = [EVA01, EVA01_B, EVA01_R, IMG_MIN_BULLET, MIN_B, MIN_R];

export const bulletSkins = {
    [MIN_BULLET]: {
        judge_radius: 10,
        skin_radius: 10,
        skin: [IMG_MIN_BULLET],
        camp: [MIN_B, MIN_R]
    },
    [MAX_BULLET]: {
        judge_radius: 60,
        skin_radius: 60,
        skin: [IMG_MIN_BULLET],
        camp: [MIN_B, MIN_R]
    }
};

export const airplaneSkins = {
    [EVA01_AIRPLANE]: {
        judge_radius: 10,
        skin_radius: 60,
        skin: [EVA01],
        camp: [EVA01_B, EVA01_R]
    }
};


/* skin.js ends here */
