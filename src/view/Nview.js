/* view.js
 *
 * Maintainer: Neoco
 * Email: Neoco.wlp1002@gmail.com
 */

import * as PIXI from "./pixi.js";
import GMD from "../model/gamemodel.js";

// game state
let state;

// fps
const FPS = 60, stot = 1000 / FPS;

// virture size
let VIR_W = 1280 * 2, VIR_H = 800 * 2;

// cut view size
let CUT_W = 1280 * 2, CUT_H = 800 * 2; 

// local window size
let LOCAL_W = window.innerWidth,
    LOCAL_H = window.innerHeight;

// local view size
let VIEW_W, VIEW_H;
let adaptWindow = () => {
    let xr = LOCAL_W / CUT_W,
        yr = LOCAL_H / CUT_H;
    if (xr < yr) {
        VIEW_W = CUT_W * xr;
        VIEW_H = CUT_H * xr;
    } else {
        VIEW_W = CUT_W * yr;
        VIEW_H = CUT_H * yr;
    }
};
adaptWindow();

// center the canvas
let centerCanvas = () => {
    let LEFT = (LOCAL_W - VIEW_W) / 2 === 0? 0 : (LOCAL_W - VIEW_W) / 2 + "px",
        TOP = (LOCAL_H - VIEW_H) / 2 === 0? 0 : (LOCAL_H - VIEW_H) / 2 + "px";

    let canvas = document.getElementById("canvas");
    canvas.style.margin = `${TOP} ${LEFT}`;
};

// center of the local view size
let CENTER_X = VIEW_W / 2,
    CENTER_Y = VIEW_H / 2;

// ratio
let RATIO_CRT = VIEW_W / CUT_W,
    RATIO_PRE = RATIO_CRT,
    TRANS_VALUE  = RATIO_CRT / RATIO_PRE;

// resources
let resources = PIXI.loader.resources;
let img_url = "/static/view/imgs/",
    eva01 = img_url + "EVA01.png",
    eva01_b = img_url + "EVA01_B.png",
    eva01_r = img_url + "EVA01_R.png",
    min_bullet = img_url + "MIN_BULLET.png",
    min_b = img_url + "MIN_B.png",
    min_r = img_url + "MIN_R.png";

// pixi renderer
let renderer = PIXI.autoDetectRenderer(
    VIEW_W,
    VIEW_H,
    { backgroundColor: 0x000000 }
); 

// layers
let Container = PIXI.Container;
let Stage = new Container(),
    BackgroundLayer = new Container(),
    ObstacleLayer = new Container(),
    ResourceLayer = new Container(),
    EnemyLayer = new Container(),
    AirplaneLayer = new Container(),
    RedBulletLayer = new Container(),
    BlueBulletLayer = new Container(),
    EffectLayer = new Container(),
    UILayer = new Container();

// sprites
let Sprite = PIXI.Sprite;
let createSprite = (url) => {
    let sp = new Sprite(resources[url].texture);
    sp.anchor.set(0.5, 0.5);
    return sp;
};
let setObjectSize = (obj, size) => {
    obj.width = size * RATIO_CRT;
    obj.height = size * RATIO_CRT;
};

let centerAPX = (me, ap) => {
    return (me - ap) * RATIO_CRT + CENTER_X;
};

let centerAPY = (me, ap) => {
    return (me - ap) * RATIO_CRT + CENTER_Y;
};

// select exact size balls to draw array from gamemodel
let selectBalls = (con, sparr, gmd, size, url, type) => {
    // renge
    let right = ap_data.x_crt + (CUT_W + size) / 2,
        left = ap_data.x_crt - (CUT_W + size) / 2,
        top = ap_data.y_crt - (CUT_H + size) / 2,
        bottom = ap_data.y_crt + (CUT_H + size) / 2;

    let count = 0;

    for (let i = 0; i < gmd.length; i ++) {
        let x = gmd[i].locationCurrent.x,
            y = gmd[i].locationCurrent.y,
            r = gmd[i].attackDir;
        let data = [x, y, r];
        if (x < right && x > left && y > top && y < bottom) {
            count += 1;
            if (count > sparr.length) {
                switch (type) {
                    case T_BULLET: addBullet(con, sparr, url, size, data); break;
                    case T_ENM: addEnm(con, sparr, url, size, data); break;
                    default: break;
                }
            } else {
                switch (type) {
                    case T_BULLET: updateBullet(sparr, count - 1, size, data); break;
                    case T_ENM: updateEnm(sparr, count - 1, size, data); break;
                    default: break;
                }
            }
        }
    }

    if (count < sparr.length) {
        for (let j = count; j < sparr.length; j ++) {
            sparr[j].visible = false;
        }
    }
};

// AirplaneLayer
const ap_l = 120;
let airplane = new Container();
let ap_gi,
    ap_data = {
        x_pre: 0,
        x_crt: 0,
        x_len: 0,
        y_pre: 0,
        y_crt: 0,
        y_len: 0,
        r: 0,
        flag: 0
    };
let copyAirplaneInfo = () => {
    ap_gi = GMD.data.engineControlData.airPlane;

    if (ap_gi === undefined) {
        ap_data.x_pre = 0;
        ap_data.y_pre = 0;
        ap_data.flag = 0;
        ap_data.x_crt = 0;
        ap_data.x_len = 0;
        ap_data.y_crt = 0;
        ap_data.y_len = 0;
        ap_data.r = 0;
    }else{
        if (ap_data.flag === 0) {
            ap_data.x_pre = ap_gi.locationCurrent.x;
            ap_data.y_pre = ap_gi.locationCurrent.y;
            ap_data.flag = 1;
        } else {
            ap_data.x_pre = ap_data.x_crt;
            ap_data.y_pre = ap_data.y_crt;
        }

        ap_data.x_crt = ap_gi.locationCurrent.x;
        ap_data.x_len = ap_data.x_crt - ap_data.x_pre;

        ap_data.y_crt = ap_gi.locationCurrent.y;
        ap_data.y_len = ap_data.y_crt - ap_data.y_pre;

        ap_data.r = ap_gi.attackDir;    
    }

    
};

// BackgroundLayer
let universe = new Container();
const rect_l = 80;
let rect_xn = CUT_W / rect_l,
    rect_yn = CUT_H / rect_l,
    rect_vl = rect_l * RATIO_CRT;

let drawCrossLine = (x, y) => {
    universe.removeChildren();

    let Graphics = new PIXI.Graphics;
    Graphics.lineStyle(1, 0x252525, 1);
    let ni = rect_yn + 2, nj = rect_xn + 2;
    for (let i = 0; i < ni; i ++) {
        for (let j = 0; j < nj; j ++) {
            let x = j * rect_vl,
                y = i * rect_vl;
            Graphics.drawRect(x, y, rect_vl, rect_vl);
        }
    }
    Graphics.endFill();
    
    universe.addChild(Graphics);
    universe.x = x;
    universe.y = y;
};

// EnemyLayer
const T_ENM = 0;
const enm_l = 120; 
let Enemys = [], enm_gi;
let updateEnm = (sparr, index, size, data) => {
    sparr[index].visible = true;
    if (sparr[index].width !== size * RATIO_CRT) {
        setObjectSize(sparr[index], size);
    }
    sparr[index].x = centerAPX(data[0], ap_data.x_crt);
    sparr[index].y = centerAPY(data[1], ap_data.y_crt);
    sparr[index].rotation = data[2];

};

let addEnm = (con, sparr, url, size, data) => {
    let enemy = new Container();
    enemy.addChild(createSprite(url[1]));
    enemy.addChild(createSprite(url[0]));
    setObjectSize(enemy, size);
    sparr.push(enemy);

    let p = sparr.length - 1;
    updateEnm(sparr, p, size, data);
    con.addChild(sparr[p]);
};

// BULLET
const T_BULLET = 1;
// BlueBulletLayer
const bblt_l = 20;
let Bbullets = [], bblt_gi;
// RedBulletLayer
const rblt_l = 20;
let Rbullets = [], rblt_gi;

let updateBullet = (sparr, index, size, data) => {
    sparr[index].visible = true;
    if (sparr[index].width !== size * RATIO_CRT) {
        setObjectSize(sparr[index], size);
    }
    sparr[index].x = centerAPX(data[0], ap_data.x_crt);
    sparr[index].y = centerAPY(data[1], ap_data.y_crt);
    sparr[index].rotation = data[2];
};

let addBullet = (con, sparr, url, size, data) => {
    let bullet = new Container();
    bullet.addChild(createSprite(url[0]));
    bullet.addChild(createSprite(url[1]));
    sparr.push(bullet);
    let p = sparr.length - 1;
    updateBullet(sparr, p, size, data);
    con.addChild(sparr[p]);
};

// export for launch
export function initView(callback) {
    PIXI.loader
        .add(eva01)
        .add(eva01_b)
        .add(eva01_r)
        .add(min_bullet)
        .add(min_b)
        .add(min_r)
        .load(() =>{
            renderer.view.id = "canvas";
            document.body.appendChild(renderer.view);
            centerCanvas();
            initLayers(callback);
        });
}

function initLayers(callback) {
    initBackground();
    initObstacle();
    initResource();
    initEnemy();
    initAirplane();
    initRedBullet();
    initBlueBullet();
    initEffect();
    initUI();

    state = play;
    console.log("init view");
    callback();
    console.log("callback success");

}

function initBackground() {
    drawCrossLine(-rect_vl, -rect_vl);
    BackgroundLayer.addChild(universe);
    Stage.addChild(BackgroundLayer);
}

function initObstacle() {
    Stage.addChild(ObstacleLayer);
}

function initResource() {
    Stage.addChild(ResourceLayer);
}

function initEnemy() {
    Stage.addChild(EnemyLayer);
}

function initAirplane() {
    let body = createSprite(eva01_b),
        camp = createSprite(eva01);

    airplane.addChild(body);
    airplane.addChild(camp);
    
    setObjectSize(airplane, ap_l);
    airplane.position.set(CENTER_X, CENTER_Y);

    AirplaneLayer.addChild(airplane);
    Stage.addChild(AirplaneLayer);
}

function initRedBullet() {
    Stage.addChild(RedBulletLayer);
}

function initBlueBullet() {
    Stage.addChild(BlueBulletLayer);
}

function initEffect() {
    Stage.addChild(EffectLayer);
}

function initUI() {
    Stage.addChild(UILayer);
}

// loop render
export function loopRender() {
    state();
    rszView();
    renderer.render(Stage);
    GMD.deadCache = [];
    GMD.disappearCache = [];
    GMD.collisionCache = [];
}

function play() {
    copyAirplaneInfo();

    rstBackground();
    rstObstacle();
    rstResource();
    rstEnemy();
    rstAirplane();
    rstRedBullet();
    rstBlueBullet();
    rstEffect();
    rstUI();
}

function rstBackground() {
    universe.x += -ap_data.x_len * RATIO_CRT;
    if (ap_data.x_crt < CUT_W / 2) {
        universe.x = (CUT_W / 2 - ap_data.x_crt) * RATIO_CRT;
    } else if (ap_data.x_crt > VIR_W - CUT_W / 2) {
        universe.x = - 2 * rect_vl - (CUT_W / 2 - (VIR_W - ap_data.x_crt)) * RATIO_CRT;
    } else if (universe.x < - 2 * rect_vl || universe.x > 0) {
        universe.x = -rect_vl + (universe.x % rect_vl);
    }

    universe.y += -ap_data.y_len * RATIO_CRT;
    if (ap_data.y_crt < CUT_H / 2) {
        universe.y = (CUT_H / 2 - ap_data.y_crt) * RATIO_CRT;
    } else if (ap_data.y_crt > VIR_H - CUT_H / 2) {
        universe.y = - 2 * rect_vl - (CUT_H / 2 - (VIR_H - ap_data.y_crt)) * RATIO_CRT;
    } else if (universe.y < - 2 * rect_vl || universe.y > 0) {
        universe.y = -rect_vl + (universe.y % rect_vl);
    }
}

function rstObstacle() {
}

function rstResource() {
}

function rstEnemy() {
    enm_gi = GMD.data.backendControlData.airPlane;
    let url =[eva01, eva01_r];
    selectBalls(EnemyLayer, Enemys, enm_gi, enm_l, url, T_ENM);
}

function rstAirplane() {
    airplane.rotation = ap_data.r;
}

function rstRedBullet() {
    rblt_gi = GMD.data.backendControlData.bullet;
    let url = [min_bullet, min_r];
    selectBalls(RedBulletLayer, Rbullets, rblt_gi, rblt_l, url, T_BULLET);
}

function rstBlueBullet() {
    bblt_gi = GMD.data.engineControlData.bullet;
    let url = [min_bullet, min_b]
    selectBalls(BlueBulletLayer, Bbullets, bblt_gi, bblt_l, url, T_BULLET);
}

function rstEffect() {
}

function rstUI() {
}

// resize view when window'size changed
function rszView() {
    // remember the last ratio;
    RATIO_PRE = RATIO_CRT;

    // current window size
    let lw = LOCAL_W, lh = LOCAL_H;
    LOCAL_W = window.innerWidth;
    LOCAL_H = window.innerHeight;

    if (
        (LOCAL_W !== VIEW_W && LOCAL_H !== VIEW_H) ||
        (LOCAL_W === VIEW_W && LOCAL_H < VIEW_H) ||
        (LOCAL_W < VIEW_W && LOCAL_H === VIEW_H)
    ) {

        adaptWindow();

        CENTER_X = VIEW_W / 2;
        CENTER_Y = VIEW_H / 2;

        RATIO_CRT = VIEW_W / CUT_W;
        TRANS_VALUE  = RATIO_CRT / RATIO_PRE;
        console.log("change: " + RATIO_CRT);

        renderer.resize(VIEW_W, VIEW_H);

        rect_vl = rect_l * RATIO_CRT;

        rszBackground();
        rszObstacle();
        rszResource();
        rszEnemy();
        rszAirplane();
        rszRedBullet();
        rszBlueBullet();
        rszEffect();
        rszUI();
    }
    if (LOCAL_W !== lw || LOCAL_H !== lh) {
        centerCanvas();
    }
}

function rszBackground() {
    drawCrossLine(universe.x * TRANS_VALUE, universe.x * TRANS_VALUE);
}

function rszObstacle() {
}

function rszResource() {
}

function rszEnemy() {
    for (let i = 0; i < Enemys.length; i ++) {
        setObjectSize(Enemys[i], enm_l);
    }
}

function rszAirplane() {
    setObjectSize(airplane, ap_l);
    airplane.position.set(CENTER_X, CENTER_Y);
}

function rszRedBullet() {
}

function rszBlueBullet() {
}

function rszEffect() {
}

function rszUI() {
}
