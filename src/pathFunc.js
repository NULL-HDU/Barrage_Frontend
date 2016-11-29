import PVector from "./model/Point.js";

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

export const uniformlyRetardedPath = (bullet, maxS=300) => {
  let v1 = bullet.speed;                          // px / GLI (GAME_LOOP_INTERVAL)
  let angle = bullet.attackDir % (2 * Math.PI);
  let sv = new PVector(
    Math.cos(angle) * v1,
    Math.sin(angle) * v1
  );
  let v0 = bullet.speed * 3;                    // px / GLI (GAME_LOOP_INTERVAL)
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
