/* view.js
 *
 * Maintainer: Neoco
 * Email: Neoco.wlp1002@gmail.com
 */

import * as PIXI from "./pixi.js";

// game state
let state;

// fps
const FPS = 60, stot = 1000 / FPS;

// cut view size
let CUT_W = 1280, CUT_H = 800; 

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
    img_ap_body = img_url + "ap_body.png",
    img_ap_arrow = img_url + "ap_arrow.png";

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

// airplane
const ap_l = 120;
let airplane = new Container();
let ap_data = {
    x_pre: 0,
    x_crt: 0,
    x_len: 0,
    y_pre: 0,
    y_crt: 0,
    y_len: 0,
    r: 0
};
export function moveAirplane(x, y, r) {
    ap_data.x_pre = ap_data.x_crt;
    ap_data.y_pre = ap_data.y_crt;
    
    ap_data.x_crt = x;
    ap_data.y_crt = y;

    ap_data.x_len = x - ap_data.x_pre;
    ap_data.y_len = y - ap_data.y_pre;

    ap_data.r = r;
}

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

// export for launch
export function initView(callback) {
    PIXI.loader
        .add(img_ap_body)
        .add(img_ap_arrow)
        .load(() =>{
            renderer.view.id = "canvas";
            document.body.appendChild(renderer.view);
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

    console.log("init view");
    callback();

    state = play;
    loopRender();
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
    let body = createSprite(img_ap_body),
        arrow = createSprite(img_ap_arrow);

    airplane.addChildAt(body, 0);
    airplane.addChildAt(arrow, 1);
    
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
function loopRender() {
    state();
    rszView();
    renderer.render(Stage);
    setTimeout(loopRender, stot);
}

function play() {
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
    if (universe.x < - 2 * rect_vl || universe.x > 0) {
        universe.x = -rect_vl + (universe.x % rect_vl);
    }
    universe.y += -ap_data.y_len * RATIO_CRT;
    if (universe.y < - 2 * rect_vl || universe.y > 0) {
        universe.y = -rect_vl + (universe.y % rect_vl);
    }
}

function rstObstacle() {
}

function rstResource() {
}

function rstEnemy() {
}

function rstAirplane() {
    airplane.getChildAt(1).rotation = ap_data.r;
}

function rstRedBullet() {
}

function rstBlueBullet() {
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
    LOCAL_W = window.innerWidth;
    LOCAL_H = window.innerHeight;

    if (
        (LOCAL_W !== VIEW_W && LOCAL_H !== VIEW_H) ||
        (LOCAL_W === VIEW_W && LOCAL_H < VIEW_H) ||
        (LOCAL_W < VIEW_W && LOCAL_H === VIEW_H)
    ) {
        adaptWindow();
        renderer.resize(VIEW_W, VIEW_H);

        CENTER_X = VIEW_W / 2;
        CENTER_Y = VIEW_H / 2;

        RATIO_CRT = VIEW_W / CUT_W;
        TRANS_VALUE  = RATIO_CRT / RATIO_PRE;

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
}

function rszBackground() {
    let pl = rect_vl;
    rect_vl = rect_l * RATIO_CRT;

    let nx = -rect_vl + (universe.x - pl) * TRANS_VALUE;
    let ny = -rect_vl + (universe.y - pl) * TRANS_VALUE;
    
    drawCrossLine(nx, ny);
}

function rszObstacle() {
}

function rszResource() {
}

function rszEnemy() {
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
