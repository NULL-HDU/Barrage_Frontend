/* circlePath --- function to run circle
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import PVector from "../../model/Point.js";
import global from "../../global.js";

// clockwise=1: clockwise
// clockwise=-1: anticlockwise
// tt: time of transform from minRadius to maxRadius
export const circlePath = (bullet, clockwise = 1, minRadius = 50, maxRadius = 900, tt = 3000) => {
    let angle = bullet.attackDir % (2 * Math.PI);
    let sv = new PVector(
        Math.cos(angle) * bullet.speed,
        Math.sin(angle) * bullet.speed
    );
    // sv.mult(direaction);
    let R = minRadius; // a = v**2 / R
    let dR = (maxRadius - minRadius) / (tt / global.GAME_LOOP_INTERVAL);
    let asvMag = Math.pow(bullet.speed, 2) / R;

    return () => {
        let asv = new PVector(-sv.y, sv.x);
        asv.setMag(asvMag);
        asv.mult(clockwise);
        sv.add(asv);
        sv.setMag(bullet.speed);
        if (R <= maxRadius) {
            asvMag *= R;
            R += dR;
            asvMag /= R;
        }
        return sv;
    };
};

export default circlePath;

/* circlePath ends here */
