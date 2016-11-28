/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import global from "../global";
import constant from "../constant.js";
import gamemodel from "../model/gamemodel";
import Quadtree from "./quadtree";
import PVector from "../model/Point";

let data = gamemodel.data.engineControlData;
let quad = new Quadtree({
    x: 0,
    y: 0,
    width: global.LOCAL_WIDTH,
    height: global.LOCAL_HEIGHT
});

window.bulletMaker = undefined;

let looper = (f, t) => setTimeout(() => {f(); looper(f, t);}, t);
let bulletMakerEngine = (f, t) => window.bulletMaker = setTimeout(
  () => {f(); bulletMakerEngine(f, t);}, t);

let uselessBulletsCollect = () => {
    data.bullet.map((bullet) => {
        if (bullet.alive === false && bullet.isKilled === true) {
            gamemodel.deadCache.push(bullet);
            gamemodel.socketCache.disappearBulletInformation.push(bullet.id);
        } else if (bullet.alive === false && bullet.isKilled === false) {
            gamemodel.disappearCache.push(bullet);
            gamemodel.socketCache.disappearBulletInformation.push(bullet.id);
        }
        return bullet;
    });

    let i = data.bullet.length;
    while (i--) {
        let bullet = data.bullet[i];
        if (bullet.alive === false) {
            data.bullet.splice(i, 1);
        }
    }

    let j = gamemodel.data.backendControlData.bullet.length;
    while (j--) {
        let bullet = gamemodel.data.backendControlData.bullet[j];
        if (bullet.alive === false) {
            gamemodel.data.backendControlData.bullet.splice(j, 1);
        }
    }
};

let enableCollisionDetectionEngine = () => {
    /*
      1.将要检测碰撞的球体加入四叉树
      2.对每个球体进行碰撞检测，检测到的就进行标记
      3.碰撞效果和伤害检测处理之后清空四叉树，进行下一轮碰撞检测
    */
    let airPlane = data.airPlane;
    let selfBullets = data.bullet.concat(airPlane);
    let enemyBullets = gamemodel.data.backendControlData.bullet.concat(gamemodel.data.backendControlData.airPlane);

    let bulletsBank = selfBullets.concat(enemyBullets);
    let i, j;
    quad.clear();
    for (i = 0; i < bulletsBank.length; i++) {
        quad.insert(bulletsBank[i]);
    }
    i = 0;
    while (i < selfBullets.length) {
        let collidors = quad.retrieve(selfBullets[i]);
        for (j = 0; j < collidors.length; j++) {
            if (collidors[j].hasJudge || selfBullets[i] == collidors[j]) {
                continue;
            }
            let a = new PVector(selfBullets[i].locationCurrent.x, selfBullets[i].locationCurrent.y);
            let b = new PVector(collidors[j].locationCurrent.x, collidors[j].locationCurrent.y);
            let distance = PVector.dist(a, b);
            if (distance <= collidors[j].radius + selfBullets[i].radius && collidors[j].camp !== selfBullets[i].camp) {

                //碰撞处理和伤害计算
                if (collidors[j].ballType === constant.BULLET) {
                    collidors[j].alive = false;
                    collidors[j].isKilled = true;
                }

                if (selfBullets[i].ballType === constant.BULLET) {
                    selfBullets[i].alive = false;
                    selfBullets[i].isKilled = true;
                }

                //不管碰撞的是子弹和子弹，还是子弹和飞机都需要加入碰撞信息中
                //暂未处理飞机撞击飞机的情况
                let damageInformation = {
                    collision1: collidors[j].id,
                    collision2: selfBullets[i].id,
                    damageValue: [collidors[j].damageValue, selfBullets[i].damageValue],
                    isAlive: [collidors[j].alive, selfBullets[i].alive],
                    willDisappear: [!collidors[j].alive, !selfBullets[i].alive],
                };
                gamemodel.socketCache.damageInformation.push(damageInformation);

                //只判断两个相撞
                break;
            }
        }

        selfBullets[i].hasJudge = true;
        i++;
    }
};

export const enableBulletsCollectingEngine = () => {
    looper(() => {
        uselessBulletsCollect();
    }, global.BULLET_COLLECTING_INTERVAL);
};

export const startGameLoop = () => {
    let airPlane = data.airPlane;
    looper(() => {
        //gamemodel.data.backendControlData.airPlane[0].attackDir += 0.05;
        airPlane.move();
        //airPlane.attackDir += 0.05;
        //自主机子弹
        // console.log(gamemodel.data.engineControlData.bullet);
        gamemodel.data.engineControlData.bullet.map((bullet) => {
            bullet.pathCalculate();
            return bullet;
        });
        //敌机子弹
        gamemodel.data.backendControlData.bullet.map((bullet) => {
            bullet.pathCalculate();
            return bullet;
        });

        //        if(gamemodel.data.engineControlData.bullet.length !== 0){
        enableCollisionDetectionEngine();
        //        }
    }, global.GAME_LOOP_INTERVAL);
};

