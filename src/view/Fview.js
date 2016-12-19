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
let CUT = {
    width : 1280, 
    height: 800,
    special: {
        width: 1280 * 2,
        height: 800 * 2
    }
};

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
    ratio: 1, // the ratio of view to cut
    pre: {ratio: 1},
    flag: false // is the view changed?
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
    VIEW.pre.ratio = VIEW.ratio;
    VIEW.ratio = VIEW.width / CUT.width;
    VIEW.flag = true;
};

// center canvas
let centerCanvas = () => {
    VIEW.side.left = (LOCAL.width - VIEW.width) / 2;
    VIEW.side.top = (LOCAL.height - VIEW.height) / 2;
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
    if (ORIGIN.airplane === null || ORIGIN.airplane === undefined) {
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
    object.width = size * VIEW.ratio;
    object.height = size * VIEW.ratio;
};
let setObjectPosition = (object, x_ori, y_ori) => {
    object.x = (x_ori - AIRPLANE.x) * VIEW.ratio + VIEW.center.x; 
    object.y = (y_ori - AIRPLANE.y) * VIEW.ratio + VIEW.center.y;
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
    square.view_length = square.const_length * VIEW.ratio;
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
    size: 0,
    pre: {x: 0, y:0},
    flag: true // first read the data ?
};

// maps
let BlueBullet = {
    visible: null,
    invisible: null
};

let RedBullet = {
    visible: null,
    invisible: null
};

let Enemy = {
    visible: null,
    invisible: null
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

    // set maps
    BlueBullet.visible = new Map();
    BlueBullet.invisible = new Map();
    RedBullet.visible = new Map();
    RedBullet.invisible = new Map();
    Enemy.visible = new Map();
    Enemy.invisible = new Map();


    STATE = play;

    // socket dealinfo and engine init
    callback();
}

// export for engine to use less setTimeout
export function loopRender() {
    resizeView();
    STATE(); 
    renderer.render(Stage);

    // cleanCache
    MODEL.deadCache = [];
    MODEL.disappearCache = [];
    MODEL.collisionCache = [];
}

function resizeView() {
    getLocalSize();
    if (isLocalSizeChanged()) {
        if (!isViewFitLocal()) {
            adjustView();
            renderer.resize(VIEW.width, VIEW.height);
        } else {
            VIEW.flag = false;
        }
        centerCanvas();
    } else {
        VIEW.flag = false;
    }
}

function play () {
    setAirplane();
    setBackground();
    setBalls(ORIGIN.blue_bullets, BlueBullet, BlueBulletLayer, bulletSkins, 0, getBlueBulletInfo);
}

let setAirplane = () => {
    if (getAirplaneInfo()) {
        // copy info to view's data
        if (AIRPLANE.flag === true) {
            AIRPLANE.pre.x = ORIGIN.airplane.locationCurrent.x;
            AIRPLANE.pre.y = ORIGIN.airplane.locationCurrent.y;
            AIRPLANE.flag = false;
        } else {
            AIRPLANE.pre.x = AIRPLANE.x;
            AIRPLANE.pre.y = AIRPLANE.y;
        }
        AIRPLANE.x = ORIGIN.airplane.locationCurrent.x;
        AIRPLANE.y = ORIGIN.airplane.locationCurrent.y;
        AIRPLANE.r = ORIGIN.airplane.attackDir;

        // create airplane
        if (AIRPLANE.self === null || AIRPLANE.self === undefined) {
            let con = new Container();
            let skin = airplaneSkins[ORIGIN.airplane.skinId].skin,
                camp = airplaneSkins[ORIGIN.airplane.skinId].camp[0];
            con.addChild(createSprite(camp));
            for (let i = 0; i < skin.length; i ++) {
                con.addChild(createSprite(skin[i]));
            }
            setObjectSize(con, airplaneSkins[ORIGIN.airplane.skinId].skin_radius * 2);
            con.position.set(VIEW.center.x, VIEW.center.y);
            con.rotation = AIRPLANE.r;
            AIRPLANE.self = con;
            AirplaneLayer.addChild(AIRPLANE.self);
        }
        
        // reset the state of the airplane
        if (AIRPLANE.self.visible === false) {
            AIRPLANE.self.visible = true;
        }
        AIRPLANE.self.rotation = AIRPLANE.r;

        // is the view size changed ?
        if (VIEW.flag === true) {
            setObjectSize(AIRPLANE.self, airplaneSkins[ORIGIN.airplane.skinId].skin_radius * 2);
            AIRPLANE.self.position.set(VIEW.center.x, VIEW.center.y);
        }
    } else {
        // if airplane dead , it will be hide in the dark
        if (AIRPLANE.self !== null || AIRPLANE.self !== undefined) {
            AIRPLANE.self.visible = false;
            AIRPLANE.flag = true;
        }
    }
};

let setBackground = () => {
    if (VIEW.flag === true) {
        setSquare();
        let trans = VIEW.ratio / VIEW.pre.ratio;
        drawBackground(universe.x * trans, universe.y * trans);
    }

    universe.x += -(AIRPLANE.x - AIRPLANE.pre.x) * VIEW.ratio;
    if (universe.x < 2 * square.view_length || universe.x > 0) {
        universe.x = - square.view_length + (universe.x % square.view_length);
    }

    universe.y += -(AIRPLANE.y - AIRPLANE.pre.y) * VIEW.ratio;
    if (universe.y < 2 * square.view_length || universe.y > 0) {
        universe.y = - square.view_length + (universe.y % square.view_length);
    }
};

// info : the origin data array
// map : visible and invisible
// type: bullet or enemy
// func: the getinfo func
// skin: 
let setBalls = (origin, map, layer, skin, camp, getinfo) => {
    if (getinfo()){
        // new visible map
        let visible = new Map();

        // console.log("origin: " + origin.length)
        for (let i = 0; i < origin.length; i ++) {
            // data
            let skinId = origin[i].skinId;
            let radius = skin[skinId].skin_radius;
            let x = origin[i].locationCurrent.x,
                y = origin[i].locationCurrent.y,
                r = origin[i].attackDir;

            // range
            let left = AIRPLANE.x - (CUT.width + radius) / 2,
                right = AIRPLANE.x + (CUT.width + radius) / 2,
                top =  AIRPLANE.y - (CUT.height + radius) / 2,
                bottom = AIRPLANE.y + (CUT.height + radius) / 2;

            let id = origin[i].userId << 16 + origin[i].id;

            if (x > left && x < right && y > top && y < bottom) {
                if (map.visible.get(id) !== undefined) {
                    visible.set(id, map.visible.get(id));
                    map.visible.delete(id);
                    updateBall(visible.get(id), x, y, r, radius * 2);
                } else if ( 
                    map.invisible.get(skinId) !== undefined &&
                    map.invisible.get(skinId).length !== 0
                ) {
                    visible.set(id, map.invisible.get(skinId).pop());
                    updateBall(visible.get(id), x, y, r, radius * 2);
                    visible.get(id).visible = true;
                } else if (
                    map.visible.get(id) === undefined &&
                    (map.invisible.get(skinId) === undefined || map.invisible.get(skinId).length === 0 ) 
                )  {
                    let con = new Container();
                    let _skin = skin[skinId].skin,
                        _camp = skin[skinId].camp[camp];
                    for (let j = 0; j < _skin.length; j ++) {
                        con.addChild(createSprite(_skin[j]));
                    }
                    con.addChild(createSprite(_camp));

                    visible.set(id, con);
                    setObjectPosition(visible.get(id), x, y);
                    visible.get(id).rotation = r;
                    setObjectSize(visible.get(id), radius * 2);

                    // add self skinId
                    visible.get(id).mySkinId = skinId;
                    layer.addChild(visible.get(id));
                    // console.log("new :" + count++)
                }
            }
        }
        // console.log("visible: " + visible.size);
        /// deal the new visible and the old vsible
        if (map.visible.size > 0) {
            for (let value of map.visible.values()) {
                let mySkinId = value.mySkinId;
                if (map.invisible.get(mySkinId) === undefined) {
                    map.invisible.set(mySkinId, []);
                }
                value.visible = false;
                map.invisible.get(mySkinId).push(value);
                // console.log(" map invisible: " + map.invisible.get(mySkinId).length);
            }
        }

        map.visible.clear();
        map.visible = visible;
        // console.log(map.visible.size);
        // console.log(" map visible: " + map.visible.size);

    } else {
        if (map.visible.size > 0) {
            for (let value of map.visible.values()) {
                let mySkinId = value.mySkinId;
                if (map.invisible.get(mySkinId) === undefined) {
                    map.invisible.set(mySkinId, []);
                }
                value.visible = false;
                map.invisible.get(mySkinId).push(value);
            }
        }
        map.visible.clear();
    }
};

let updateBall = (object, x, y, r, size) => {
    setObjectPosition(object, x, y);
    object.rotation = r;
    if (VIEW.flag === true) {
        setObjectSize(object, size);
    }
};
