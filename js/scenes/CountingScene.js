/**
 * CountingScene - educational numbers mini-game for 5-year-olds
 */
import { gameState } from '../state/GameState.js';
import { randomInt } from '../utils/collision.js';

export class CountingScene {
  constructor(game, sceneManager) {
    this.game = game;
    this.sceneManager = sceneManager;
  }

  init() {
    // Generate a counting challenge
    this.targetNumber = randomInt(1, 5); // Count 1-5 for young children
    this.selectedCount = 0;
    this.state = 'playing'; // playing, correct, wrong

    // Generate fish to count
    this.fishToShow = [];
    const totalFish = randomInt(3, 7); // Show 3-7 fish total
    const fishTypes = ['fish_blue', 'fish_yellow', 'fish_orange', 'fish_red', 'fish_green'];

    for (let i = 0; i < totalFish; i++) {
      this.fishToShow.push({
        type: fishTypes[randomInt(0, fishTypes.length - 1)],
        x: 200 + (i % 4) * 100,
        y: 200 + Math.floor(i / 4) * 100,
        selected: false
      });
    }

    this.feedbackTimer = 0;
  }

  create() {
    this.init();
  }

  update(deltaTime) {
    // Check arrow key selection (up/down to change count)
    if (this.state === 'playing') {
      if (this.game.input.wasJustPressed('ArrowUp')) {
        this.selectedCount = Math.min(7, this.selectedCount + 1);
      }
      if (this.game.input.wasJustPressed('ArrowDown')) {
        this.selectedCount = Math.max(0, this.selectedCount - 1);
      }

      // Space to submit answer
      if (this.game.input.spacePressed) {
        this.checkAnswer();
      }
    } else if (this.state === 'correct' || this.state === 'wrong') {
      this.feedbackTimer += deltaTime;

      // Auto-return after 2 seconds, or space to continue
      if (this.feedbackTimer > 2 || this.game.input.spacePressed) {
        if (this.state === 'correct') {
          gameState.incrementCounting();
          this.sceneManager.switchTo('island');
        } else {
          // Try again
          this.init();
        }
      }
    }

    this.game.input.update();
  }

  checkAnswer() {
    if (this.selectedCount === this.targetNumber) {
      this.state = 'correct';
    } else {
      this.state = 'wrong';
    }
    this.feedbackTimer = 0;
  }

  render(ctx) {
    // Background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 800, 600);

    // Game window
    const centerX = 400;
    const centerY = 300;

    // Title
    ctx.fillStyle = '#0F380F';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🐟 Counting Fish! 🐟', centerX, 80);

    if (this.state === 'playing') {
      this.renderPlaying(ctx, centerX, centerY);
    } else if (this.state === 'correct') {
      this.renderCorrect(ctx, centerX, centerY);
    } else if (this.state === 'wrong') {
      this.renderWrong(ctx, centerX, centerY);
    }

    ctx.textAlign = 'left';
  }

  renderPlaying(ctx, cx, cy) {
    // Instructions
    ctx.fillStyle = '#0F380F';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`How many fish do you see?`, cx, 140);

    // Draw fish to count
    for (const fish of this.fishToShow) {
      this.game.assetLoader.drawSprite(
        ctx,
        'fish',
        fish.type,
        fish.x,
        fish.y,
        2
      );
    }

    // Selection area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 150, cy + 80, 300, 80);
    ctx.strokeStyle = '#0F380F';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 150, cy + 80, 300, 80);

    ctx.fillStyle = '#0F380F';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.selectedCount.toString(), cx, cy + 140);

    // Controls hint
    ctx.font = '16px monospace';
    ctx.fillText('↑↓ to change • SPACE to submit', cx, cy + 190);
  }

  renderCorrect(ctx, cx, cy) {
    ctx.fillStyle = '#32CD32';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 CORRECT! 🎉', cx, cy);

    ctx.fillStyle = '#0F380F';
    ctx.font = '24px monospace';
    ctx.fillText(`Yes! There are ${this.targetNumber} fish!`, cx, cy + 60);

    ctx.font = '16px monospace';
    ctx.fillText('Great job counting!', cx, cy + 100);

    // Draw celebration fish
    this.game.assetLoader.drawSprite(ctx, 'fish', 'fish_blue', cx - 80, cy - 80, 3);
    this.game.assetLoader.drawSprite(ctx, 'fish', 'fish_yellow', cx + 40, cy - 80, 3);
  }

  renderWrong(ctx, cx, cy) {
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Not quite!', cx, cy);

    ctx.fillStyle = '#0F380F';
    ctx.font = '24px monospace';
    ctx.fillText('Let\'s try counting again!', cx, cy + 60);

    ctx.font = '16px monospace';
    ctx.fillText('Count carefully, one by one!', cx, cy + 100);
  }

  destroy() {
    // Cleanup
  }
}
