/**
 * Input manager - handles keyboard input
 */
export class Input {
  constructor() {
    this.keys = {};
    this.justPressed = {};

    // Bind event listeners
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyDown(e) {
    if (!this.keys[e.code]) {
      this.justPressed[e.code] = true;
    }
    this.keys[e.code] = true;
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
  }

  isDown(keyCode) {
    return !!this.keys[keyCode];
  }

  wasJustPressed(keyCode) {
    return !!this.justPressed[keyCode];
  }

  // Call this at the end of each frame to clear "just pressed" states
  update() {
    this.justPressed = {};
  }

  // Helper methods for common keys
  get left() { return this.isDown('ArrowLeft'); }
  get right() { return this.isDown('ArrowRight'); }
  get up() { return this.isDown('ArrowUp'); }
  get down() { return this.isDown('ArrowDown'); }
  get space() { return this.isDown('Space'); }
  get spacePressed() { return this.wasJustPressed('Space'); }
}
