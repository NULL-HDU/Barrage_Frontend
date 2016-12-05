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
let FPS = 60,
    stot = 1000/ FPS;
// cut view
let HEIGHT_CUT = 800, WIDTH_CUT = 1280;
// init standard size 
let HEIGHT_LOCAL = window.innerHeight,
    WIDTH_LOCAL = window.innerWidth,
    X_CENTER = WIDTH_LOCAL / 2,
    Y_CENTER = HEIGHT_LOCAL / 2,
    X_RATIO = WIDTH_LOCAL / WIDTH_CUT,
    Y_RATIO = HEIGHT_LOCAL / HEIGHT_CUT,
    // remember last size
    RULER = [WIDTH_LOCAL, HEIGHT_LOCAL, 0, 0];
// size of airplane and enemy
let SIZE_PLANE = 120;

// init renderer
let renderer = PIXI.autoDetectRenderer(
    WIDTH_LOCAL, 
    HEIGHT_LOCAL, 
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
let universe = new Container(),
    rect_l = 40,
    rect_xn = WIDTH_CUT / rect_l,
    rect_yn = HEIGHT_CUT / rect_l,
    rect_xl = WIDTH_LOCAL / rect_xn,
    rect_yl = HEIGHT_LOCAL / rect_yn;
// AirplaneLayer
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
            let x = j * rect_xl,
                y = i * rect_yl;
            Graphics.drawRect(x, y, rect_xl, rect_yl);
        }
    }
    Graphics.endFill();
    
    universe.addChild(Graphics);
    universe.x = xp;
    universe.y = yp;
};
function initBackground() {
    drawCrossLine(-rect_xl, -rect_yl);

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

let createSP = (url, size) => {
    let sprite = new Sprite(resources[url].texture);
    sprite.width = size * X_RATIO;
    sprite.height = size * Y_RATIO;
    sprite.anchor.set(0.5, 0.5);
    return sprite;
}
let putSP = (sp, x, y, r) => {
    sp.x = x;
    sp.y= y;
    sp.rotation = r;
}
function initAirplane() {
    ap_body = createSP(img_ap_body, SIZE_PLANE);
    ap_arrow = createSP(img_ap_arrow, 160);

    putSP(ap_body, X_CENTER, Y_CENTER, 0);
    putSP(ap_arrow, X_CENTER, Y_CENTER, 0);

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
    RULER[3] = 0;
    WIDTH_LOCAL = window.innerWidth;
    HEIGHT_LOCAL = window.innerHeight;
    let W = (WIDTH_LOCAL !== RULER[0]) ? true : false;
    let H = (HEIGHT_LOCAL !== RULER[1]) ? true : false;
    if (W || H) {
        renderer.resize(WIDTH_LOCAL, HEIGHT_LOCAL);
    }
    if (W) {
        X_CENTER = WIDTH_LOCAL / 2;
        X_RATIO = WIDTH_LOCAL / WIDTH_CUT;
        rect_xl = WIDTH_LOCAL / rect_xn;
        RULER[0] = WIDTH_LOCAL;
        RULER[2] = 1;
    }
    if (H) {
        Y_CENTER = HEIGHT_LOCAL / 2;
        Y_RATIO = HEIGHT_LOCAL / HEIGHT_CUT;
        rect_yl = HEIGHT_LOCAL / rect_yn;
        RULER[1] = HEIGHT_LOCAL;
        RULER[3] = 1;
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
    if (RULER[2] === 1 || RULER[3] === 1) {
        universe.removeChildren();
        drawCrossLine(universe.x * X_RATIO, universe.y * Y_RATIO);
    }

    universe.x += 81 * X_RATIO;
    universe.y -= 1 * Y_RATIO;

    if (universe.x < -2 * rect_xl || universe.x > 0) {
        universe.x = -rect_xl + (universe.x % rect_xl);
    }
    if (universe.y < -2 * rect_yl || universe.y > 0) {
        universe.y = -rect_yl + (universe.y % rect_yl);
    }
}

function rstObstacle() {
}

function rstResource() {
}

function rstEnemy() {
}

function rstAirplane() {
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
