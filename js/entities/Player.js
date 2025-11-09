/**
 * Player entity - handles player movement and rendering
 */
export class Player {
  constructor(x, y, spriteAtlas) {
    this.x = x;
    this.y = y;
    this.spriteAtlas = spriteAtlas;

    // Movement
    this.speed = 100; // pixels per second
    this.direction = 'down'; // up, down, left, right

    // Sprite info
    this.atlasKey = 'fish';
    this.frameName = 'char_child';

    // Collision bounds (smaller than sprite for better feel)
    this.width = 24;
    this.height = 36;

    // Visual offset (to center the collision box on the sprite)
    this.spriteOffsetX = -8;
    this.spriteOffsetY = -8;
  }

  update(deltaTime, input, bounds, obstacles = []) {
    const oldX = this.x;
    const oldY = this.y;

    // Movement
    if (input.left) {
      this.x -= this.speed * deltaTime;
      this.direction = 'left';
    }
    if (input.right) {
      this.x += this.speed * deltaTime;
      this.direction = 'right';
    }
    if (input.up) {
      this.y -= this.speed * deltaTime;
      this.direction = 'up';
    }
    if (input.down) {
      this.y += this.speed * deltaTime;
      this.direction = 'down';
    }

    // Keep within bounds
    this.x = Math.max(bounds.x, Math.min(bounds.x + bounds.width - this.width, this.x));
    this.y = Math.max(bounds.y, Math.min(bounds.y + bounds.height - this.height, this.y));

    // Check collision with obstacles
    const playerRect = this.getBounds();
    for (const obstacle of obstacles) {
      if (this.checkCollision(playerRect, obstacle)) {
        // Revert movement
        this.x = oldX;
        this.y = oldY;
        break;
      }
    }
  }

  checkCollision(playerRect, obstacle) {
    return playerRect.x < obstacle.x + obstacle.width &&
           playerRect.x + playerRect.width > obstacle.x &&
           playerRect.y < obstacle.y + obstacle.height &&
           playerRect.y + playerRect.height > obstacle.y;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  render(ctx) {
    // Draw player sprite
    this.spriteAtlas.drawSprite(
      ctx,
      this.atlasKey,
      this.frameName,
      this.x + this.spriteOffsetX,
      this.y + this.spriteOffsetY,
      1
    );

    // Debug: draw collision box (optional, comment out for production)
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
