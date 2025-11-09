/**
 * AssetLoader - loads images and sprite atlases
 */
export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.atlases = new Map();
  }

  async loadImage(key, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      img.src = path;
    });
  }

  async loadAtlas(key, imagePath, jsonPath) {
    try {
      // Load JSON data
      const response = await fetch(jsonPath);
      const data = await response.json();

      // Load image
      const img = await this.loadImage(key, imagePath);

      // Store atlas data
      this.atlases.set(key, {
        image: img,
        frames: data.frames
      });

      return { image: img, frames: data.frames };
    } catch (error) {
      console.error(`Failed to load atlas ${key}:`, error);
      throw error;
    }
  }

  getImage(key) {
    return this.images.get(key);
  }

  getAtlas(key) {
    return this.atlases.get(key);
  }

  // Load multiple assets at once
  async loadAll(assets) {
    const promises = [];

    for (const asset of assets) {
      if (asset.type === 'image') {
        promises.push(this.loadImage(asset.key, asset.path));
      } else if (asset.type === 'atlas') {
        promises.push(this.loadAtlas(asset.key, asset.imagePath, asset.jsonPath));
      }
    }

    return Promise.all(promises);
  }
}
