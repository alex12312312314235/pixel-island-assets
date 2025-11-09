/**
 * FishingScene - fishing mini-game
 */
import { gameState } from '../state/GameState.js';
import { randomElement } from '../utils/collision.js';

// Fish types with rarity
const FISH_TYPES = [
  { id: 'fish_blue', displayName: 'Blue Fish', rarity: 'Common' },
  { id: 'fish_yellow', displayName: 'Yellow Fish', rarity: 'Common' },
  { id: 'fish_orange', displayName: 'Orange Fish', rarity: 'Common' },
  { id: 'fish_red', displayName: 'Red Fish', rarity: 'Uncommon' },
  { id: 'fish_green', displayName: 'Green Fish', rarity: 'Uncommon' },
  { id: 'fish_purple', displayName: 'Purple Fish', rarity: 'Rare' },
  { id: 'fish_gray', displayName: 'Gray Fish', rarity: 'Uncommon' },
  { id: 'fish_spotted', displayName: 'Spotted Fish', rarity: 'Rare' },
  { id: 'angelfish', displayName: 'Angelfish', rarity: 'Rare' },
  { id: 'fish_shark_small', displayName: 'Small Shark', rarity: 'Epic' },
  { id: 'octopus_orange', displayName: 'Orange Octopus', rarity: 'Epic' },
  { id: 'crab_blue', displayName: 'Blue Crab', rarity: 'Uncommon' }
];

export class FishingScene {
  constructor(game, sceneManager) {
    this.game = game;
    this.sceneManager = sceneManager;
  }

  init() {
    this.state = 'waiting'; // waiting, hooking, reeling, success, fail
    this.timer = 0;
    this.hookBobOffset = 0;
    this.hookBobDirection = 1;

    // Reeling phase variables
    this.playerPosition = 0; // -130 to 130
    this.targetPosition = 0;
    this.reelingProgress = 0; // 0 to 1
    this.selectedFish = null;
    this.driftSpeed = 2; // Player arrow drifts right naturally

    // Animation
    this.resultScale = 0;
    this.spacePressed = false;
  }

  create() {
    this.init();

    // Start waiting phase
    this.waitDelay = 1 + Math.random() * 2; // 1-3 seconds
    this.hookDeadline = 0;
  }

  update(deltaTime) {
    this.timer += deltaTime;

    // Track space press
    this.spacePressed = this.game.input.spacePressed;

    if (this.state === 'waiting') {
      this.updateWaiting(deltaTime);
    } else if (this.state === 'hooking') {
      this.updateHooking(deltaTime);
    } else if (this.state === 'reeling') {
      this.updateReeling(deltaTime);
    } else if (this.state === 'success' || this.state === 'fail') {
      this.updateResult(deltaTime);
    }

    this.game.input.update();
  }

  updateWaiting(deltaTime) {
    // Bob the hook
    this.hookBobOffset += deltaTime * 2 * this.hookBobDirection;
    if (Math.abs(this.hookBobOffset) > 0.15) {
      this.hookBobDirection *= -1;
    }

    // Check if wait is over
    if (this.timer >= this.waitDelay) {
      this.state = 'hooking';
      this.hookDeadline = this.timer + 1.5; // 1.5 seconds to react
    }
  }

  updateHooking(deltaTime) {
    // Check if player pressed space
    if (this.spacePressed) {
      this.startReeling();
      return;
    }

    // Check if time is up
    if (this.timer >= this.hookDeadline) {
      this.state = 'fail';
      this.failReason = 'Too slow!';
    }
  }

  startReeling() {
    this.state = 'reeling';

    // Select a random fish based on rarity
    const rarityRoll = Math.random();
    let fishPool;
    if (rarityRoll < 0.5) {
      fishPool = FISH_TYPES.filter(f => f.rarity === 'Common');
    } else if (rarityRoll < 0.8) {
      fishPool = FISH_TYPES.filter(f => f.rarity === 'Uncommon');
    } else if (rarityRoll < 0.95) {
      fishPool = FISH_TYPES.filter(f => f.rarity === 'Rare');
    } else {
      fishPool = FISH_TYPES.filter(f => f.rarity === 'Epic');
    }
    this.selectedFish = randomElement(fishPool);

    // Reset reeling variables
    this.playerPosition = 0;
    this.targetPosition = Math.random() * 200 - 100; // -100 to 100
    this.reelingProgress = 0;
    this.reelingTimer = 0;
    this.targetMoveTimer = 0;
  }

  updateReeling(deltaTime) {
    this.reelingTimer += deltaTime;
    this.targetMoveTimer += deltaTime;

    // Move target zone randomly
    if (this.targetMoveTimer > 1) {
      this.targetPosition = Math.random() * 200 - 100;
      this.targetMoveTimer = 0;
    }

    // Player arrow drifts right naturally
    this.playerPosition += this.driftSpeed;
    this.playerPosition = Math.max(-130, Math.min(130, this.playerPosition));

    // Space moves arrow left
    if (this.spacePressed) {
      this.playerPosition -= 30;
      this.playerPosition = Math.max(-130, Math.min(130, this.playerPosition));
    }

    // Check if in target zone
    const distance = Math.abs(this.playerPosition - this.targetPosition);
    const inZone = distance < 30;

    if (inZone) {
      this.reelingProgress += deltaTime / 3; // 3 seconds to complete
    } else {
      this.reelingProgress -= deltaTime / 3;
    }

    this.reelingProgress = Math.max(0, Math.min(1, this.reelingProgress));

    // Check win condition
    if (this.reelingProgress >= 1) {
      this.state = 'success';
      gameState.addFish(this.selectedFish.id);
    }
  }

  updateResult(deltaTime) {
    // Animate result fish scaling up
    if (this.resultScale < 1) {
      this.resultScale += deltaTime * 3;
      this.resultScale = Math.min(1, this.resultScale);
    }

    // Space or click to return to island
    if (this.spacePressed) {
      this.sceneManager.switchTo('island');
    }
  }

  render(ctx) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 800, 600);

    // Game window
    const centerX = 400;
    const centerY = 300;
    const windowW = 500;
    const windowH = 350;

    // Outer border
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(centerX - windowW / 2 - 10, centerY - windowH / 2 - 10, windowW + 20, windowH + 20);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(centerX - windowW / 2 - 10, centerY - windowH / 2 - 10, windowW + 20, windowH + 20);

    // Inner window
    ctx.fillStyle = '#9BBC0F';
    ctx.fillRect(centerX - windowW / 2, centerY - windowH / 2, windowW, windowH);

    ctx.strokeStyle = '#0F380F';
    ctx.lineWidth = 4;
    ctx.strokeRect(centerX - windowW / 2, centerY - windowH / 2, windowW, windowH);

    // Title bar
    ctx.fillStyle = '#0F380F';
    ctx.fillRect(centerX - 240, centerY - 140, 480, 50);

    ctx.fillStyle = '#9BBC0F';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🎣 FISHING MINI-GAME', centerX, centerY - 110);

    // Render based on state
    if (this.state === 'waiting') {
      this.renderWaiting(ctx, centerX, centerY);
    } else if (this.state === 'hooking') {
      this.renderHooking(ctx, centerX, centerY);
    } else if (this.state === 'reeling') {
      this.renderReeling(ctx, centerX, centerY);
    } else if (this.state === 'success') {
      this.renderSuccess(ctx, centerX, centerY);
    } else if (this.state === 'fail') {
      this.renderFail(ctx, centerX, centerY);
    }

    ctx.textAlign = 'left';
  }

  renderWaiting(ctx, cx, cy) {
    ctx.fillStyle = '#0F380F';
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Wait for the fish to bite...', cx, cy - 60);

    // Fishing rod
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(cx - 100, cy - 20, 8, 120);

    // Fishing line
    ctx.strokeStyle = '#0F380F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 96, cy + 40);
    ctx.lineTo(cx + 50, cy + 60 + this.hookBobOffset * 50);
    ctx.stroke();

    // Hook
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx + 50, cy + 60 + this.hookBobOffset * 50, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  renderHooking(ctx, cx, cy) {
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('❗ PRESS SPACE NOW! ❗', cx, cy - 60);

    // Fishing rod
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(cx - 100, cy - 20, 8, 120);

    // Hook (shaking)
    const shake = Math.sin(this.timer * 30) * 5;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx + 50 + shake, cy + 60, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  renderReeling(ctx, cx, cy) {
    ctx.fillStyle = '#0F380F';
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Keep the arrow in the green zone!', cx, cy - 60);

    // Arrow track
    const trackW = 300;
    const trackH = 60;
    const trackY = cy + 60;

    ctx.fillStyle = '#0F380F';
    ctx.fillRect(cx - trackW / 2, trackY - trackH / 2, trackW, trackH);

    ctx.fillStyle = '#8BAC0F';
    ctx.fillRect(cx - trackW / 2 + 4, trackY - trackH / 2 + 4, trackW - 8, trackH - 8);

    // Target zone (green)
    const targetX = cx + this.targetPosition;
    ctx.fillStyle = 'rgba(50, 205, 50, 0.5)';
    ctx.fillRect(targetX - 25, trackY - 26, 50, 52);

    ctx.strokeStyle = '#32CD32';
    ctx.lineWidth = 3;
    ctx.strokeRect(targetX - 25, trackY - 26, 50, 52);

    // Player arrow (red triangle)
    const arrowX = cx + this.playerPosition;
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(arrowX, trackY - 20);
    ctx.lineTo(arrowX - 15, trackY + 20);
    ctx.lineTo(arrowX + 15, trackY + 20);
    ctx.closePath();
    ctx.fill();

    // Progress bar
    const progressW = 300 * this.reelingProgress;
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(cx - 150, cy + 130, progressW, 20);

    ctx.strokeStyle = '#0F380F';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 150, cy + 130, 300, 20);
  }

  renderSuccess(ctx, cx, cy) {
    ctx.fillStyle = '#0F380F';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`🎉 You caught a ${this.selectedFish.displayName}! 🎉`, cx, cy - 60);

    // Draw fish sprite
    const scale = 3 + this.resultScale * 3; // Scale from 3 to 6
    this.game.assetLoader.drawSprite(
      ctx,
      'fish',
      this.selectedFish.id,
      cx - 20 * scale / 2,
      cy - 20 * scale / 2,
      scale
    );

    // Rarity
    ctx.font = 'italic 16px monospace';
    ctx.fillText(`[${this.selectedFish.rarity}]`, cx, cy + 80);

    // Close button
    this.renderCloseButton(ctx, cx, cy);
  }

  renderFail(ctx, cx, cy) {
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`❌ ${this.failReason}`, cx, cy - 60);

    // Close button
    this.renderCloseButton(ctx, cx, cy);
  }

  renderCloseButton(ctx, cx, cy) {
    const btnW = 150;
    const btnH = 40;
    const btnY = cy + 130;

    ctx.fillStyle = '#0F380F';
    ctx.fillRect(cx - btnW / 2, btnY - btnH / 2, btnW, btnH);

    ctx.fillStyle = '#9BBC0F';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CLOSE', cx, btnY + 7);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - btnW / 2, btnY - btnH / 2, btnW, btnH);

    // Hint
    ctx.font = '12px monospace';
    ctx.fillStyle = '#0F380F';
    ctx.fillText('(Press SPACE)', cx, btnY + 30);
  }

  destroy() {
    // Cleanup
  }
}
