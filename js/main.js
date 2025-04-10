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
import { CANVAS, CTX, MS_PER_FRAME, KEYS } from "./globals.js";

// Globals
const HERO = new Player(120, 50, 48, 48);
const GROUND = new Ground();


let frame_time = performance.now()

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
  
  const EXCESS_TIME = TIME_PASSED % MS_PER_FRAME
  frame_time = NOW - EXCESS_TIME
  /*** END FPS Trap ***/
  
  // Clear the canvas
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  
  // Draw the ground
  GROUND.update();
  
  // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  //CTX.drawImage(ground, 0, 103, 2300, 26, ground.x_pos, 300, 2300, 28)
  
  // Draw our hero
  HERO.update();
}

// Start the animation
update()
