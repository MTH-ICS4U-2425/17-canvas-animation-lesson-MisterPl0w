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
import { CANVAS, CTX, MS_PER_FRAME, KEYS, SPRITE_SHEET, randInt, KEYS_PRESSED, $ } from "./globals.js";

// Globals
const LEFT_CONSTRAINT = 50;
const RIGHT_CONSTRAINT = 550;
const HERO = new Player(120, 50, 88, 93);
const GROUND = new Ground();
const CLOUDS = [];
const MOON = {x: CANVAS.width + 10, y: 80, frame: 0, max_frame: 7}
const STARS = [];


let frame_time = performance.now()
let frame_count = 1;
let velocity = -4;
let automate = true;
let twinkle = true;

// Setup the clouds and stars
for (let i = 0; i < 8; i++) {
  CLOUDS.push({x:((i > 2) ? CANVAS.width : randInt(10, CANVAS.width-100)), y:randInt(10, 250), velocity_divider:randInt(5, 20), active:(i < 3)});
  STARS.push({x:((i > 2) ? CANVAS.width : randInt(10, CANVAS.width-100)), y:randInt(10, 280), type:randInt(0, 2), active:(i < 3)});
}

// Event Listeners
document.addEventListener("keydown", keypress);
document.addEventListener("keyup", key_release);
$("twinkle").addEventListener("click", () => {twinkle = $("twinkle").checked});
$("automate").addEventListener("click", () => {automate = $("automate").checked});

// Disable the context menu on the entire document
document.addEventListener("contextmenu", (event) => { 
  event.preventDefault();
  return false; 
});

/**
 * The user pressed a key on the keyboard 
 */
function keypress(event) {
  if ([KEYS.SPACE, KEYS.W, KEYS.UP_ARROW].includes(event.keyCode)) {
    HERO.jump();
  } else if ([KEYS.A, KEYS.LEFT_ARROW].includes(event.keyCode)) {
    KEYS_PRESSED.left = true;
  } else if ([KEYS.D, KEYS.RIGHT_ARROW].includes(event.keyCode)) {
    KEYS_PRESSED.right = true;
  } else if ([KEYS.S, KEYS.DOWN_ARROW].includes(event.keyCode)) {
    KEYS_PRESSED.down = true;
  }
  event.preventDefault();
}
/**
 * The user released a key on the keyboard 
*/
function key_release(event) {
  if ([KEYS.A, KEYS.LEFT_ARROW].includes(event.keyCode)) {
    KEYS_PRESSED.left = false;
  } else if ([KEYS.D, KEYS.RIGHT_ARROW].includes(event.keyCode)) {
    KEYS_PRESSED.right = false;
  } else if ([KEYS.S, KEYS.DOWN_ARROW].includes(event.keyCode)) {
    KEYS_PRESSED.down = false;
  }
  event.preventDefault();
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
  
  frame_count = frame_count > 300 ? 1 : frame_count + 1;

  const EXCESS_TIME = TIME_PASSED % MS_PER_FRAME
  frame_time = NOW - EXCESS_TIME
  /*** END FPS Trap ***/
  
  // Clear the canvas
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  /**** Background graphics ****/
  // Moon
  if (MOON.x < -45) {
    MOON.frame = MOON.frame == MOON.max_frame ? 0 : MOON.frame + 1;
    MOON.x = CANVAS.width + 50;
  } else {
    MOON.x -= 0.2;
    CTX.drawImage(SPRITE_SHEET, 953 + 40*MOON.frame, 0, 40, 85, MOON.x, MOON.y, 40, 85)
  }
  // Activate a cloud and/or star - it might already be active
  if (frame_count % 150 == 0 && randInt(0, 2) == 1) {
    CLOUDS[randInt(0, 7)].active = true;
    STARS[randInt(0, 7)].active = true;
  }
  // Draw the clouds and stars
  for (let c = 0; c < 8; c++) {

    if (CLOUDS[c].active) {
      // If I'm off the screen, deactivate me
      if (CLOUDS[c].x < -100) {
        CLOUDS[c].active = false;
        CLOUDS[c].x = CANVAS.width;
        CLOUDS[c].y = randInt(10, 250);
        CLOUDS[c].velocity_divider = randInt(5, 20);
      }
      else {
        CTX.drawImage(SPRITE_SHEET, 165, 0, 95, 35, CLOUDS[c].x, CLOUDS[c].y, 95, 35);
        CLOUDS[c].x += velocity / CLOUDS[c].velocity_divider;
      }
    }
    if (STARS[c].active) {
      // If I'm off the screen, deactivate me
      if (STARS[c].x < -20) {
        STARS[c].active = false;
        STARS[c].x = CANVAS.width;
        STARS[c].y = randInt(10, 250);
        STARS[c].velocity_divider = randInt(5, 20);
      }
      else {
        // twinkle the stars (is this worth it? Does it work?)
        if (twinkle && frame_count % 10 == 0) {
          let rnd = randInt(80, 100)/100
          CTX.filter = `invert(${rnd})`
        }
        CTX.drawImage(SPRITE_SHEET, 1274, STARS[c].type*18 + 1, 18, 18, STARS[c].x, STARS[c].y, 18, 18);
        STARS[c].x += velocity / 20;
        CTX.filter = 'invert(0.98)'
      }
    }
    //CTX.filter = "invert(0.9)";
  }


  // Draw the ground
  GROUND.update(velocity);

  // Draw our 
  HERO.update(frame_count);

  // Move the hero if the correct button is pressed
  if (KEYS_PRESSED.left && HERO.left > LEFT_CONSTRAINT)
    HERO.left -= 5;
  else if (KEYS_PRESSED.right && HERO.right < RIGHT_CONSTRAINT)
    HERO.left += 5;


  // Randomly jump or duck - just for automation, this will get removed
  if (automate && frame_count % 5 == 0) {
    let rnd = randInt(1, 400);
    if (rnd == 200) {
      HERO.jump()
      KEYS_PRESSED.down = false;
    }
    else if (rnd == 100)
      KEYS_PRESSED.down = true;
    else if (rnd % 60 == 0)
      KEYS_PRESSED.down = false;
    else if (rnd == 99) {
      KEYS_PRESSED.left = true;
      KEYS_PRESSED.right = false;
    }
    else if (rnd == 98) {
      KEYS_PRESSED.right = true;
      KEYS_PRESSED.left = false;
    }
    else if (rnd % 70 == 0) {
      KEYS_PRESSED.left = false;
      KEYS_PRESSED.right = false;
    }

  }
}

// Start the animation
update()
