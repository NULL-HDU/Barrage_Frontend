/* view.js --- used to render the canvas with rich pics
 *
 * Maintainer: Neoco
 * Email: Neoco.wlp1002@gmail.com
 */

import PIXI from "../view/pixi.js";
import Prototype from "../view/images/Prototype.png";

// Global Alias
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    // resources = PIXI.loader.resources,
    // TextureCache = PIXI.utils.TextureCache,
    // Texture = PIXI.Texture,
    Sprite = PIXI.Sprite;
    // Text = PIXI.Text,
    // Graphics = PIXI.Graphics;

let stage = new Container(),
    renderer = autoDetectRenderer(1280, 705);

// export for engine/handle_user_input.js
export function initScenes() {
    document.body.appendChild(renderer.view);
    loader
        .add("src/view/images/Prototype.json")
        .load(setup);
}

function setup() {
    console.log("hi!");
}

/*view.js ends here*/
