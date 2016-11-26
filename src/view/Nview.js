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


//////// init function
export function initView () {
    // load resources
    PIXI.loader
        .add("/static/view/pics/ufo.json")
        .load(initLayer);

}

//////// init layers
function initLayer () {

    console.log("setup!");
}

//////// resize standard and canvas's size
function rszStandard() {
    HEIGHT_LOCAL = window.innerHeight;
    WIDTH_LOCAL = window.innerWidth;
    X_CENTER = WIDTH_LOCAL / 2;
    Y_CENTER = HEIGHT_LOCAL / 2;
    renderer.height = HEIGHT_LOCAL;
    renderer.width = WIDTH_LOCAL;
    renderer.view.height = HEIGHT_LOCAL;
    renderer.view.width = WIDTH_LOCAL;
}

/* view.js ends here */
