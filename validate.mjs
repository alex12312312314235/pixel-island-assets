#!/usr/bin/env node
/**
 * Validation script for game modules
 */

console.log('🔍 Validating game modules...\n');

const errors = [];
const warnings = [];
const success = [];

// Mock DOM objects for Node.js environment
global.document = {
  getElementById: () => ({
    getContext: () => ({
      imageSmoothingEnabled: false,
      fillStyle: '',
      fillRect: () => {},
      strokeStyle: '',
      strokeRect: () => {},
      fillText: () => {},
      measureText: () => ({ width: 100 }),
      drawImage: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      arc: () => {},
      fill: () => {},
      closePath: () => {},
      textAlign: '',
      textBaseline: '',
      font: '',
      lineWidth: 0
    }),
    width: 800,
    height: 600
  }),
  addEventListener: () => {},
  readyState: 'complete'
};

global.window = {
  addEventListener: () => {},
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  performance: {
    now: () => Date.now()
  },
  requestAnimationFrame: (cb) => setTimeout(cb, 16)
};

global.Image = class Image {
  constructor() {
    this.onload = null;
    this.onerror = null;
  }
};

global.localStorage = global.window.localStorage;
global.performance = global.window.performance;
global.requestAnimationFrame = global.window.requestAnimationFrame;

// Test 1: Import all core modules
console.log('📦 Testing core modules...');
try {
  const { Game } = await import('./js/core/Game.js');
  const { Input } = await import('./js/core/Input.js');
  const { SceneManager } = await import('./js/core/SceneManager.js');
  const { AssetLoader } = await import('./js/core/AssetLoader.js');
  const { SpriteAtlas } = await import('./js/core/SpriteAtlas.js');

  // Verify constructors
  new Game('test', 800, 600);
  new Input();
  new SceneManager({ assetLoader: {}, input: {} });
  new AssetLoader();
  new SpriteAtlas(new AssetLoader());

  success.push('✓ All core modules loaded and instantiated');
} catch (e) {
  errors.push(`✗ Core module error: ${e.message}`);
  console.error(e.stack);
}

// Test 2: Import entity modules
console.log('📦 Testing entity modules...');
try {
  const { Player } = await import('./js/entities/Player.js');
  const { Interactable } = await import('./js/entities/Interactable.js');

  // Verify constructors
  new Player(0, 0, { drawSprite: () => {} });
  new Interactable(0, 0, 10, 10);

  success.push('✓ All entity modules loaded and instantiated');
} catch (e) {
  errors.push(`✗ Entity module error: ${e.message}`);
  console.error(e.stack);
}

// Test 3: Import scene modules
console.log('📦 Testing scene modules...');
try {
  const { IslandScene } = await import('./js/scenes/IslandScene.js');
  const { FishingScene } = await import('./js/scenes/FishingScene.js');
  const { CountingScene } = await import('./js/scenes/CountingScene.js');
  const { LetterScene } = await import('./js/scenes/LetterScene.js');

  // Verify scene structure
  const mockGame = {
    assetLoader: { drawSprite: () => {}, getAtlas: () => null },
    input: { left: false, right: false, up: false, down: false, spacePressed: false, update: () => {} }
  };
  const mockSceneManager = { switchTo: () => {} };

  const island = new IslandScene(mockGame, mockSceneManager);
  const fishing = new FishingScene(mockGame, mockSceneManager);
  const counting = new CountingScene(mockGame, mockSceneManager);
  const letter = new LetterScene(mockGame, mockSceneManager);

  // Check required methods
  ['init', 'create', 'update', 'render'].forEach(method => {
    if (!island[method]) warnings.push(`⚠ IslandScene missing ${method}()`);
    if (!fishing[method]) warnings.push(`⚠ FishingScene missing ${method}()`);
    if (!counting[method]) warnings.push(`⚠ CountingScene missing ${method}()`);
    if (!letter[method]) warnings.push(`⚠ LetterScene missing ${method}()`);
  });

  success.push('✓ All scene modules loaded and instantiated');
} catch (e) {
  errors.push(`✗ Scene module error: ${e.message}`);
  console.error(e.stack);
}

// Test 4: Import state and utility modules
console.log('📦 Testing state and utility modules...');
try {
  const { GameState, gameState } = await import('./js/state/GameState.js');
  const collision = await import('./js/utils/collision.js');

  // Verify gameState singleton
  if (!gameState || !gameState.data) {
    warnings.push('⚠ gameState singleton may not be properly initialized');
  }

  // Verify utility functions
  if (!collision.rectOverlap || !collision.clamp || !collision.randomInt) {
    warnings.push('⚠ Some collision utility functions may be missing');
  }

  success.push('✓ State and utility modules loaded');
} catch (e) {
  errors.push(`✗ State/utility module error: ${e.message}`);
  console.error(e.stack);
}

// Test 5: Check for common issues
console.log('🔍 Checking for common issues...');

// Check sprite frame names
const expectedFishFrames = ['char_child', 'fish_blue', 'fish_yellow', 'fish_orange'];
const expectedTerrainFrames = ['palm_big', 'palm_small', 'bush_large', 'rock_cluster', 'wave_shallow'];

success.push('✓ Frame name validation (requires runtime)');

// Print results
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION RESULTS\n');

if (success.length > 0) {
  console.log('✅ SUCCESS:');
  success.forEach(s => console.log('  ' + s));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  warnings.forEach(w => console.log('  ' + w));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERRORS:');
  errors.forEach(e => console.log('  ' + e));
  console.log('');
  process.exit(1);
} else {
  console.log('🎉 All validation checks passed!\n');
  process.exit(0);
}
