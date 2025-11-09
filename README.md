# Maxi's Island - Educational Adventure Game

A vanilla JavaScript + Canvas game for 5-year-olds, featuring a static island hub with educational mini-games.

## 🎮 Features

- **Island Hub**: Explore a static top-down island with player movement
- **Fishing Mini-Game**: Catch different types of fish with simple timing mechanics
- **Counting Mini-Game**: Count fish and learn numbers (1-5)
- **Letter Mini-Game**: Find matching letters from the alphabet

## 🚀 Quick Start

1. Start a local server:
   ```bash
   python -m http.server 8080
   ```

2. Open your browser to `http://localhost:8080`

3. Play!

## 🎯 Controls

- **Arrow Keys**: Move player / Navigate menus
- **Space**: Interact / Confirm selection

## 🏗️ Architecture

### Core Engine (`js/core/`)
- `Game.js` - Main game loop with requestAnimationFrame
- `Input.js` - Keyboard input handling
- `SceneManager.js` - Scene transitions
- `AssetLoader.js` - Image and sprite atlas loading
- `SpriteAtlas.js` - Sprite rendering helper

### Game Logic (`js/`)
- `state/GameState.js` - Shared game state with localStorage persistence
- `utils/collision.js` - Collision detection and helper utilities
- `entities/Player.js` - Player movement and rendering
- `entities/Interactable.js` - Interactive objects (fishing spots, mini-game triggers)

### Scenes (`js/scenes/`)
- `IslandScene.js` - Main hub with static map
- `FishingScene.js` - Fishing mini-game (ported from Phaser version)
- `CountingScene.js` - Educational counting game
- `LetterScene.js` - Educational alphabet game

## 📦 Assets

- `fish_characters.png/.json` - Sprite atlas with fish, characters, and creatures
- `terrain_flora.png/.json` - Sprite atlas with terrain, palms, rocks, and decorations

## 🔧 Technical Details

- **No frameworks** - Pure vanilla JavaScript ES6 modules
- **Canvas-based** - HTML5 Canvas with 800×600 resolution
- **Pixel art style** - `imageSmoothingEnabled = false` for crisp pixels
- **Modular** - Clean separation of concerns
- **Persistent** - Progress saved to localStorage

## 📝 Notes

- Target audience: 5-year-old children
- Simple, forgiving gameplay mechanics
- Positive feedback and gentle retry on mistakes
- No complex camera movement (static map)
- Keyboard-only controls (touch can be added later)

## 🎨 Game Design

The game features a GameBoy-style aesthetic with:
- Green palette (#9BBC0F background, #0F380F dark)
- Simple pixel art sprites
- Clear, readable UI
- Child-friendly visual feedback

## 📂 File Structure

```
pixel-island-assets/
├── index.html              # Main entry point
├── fish_characters.png     # Character/fish sprite atlas
├── fish_characters.json    # Atlas metadata
├── terrain_flora.png       # Terrain sprite atlas
├── terrain_flora.json      # Atlas metadata
└── js/
    ├── main.js             # Initialization
    ├── core/               # Engine modules
    ├── entities/           # Game entities
    ├── scenes/             # Game scenes
    ├── state/              # State management
    └── utils/              # Utilities
```

## 🔄 Migration from Phaser

This project was refactored from a Phaser 3 implementation to vanilla JavaScript:
- Removed Phaser dependency (~250KB)
- Implemented custom game loop and scene management
- Ported fishing mechanics from Phaser to canvas
- Added new educational mini-games
- Simplified architecture for better maintainability

Old Phaser version backed up as `index-phaser-backup.html`.
