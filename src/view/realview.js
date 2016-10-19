import PIXI from "../view/pixi.js";
import gamemodel from "../model/gamemodel.js";
import ProtoPics from "../view/images/Prototype.png";

// Alias for PIXI
let autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite,
    ;

// Alias about local
let localH = window.screen.height,
    localW = window.screen.width,
    ;

// Export for engine/handle_user_input.js
let renderer = autoDetectRenderer(localW, localH);
export function playGame() {
    document.body.appendChild(renderer.view);
    loader
        .add("src/view/images/Prototype.json")
        .on("progress", loadProgressHandler)
        .load(initScenes);
}

// Handle when loading the resources
function loadProgressHandler() {
    console.log("loading");
}

