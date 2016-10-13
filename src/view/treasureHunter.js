/*
 *  Neoco's TreasureHunter Demo
 *
 * */

import PIXI from "../view/pixi.js"

// Global Alias
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

var stage = new Container(),
    renderer = autoDetectRenderer(512, 512);

export function initGame() {
    document.body.appendChild(renderer.view);
    loader
        .add("src/view/images/treasureHunter.json")
        .load(setup);
}


//Setup Pixi and load the texture atlas files - call the `setup`
//function when they've loaded

var state, explorer, treasure, blobs, chimes, exit, player, dungeon,
    door, healthBar, message, gameScene, gameOverScene, enemies, id;

//
function setup() {
  //Create the `gameScene` group
  gameScene = new Container();
  stage.addChild(gameScene);

  //Create an Alias for the texture atlas frame id
  id = resources["src/view/images/treasureHunter.json"].textures;

  //Create the dungeon sprite
  dungeon = new Sprite(id["dungeon.png"]);
  gameScene.addChild(dungeon);

  //Create the door sprite
  door = new Sprite(id["door.png"]);
  door.position.set(32, 0);
  gameScene.addChild(door);

  //Create the explorer sprite
  explorer = new Sprite(id["explorer.png"]);
  explorer.position.set(68, gameScene.height / 2 - explorer.height / 2);
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);

  //Create the treasure sprite
  treasure = new Sprite(id["treasure.png"]);
  treasure.position.set(gameScene.width - treasure.width - 48, gameScene.height / 2 - treasure.height / 2);
  gameScene.addChild(treasure);

  //Make the enemies
  var numberOfBlobs = 6,
      spacing = 48,
      xOffset = 150,
      speed = 2,
      direction = 1;

  blobs = [];

  for (let i = 0; i < numberOfBlobs; i ++) {
    var blob = new Sprite(id["blob.png"]);
    
    var x = xOffset + spacing * i,
        y = randomInt(0, stage.height - blob.height);

    blob.x = x;
    blob.y = y;

    blob.vy = speed * direction;

    direction *= -1;

    blobs.push(blob);

    gameScene.addChild(blob);
  }

  //Create the health bar
  healthBar = new PIXI.DisplayObjectContainer();
  healthBar.position.set(stage.width - 170 , 6);
  gameScene.addChild(healthBar);

  var innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  var outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;

  //Create a `gameOverScene` group
  gameOverScene = new Container();
  gameOverScene.visibile = false;
  stage.addChild(gameOverScene);

  //Add some text for the game over message
  message = new Text(
    "",
    {front : "64px Futura", fill : "white"}
  );

  message.x = 200;
  message.y = stage.height / 2 - 32;

  gameOverScene.addChild(message);


  //处理用户输入
  //Assign the player's keyboard controllers
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  
  up.press = function() {
    explorer.vy = -5;
  }
  up.release = function() {
    if (down.isUp) {
      explorer.vy = 0;
    } else {
      down.press();
    }
  }
  down.press = function() {
    explorer.vy = 5;
  }
  down.release = function() {
    if (up.isUp) {
      explorer.vy = 0;
    } else {
      up.press();
    }
  }
  left.press = function() {
    explorer.vx = -5;
  }
  left.release = function() {
    if (right.isUp) {
      explorer.vx = 0;
    } else {
      right.press();
    }
  }
  right.press = function() {
    explorer.vx = 5;
  }
  right.release = function() {
    if (left.isUp) {
      explorer.vx = 0;
    } else {
      left.press();
    }
  }
  //set the game state to `play`
  state = play;

  //Start the game loop
  gameLoop();
}

function gameLoop() {
  //Runs the current game `state` in a loop and renders the sprites
  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  //Update the current game state
  state();

  //Render the stage
  renderer.render(stage);
}

function play() {
  //All the game logic goes here
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;
  contain(explorer, {x: 28, y: 10, width: 488, height: 480});

  var explorerHit = false;

  blobs.forEach(function(blob, index) {
    blob.y += blob.vy;

    var blobHitsWall = contain(blob, {x: 28, y: 10, width: 488, height: 480});

    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob.vy *= -1;
    }

    if(hitTestRectangle(explorer, blob)) {
      explorerHit = true;
      blob.visible = false;
      blobs.splice(index, 1);
    }
  });

  if (explorerHit) {
    explorer.alpha = 0.5;
    explorer.x -= 50;
    healthBar.outer.width -= 43;
  } else {
    explorer.alpha = 1;
  }

  if (hitTestRectangle(explorer, treasure)) {
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

  if (hitTestRectangle(treasure, door)) {
    state = end;
    message.text = "You won!";
  }

  if (healthBar.outer.width < 0) {
    state = end;
    message.text = "You lost!";

  }
}

function end() {
  //All the code that should run at the end of the game
  gameScene.visible = false;
  gameOverScene.visible = true;
}

//The game's helper functions:
//`keyboard`, `hitTestRectangle`, `contain` and `randomInt`


// keyboard Function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener( "keydown", key.downHandler.bind(key), false);
  window.addEventListener( "keyup", key.upHandler.bind(key), false);

  return key;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function contain(sprite, container) {

  var collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};
