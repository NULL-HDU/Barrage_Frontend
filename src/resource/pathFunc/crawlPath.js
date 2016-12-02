/* crawlPath.js --- function to run crawlPath.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import PVector from "../../model/Point.js";

export const crawlPath = (bullet, direction=1,maxCrawlS=150) => {
  let v1 = bullet.speed;                          // px / GLI (GAME_LOOP_INTERVAL)
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle) * v1,
    Math.sin(angle) * v1
  );
  // v0**2 - v1**2 = 2ax
  let asv_mag =Math.pow(v1, 2)  / (2*maxCrawlS); // px / s**2
  let asv = PVector.mult(sv, -1);
  asv.setMag(asv_mag);
  sv.setMag(v1);
  sv.mult(direction);
  asv.mult(direction);

  let step = 1;

  return () => {
    if(step == 1 && sv.mag() <= v1/10){
      step = 2;
      asv.mult(-1);
    }
    sv.add(asv);
    bullet.locationCurrent.add(sv);
  };
};

export default crawlPath;

/* crawlPath.js ends here */
