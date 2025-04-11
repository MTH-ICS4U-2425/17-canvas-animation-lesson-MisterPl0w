/**
 * ICS4U - Mr. Brash 🐿️
 * 
 * 17 - Canvas Animation
 * 
 * Author: Mr. Squirrel
 * 
 */

'use strict';

import Player from "./player.js";
import Ground from "./ground.js";
import { CANVAS, CTX, MS_PER_FRAME, KEYS, SPRITE_SHEET, randInt } from "./globals.js";

// Globals
const HERO = new Player(120, 50, 88, 93);
const GROUND = new Ground();

// Instead - let's pre-bake the star and cloud memory spaces and only "activate" or "deactivate" them, as necessary
// Changes to come!
const CLOUDS = []
const STARS = []

let frame_time = performance.now()
let frame_count = 1;
let velocity = -4;

// Event Listeners
document.addEventListener("keydown", keypress);

// Disable the context menu on the entire document
document.addEventListener("contextmenu", (event) => { 
  event.preventDefault();
  return false; 
});

/**
 * The user pressed a key on the keyboard 
 */
function keypress(event) {
  //console.log(event.keyCode)

  if ([KEYS.SPACE, KEYS.W, KEYS.UP_ARROW].includes(event.keyCode)) {
    HERO.jump();
  }
}

/**
 * The main game loop
 */
function update() {
  // Prepare for the next frame
  requestAnimationFrame(update)
  
  /*** Desired FPS Trap ***/
  const NOW = performance.now()
  const TIME_PASSED = NOW - frame_time
  
  if (TIME_PASSED < MS_PER_FRAME) return
  
  frame_count = frame_count > 20 ? 1 : frame_count + 1;

  const EXCESS_TIME = TIME_PASSED % MS_PER_FRAME
  frame_time = NOW - EXCESS_TIME
  /*** END FPS Trap ***/
  
  // Clear the canvas
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  /**** Background graphics ****/

  // Clouds (the setup for this might change)
  // Don't crowd the clouds
  if (CLOUDS.length == 0 || CLOUDS[CLOUDS.length - 1].x < CANVAS.width - 400) {
    if (randInt(1, 200) == 100 && CLOUDS.length < 15 && frame_count < 20) {
      CLOUDS.push({x:CANVAS.width, y:randInt(10, 250), velocity_divider:randInt(5, 20)});
    }
  }

  // Draw the clouds
  for (let i in CLOUDS) {
    let c = CLOUDS[i];
    CTX.drawImage(SPRITE_SHEET, 165, 0, 95, 35, c.x, c.y, 95, 35);
    c.x += velocity / c.velocity_divider;
    if (c.x < -100) {
      CLOUDS.splice(i--, 1);
    }
  }

  // Stars (the setup for this might change)
  // Don't crowd the stars
  if (STARS.length == 0 || STARS[STARS.length - 1].x < CANVAS.width - 150) {
    if (randInt(1, 300) == 50 && STARS.length < 25 && frame_count > 40) {
      STARS.push({x:CANVAS.width, y:randInt(10, 280), type:randInt(0, 2)});
    }
  }

  // Draw the stars
  for (let i in STARS) {
    let s = STARS[i];
    CTX.filter = "invert(1)";
    CTX.drawImage(SPRITE_SHEET, 1274, s.type*18 + 1, 18, 18, s.x, s.y, 18, 18);
    CTX.filter = "invert(0.9)";
    s.x += velocity / 20;
    if (s.x < -20) {
      STARS.splice(i--, 1)
    }
  }

  // Moon


  // Draw the ground
  GROUND.update(velocity);

  // Draw our hero
  HERO.update(frame_count);

  // Randomly jump - just for automation, this will get removed
  if (randInt(1, 400) == 200) HERO.jump()
}

// Start the animation
update()
