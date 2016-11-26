/* view.js
 *
 * Maintainer: Neoco
 * Email: Neoco.wlp1002@gmail.com
 */

//////// import modules
import * as PIXI from "./pixi.js";

//////// global variables
// init standard size 
let HEIGHT_LOCAL = window.innerHeight,
    WIDTH_LOCAL = window.innerWidth,
    X_CENTER = WIDTH_LOCAL / 2,
    Y_CENTER = HEIGHT_LOCAL / 2;
// init renderer
let renderer = PIXI.autoDetectRenderer(
    WIDTH_LOCAL, 
    HEIGHT_LOCAL, 
    {backgroundColor: 0x141414}
);
renderer.view.id = "canvas";
renderer.view.height = HEIGHT_LOCAL;
renderer.view.width = WIDTH_LOCAL;
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


//////// init functions
export function initView() {
    // load resources
    PIXI.loader
        .add("/static/view/pics/ufo.json")
        .load(initLayer);

}

// init layers
function initLayer() {
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

    // change sprites' state and loop render the view
    // set state playing
    state = playing;
    loopRender();
}

function initBackground() {
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
    requestAnimationFrame(loopRender);

    resizeStandard();

    state();

    renderer.render(Stage);
}

// resize standard and canvas's size
function resizeStandard() {
    HEIGHT_LOCAL = window.innerHeight;
    WIDTH_LOCAL = window.innerWidth;
    X_CENTER = WIDTH_LOCAL / 2;
    Y_CENTER = HEIGHT_LOCAL / 2;
    renderer.height = HEIGHT_LOCAL;
    renderer.width = WIDTH_LOCAL;
    renderer.view.height = HEIGHT_LOCAL;
    renderer.view.width = WIDTH_LOCAL;
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
