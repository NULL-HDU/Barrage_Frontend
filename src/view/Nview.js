/* view.js
 *
 * Maintainer: Neoco
 * Email: Neoco.wlp1002@gmail.com
 */

//////// import modules
import * as PIXI from "./pixi.js";
import gamemodel from "../model/gamemodel.js";

//////// global variables
// fps
const FPS = 60,
    stot = 1000/ FPS;
// view size
const HEIGHT_CUT = 800, WIDTH_CUT = 1280;
let WIDTH_LOCAL = window.innerWidth,
    HEIGHT_LOCAL = window.innerHeight,
    WIDTH_VIEW,
    HEIGHT_VIEW;
let adaptWindow = () => {
    let xr = WIDTH_LOCAL / WIDTH_CUT,
        yr = HEIGHT_LOCAL / HEIGHT_CUT;
    if (xr < yr) {
        WIDTH_VIEW = WIDTH_CUT * xr;
        HEIGHT_VIEW = HEIGHT_CUT * xr;
    } else {
        WIDTH_VIEW = WIDTH_CUT * yr;
        HEIGHT_VIEW = HEIGHT_CUT * yr;
    }
};
adaptWindow();
// init renderer
let renderer = PIXI.autoDetectRenderer(
    WIDTH_VIEW, 
    HEIGHT_VIEW, 
    {
        // backgroundColor: 0x000000,
        // autoResize: true,
        // resolution: 2
        // roundPixels: true
        // clearBeforeRender: false,
        // preserveDrawingBuffer: true
    }
);
renderer.view.id = "canvas";
document.body.appendChild(renderer.view);
// other rules
let X_CENTER = WIDTH_VIEW / 2,
    Y_CENTER = HEIGHT_VIEW / 2,
    RATIO = [WIDTH_VIEW / WIDTH_CUT, WIDTH_VIEW / WIDTH_CUT],
    // remember last size of local
    RULER = [WIDTH_VIEW, HEIGHT_VIEW, 0];

// game state
let state;

// containers
let Container = PIXI.Container;
// main containers
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
let Sprite = PIXI.Sprite,
    resources = PIXI.loader.resources;
// BackgroundLayer
const rect_l = 40;
let universe = new Container(),
    rect_xn = WIDTH_CUT / rect_l,
    rect_yn = HEIGHT_CUT / rect_l,
    rect_vl = rect_l * RATIO[0];
// AirplaneLayer
const ap_length = 120;
let airplane = new Container(),
    ap_body,
    ap_arrow;

//////// init functions
let img_url = "/static/view/imgs/",
    img_ap_body = img_url + "ap_body.png",
    img_ap_arrow = img_url + "ap_arrow.png";
export function initView(callback) {
    // load resources
    PIXI.loader
        .add(img_ap_body)
        .add(img_ap_arrow)
        .load(() => {
            initLayer(callback);
        });
}

// init layers
function initLayer(callback) {
    // init sprites
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
    
    // change sprites' state and loop render the view
    // set state playing
    state = playing;
    loopRender();
}

let  drawCrossLine = (xp, yp) => {
    let Graphics = new PIXI.Graphics;
    Graphics.lineStyle(1, 0x212121, 1);
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
    universe.x = xp;
    universe.y = yp;
};
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

let createSP = (url) => {
    let sprite = new Sprite(resources[url].texture);
    sprite.anchor.set(0.5, 0.5);
    return sprite;
};
let setSPSz = (sp, l) => {
    let rl = l * RATIO[0];
    sp.width = rl;
    sp.height = rl;
};
function initAirplane() {
    ap_body = createSP(img_ap_body);
    setSPSz(ap_body, ap_length);
    ap_body.position.set(X_CENTER, Y_CENTER);
    ap_body.rotation = 0;

    ap_arrow = createSP(img_ap_arrow);
    setSPSz(ap_arrow, ap_length);
    ap_arrow.position.set(X_CENTER, Y_CENTER);
    ap_arrow.rotation = 0;

    airplane.addChild(ap_body);
    airplane.addChild(ap_arrow);

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

//////// loop render functions
function loopRender() {
    // requestAnimationFrame(loopRender);

    resizeStandard();

    state();

    renderer.render(Stage);

    setTimeout(loopRender, stot);
}

// resize standard and canvas's size
function resizeStandard() {
    RULER[2] = 0;
    RATIO[1] = RATIO[0];
    WIDTH_LOCAL = window.innerWidth;
    HEIGHT_LOCAL = window.innerHeight;
    let W = WIDTH_LOCAL, H = HEIGHT_LOCAL, R0 = RULER[0], R1 = RULER[1];
    // let FUCK = ( (W == R0 && H < R1) || (W < R0 && H == R1) || (W > R0 && H > R1) || (W < R0 && H < R1) || (W > R0 && H < R1) || (W < R0 && H > R1)) ? true : false;
    let FUCK = ((W != R0 && H != R1) || (W == R0 && H < R1) || (W < R0 && H == R1)) ? true : false;
    if (FUCK) {
        adaptWindow();
        renderer.resize(WIDTH_VIEW, HEIGHT_VIEW);
        X_CENTER = WIDTH_VIEW / 2;
        Y_CENTER = HEIGHT_VIEW / 2;
        RATIO[0] = WIDTH_VIEW / WIDTH_CUT;
        RULER[0] = WIDTH_VIEW;
        RULER[1] = HEIGHT_VIEW;
        RULER[2] = 1;
    }
}

// catch the changed sprites and reset them
function playing() {
    // reset sprites
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
    if (RULER[2] === 1) {
        universe.removeChildren();
        rect_vl = rect_l * RATIO[0];
        drawCrossLine(universe.x / RATIO[1] * RATIO[0], universe.y / RATIO[1] * RATIO[0]);
    }

    universe.x += 81 * RATIO[0];
    universe.y -= 1 * RATIO[0];

    if (universe.x < -2 * rect_vl || universe.x > 0) {
        universe.x = -rect_vl + (universe.x % rect_vl);
    }
    if (universe.y < -2 * rect_vl || universe.y > 0) {
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
    if (RULER[2] === 1) {
        setSPSz(ap_body, ap_length);
        ap_body.position.set(X_CENTER, Y_CENTER);

        setSPSz(ap_arrow, ap_length);
        ap_arrow.position.set(X_CENTER, Y_CENTER);
    }
}

function rstRedBullet() {
}

function rstBlueBullet() {
}

function rstEffect() {
}

function rstUI() {
}

/* view.js ends here */
