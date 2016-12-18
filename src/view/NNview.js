import * as PIXI from "./pixi.js";
import MODEL from "../model/gamemodel.js";
import {
    IMAGES,
    bulletSkins,
    airplaneSkins
} from "../resource/skin/skin.js";

// pixi alias
const loader = PIXI.loader,
    resources = PIXI.loader.resources,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;
let renderer;

// game state
let STATE;

// cut siz
const CUT = {width : 1280, height: 800};

// local size
let LOCAL = {
    width: 0, 
    height: 0,
    pre: {width: 0, height: 0},
    flag: false // is the local size changed ?
};
let getLocalSize = () => {
    LOCAL.pre.width = LOCAL.width;
    LOCAL.pre.height = LOCAL.height;
    LOCAL.width = window.innerWidth;
    LOCAL.height = window.innerHeight;
};
let isLocalSizeChanged = () => {
    LOCAL.flag = (LOCAL.width !== LOCAL.pre.width || LOCAL.height !== LOCAL.pre.height) ? true : false;
    return LOCAL.flag;
};

// view size
let VIEW = {
    width: 0,
    height: 0,
    center: {x: 0, y: 0}, // center positon of the view
    side: {left: 0, top: 0}, // view side to local window
    ratio: {pre: 1, crt: 1} // the ratio of view to cut
};
let isViewFitLocal = () => {
    if (
        (LOCAL.width !== VIEW.width && LOCAL.height !== VIEW.height) ||
        (LOCAL.width === VIEW.width && LOCAL.height < VIEW.height) ||
        (LOCAL.width < VIEW.width && LOCAL.height === VIEW.height)
    ) {
        return false;
    } else {
        return true;
    }
};
let adjustView = () => {
    let w = LOCAL.width / CUT.width, h = LOCAL.height / CUT.height;
    let r = (w <= h) ? w : h;

    VIEW.width = CUT.width * r;
    VIEW.height = CUT.height * r;
    VIEW.center.x = VIEW.width / 2;
    VIEW.center.y = VIEW.height / 2;
    VIEW.side.left = (LOCAL.width - VIEW.width) / 2;
    VIEW.side.top = (LOCAL.height - VIEW.height) / 2;
    VIEW.ratio.pre = VIEW.ratio.crt;
    VIEW.ratio.crt = VIEW.width / CUT.width;
};

// center canvas
let centerCanvas = () => {
    let canvas = document.getElementById("canvas");
    let left = VIEW.side.left + "px",
        top = VIEW.side.top + "px";
    canvas.style.margin = `${top} ${left}`;
};

// data
let ORIGIN = {
    airplane: null,
    enemys: [],
    red_bullets: [],
    blue_bullets: []
};
let getAirplaneInfo = () => {
    ORIGIN.airplane = MODEL.data.engineControlData.airPlane;
    if (ORIGIN.airPlane == null || ORIGIN.airPlane == undefined) {
        return false;
    } else {
        return true;
    }
};
let getEnemysInfo = () => {
    ORIGIN.enemys = MODEL.data.backendControlData.airPlane;
    if (ORIGIN.enemys.length === 0) {
        return false;
    } else {
        return true;
    }
};
let getRedBulletInfo = () => {
    ORIGIN.red_bullets = MODEL.data.backendControlData.bullet;
    if (ORIGIN.red_bullets.length === 0) {
        return false;
    } else {
        return true;
    }
};
let getBlueBulletInfo = () => {
    ORIGIN.blue_bullets = MODEL.data.engineControlData.bullet;
    if (ORIGIN.blue_bullets.length === 0) {
        return false;
    } else {
        return true;
    }
};

// all the objects that can be seen
let VISUAL = new Map();

// container
let Stage = new Container();
let BackgroundLayer = new Container(),
    ObstacleLayer = new Container(),
    FoodLayer = new Container(),
    EnemyLayer = new Container(),
    AirplaneLayer = new Container(),
    RedBulletLayer = new Container(),
    BlueBulletLayer = new Container(),
    EffectLayer = new Container(),
    UILayer = new Container();

// Sprite
let createSprite = (path) => {
    let sprite = new Sprite(resources[path].texture);
    sprite.anchor.set(0.5, 0.5);
    return sprite;
};
let setObjectSize = (object, size) => {
    object.width = size * VIEW.ratio.crt;
    object.height = size * VIEW.ratio.crt;
};
let setObjectPosition = (object, x_ori, y_ori) => {
    object.x = (x_ori - AIRPLANE.x) * VIEW.ratio.crt + VIEW.center.x; 
    object.y = (y_ori - AIRPLANE.y) * VIEW.ratio.crt + VIEW.center.y;
};

// background
let universe = new Container();
let square = {
    const_length: 80,
    x_count: 0,
    y_count: 0,
    view_length: 0
};
let setSquare = () => {
    square.x_count = CUT.width / square.const_length;
    square.y_count = CUT.height / square.const_length;
    square.view_length = square.const_length * VIEW.ratio.crt;
};
let drawBackground = (x_crt, y_crt) => {
    // remove old background
    universe.removeChildren();

    let part = new Graphics;
    part.lineStyle(1, 0x252525, 1);

    let i_limit = square.y_count + 2, j_limit = square.x_count + 2;
    for (let i = 0; i < i_limit; i ++) {
        for (let j = 0; j < j_limit; j ++) {
            let l = square.view_length,
                x = j * l,
                y = i * l;
            part.drawRect(x, y, l, l);
        }
    }
    part.endFill();

    universe.addChild(part);
    universe.x = x_crt;
    universe.y = y_crt;
};

// Airplane
let AIRPLANE = {
    self: null, // this shoud be the sprite or the container
    x: 0,
    y: 0,
    r: 0,
    // when airplane is dead, use this state
    pre: {
        x: 0,
        y: 0,
        r: 0
    }
};


export function initView(callback) {
    loader
        .add(IMAGES)
        .load(() => {
            initLayers(callback);
        });
} 

function initLayers(callback) {
    // set the init view size
    getLocalSize();
    adjustView();

    // set the renderer
    renderer = autoDetectRenderer(
        VIEW.width,
        VIEW.height,
        { backgroundColor: 0x000000 }
    );
    renderer.view.id = "canvas";
    document.body.appendChild(renderer.view);

    // center the canvas
    centerCanvas();

    // init every layers, at least add the container
    // first init background
    setSquare();
    drawBackground(-square.view_length, -square.view_length);
    BackgroundLayer.addChild(universe);
    Stage.addChild(BackgroundLayer);

    // others
    Stage.addChild(ObstacleLayer);
    Stage.addChild(FoodLayer);
    Stage.addChild(EnemyLayer);
    Stage.addChild(AirplaneLayer);
    Stage.addChild(RedBulletLayer);
    Stage.addChild(BlueBulletLayer);
    Stage.addChild(EffectLayer);
    Stage.addChild(UILayer);

    // socket dealinfo and engine init
    callback();
}

// export for engine to use less setTimeout
export function loopRender() {
    
}
