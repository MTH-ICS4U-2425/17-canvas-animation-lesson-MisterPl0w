/**
 * cacti.js
 * 
 * The cacti object (could probably have done it simpler)
 * 
 * Author: Mr. Brash 🐿️
 */

import { CANVAS, CTX, FLOOR, randInt, SPRITE_SHEET } from "./globals.js";

/*
SMALL_START = 445;
SMALL_WIDTH = 35;
SMALL_HEIGHT = 72;
LARGE_START = 650;
LARGE_WIDTH = 50;
LARGE_HEIGHT = 101;
*/

const options = [
  {sx: 445, sw: 34, sh: 72},
  {sx: 480, sw: 68, sh: 72},
  {sx: 548, sw: 102, sh: 72},
  {sx: 652, sw: 50, sh: 101},
  {sx: 702, sw: 100, sh: 101},
  {sx: 802, sw: 150, sh: 101}
]

export default class Cactus {
  constructor() {
    //Am I large or small?
    this.type = randInt(0, 5);
    
    // values depend on size
    this.sx = options[this.type].sx;
    this.width = options[this.type].sw;
    this.x = CANVAS.width + this.width;
    this.height = options[this.type].sh;
    this.y = FLOOR - this.height + randInt(-2, 10);
  }

  draw() {
    CTX.drawImage(SPRITE_SHEET, this.sx, 1, this.width, this.height, this.x, this.y, this.width, this.height);
  }

  update(velocity) {
    // We'll need to take care of items off the screen somehow

    this.x += velocity;
    this.draw();
  }
}
