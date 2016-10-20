import PIXI from "../view/pixi.js";
import gamemodel from "../model/gamemodel.js";
import ProtoPics from "../view/images/Prototype.png";

// Alias for PIXI
let autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

// Export for engine/handle_user_input.js
let renderer = autoDetectRenderer(localW, localH);
export function playGame() {
    document.body.appendChild(renderer.view);
    loader
        .add("src/view/images/Prototype.json")
        .on("progress", loadProgressHandler)
        .load(renderGame);
}

// Handle when loading the resources
function loadProgressHandler() {
    console.log("loading");
}

// renderGame with state
function renderGame() {
    // Pic json
    let id = resources["src/view/images/Prototype.json"].textures;
    
    // Used in game
    let stage = new Container();
    let uiView = new Container(),
        selfView = new Container(),
        enemyView = new Container(),
        bulletView = new Container(),
        resourceView = new Container(),
        obstacleView = new Container();

    let AirplaneSelf, enemies, SelfBullets, EnemyBullets, resources, obstacles; 

    // Alias about local
    let localH = window.screen.height,
        localW = window.screen.width,
        ;

    // Game state
    let state = play;

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
    // Remove the old sprites
    stage.removeChildren();

    // Add the new sprites
    renderObstacles();
    renderResouces();
    renderBullets();
    renderEnemyAirplanes();
    renderSelfAirplane();
    renderUI();

    stage.addChild(obstacleView);
    stage.addChild(resourceView);
    stage.addChild(bulletView);
    stage.addChild(enemyView);
    stage.addChild(selfView);
    stage.addChild(uiView);
}

// Render the UI
function renderUI() {

}

// Render things about selfairplane
// Such as name, hp, damage, speed
function renderSelfAirplane() {
    AirplaneSelf = new Sprite(id["Airplane-Self.png"]);
    let information = gamemodel.data.engineControlData.airPlane;
    let x = information.locationCurrent.x,
        y = information.locationCurrent.y,
        r = information.attackDir;
    AirplaneSelf.x = x;
    AirplaneSelf.y = y;
    AirplaneSelf.anchor.set(0.5, 0.5);
    AirplaneSelf.rotation = r;
    selfView.addChild(AirplaneSelf);
}

// Render enemies
function renderEnemyAirplanes() {
    enemies = gamemodel.data.backendControlData.airPlane;
    for (let i = 0; i < enemies.length; i ++) {
        let AirplaneEnemy = new Sprite(id["Airplane-Enemy.png"]);
        let x = enemies[i].locationCurrent.x,
            y = enemies[i].locationCurrent.y,
            r = enemies[i].attackDir;
        AirplaneEnemy.x = x;
        AirplaneEnemy.y = y;
        AirplaneEnemy.anchor.set(0.5, 0.5);
        AirplaneEnemy.rotation = r;
        enemyView.addChild(AirplaneEnemy);
    }
}

// Render the bullets
function renderBullets() {
    // Enemy bullets
    EnemyBullets = gamemodel.data.backendControlData.bullet;
    for (let i = 0; i < EnemyBullets.length; i ++) {
        let bullet = new Sprite(id["Bullet-Harmful.png"]);
        let x = SelfBullets[i].locationCurrent.x,
            y = SelfBullets[i].locationCurrent.y;
        bullet.x = x;
        bullet.y = y;
        bullet.anchor.set(0.5, 0.5);
        bullet.rotation = 0;
        bulletView.addChild(bullet);
    }

    // Self bullets
    SelfBullets = gamemodel.data.engineControlData.bullet;
    for (let i = 0; i < SelfBullets.length; i ++) {
        let bullet = new Sprite(id["Bullet-Harmless.png"]);
        let x = SelfBullets[i].locationCurrent.x,
            y = SelfBullets[i].locationCurrent.y;
        bullet.x = x;
        bullet.y = y;
        bullet.anchor.set(0.5, 0.5);
        bullet.rotation = 0;
        bulletView.addChild(bullet);
    }

}

// Render resources
function renderResouces() {

}

// Render obstacles
function renderObstacles() {

} 
