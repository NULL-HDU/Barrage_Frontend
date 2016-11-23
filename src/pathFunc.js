import PVector from "./model/Point.js";

const straightLinePath = (bullet) => {
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle + (3/2)*Math.PI) * bullet.speed,
    Math.sin(angle + (3/2)*Math.PI) * bullet.speed
  );

  return () => {
    bullet.locationCurrent.add(sv);
  };
};

const circlePath = (bullet) => {
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.sin(angle + (3/2)*Math.PI) * bullet.speed,
    - Math.cos(angle + (3/2)*Math.PI) * bullet.speed
  );
  let R = 50; // a = v**2 / R
  let dR = 0.2;

  return () => {
    let asv = new PVector(sv.y , -sv.x);
    asv.setMag(Math.pow(bullet.speed, 2) / R);
    sv.add(asv);
    sv.setMag(bullet.speed);
    if(R <= 400){
      R += dR;
    }
    bullet.locationCurrent.add(sv);
  };
};

export const testPath = circlePath;
