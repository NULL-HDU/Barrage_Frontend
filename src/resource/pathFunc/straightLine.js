/* straightLine.js --- function to run straight line.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import PVector from "../../model/Point.js";

export const straightLinePath = (bullet) => {
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle) * bullet.speed,
    Math.sin(angle) * bullet.speed
  );

  return () => {
    bullet.locationCurrent.add(sv);
  };
};

export default straightLinePath;

/* straightLine.js ends here */
