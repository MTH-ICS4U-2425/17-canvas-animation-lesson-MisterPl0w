/**
 * player.js
 * 
 * The Player Class
 * 
 * Acts as a sprite or "hero" for the game
 * 
 * Author: 
 */

import { CTX, GRAVITY, FLOOR, SPRITE_SHEET, KEYS_PRESSED } from "./globals.js"

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

    this.sx = [1854, 1942, 1678, 2210, 2328];
    this.sy = 1;
    this.frame = 0;
  }

  // Getters and setters (the setters are kinda cheating but whatever)
  get right() { return this.position.x + this.width; }
  get bottom() { return this.position.y + this.height; }
  get top() { return this.position.y; }
  get left() { return this.position.x; }
  set bottom(location) { this.position.y = location - this.height; }
  set right(location) { this.position.x = location - this.width; }
  set top(location) { this.position.y = location; }
  set left(location) { this.position.x = location; }

  /**
   * Main function to update location, velocity, and image
   */
  update(frame_time) {
    
    // If we WILL hit the floor, stop falling
    if (this.bottom + this.velocity.y >= FLOOR) {
      this.velocity.y = 0;
      this.bottom = FLOOR;
    } else {
      this.velocity.y += GRAVITY;
    }
    
    // Update the location of the hero
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw(frame_time);
  }
  
  /**
   * Draw the player on the canvas
  */
  draw(frame_time) {
   if (this.bottom == FLOOR && !KEYS_PRESSED.down) {
      // Change the feet 
      this.frame = frame_time % 12 > 5 ? 0 : 1;
      CTX.drawImage(SPRITE_SHEET, this.sx[this.frame], this.sy, this.width, this.height, this.left, this.top, this.width, this.height);
    } else if (this.bottom == FLOOR && KEYS_PRESSED.down) {
      this.frame = frame_time % 12 > 5 ? 3 : 4;
      CTX.drawImage(SPRITE_SHEET, this.sx[this.frame], this.sy, 115, this.height, this.left, this.top, 115, this.height);
    } else {
      CTX.drawImage(SPRITE_SHEET, this.sx[2], this.sy, this.width, this.height, this.left, this.top, this.width, this.height);
    }
  }

  /**
   * Make the player jump 
   */
  jump() {
    if (this.bottom >= FLOOR) {
      this.bottom = FLOOR
      this.velocity.y = -26;
    }
  }
}
