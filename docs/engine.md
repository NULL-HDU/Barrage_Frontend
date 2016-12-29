# Engine

## Introduction

Engine 控制 Socket 的解析与 View 的渲染的速度比例。

Engine 进行 bullet 碰撞检查。

Engine 接受用户的输入，包括键盘输入，鼠标左键输入以及鼠标轨迹的输入，用来控制飞机的技能发动，移动以及方向的变化

Engine 对失效的子弹进行回收。

## Implement

### Rate Control

Engine 的循环作为总循环控制 Socket 的解析以及 View 的渲染

``` javascript
    let engine = () => {

    let socketCount = 0;
    let socketCountMax = global.SOCKET_LOOP_INTERVAL / global.GAME_LOOP_INTERVAL;
    let viewCount = 0;
    let viewCountMax = Math.floor(global.VIEW_LOOP_INTERVAL / global.GAME_LOOP_INTERVAL);

    looper(() => {
        if (++socketCount >= socketCountMax) {
            socketCount = 0;
            playgroundInfo();
        }

        if (++viewCount >= viewCountMax) {
            viewCount = 0;
            loopRender();
        }

    }, global.GAME_LOOP_INTERVAL);
}; 
```

### Collision Detect

使用四叉树空间检索算法进行碰撞检测:
1.将要检测碰撞的球体加入四叉树
2.对每个球体进行碰撞检测，检测到的就进行标记
3.碰撞效果和伤害检测处理之后清空四叉树，进行下一轮碰撞检测

四叉树算法具体见 src/engine/quadtree.js

``` javascript
let collisionDetection = () => {

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

```

### Useless Bullet Collect

Engine 对 hp 归0的子弹、超出射程范围的子弹、超出边界的子弹以及 hp 归0的飞机进行回收。

``` javascript
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
```

### Handle user input

在用户输入用户名结束之后会对时间监听进行重新绑定，键盘敲击的时间绑定在 window 下，鼠标的点击事件绑定在 canvas 下


``` javascript
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
```

``` javascript
    export const configCanvasEventListen = () => {
    //屏蔽右键菜单
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    }, false);

    let canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", mousePress);
    canvas.addEventListener("mouseup", mouseRelease);
    canvas.addEventListener("mousemove", mouseMove);
};
```

