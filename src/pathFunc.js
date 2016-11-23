

export const straightLinePath = (bullet) => {
  let speed = bullet.speed;
  let angel = bullet.attackDir % (2 * Math.PI);
  bullet.locationCurrent.x += Math.cos(angel + (3/2)*Math.PI) * speed;
  bullet.locationCurrent.y += Math.sin(angel + (3/2)*Math.PI) * speed;
};
