import * as PIXI from "./pixi.js";
import MODEL from "../model/gamemodel.js";
import {
    IMAGES,
    bulletSkins,
    airplaneSkins
} from "../resource/skin/skin.js";
import {
    EVA01_AIRPLANE,
    MIN_BULLET
} from "../resource/skin/skinId.js";

// pixi alias
const loader = PIXI.loader,
    resources = PIXI.loader.resources,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

let renderer;

// cut siz
const CUT = {width : 1280, height: 800};

// local size
let LOCAL = {
    pre : {width: 0, height: 0},
    crt: {width: 0, height: 0},
    flag: false // is the local size changed ?
};
let getLocalSize = () => {
    LOCAL.pre.width = LOCAL.crt.width;
    LOCAL.pre.height = LOCAL.crt.height;
    LOCAL.crt.width = window.innerWidth;
    LOCAL.crt.height = window.innerHeight;
};
let isLocalSizeChanged = () => {
    LOCAL.flag = (LOCAL.crt.width !== LOCAL.pre.width || LOCAL.crt.height !== LOCAL.pre.height) ? true : false;
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
        (LOCAL.crt.width !== VIEW.width && LOCAL.crt.height !== VIEW.height) ||
        (LOCAL.crt.width === VIEW.width && LOCAL.crt.height < VIEW.height) ||
        (LOCAL.crt.width < VIEW.width && LOCAL.crt.height === VIEW.height)
    ) {
        return false;
    } else {
        return true;
    }
};
let adjustView = () => {
    let w = LOCAL.crt.width / CUT.width, h = LOCAL.crt.height / CUT.height;
    let r = (w <= h) ? w : h;

    VIEW.width = CUT.width * r;
    VIEW.height = CUT.height * r;
    VIEW.center.x = VIEW.width / 2;
    VIEW.center.y = VIEW.height / 2;
    VIEW.side.left = (LOCAL.crt.width - VIEW.width) / 2;
    VIEW.side.top = (LOCAL.crt.height - VIEW.height) / 2;
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
};
let getEnemysInfo = () => {
    ORIGIN.enemys = MODEL.data.backendControlData.airPlane;
};
let getRedBulletInfo = () => {
    ORIGIN.red_bullets = MODEL.data.backendControlData.bullet;
};
let getBlueBulletInfo = () => {
    ORIGIN.blue_bullets = MODEL.data.engineControlData.bullet;
};

// background
let universe = new Container();
let square = {
    const_length: 80,
    x_count: 0,
    y_count: 0,
    view_length: 0
};
let serSquare = () => {
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



export function initView(callback) {
    loader
        .add(IMAGES)
        .load(() => {
            initLayers(callback);
        });
} 
