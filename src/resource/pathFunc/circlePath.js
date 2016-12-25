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
    let rAngle = angle + Math.PI;
    let sv = new PVector(
        Math.cos(angle) * bullet.speed,
        Math.sin(angle) * bullet.speed
    ).mult(clockwise);

    let R = minRadius; // a = v**2 / R
    let preRv = new PVector(
        Math.cos(rAngle) * R,
        Math.sin(rAngle) * R
    );
    let dR = (maxRadius - minRadius) / (tt / global.GAME_LOOP_INTERVAL);

    return () => {
        rAngle += bullet.speed / R * clockwise;
        let rv = new PVector(
            Math.cos(rAngle) * R,
            Math.sin(rAngle) * R
        );
        sv.add(PVector.sub(rv, preRv));
        sv.setMag(bullet.speed);
        preRv = rv;
        // sv.setMag(bullet.speed);
        if (R <= maxRadius) {
            R += dR;
        }
        return sv;
    };
};

export default circlePath;

/* circlePath ends here */
