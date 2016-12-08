/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import global from "../global";
import {
  DEAD,
  DISAPPEAR,
  AIRPLANE,
  BULLET
} from "../constant.js";
import gamemodel from "../model/gamemodel";
import Quadtree from "./quadtree";
import PVector from "../model/Point";
import {socketStatusSwitcher} from "../socket/transmitted";

let data = gamemodel.data.engineControlData;
let backendData = gamemodel.data.backendControlData;
let quad = new Quadtree({
    x: 0,
    y: 0,
    width: global.LOCAL_WIDTH,
    height: global.LOCAL_HEIGHT
});

let looper = (f, t) => setTimeout(() => {f(); looper(f, t);}, t);

let uselessBulletsCollect = () => {
    if(data.bullet.length <= 0) return;

    data.bullet = data.bullet.filter((bullet) => {
        if (bullet.state === DEAD) {
            gamemodel.deadCache.push(bullet);
            gamemodel.socketCache.disapperBulletInformation.push(bullet.id);
            return false;
        }
        if (bullet.state === DISAPPEAR) {
            gamemodel.disappearCache.push(bullet);
            gamemodel.socketCache.disapperBulletInformation.push(bullet.id);
            return false;
        }
        return true;
    });
};

let collisionDetection = () => {
    /*
      1.将要检测碰撞的球体加入四叉树
      2.对每个球体进行碰撞检测，检测到的就进行标记
      3.碰撞效果和伤害检测处理之后清空四叉树，进行下一轮碰撞检测
    */
    let airPlane = data.airPlane;
    let selfBullets = data.bullet.concat(airPlane);
    let enemyBullets = backendData.bullet.concat(backendData.airPlane);
    let bulletsBank = selfBullets.concat(enemyBullets);
    let i, j;
    quad.clear();
    for (i = 0; i < bulletsBank.length; i++) {
        quad.insert(bulletsBank[i]);
    }
    for (i = 0; i < selfBullets.length; i++) {
        let collidors = quad.retrieve(selfBullets[i]);
        for (j = 0; j < collidors.length; j++) {
            // 1 check camp
            // 2 check distance
            if (collidors[j].camp === selfBullets[i].camp) {
                continue;
            }

            let a = selfBullets[i].locationCurrent;
            let b = collidors[j].locationCurrent;
            let distance = PVector.dist(a, b);
            if (distance <= collidors[j].radius + selfBullets[i].radius) {


                //碰撞处理和伤害计算
                if (collidors[j].ballType === BULLET) {
                    collidors[j].state = DEAD;
                    //console.log("enemy bullet dead detect");
                }

                if (selfBullets[i].ballType === AIRPLANE){
                    selfBullets[i].hp -= collidors[j].damage;
                }

                if (selfBullets[i].ballType === BULLET) {
                    selfBullets[i].state = DEAD;
                    //console.log("self bullet dead detect");
                }

                //console.log("damage!!!");

                //不管碰撞的是子弹和子弹，还是子弹和飞机都需要加入碰撞信息中
                //暂未处理飞机撞击飞机的情况
                let damageInformation = {
                    collision1: selfBullets[i].id,
                    collision2: collidors[j].id,
                    damageValue: [selfBullets[i].damageValue, collidors[j].damageValue],
                    state: [selfBullets[i].state, collidors[j].state]
                };
                gamemodel.socketCache.damageInformation.push(damageInformation);

                //只判断两个相撞
                break;
            }
        }
    }
};

let engine = () => {
  let airPlane = data.airPlane;
  looper(() => {
    airPlane.move();
    airPlane.skillCountDown();

    data.bullet.forEach((bullet) => {
      bullet.pathCalculate();
    });
    collisionDetection();

    // uselessBulletsCollect useless balls always are in the end of a engine cycle;
    uselessBulletsCollect();

    socketStatusSwitcher();
  }, global.GAME_LOOP_INTERVAL);
};

export const startEngine= () => {
  engine();
};
