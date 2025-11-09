/**
 * GameState - shared game state and localStorage persistence
 */
export class GameState {
  constructor() {
    this.storageKey = 'pixelIsland.gameState.v1';
    this.data = this.load();
  }

  getDefaultState() {
    return {
      fishCaught: 0,
      fishCollection: {}, // { fishType: { seen: bool, caught: bool, count: number } }
      countingProgress: 0, // Number of correct counting answers
      letterProgress: 0,   // Number of correct letter answers
      totalPlayTime: 0
    };
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return { ...this.getDefaultState(), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load game state:', e);
    }
    return this.getDefaultState();
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }

  // Fish collection methods
  addFish(fishType) {
    if (!this.data.fishCollection[fishType]) {
      this.data.fishCollection[fishType] = { seen: true, caught: true, count: 0 };
    }
    this.data.fishCollection[fishType].caught = true;
    this.data.fishCollection[fishType].count++;
    this.data.fishCaught++;
    this.save();
  }

  markFishSeen(fishType) {
    if (!this.data.fishCollection[fishType]) {
      this.data.fishCollection[fishType] = { seen: true, caught: false, count: 0 };
    }
    this.data.fishCollection[fishType].seen = true;
    this.save();
  }

  getFishStats() {
    const collection = this.data.fishCollection;
    const types = Object.keys(collection);
    return {
      totalTypes: types.length,
      caughtTypes: types.filter(t => collection[t].caught).length,
      totalCaught: this.data.fishCaught
    };
  }

  // Learning progress methods
  incrementCounting() {
    this.data.countingProgress++;
    this.save();
  }

  incrementLetter() {
    this.data.letterProgress++;
    this.save();
  }

  // Reset for testing
  reset() {
    this.data = this.getDefaultState();
    this.save();
  }
}

// Singleton instance
export const gameState = new GameState();
