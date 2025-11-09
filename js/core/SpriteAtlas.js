/**
 * SpriteAtlas - helper for drawing sprites from atlases
 */
import { mapFrameName } from '../utils/frameMapping.js';

export class SpriteAtlas {
  constructor(assetLoader) {
    this.assetLoader = assetLoader;
  }

  /**
   * Draw a sprite from an atlas
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} atlasKey - Atlas key from AssetLoader
   * @param {string} frameName - Frame name from atlas JSON
   * @param {number} x - Destination x
   * @param {number} y - Destination y
   * @param {number} scale - Optional scale factor
   */
  drawSprite(ctx, atlasKey, frameName, x, y, scale = 1) {
    const atlas = this.assetLoader.getAtlas(atlasKey);
    if (!atlas) {
      console.warn(`Atlas '${atlasKey}' not found`);
      return;
    }

    // Map old frame names to new grid-based names
    const mappedFrameName = mapFrameName(frameName);
    const frame = atlas.frames[mappedFrameName];
    if (!frame) {
      console.warn(`Frame '${mappedFrameName}' (original: '${frameName}') not found in atlas '${atlasKey}'`);
      return;
    }

    const f = frame.frame;
    const width = f.w * scale;
    const height = f.h * scale;

    ctx.drawImage(
      atlas.image,
      f.x, f.y, f.w, f.h,  // Source rectangle
      x, y, width, height   // Destination rectangle
    );
  }

  /**
   * Get frame dimensions
   */
  getFrameSize(atlasKey, frameName) {
    const atlas = this.assetLoader.getAtlas(atlasKey);
    if (!atlas) return null;

    const mappedFrameName = mapFrameName(frameName);
    const frame = atlas.frames[mappedFrameName];
    if (!frame) return null;

    return { w: frame.frame.w, h: frame.frame.h };
  }

  /**
   * Check if a frame exists
   */
  hasFrame(atlasKey, frameName) {
    const atlas = this.assetLoader.getAtlas(atlasKey);
    if (!atlas) return false;
    const mappedFrameName = mapFrameName(frameName);
    return !!atlas.frames[mappedFrameName];
  }
}
