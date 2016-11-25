import PVector from "./model/Point.js";
import global from "./global.js";

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

const MAX_S = 300;
const uniformlyRetardedPath = (bullet) => {
  let v1 = bullet.speed;                          // px / GLI (GAME_LOOP_INTERVAL)
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle + (3/2)*Math.PI) * v1,
    Math.sin(angle + (3/2)*Math.PI) * v1
  );
  let v0 = bullet.speed * 3;                    // px / GLI (GAME_LOOP_INTERVAL)
  // v0**2 - v1**2 = 2ax
  let asv_mag = (Math.pow(v0, 2) - Math.pow(v1, 2)) / (2*MAX_S); // px / s**2
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

const MAX_CRAWL_S = 150;
const crawlPath = (bullet) => {
  let v1 = bullet.speed;                          // px / GLI (GAME_LOOP_INTERVAL)
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle + (3/2)*Math.PI) * v1,
    Math.sin(angle + (3/2)*Math.PI) * v1
  );
  // v0**2 - v1**2 = 2ax
  let asv_mag =Math.pow(v1, 2)  / (2*MAX_CRAWL_S); // px / s**2
  let asv = PVector.mult(sv, -1);
  asv.setMag(asv_mag);
  sv.setMag(v1);

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

export const testPath = crawlPath;
