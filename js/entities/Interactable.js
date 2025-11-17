/**
 * Interactable - base class for interactive objects (fishing spots, huts, signs, etc.)
 */
export class Interactable {
  constructor(x, y, width, height, options = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Options
    this.label = options.label || 'Interact';
    this.targetScene = options.targetScene || null;
    this.onInteract = options.onInteract || null;

    // Interaction state
    this.isNearby = false;
    this.interactionDistance = options.interactionDistance || 40;
  }

  checkProximity(player) {
    const playerCenter = player.getCenter();
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    const dx = playerCenter.x - centerX;
    const dy = playerCenter.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.isNearby = distance < this.interactionDistance;
    return this.isNearby;
  }

  interact(sceneManager) {
    if (this.onInteract) {
      this.onInteract();
    }
    if (this.targetScene) {
      sceneManager.switchTo(this.targetScene);
    }
  }

  render(ctx, spriteAtlas, atlasKey, frameName, scale = 1) {
    // Render sprite if provided
    if (spriteAtlas && atlasKey && frameName) {
      spriteAtlas.drawSprite(ctx, atlasKey, frameName, this.x, this.y, scale);
    } else {
      // Debug visualization
      ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Show prompt if player is nearby
    if (this.isNearby) {
      this.renderPrompt(ctx);
    }
  }

  renderPrompt(ctx) {
    const promptText = `Press [SPACE] - ${this.label}`;
    const centerX = this.x + this.width / 2;
    const promptY = this.y - 10;

    // Text styling
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    // Background
    const textMetrics = ctx.measureText(promptText);
    const padding = 4;
    const bgX = centerX - textMetrics.width / 2 - padding;
    const bgY = promptY - 14;
    const bgW = textMetrics.width + padding * 2;
    const bgH = 18;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(bgX, bgY, bgW, bgH);

    // Text
    ctx.fillStyle = '#FFD700'; // Gold color
    ctx.fillText(promptText, centerX, promptY);

    // Reset text align
    ctx.textAlign = 'left';
  }
}
