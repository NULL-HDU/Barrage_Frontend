/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import global from "../global";
import {
    EVA01
} from "../resource/airplane/roleId.js";
import {
    DEAD,
    DISAPPEAR,
    AIRPLANE,
} from "../constant.js";
import gamemodel from "../model/gamemodel";
import Quadtree from "./quadtree";
import PVector from "../model/Point";
import {
    playgroundInfo
} from "../socket/transmitted";
import {
    loopRender
} from "../view/Nview";
import {
  createAirplane
} from "../model/airplane.js";

let data, backendData;
// store information about looper
let loopInfo = {};
let quad = new Quadtree({
    x: 0,
    y: 0,
    width: global.LOCAL_WIDTH,
    height: global.LOCAL_HEIGHT
}, 10, 5);

let looper = (t, i, f) => setTimeout(() => {
    f();
    i.loop = looper(t, i, f);
}, t);

let uselessBulletsCollect = () => {

    if (data.airPlane && data.airPlane.state === DEAD) {
        gamemodel.deadCache.push(data.airPlane);
        data.airPlane = undefined;
        data.bullet.forEach((bullet) => {
            bullet.state = DISAPPEAR;
        });
    }

    backendData.airPlane = backendData.airPlane.filter((airPlane) => {
        if (airPlane.state === DEAD) {
            gamemodel.deadCache.push(airPlane);
            return false;
        }
        return true;
    });

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

    backendData.bullet = backendData.bullet.filter((bullet) => {
        if (bullet.state === DEAD) {
            gamemodel.deadCache.push(bullet);
            return false;
        }
        if (bullet.state === DISAPPEAR) {
            gamemodel.disappearCache.push(bullet);
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

    if (data.airPlane === undefined) {
        return;
    }

    let selfBullets = data.bullet.concat(data.airPlane);
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
            // 2 check type
            // 3 check distance
            if (collidors[j].camp === selfBullets[i].camp) {
                continue;
            }
            if (collidors[j].ballType === AIRPLANE && selfBullets[i].ballType === AIRPLANE) {
                continue;
            }

            let a = selfBullets[i].locationCurrent;
            let b = collidors[j].locationCurrent;
            let distance = PVector.dist(a, b);
            if (distance <= collidors[j].radius + selfBullets[i].radius) {
                let damageInformation = {
                    collision1: [selfBullets[i].userId, selfBullets[i].id],
                    collision2: [collidors[j].userId, collidors[j].id],
                    damageValue: [selfBullets[i].hp, collidors[j].hp],
                    state: []
                };

                // bullet <-> bullet
                if (collidors[j].ballType === selfBullets[i].ballType) {
                    let chp = collidors[j].hp,
                        shp = selfBullets[i].hp;
                    collidors[j].hp -= shp;
                    selfBullets[i].hp -= chp;
                } else {
                    // TODO: There is no method to check airPlane colliding with food.
                    collidors[j].hp = 0;
                    selfBullets[i].hp = 0;
                }

                if (collidors[j].hp <= 0) collidors[j].state = DEAD;
                if (selfBullets[i].hp <= 0) selfBullets[i].state = DEAD;

                damageInformation.state[0] = selfBullets[i].state;
                damageInformation.state[1] = collidors[j].state;
                gamemodel.socketCache.damageInformation.push(damageInformation);

                //只判断两个相撞
                break;
            }
        }
    }
};

let askForTryAgain = () => {
    window.dialogs.info.Open("You are dead!!!", "Try again?", (yes) => {
        if (yes) {
            gamemodel.data.engineControlData.airPlane = createAirplane(EVA01);
        } else {
            window.location.hash = "";
            window.location.reload();
        }
    });
};

let engine = () => {

    let socketCount = 0;
    let socketCountMax = global.SOCKET_LOOP_INTERVAL / global.GAME_LOOP_INTERVAL;
    let viewCount = 0;
    let viewCountMax = Math.floor(global.VIEW_LOOP_INTERVAL / global.GAME_LOOP_INTERVAL);
    let _engine = () => {
        if (data.airPlane !== undefined) {
            data.airPlane.move();
            data.airPlane.skillActive();
            data.airPlane.skillCountDown();
        } else {
            if (gamemodel.gameMode === 1) {
                if (!window.dialogs.info.State()) askForTryAgain();
            }
        }

        data.bullet.forEach((bullet) => {
            bullet.pathCalculate();
        });
        collisionDetection();

        // uselessBulletsCollect useless balls always are in the end of a engine cycle;
        uselessBulletsCollect();

        if (++socketCount >= socketCountMax) {
            socketCount = 0;
            playgroundInfo();
        }

        if (++viewCount >= viewCountMax) {
            viewCount = 0;
            loopRender();
        }

    };

    loopInfo.loop = looper(global.GAME_LOOP_INTERVAL, loopInfo, _engine);
};

export const startEngine = () => {
    data = gamemodel.data.engineControlData;
    backendData = gamemodel.data.backendControlData;
    engine();
};

export const overEngine = () => {
    clearTimeout(loopInfo.loop);
};
