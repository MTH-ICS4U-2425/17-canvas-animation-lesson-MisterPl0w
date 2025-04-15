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
import Cactus from "./cacti.js";

// Globals
const LEFT_CONSTRAINT = 50;
const RIGHT_CONSTRAINT = 550;
const HERO = new Player(120, 50, 88, 93);
const GROUND = new Ground();
const CLOUDS = [];
const MOON = {x: CANVAS.width + 10, y: 80, frame: 0, max_frame: 7}
const STARS = [];
const ENEMIES = [];

let frame_time = performance.now()
let frame_count = 1;
let velocity = -7;
let automate = false;
let twinkle = true;
let bgmusic;
let score = 0;
let hi_score = "00000"

// Setup the clouds and stars
for (let i = 0; i < 8; i++) {
  CLOUDS.push({x:((i > 2) ? CANVAS.width : randInt(10, CANVAS.width-100)), y:randInt(10, 250), velocity_divider:randInt(5, 20), active:(i < 3)});
  STARS.push({x:((i > 2) ? CANVAS.width : randInt(10, CANVAS.width-100)), y:randInt(10, 280), type:randInt(0, 2), active:(i < 3)});
}

// Setup the enemies
for (let i = 0; i < 6; i++) {
  ENEMIES.push(new Cactus())
}

// Event Listeners
$("volume").addEventListener("input", volume);
$("mute").addEventListener("click", mute);
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
  } else if ([KEYS.SPACE, KEYS.W, KEYS.UP_ARROW].includes(event.keyCode)) {
    if (HERO.velocity.y < 0 && HERO.bottom > 200)
      HERO.velocity.y += 4;
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
  
  
  const EXCESS_TIME = TIME_PASSED % MS_PER_FRAME
  frame_time = NOW - EXCESS_TIME
  frame_count = frame_count > 300 ? 1 : frame_count + 1;
  if (frame_count % 6 == 0) score++;
  /*** END FPS Trap ***/
  
  // Clear the canvas
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  /**** Background graphics ****/
  // Moon
  if (MOON.x < -45) {
    // Full moon?
    if (MOON.frame == 3) 
      MOON.frame = -1
    else if (MOON.frame == -1) 
      MOON.frame = 4
    else 
      MOON.frame = MOON.frame == MOON.max_frame ? 0 : MOON.frame + 1;
    
    MOON.x = CANVAS.width + 50;
  } else {
    MOON.x -= 0.25;
    if (MOON.frame == -1)
      CTX.drawImage(SPRITE_SHEET, 1073, 0, 80, 85, MOON.x, MOON.y, 80, 85)
    else
      CTX.drawImage(SPRITE_SHEET, 953 + 40*MOON.frame, 0, 40, 85, MOON.x, MOON.y, 40, 85)
  }
  // Activate a cloud and/or star - it might already be active
  if (frame_count % 150 == 0 && randInt(0, 2) == 1) {
    CLOUDS[randInt(0, 7)].active = true;
    STARS[randInt(0, 7)].active = true;
  }
  // Draw the clouds and stars
  for (let c = 0; c < 8; c++) {

    if (STARS[c].active) {
      // If I'm off the screen, deactivate me
      if (STARS[c].x < -20) {
        STARS[c].active = false;
        STARS[c].x = CANVAS.width;
        STARS[c].y = randInt(10, 250);
      }
      else {
        // twinkle the stars 
        if (twinkle && frame_count % 10 == 0) {
          let rnd = randInt(80, 100)/100
          CTX.filter = `invert(${rnd})`
        }
        CTX.drawImage(SPRITE_SHEET, 1274, STARS[c].type*18 + 1, 18, 18, STARS[c].x, STARS[c].y, 18, 18);
        STARS[c].x += velocity / 20;
        CTX.filter = 'invert(0.98)'
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
      }
    }
  }

  // Draw the ground
  GROUND.update(velocity);

  // Draw enemies or obstacles...
  
  // ENEMIES
  for (let e of ENEMIES) {
    if (e.active)
      e.update(velocity);
    
    if (e.x < 0 - e.width) {
      e.reload();
    }
  }
  if (frame_count % 100 == 0) ENEMIES[randInt(0, 5)].active = true;
  
  // Draw our hero
  HERO.update(frame_count);

  // Draw the score
  CTX.fillStyle = "#888888"
  CTX.fillText(`HI ${hi_score}      `, CANVAS.width - 10, 30)
  CTX.fillStyle = "#444444"
  CTX.fillText(`${String(score).padStart(5, '0')}`, CANVAS.width - 10, 30)

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

// Update the volume of the music & sounds
function volume() {
  bgmusic.volume = ($("volume").value/100);
}

function mute() {
  if (!bgmusic.muted) {
    document.getElementById("mute").src = "../images/Mute.png";
  } else {
    document.getElementById("mute").src = "../images/Volume.png";
  }
  document.getElementById("volume").disabled = !bgmusic.muted;
  bgmusic.muted = !bgmusic.muted;
}

function splash_screen() {
  CTX.font = "30px Press-Start-2P";
  CTX.textAlign = "center"
  
  // Setup the music
  bgmusic = new Audio("../media/arcade_music2.mp3")
  bgmusic.volume = $("volume").value/100;
  
  // Load the splash screen after the audio is ready
  bgmusic.addEventListener("canplay", () => { 
    bgmusic.loop = true;
    CTX.fillStyle = "#999999"
    CTX.fillText("Press SPACE to start...", CANVAS.width / 2, CANVAS.height / 3);
  })
  
}

function start_game(event) {
  if (event.keyCode != KEYS.SPACE) return;
  
  // Replace the spacebar listener
  document.removeEventListener("keydown",space_listener)
  document.addEventListener("keydown", keypress);
  document.addEventListener("keyup", key_release);
  
  // Setup the score font
  CTX.font = "12px Press-Start-2P";
  CTX.textAlign = "right"
  CTX.fillStyle = "#999999"

  // Start the music
  bgmusic.play();
  
  // Start the game!
  requestAnimationFrame(update());
}

// Get ready for the splash screen
let space_listener = document.addEventListener("keydown", start_game);
splash_screen()