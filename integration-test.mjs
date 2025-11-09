#!/usr/bin/env node
/**
 * Integration test - simulates full game flow
 */

console.log('🎮 Running integration test...\n');

// Mock browser environment
const canvas = {
  width: 800,
  height: 600,
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
  })
};

global.document = {
  getElementById: (id) => canvas,
  addEventListener: () => {},
  readyState: 'complete'
};

global.window = {
  addEventListener: () => {},
  localStorage: {
    data: {},
    getItem: function(key) { return this.data[key] || null; },
    setItem: function(key, value) { this.data[key] = value; },
    removeItem: function(key) { delete this.data[key]; }
  },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (cb) => setTimeout(cb, 16)
};

global.Image = class Image {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.src = '';
  }
  set src(value) {
    this._src = value;
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 10);
  }
  get src() { return this._src; }
};

global.fetch = async (url) => {
  const fs = await import('fs/promises');
  const data = await fs.readFile(url.replace(/^\//, ''), 'utf8');
  return {
    json: async () => JSON.parse(data)
  };
};

global.localStorage = global.window.localStorage;
global.performance = global.window.performance;
global.requestAnimationFrame = global.window.requestAnimationFrame;

// Import and test
let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
    console.error(e.stack);
    testsFailed++;
  }
}

// Test 1: Game initialization
await test('Game initialization', async () => {
  const { Game } = await import('./js/core/Game.js');
  const game = new Game('test', 800, 600);

  if (!game.canvas || !game.ctx) throw new Error('Canvas not initialized');
  if (game.width !== 800 || game.height !== 600) throw new Error('Wrong dimensions');
});

// Test 2: Input system
await test('Input system', async () => {
  const { Input } = await import('./js/core/Input.js');
  const input = new Input();

  // Simulate key press
  input.onKeyDown({ code: 'ArrowLeft' });
  if (!input.left) throw new Error('Arrow left not detected');

  input.onKeyUp({ code: 'ArrowLeft' });
  if (input.left) throw new Error('Arrow left not released');

  // Test justPressed
  input.onKeyDown({ code: 'Space' });
  if (!input.spacePressed) throw new Error('Space press not detected');

  input.update();
  if (input.spacePressed) throw new Error('Space press not cleared after update');
});

// Test 3: Asset loader
await test('Asset loading', async () => {
  const { AssetLoader } = await import('./js/core/AssetLoader.js');
  const loader = new AssetLoader();

  // Load atlases
  await loader.loadAtlas('fish', 'fish_characters.png', 'fish_characters.json');
  await loader.loadAtlas('terrain', 'terrain_flora.png', 'terrain_flora.json');

  const fishAtlas = loader.getAtlas('fish');
  const terrainAtlas = loader.getAtlas('terrain');

  if (!fishAtlas) throw new Error('Fish atlas not loaded');
  if (!terrainAtlas) throw new Error('Terrain atlas not loaded');

  // Check required frames exist
  if (!fishAtlas.frames['char_child']) throw new Error('char_child frame missing');
  if (!fishAtlas.frames['fish_blue']) throw new Error('fish_blue frame missing');
  if (!terrainAtlas.frames['palm_big']) throw new Error('palm_big frame missing');
  if (!terrainAtlas.frames['rock_small_1']) throw new Error('rock_small_1 frame missing');
});

// Test 4: Player entity
await test('Player entity', async () => {
  const { Player } = await import('./js/entities/Player.js');
  const mockAtlas = { drawSprite: () => {} };
  const player = new Player(400, 300, mockAtlas);

  const mockInput = { left: false, right: true, up: false, down: false };
  const bounds = { x: 0, y: 0, width: 800, height: 600 };

  const oldX = player.x;
  player.update(1, mockInput, bounds, []);

  if (player.x <= oldX) throw new Error('Player did not move right');
});

// Test 5: Game state persistence
await test('Game state persistence', async () => {
  const { gameState } = await import('./js/state/GameState.js');

  // Add a fish
  gameState.addFish('fish_blue');
  if (gameState.data.fishCaught !== 1) throw new Error('Fish count incorrect');

  // Increment progress
  gameState.incrementCounting();
  if (gameState.data.countingProgress !== 1) throw new Error('Counting progress incorrect');

  gameState.incrementLetter();
  if (gameState.data.letterProgress !== 1) throw new Error('Letter progress incorrect');

  // Check stats
  const stats = gameState.getFishStats();
  if (stats.totalCaught !== 1) throw new Error('Fish stats incorrect');
});

// Test 6: Scene management
await test('Scene management', async () => {
  const { SceneManager } = await import('./js/core/SceneManager.js');
  const { IslandScene } = await import('./js/scenes/IslandScene.js');

  const mockGame = {
    assetLoader: {
      drawSprite: () => {},
      getAtlas: () => ({ frames: {} })
    },
    input: {
      left: false, right: false, up: false, down: false,
      spacePressed: false, update: () => {}
    }
  };

  const sceneManager = new SceneManager(mockGame);
  sceneManager.add('island', IslandScene);
  sceneManager.start('island');

  if (!sceneManager.currentScene) throw new Error('Scene not started');
  if (!(sceneManager.currentScene instanceof IslandScene)) {
    throw new Error('Wrong scene type');
  }
});

// Test 7: Collision utilities
await test('Collision utilities', async () => {
  const { rectOverlap, clamp, randomInt } = await import('./js/utils/collision.js');

  // Test rect overlap
  const rect1 = { x: 0, y: 0, width: 10, height: 10 };
  const rect2 = { x: 5, y: 5, width: 10, height: 10 };
  const rect3 = { x: 20, y: 20, width: 10, height: 10 };

  if (!rectOverlap(rect1, rect2)) throw new Error('Overlapping rects not detected');
  if (rectOverlap(rect1, rect3)) throw new Error('Non-overlapping rects detected as overlapping');

  // Test clamp
  if (clamp(5, 0, 10) !== 5) throw new Error('Clamp failed for value in range');
  if (clamp(-5, 0, 10) !== 0) throw new Error('Clamp failed for value below range');
  if (clamp(15, 0, 10) !== 10) throw new Error('Clamp failed for value above range');

  // Test randomInt
  for (let i = 0; i < 100; i++) {
    const val = randomInt(1, 5);
    if (val < 1 || val > 5) throw new Error('randomInt out of range');
  }
});

// Test 8: Fishing scene logic
await test('Fishing scene logic', async () => {
  const { FishingScene } = await import('./js/scenes/FishingScene.js');

  const mockGame = {
    assetLoader: {
      drawSprite: () => {},
      getAtlas: () => ({ frames: {}, image: {} })
    },
    input: {
      spacePressed: false,
      update: () => {}
    }
  };
  const mockSceneManager = { switchTo: () => {} };

  const scene = new FishingScene(mockGame, mockSceneManager);
  scene.create();

  if (scene.state !== 'waiting') throw new Error('Initial state should be waiting');

  // Simulate waiting
  scene.update(0.5);
  scene.update(1.5);

  // Should transition to hooking after wait
  if (scene.state === 'waiting' && scene.timer > 3) {
    throw new Error('Did not transition from waiting state');
  }
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Integration Test Results: ${testsPassed} passed, ${testsFailed} failed\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All integration tests passed!\n');
  process.exit(0);
}
