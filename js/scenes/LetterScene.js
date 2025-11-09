/**
 * LetterScene - educational alphabet mini-game for 5-year-olds
 */
import { gameState } from '../state/GameState.js';
import { randomInt, randomElement } from '../utils/collision.js';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export class LetterScene {
  constructor(game, sceneManager) {
    this.game = game;
    this.sceneManager = sceneManager;
  }

  init() {
    // Pick a target letter
    this.targetLetter = randomElement(LETTERS);

    // Generate 4 choices (including the correct one)
    this.choices = [this.targetLetter];
    while (this.choices.length < 4) {
      const letter = randomElement(LETTERS);
      if (!this.choices.includes(letter)) {
        this.choices.push(letter);
      }
    }

    // Shuffle choices
    this.choices.sort(() => Math.random() - 0.5);

    this.selectedIndex = 0;
    this.state = 'playing'; // playing, correct, wrong
    this.feedbackTimer = 0;

    // Position choices
    this.choicePositions = [
      { x: 200, y: 300 },
      { x: 350, y: 300 },
      { x: 500, y: 300 },
      { x: 650, y: 300 }
    ];
  }

  create() {
    this.init();
  }

  update(deltaTime) {
    if (this.state === 'playing') {
      // Arrow keys to select
      if (this.game.input.wasJustPressed('ArrowLeft')) {
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      }
      if (this.game.input.wasJustPressed('ArrowRight')) {
        this.selectedIndex = Math.min(3, this.selectedIndex + 1);
      }

      // Space to submit
      if (this.game.input.spacePressed) {
        this.checkAnswer();
      }
    } else if (this.state === 'correct' || this.state === 'wrong') {
      this.feedbackTimer += deltaTime;

      // Auto-return after 2 seconds, or space to continue
      if (this.feedbackTimer > 2 || this.game.input.spacePressed) {
        if (this.state === 'correct') {
          gameState.incrementLetter();
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
    const selected = this.choices[this.selectedIndex];
    if (selected === this.targetLetter) {
      this.state = 'correct';
    } else {
      this.state = 'wrong';
    }
    this.feedbackTimer = 0;
  }

  render(ctx) {
    // Background
    ctx.fillStyle = '#9BBC0F';
    ctx.fillRect(0, 0, 800, 600);

    const centerX = 400;
    const centerY = 300;

    // Title
    ctx.fillStyle = '#0F380F';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🔤 Find the Letter! 🔤', centerX, 80);

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
    // Show target letter
    ctx.fillStyle = '#0F380F';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Find the letter:', cx, 150);

    // Big target letter
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 60, 170, 120, 100);
    ctx.strokeStyle = '#0F380F';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 60, 170, 120, 100);

    ctx.fillStyle = '#0F380F';
    ctx.font = 'bold 72px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.targetLetter, cx, 250);

    // Choices
    for (let i = 0; i < this.choices.length; i++) {
      const pos = this.choicePositions[i];
      const isSelected = i === this.selectedIndex;

      // Choice box
      ctx.fillStyle = isSelected ? '#FFD700' : '#FFFFFF';
      ctx.fillRect(pos.x - 40, pos.y - 50, 80, 80);

      ctx.strokeStyle = isSelected ? '#FF6B6B' : '#0F380F';
      ctx.lineWidth = isSelected ? 6 : 3;
      ctx.strokeRect(pos.x - 40, pos.y - 50, 80, 80);

      // Letter
      ctx.fillStyle = '#0F380F';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.choices[i], pos.x, pos.y + 10);
    }

    // Instructions
    ctx.font = '16px monospace';
    ctx.fillStyle = '#0F380F';
    ctx.fillText('← → to choose • SPACE to select', cx, 450);
  }

  renderCorrect(ctx, cx, cy) {
    ctx.fillStyle = '#32CD32';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🌟 EXCELLENT! 🌟', cx, cy - 50);

    ctx.fillStyle = '#0F380F';
    ctx.font = 'bold 72px monospace';
    ctx.fillText(this.targetLetter, cx, cy + 50);

    ctx.font = '24px monospace';
    ctx.fillText('You found the right letter!', cx, cy + 100);

    // Draw celebration creatures
    this.game.assetLoader.drawSprite(ctx, 'fish', 'fish_blue', cx - 100, cy - 80, 2);
    this.game.assetLoader.drawSprite(ctx, 'fish', 'seahorse_yellow', cx + 60, cy - 80, 2);
  }

  renderWrong(ctx, cx, cy) {
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Oops! Try again!', cx, cy - 50);

    ctx.fillStyle = '#0F380F';
    ctx.font = '24px monospace';
    ctx.fillText(`Look for the letter: ${this.targetLetter}`, cx, cy + 20);

    ctx.font = '18px monospace';
    ctx.fillText('You can do it!', cx, cy + 60);
  }

  destroy() {
    // Cleanup
  }
}
