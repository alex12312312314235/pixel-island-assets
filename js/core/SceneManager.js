/**
 * SceneManager - handles scene transitions
 */
export class SceneManager {
  constructor(game) {
    this.game = game;
    this.scenes = new Map();
    this.currentScene = null;
  }

  add(name, SceneClass) {
    this.scenes.set(name, SceneClass);
  }

  start(name, data = {}) {
    const SceneClass = this.scenes.get(name);
    if (!SceneClass) {
      console.error(`Scene '${name}' not found`);
      return;
    }

    // Clean up previous scene
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }

    // Create and initialize new scene
    this.currentScene = new SceneClass(this.game, this);
    if (this.currentScene.init) {
      this.currentScene.init(data);
    }
    if (this.currentScene.create) {
      this.currentScene.create();
    }
  }

  // Switch to another scene
  switchTo(name, data = {}) {
    this.start(name, data);
  }
}
