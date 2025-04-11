/**
 * ground.js
 * 
 * The Ground class to draw nicely
 * 
 * Author: Mr. Brash 🐿️
 */
import { SPRITE_SHEET, CTX, CANVAS, randInt } from "./globals.js"

const SY = 103;
const SH = 26;
const DY = 300;
const DH = SH;
const CHUNK_WIDTH = Math.round(CANVAS.width / 300) * 100;
console.log(CHUNK_WIDTH)

class Ground_Img {
  constructor(dx) {
    this.sx = CHUNK_WIDTH * randInt(1, 5) - 5;
    this.dx = dx * CHUNK_WIDTH;
    // I was just created, I should draw myself
    this.draw();
  }
  
  // Move the image velocity-amount of pixels and then draw it
  update(velocity) {
    // Check to see if it's off the canvas... if yes, regenerate it
    if (this.dx < -1 * CHUNK_WIDTH) {
      this.sx = CHUNK_WIDTH * randInt(1, 5) - 5;
      this.dx = 3 * CHUNK_WIDTH + velocity;
    }
    this.dx += velocity;

    // Draw myself
    this.draw();
  }
  
  draw() {
    CTX.drawImage(SPRITE_SHEET, this.sx, SY, CHUNK_WIDTH, SH, this.dx, DY, CHUNK_WIDTH, DH);
  }
}

// Overseer of the ground - contains an array of Ground_Img objects
export default class Ground {
  constructor() {
    // Generate and draw the starting ground (we'll use 4 images)
    this.images = []
    for (let x = 0; x < 4; x++) {
      this.images.push(new Ground_Img(x));
    }
  }

  // Move all the images (which will draw themselves)
  update(velocity) {
    for (let i of this.images) {
      i.update(velocity);
    }
  }
}
