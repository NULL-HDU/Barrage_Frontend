import * as PIXI from "../view/pixi.js";
import gamemodel from "../model/gamemodel.js";

// Imags
let ProtoJ = "/static/view/pics/ufo.json";

// Alias for PIXI
let autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

// Alias about local
let localH = window.screen.height,
    localW = window.screen.width,
    CenterH = localH / 2,
    CenterW = localW / 2;

// Pic json
let id; 

// Used in game
let stage;
let uiView,selfView, enemyView, bulletView, resourceView, obstacleView;
let AirplaneSelf, enemies, SelfBullets, EnemyBullets, GameResources, obstacles; 
let timeC, timeR;

// Game state
let state;

// Export for engine/handle_user_input.js
let renderer = autoDetectRenderer(localW, localH);
renderer.backgroundColor = 0xf5f5f5;
renderer.view.id = "canvas";

export function playGame() {
    document.body.appendChild(renderer.view);
    loader
        .add(ProtoJ)
        .on("progress", loadProgressHandler)
        .load(renderGame);
}

// Handle when loading the resources
function loadProgressHandler() {
    console.log("loading");
}

// renderGame with state
function renderGame() {

    stage = new Container();
    uiView = new Container();
    selfView = new Container();
    enemyView = new Container();
    bulletView = new Container();
    resourceView = new Container();
    obstacleView = new Container();

    id = resources[ProtoJ].textures;

    state = play;

    timeC = 0;

    // Loop rendering
    loopRendering();
}

// Loop render the scenes
function loopRendering() {
    timeC += 1 / 4;
    if (timeC > 60) {
        timeC -= 60;
    }

    timeR = 2 * 3.1415926 * timeC / 60;

    requestAnimationFrame(loopRendering);
    state();
    renderer.render(stage);
}

function play() {
    // Remove old children
    obstacleView.removeChildren();
    resourceView.removeChildren();
    bulletView.removeChildren();
    enemyView.removeChildren();
    selfView.removeChildren();
    uiView.removeChildren();
    stage.removeChildren();

    // Add the new sprites
    let pos = renderSelfAirplane();
    renderUI();
    renderEnemyAirplanes(pos);
    renderBullets(pos);
    renderResouces();
    renderObstacles();

    stage.addChild(obstacleView);
    stage.addChild(enemyView);
    stage.addChild(selfView);
    stage.addChild(bulletView);
    stage.addChild(resourceView);
    stage.addChild(uiView);
}

// Render the UI
function renderUI() {

}

// Render things about selfairplane
// Such as name, hp, damage, speed
function renderSelfAirplane() {
    AirplaneSelf = {};
    AirplaneSelf.body = new Sprite(id["ufo_blue_body.png"]);
    AirplaneSelf.gun = new Sprite(id["ufo_blue_gun.png"]);
    AirplaneSelf.man = new Sprite(id["ufo_blue_man.png"]);
    AirplaneSelf.co = new Sprite(id["ufo_blue_co.png"]);

    let information = gamemodel.data.engineControlData.airPlane;
    let x = information.locationCurrent.x,
        y = information.locationCurrent.y,
        r = information.attackDir;
    
    // AirplaneSelf.x = x;
    // AirplaneSelf.y = y;
    AirplaneSelf.body.x = CenterW;
    AirplaneSelf.body.y = CenterH;
    AirplaneSelf.body.scale.set(0.5,0.5);
    AirplaneSelf.body.anchor.set(0.5, 0.5);
    AirplaneSelf.body.rotation = timeR;
    
    AirplaneSelf.co.x = CenterW;
    AirplaneSelf.co.y = CenterH;
    AirplaneSelf.co.scale.set(0.5,0.5);
    AirplaneSelf.co.anchor.set(0.5, 0.5);
    
    AirplaneSelf.gun.x = CenterW;
    AirplaneSelf.gun.y = CenterH;
    AirplaneSelf.gun.scale.set(0.5,0.5);
    AirplaneSelf.gun.anchor.set(0.5, 0.5);
    AirplaneSelf.gun.rotation = r;
    
    AirplaneSelf.man.x = CenterW;
    AirplaneSelf.man.y = CenterH;
    AirplaneSelf.man.scale.set(0.5,0.5);
    AirplaneSelf.man.anchor.set(0.5, 0.5);
    AirplaneSelf.man.rotation = r;

    selfView.addChild(AirplaneSelf.gun);
    selfView.addChild(AirplaneSelf.body);
    selfView.addChild(AirplaneSelf.man);
    selfView.addChild(AirplaneSelf.co);
    
    return [x , y];
}

// Render enemies
function renderEnemyAirplanes(pos) {
    enemies = gamemodel.data.backendControlData.airPlane;

    for (let i = 0; i < enemies.length; i ++) {
        let AirplaneEnemy = {};
        AirplaneEnemy.body = new Sprite(id["ufo_red_body.png"]);
        AirplaneEnemy.co = new Sprite(id["ufo_red_co.png"]);
        AirplaneEnemy.gun = new Sprite(id["ufo_red_gun.png"]);
        AirplaneEnemy.man = new Sprite(id["ufo_red_man.png"]);
       
        let x = enemies[i].locationCurrent.x,
            y = enemies[i].locationCurrent.y,
            r = enemies[i].attackDir;
       
        x = centerSelfAirplane(x, pos[0], CenterW);
        y = centerSelfAirplane(y, pos[1], CenterH);
       
        AirplaneEnemy.body.x = x;
        AirplaneEnemy.body.y = y;
        AirplaneEnemy.body.scale.set(0.5,0.5);
        AirplaneEnemy.body.anchor.set(0.5, 0.5);
        AirplaneEnemy.body.rotation = timeR;
       
        AirplaneEnemy.co.x = x;
        AirplaneEnemy.co.y = y;
        AirplaneEnemy.co.scale.set(0.5,0.5);
        AirplaneEnemy.co.anchor.set(0.5, 0.5);
       
        AirplaneEnemy.man.x = x;
        AirplaneEnemy.man.y = y;
        AirplaneEnemy.man.scale.set(0.5,0.5);
        AirplaneEnemy.man.anchor.set(0.5, 0.5);
        AirplaneEnemy.man.rotation = r;
       
        AirplaneEnemy.gun.x = x;
        AirplaneEnemy.gun.y = y;
        AirplaneEnemy.gun.scale.set(0.5,0.5);
        AirplaneEnemy.gun.anchor.set(0.5, 0.5);
        AirplaneEnemy.gun.rotation = r;
       
        enemyView.addChild(AirplaneEnemy.gun);
        enemyView.addChild(AirplaneEnemy.body);
        enemyView.addChild(AirplaneEnemy.man);
        enemyView.addChild(AirplaneEnemy.co);
    }
}

// Render the bullets
function renderBullets(pos) {
    // Enemy bullets
    EnemyBullets = gamemodel.data.backendControlData.bullet;
    
    for (let i = 0; i < EnemyBullets.length; i ++) {
        let bullet = new Sprite(id["b_red.png"]);
        let x = EnemyBullets[i].locationCurrent.x,
            y = EnemyBullets[i].locationCurrent.y,
            r = EnemyBullets[i].attackDir;
        
        x = centerSelfAirplane(x, pos[0], CenterW);
        y = centerSelfAirplane(y, pos[1], CenterH);
        
        bullet.x = x;
        bullet.y = y;
        bullet.scale.set(0.5, 0.5);
        bullet.anchor.set(0.5, 0.5);
        bullet.rotation = r;
        
        bulletView.addChild(bullet);
    }

    // Self bullets
    SelfBullets = gamemodel.data.engineControlData.bullet;
    
    for (let i = 0; i < SelfBullets.length; i ++) {
        let bullet = new Sprite(id["b_blue.png"]);
        let x = SelfBullets[i].locationCurrent.x,
            y = SelfBullets[i].locationCurrent.y,
            r = SelfBullets[i].attackDir;
       
        x = centerSelfAirplane(x, pos[0], CenterW);
        y = centerSelfAirplane(y, pos[1], CenterH);
       
        bullet.x = x;
        bullet.y = y;
        bullet.scale.set(0.5, 0.5);
        bullet.anchor.set(0.5, 0.5);
        bullet.rotation = r;
       
        bulletView.addChild(bullet);
    }

}

// Render resources
function renderResouces() {

}

// Render obstacles
function renderObstacles() {

} 

// Calculate the locall x and y of balls depending on selfairplane
// v 1.0, just +-
function centerSelfAirplane (pre, selfAir, center) {
    return pre - selfAir + center;
}
