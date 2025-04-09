/**
 * player.js
 * 
 * The Player Class
 * 
 * Acts as a sprite or "hero" for the game
 * 
 * Author: 
 */

import { CTX, CANVAS, GRAVITY, FLOOR } from "./globals.js"

export default class Player {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;

    this.position = {
      x: x,
      y: y
    }
    this.velocity = {
      x: 0,
      y: 0
    };
  }

  get right() { return this.position.x + this.width; }
  get bottom() { return this.position.y + this.height; }
  get top() { return this.position.y; }
  get left() { return this.position.x; }

  /**
   * Main function to update location, velocity, and image
   */
  update() {
    // Add gravity to the hero
    this.velocity.y += GRAVITY;

    // If we hit the floor, stop falling
    if (this.bottom > FLOOR) {
      this.velocity.y = 0;
      this.position.y = FLOOR - this.height;
    }

    // Update the location of the hero
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  }

  /**
   * Draw the player on the canvas
   */
  draw() {
    CTX.fillStyle = "yellow";
    CTX.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  jump() {
    this.position.y -= 2;
    this.velocity.y = -20;
  }
}
