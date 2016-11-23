import PVector from "./model/Point.js";

export const straightLinePath = (bullet) => {
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle + (3/2)*Math.PI) * bullet.speed,
    Math.sin(angle + (3/2)*Math.PI) * bullet.speed
  );

  return () => {
    bullet.locationCurrent.add(sv);
  };
};
