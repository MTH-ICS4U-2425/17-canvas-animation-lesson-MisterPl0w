/**
 * globals.js
 * 
 * Keep all the globals in one place, in case they
 * need to be shared across modules/imports.
 * 
 * Author:
 * 
 */

// Drawing / updating
export const CANVAS = document.getElementById('game_canvas');
export const CTX = CANVAS.getContext('2d', {
      powerPreference: "high-performance"
    });
export const PATH = new Image();
PATH.src = "../images/dino_large.png";
  
// FPS Trapping
export const FPS = 60;
export const MS_PER_FRAME = 1000 / FPS;

// Movement
export const GRAVITY = 1;
export const FLOOR = CANVAS.height - 28;  // Careful - if the height ever changes...

// Some convenient keyboard codes
export const KEYS = {
  SPACE:32,
  UP_ARROW:38,
  LEFT_ARROW:37,
  DOWN_ARROW:40,
  RIGHT_ARROW:39,
  W:87,
  A:65,
  S:83,
  D:68
};

/**
 * Shortcut for the document.getElementById() function
 * @param {String} id The unique identifier of the element being requested.
 * @returns HTML Element Object
 */
export function $(id) { return document.getElementById(id); }

/**
 * Return a random integer from min to max (inclusive)
 * @param {number} min The lowest possible integer.
 * @param {number} max The highest possibe integer.
 * @returns {number} a random integer from min to max.
 */
export function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Export all the constants by default
export default { CANVAS, CTX, FPS, MS_PER_FRAME, GRAVITY, FLOOR, KEYS, $, PATH, randInt}
