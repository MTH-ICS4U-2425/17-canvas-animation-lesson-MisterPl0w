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
let automate = localStorage.getItem("automate") === "true";
$("automate").checked = automate;
let twinkle = localStorage.getItem("twinkle") === "true";
$("twinkle").checked = twinkle;
let bgmusic;
let score = 0;
let hi_score = 0;
let playing = false;
let current_frame;

// Setup the clouds and stars
for (let i = 0; i < 10; i++) {
  CLOUDS.push({x:((i > 3) ? CANVAS.width : randInt(10, CANVAS.width-100)), y:randInt(10, 250), velocity_divider:randInt(5, 20), active:(i < 4), scale: (randInt(50, 150)/100)});
  STARS.push({x:((i > 3) ? CANVAS.width : randInt(10, CANVAS.width-100)), y:randInt(10, 280), type:randInt(0, 2), active:(i < 4), scale: (randInt(50, 150)/100)});
}

// Setup the enemies (6 cacti)
for (let i = 0; i < 6; i++) {
  ENEMIES.push(new Cactus())
}

// Two birds


// Event Listeners
$("volume").addEventListener("input", volume);
$("mute").addEventListener("click", mute);
$("reset").addEventListener("click", reset);
$("twinkle").addEventListener("click", () => {
  twinkle = $("twinkle").checked; 
  localStorage.setItem("twinkle", twinkle);
});
$("automate").addEventListener("click", () => {
  automate = $("automate").checked; 
  localStorage.setItem("automate", automate);
});

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
    if (HERO.velocity.y < 0 && HERO.bottom > 180)
      HERO.velocity.y += 5.5;
  }
  event.preventDefault();
}

/**
 * The main game loop
 */
function update() {
  // Prepare for the next frame
  if (playing)
    current_frame = requestAnimationFrame(update)
  
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
  if (frame_count % 100 == 0 && randInt(0, 1) == 1)
    CLOUDS[randInt(0, 7)].active = true;
  if (frame_count % 75 == 0 && randInt(10, 11) == 11) 
    STARS[randInt(0, 7)].active = true;
  // Draw the clouds and stars
  for (let c = 0; c < CLOUDS.length; c++) {

    if (STARS[c].active) {
      // If I'm off the screen, deactivate me
      if (STARS[c].x < -20) {
        STARS[c].active = false;
        STARS[c].x = CANVAS.width;
        STARS[c].y = randInt(10, 250);
        STARS[c].scale = (randInt(50, 150)/100)
      }
      else {
        // twinkle the stars 
        if (twinkle && frame_count % 10 == 0) {
          let rnd = randInt(80, 100)/100
          CTX.filter = `invert(${rnd})`
        }
        CTX.drawImage(SPRITE_SHEET, 1274, STARS[c].type*18 + 1, 18, 18, STARS[c].x, STARS[c].y, 18*STARS[c].scale, 18*STARS[c].scale);
        STARS[c].x += velocity / 20;
        CTX.filter = 'invert(0.98)'
      }
    }

    if (CLOUDS[c].active) {
      // If I'm off the screen, deactivate me
      if (CLOUDS[c].x < -150) {
        CLOUDS[c].active = false;
        CLOUDS[c].x = CANVAS.width;
        CLOUDS[c].y = randInt(10, 250);
        CLOUDS[c].velocity_divider = randInt(5, 20);
        CLOUDS[c].scale = (randInt(50, 150)/100);
      }
      else {
        CTX.drawImage(SPRITE_SHEET, 165, 0, 95, 35, CLOUDS[c].x, CLOUDS[c].y, 95*CLOUDS[c].scale, 35*CLOUDS[c].scale);
        CLOUDS[c].x += velocity / CLOUDS[c].velocity_divider;
      }
  }
  }

  // Draw the ground
  GROUND.update(velocity);

  // Draw the score
  CTX.fillStyle = "#888888"
  CTX.fillText(`HI ${String(hi_score).padStart(5, '0')}      `, CANVAS.width - 10, 30)
  CTX.fillStyle = "#444444"
  CTX.fillText(`${String(score).padStart(5, '0')}`, CANVAS.width - 10, 30)

  // Draw enemies or obstacles...
  
  // ENEMIES - also a great time to check the hitboxes
  for (let e of ENEMIES) {
    if (e.active) {
      e.update(velocity);
      if (check_death(e)) {
        e.active = false;
        e.reload();
        game_over();
        return;
      }
    }
    
    if (e.x < 0 - e.width) {
      e.reload();
    }
  }
  if (frame_count % 100 == 0) ENEMIES[randInt(0, 5)].active = true;
  
  // Draw our hero
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

// Update the volume of the music & sounds
function volume() {
  bgmusic.volume = ($("volume").value/100);
  localStorage.setItem("volume", bgmusic.volume);
}

function mute() {
  if (!bgmusic.muted) {
    document.getElementById("mute").src = "../images/Mute.png";
  } else {
    document.getElementById("mute").src = "../images/Volume.png";
  }
  document.getElementById("volume").disabled = !bgmusic.muted;
  bgmusic.muted = !bgmusic.muted;
  localStorage.setItem("muted", bgmusic.muted);
}

function splash_screen() {
  
  // Setup the music
  bgmusic = new Audio("../media/arcade_music2.mp3")
  if (localStorage.getItem("muted") === "true") mute();
  if (localStorage.getItem("volume") == null)
    bgmusic.volume = $("volume").value/100;
  else {
    bgmusic.volume = Number(localStorage.getItem("volume"))
    $("volume").value = bgmusic.volume * 100;
  }

  bgmusic.loop = true;
  
  CTX.font = "30px Press-Start-2P";
  CTX.textAlign = "center"
  CTX.fillStyle = "#999999"
  CTX.fillText("Press SPACE to start...", CANVAS.width / 2, CANVAS.height / 3);
}

function start_game(event) {
  if (event.keyCode != KEYS.SPACE) return;
  
  // Replace the spacebar listener
  document.removeEventListener("keydown",start_game)
  document.addEventListener("keydown", keypress);
  document.addEventListener("keyup", key_release);
  
  // Setup the score font
  CTX.font = "12px Press-Start-2P";
  CTX.textAlign = "right"
  CTX.fillStyle = "#999999"

  // Start the music
  bgmusic.play();
  
  // Start the game!
  $("reset").disabled = true;
  playing = true;
  current_frame = requestAnimationFrame(update);
}

// Reset everything to base values, including the high score
function reset() {
  if (!confirm(`⚠️ This will reset all settings, including your high score. ⚠️

      Click "OK" to reset or "Cancel" to keep your settings.
      `)) return;

  localStorage.setItem("muted", false);
  localStorage.setItem("volume", 0.15);
  localStorage.setItem("twinkle", true);
  localStorage.setItem("automate", false);
  localStorage.setItem("hi_score", 0);
  location.reload();
}

/**
 * Check to see if we've died!
 */
function check_death(enemy) {
  // Specifically the bottom-right corner
  if (HERO.right - 15 > enemy.x && HERO.right < enemy.x + enemy.width && HERO.bottom - 15 > enemy.y)
    return true;
  // Specifically the bottom (here's the problem - the dino is wider than the cacti)
  if (HERO.bottom - 15 > enemy.y && HERO.right > enemy.x + enemy.width && HERO.left < enemy.x + enemy.width - 15)
    return true;

  return false;
}

/**
 * Show the game-over screen and update high score, if applicable.
 * Stop the music, disable event listeners, etc.
 */
function game_over() {
  cancelAnimationFrame(current_frame);
  playing = false;
  CTX.font = "38px Press-Start-2P";
  CTX.textAlign = "center"
  CTX.fillStyle = "#999999"
  CTX.fillText("GAME OVER", CANVAS.width / 2, CANVAS.height / 3);
  
  HERO.draw_dead();
  
  // stop the music
  bgmusic.pause();
  bgmusic.currentTime = 0;


  document.removeEventListener("keydown", keypress);
  document.removeEventListener("keyup", key_release);  
  document.addEventListener("keydown", start_game);
}

// Get ready for the splash screen
document.addEventListener("keydown", start_game);
splash_screen();

// Debugging
window.game_over = game_over;
