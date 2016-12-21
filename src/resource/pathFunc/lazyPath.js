/* lazyPath --- function to run lazy
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import PVector from "../../model/Point.js";
import global from "../../global.js";

// waitMS Number wait millisecond, how many milliseconds to wait to run.
// maxAS  Number max acceleration distance.(px)
export const lazyPath = (bullet, waitMS = 500, maxAS = 500) => {
    let angle = bullet.attackDir % (2 * Math.PI);
    let direction = new PVector(Math.cos(angle), Math.sin(angle));
    let sv = new PVector();
    let asv = PVector.mult(direction, Math.pow(bullet.speed, 2) / (2 * maxAS));
    let waitCount = waitMS / global.GAME_LOOP_INTERVAL;
    let count = 0;

    return () => {
        if (count < waitCount) {
            count++;
            return;
        }
        if (sv.mag() < bullet.speed) {
            sv.add(asv);
        }
        return sv;
    };
};

export default lazyPath;

/* lazyPath ends here */
