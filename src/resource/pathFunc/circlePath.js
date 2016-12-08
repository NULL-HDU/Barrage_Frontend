/* circlePath --- function to run circle
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import PVector from "../../model/Point.js";

// clockwise=1: clockwise
// clockwise=-1: anticlockwise
export const circlePath = (bullet, clockwise=1, minRadius=50, maxRadius=900, dRadius=0.3) => {
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle) * bullet.speed,
    Math.sin(angle) * bullet.speed
  );
  // sv.mult(direaction);
  let R = minRadius; // a = v**2 / R
  let dR = dRadius;

  return () => {
    let asv = new PVector(-sv.y , sv.x);
    asv.mult(clockwise);
    asv.setMag(Math.pow(bullet.speed, 2) / R);
    sv.add(asv);
    sv.setMag(bullet.speed);
    if(R <= maxRadius){
      R += dR;
    }
    bullet.locationCurrent.add(sv);
  };
};

export default circlePath;

/* circlePath ends here */
