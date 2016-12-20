/* uniformlyRetardedPath --- function to run uniformlyRetardedPath
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import PVector from "../../model/Point.js";

export const uniformlyRetardedPath = (bullet, speedUpRate=3, maxS=300) => {
  let v1 = bullet.speed;                          // px / GLI (GAME_LOOP_INTERVAL)
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle) * v1,
    Math.sin(angle) * v1
  );
  let v0 = bullet.speed * speedUpRate;                    // px / GLI (GAME_LOOP_INTERVAL)
  // v0**2 - v1**2 = 2ax
  let asv_mag = (Math.pow(v0, 2) - Math.pow(v1, 2)) / (2*maxS); // px / s**2
  let asv = PVector.mult(sv, -1);
  asv.setMag(asv_mag);
  sv.setMag(v0);

  return () => {
    if(sv.mag() > v1){
      sv.add(asv);
    }
    bullet.locationCurrent.add(sv);
  };
};

export default uniformlyRetardedPath;

/* uniformlyRetardedPath ends here */
