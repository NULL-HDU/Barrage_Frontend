import PIXI from "../view/pixi.js";
import gamemodel from "../model/gamemodel.js";
import ProtoPics from "../view/images/PrototypeIII.png";

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

// Game state
let state;

// Export for engine/handle_user_input.js
let renderer = autoDetectRenderer(localW, localH);
export function playGame() {
    document.body.appendChild(renderer.view);
    loader
        .add("src/view/images/PrototypeIII.json")
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

    id = resources["src/view/images/PrototypeIII.json"].textures;

    state = play;

    // Loop rendering
    loopRendering();
}

// Loop render the scenes
function loopRendering() {
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
    AirplaneSelf.body = new Sprite(id["SelfBody.png"]);
    AirplaneSelf.arrow = new Sprite(id["SelfArrow.png"]);

    let information = gamemodel.data.engineControlData.airPlane;
    let x = information.locationCurrent.x,
        y = information.locationCurrent.y,
        r = information.attackDir;
    
    // AirplaneSelf.x = x;
    // AirplaneSelf.y = y;
    AirplaneSelf.body.x = CenterW;
    AirplaneSelf.body.y = CenterH;
    AirplaneSelf.body.anchor.set(0.5, 0.5);
    
    AirplaneSelf.arrow.x = CenterW;
    AirplaneSelf.arrow.y = CenterH;
    AirplaneSelf.arrow.anchor.set(0.5, 0.5);
    AirplaneSelf.arrow.rotation = r;
    
    selfView.addChild(AirplaneSelf.arrow);
    selfView.addChild(AirplaneSelf.body);
    
    return [x , y];
}

// Render enemies
function renderEnemyAirplanes(pos) {
    enemies = gamemodel.data.backendControlData.airPlane;

    for (let i = 0; i < enemies.length; i ++) {
        let AirplaneEnemy = {};
        AirplaneEnemy.body = new Sprite(id["EnemyBody.png"]);
        AirplaneEnemy.arrow = new Sprite(id["EnemyArrow.png"]);
       
        let x = enemies[i].locationCurrent.x,
            y = enemies[i].locationCurrent.y,
            r = enemies[i].attackDir;
       
        x = centerSelfAirplane(x, pos[0], CenterW);
        y = centerSelfAirplane(y, pos[1], CenterH);
       
        AirplaneEnemy.body.x = x;
        AirplaneEnemy.body.y = y;
        AirplaneEnemy.body.anchor.set(0.5, 0.5);
       
        AirplaneEnemy.arrow.x = x;
        AirplaneEnemy.arrow.y = y;
        AirplaneEnemy.arrow.anchor.set(0.5, 0.5);
        AirplaneEnemy.arrow.rotation = r;
       
        enemyView.addChild(AirplaneEnemy.arrow);
        enemyView.addChild(AirplaneEnemy.body);
    }
}

// Render the bullets
function renderBullets(pos) {
    // Enemy bullets
    EnemyBullets = gamemodel.data.backendControlData.bullet;
    
    for (let i = 0; i < EnemyBullets.length; i ++) {
        let bullet = new Sprite(id["RedBullet.png"]);
        let x = EnemyBullets[i].locationCurrent.x,
            y = EnemyBullets[i].locationCurrent.y,
            r = EnemyBullets[i].attackDir;
        
        x = centerSelfAirplane(x, pos[0], CenterW);
        y = centerSelfAirplane(y, pos[1], CenterH);
        
        bullet.x = x;
        bullet.y = y;
        bullet.anchor.set(0.5, 0.5);
        bullet.rotation = r;
        
        bulletView.addChild(bullet);
    }

    // Self bullets
    SelfBullets = gamemodel.data.engineControlData.bullet;
    
    for (let i = 0; i < SelfBullets.length; i ++) {
        let bullet = new Sprite(id["GreenBullet.png"]);
        let x = SelfBullets[i].locationCurrent.x,
            y = SelfBullets[i].locationCurrent.y,
            r = SelfBullets[i].attackDir;
       
        x = centerSelfAirplane(x, pos[0], CenterW);
        y = centerSelfAirplane(y, pos[1], CenterH);
       
        bullet.x = x;
        bullet.y = y;
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
