/**
 * Main entry point - initializes and starts the game
 */
import { Game } from './core/Game.js';
import { Input } from './core/Input.js';
import { SceneManager } from './core/SceneManager.js';
import { AssetLoader } from './core/AssetLoader.js';
import { SpriteAtlas } from './core/SpriteAtlas.js';

import { IslandScene } from './scenes/IslandScene.js';
import { FishingScene } from './scenes/FishingScene.js';
import { CountingScene } from './scenes/CountingScene.js';
import { LetterScene } from './scenes/LetterScene.js';

// Show loading screen
function showLoading() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.style.display = 'flex';
  }
}

function hideLoading() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.style.display = 'none';
  }
}

async function init() {
  showLoading();

  try {
    // Create game instance
    const game = new Game('gameCanvas', 800, 600);

    // Setup input
    game.input = new Input();

    // Setup asset loader
    game.assetLoader = new AssetLoader();

    // Load assets
    console.log('Loading assets...');
    await game.assetLoader.loadAll([
      {
        type: 'image',
        key: 'island',
        path: 'island_bg.png'
      },
      {
        type: 'atlas',
        key: 'fish',
        imagePath: 'fish_characters.png',
        jsonPath: 'fish_characters.json'
      },
      {
        type: 'atlas',
        key: 'terrain',
        imagePath: 'terrain_flora.png',
        jsonPath: 'terrain_flora.json'
      }
    ]);

    console.log('Assets loaded successfully!');

    // Create SpriteAtlas helper (makes it easier to draw sprites from atlases)
    const spriteAtlas = new SpriteAtlas(game.assetLoader);
    game.assetLoader.drawSprite = spriteAtlas.drawSprite.bind(spriteAtlas);

    // Setup scene manager
    game.sceneManager = new SceneManager(game);
    game.sceneManager.add('island', IslandScene);
    game.sceneManager.add('fishing', FishingScene);
    game.sceneManager.add('counting', CountingScene);
    game.sceneManager.add('letters', LetterScene);

    // Start with island scene
    game.sceneManager.start('island');

    // Hide loading and start game
    hideLoading();
    game.start();

    console.log('Game started!');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    hideLoading();
    alert('Failed to load game. Please refresh the page.');
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
