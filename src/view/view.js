/* view.js --- used to render the canvas with rich pics
 *
 * Maintainer: Neoco
 * Email: Neoco.wlp1002@gmail.com
 */

import PIXI from "../view/pixi.js";
import gamemodel from "../model/gamemodel.js"
import Gameglobal from "../engine/global.js"
import Prototype from "../view/images/Prototype.png";


var test = 2;        //0 for view,1 for engine,2 for socket
// Global alias
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

let stage = new Container(),
    renderer = autoDetectRenderer(window.screen.width, window.screen.height);

// Export for engine/handle_user_input.js
export function initScenes() {
    document.body.appendChild(renderer.view);
      loader
        .add("src/view/images/Prototype.json")
        .load(setup);
}

let airplane, enemies, bullets, obstacles, Xresources,
    id,
    state;

let Hcenter = Gameglobal.LOCAL_HEIGHT / 2,
    Wcenter = Gameglobal.LOCAL_WIDTH / 2;

function setup() {
    id = resources["src/view/images/Prototype.json"].textures;

    // Create the selfairplane
    airplane = new Sprite(id["Airplane-Self.png"]);
    airplane.position.set(Hcenter, Wcenter);
    airplane.anchor.set(0.5, 0.5);
    airplane.rotation = 0;
    stage.addChild(airplane);

    state = play;
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    state();
    renderer.render(stage);
}

function play() {
    var airplaneInfo = gamemodel.data.engineControlData.airPlane;
    if( test==0 )
        console.log(airplaneInfo);
    var x = airplaneInfo.locationCurrent.x,
        y = airplaneInfo.locationCurrent.y,
        ro = airplaneInfo.attackDir;
    airplane.x = x;
    airplane.y = y;
    airplane.rotation = ro;
    
}

function setPositon(sprite, x, y) {

}

/*view.js ends here*/
