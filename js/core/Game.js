/**
 * Core Game class - manages canvas, game loop, and scene management
 */
export class Game {
  constructor(canvasId, width = 800, height = 600) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;

    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;

    // Pixel art rendering
    this.ctx.imageSmoothingEnabled = false;

    // Game loop state
    this.running = false;
    this.lastTime = 0;
    this.deltaTime = 0;

    // Scene manager will be set externally
    this.sceneManager = null;

    // Asset loader will be set externally
    this.assetLoader = null;

    // Input manager will be set externally
    this.input = null;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.running = false;
  }

  loop = (currentTime) => {
    if (!this.running) return;

    // Calculate delta time in seconds
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Cap delta time to prevent large jumps
    if (this.deltaTime > 0.1) this.deltaTime = 0.1;

    // Clear canvas
    this.ctx.fillStyle = '#9BBC0F'; // GameBoy green background
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Update and render current scene
    if (this.sceneManager && this.sceneManager.currentScene) {
      this.sceneManager.currentScene.update(this.deltaTime);
      this.sceneManager.currentScene.render(this.ctx);
    }

    // Continue loop
    requestAnimationFrame(this.loop);
  };
}
