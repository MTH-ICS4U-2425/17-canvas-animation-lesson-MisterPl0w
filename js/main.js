/**
 * ICS4U - Mr. Brash 🐿️
 * 
 * 17 - Canvas Animation
 * 
 * Author:
 * 
 */

'use strict';

import Player from "./player.js";
import Ground from "./ground.js";
import { CANVAS, CTX, MS_PER_FRAME, KEYS, SPRITE_SHEET, randInt } from "./globals.js";

// Globals
const HERO = new Player(120, 50, 88, 93);
const GROUND = new Ground();
const CLOUDS = []

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
  console.log(event.keyCode)

  if (event.keyCode == KEYS.SPACE) {
    console.log(HERO.bottom, HERO.velocity.y)
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
  
  frame_count = frame_count > 60 ? 1 : frame_count + 1;

  const EXCESS_TIME = TIME_PASSED % MS_PER_FRAME
  frame_time = NOW - EXCESS_TIME
  /*** END FPS Trap ***/
  
  // Clear the canvas
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  // See if we should add any background items
  if (randInt(1, 200) == 100) {
    console.log("added a cloud")
    CLOUDS.push(CANVAS.width);
  }

  // Draw background items
  for (let c in CLOUDS) {
    CTX.drawImage(SPRITE_SHEET, 165, 0, 95, 35, CLOUDS[c], 50, 95, 35);
    CLOUDS[c] += velocity / 4;
    if (CLOUDS[c] < -100)
      CLOUDS.shift()
  }
  
  // Draw the ground
  GROUND.update(velocity);

  // Draw our hero
  HERO.update(frame_count);
}

// Start the animation
update()
