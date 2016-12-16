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
import {
    playgroundInfo
} from "../socket/transmitted";
import {
    loopRender
} from "../view/Nview"


let data, backendData;
let quad = new Quadtree({
    x: 0,
    y: 0,
    width: global.LOCAL_WIDTH,
    height: global.LOCAL_HEIGHT
}, 10, 5);

let looper = (f, t) => setTimeout(() => {
    f();
    looper(f, t);
}, t);

let uselessBulletsCollect = () => {

    if (data.airPlane.state === DEAD) {
        gamemodel.deadCache.push(data.airPlane);
        gamemodel.socketCache.disappearBulletInformation.push(data.airPlane);
        data.airPlane = undefined;
        data.bullet.map((bullet) => {
            bullet.state = DISAPPEAR;
        });
    }

    if (data.bullet.length <= 0) return;

    

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

    backendData.airPlane = backendData.airPlane.filter((airPlane) => {
        if (airPlane.state === DEAD) {
            gamemodel.deadCache.push(airPlane);
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

    if(data.airPlane === undefined) {
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
                    collidors[j].hp -= selfBullets[i].damage;
                    if (collidors[j].hp === 0) {
                        collidors[j].state = DEAD;
                        //console.log("enemy bullet dead detect");
                    }
                }

                if (collidors[j].ballType === AIRPLANE) {
                    console.log("enemy airplane detect");
                    //                    collidors[j].hp -= selfBullets[i].damage * collidors[j].defense;
                    collidors[j].hp = 0;
                    if (collidors[j].hp === 0) {
                        console.log("enemy dead");
                        collidors[j].state = DEAD;
                    }
                }

                if (selfBullets[i].ballType === AIRPLANE) {
                    console.log("self airplane detect");
                    //                    selfBullets[i].hp -= collidors[j].damage * selfBullets[i].defense;
                    selfBullets[i].hp = 0;
                    if (selfBullets[i].hp === 0) {
                        console.log("self dead");
                        selfBullets[i].state = DEAD;
                        window.dialogs.info.Open("You are dead!!!","Try again?",(yes) => {
                            
                        });
                    }
                }

                if (selfBullets[i].ballType === BULLET) {
                    selfBullets[i].hp -= collidors[j].damage;
                    if (selfBullets[i].hp === 0) {
                        selfBullets[i].state = DEAD;
                        //console.log("self bullet dead detect");
                    }
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
    let socketCount = 0;
    let socketCountMax = global.SOCKET_LOOP_INTERVAL / global.GAME_LOOP_INTERVAL;
    let viewCount = 0;
    let viewCountMax = Math.floor(global.VIEW_LOOP_INTERVAL / global.GAME_LOOP_INTERVAL);

    looper(() => {
        data.airPlane.move();
        data.airPlane.skillActive();
        data.airPlane.skillCountDown();

        data.bullet.forEach((bullet) => {
            bullet.pathCalculate();
        });
        collisionDetection();

        // uselessBulletsCollect useless balls always are in the end of a engine cycle;
        uselessBulletsCollect();

        if(++socketCount >= socketCountMax){
            socketCount = 0;
            playgroundInfo();
        }

        if(++viewCount >= viewCountMax){
            viewCount = 0;
            loopRender();
        }


    }, global.GAME_LOOP_INTERVAL);
};

export const startEngine = () => {
    data = gamemodel.data.engineControlData;
    backendData = gamemodel.data.backendControlData;
    engine();
};
