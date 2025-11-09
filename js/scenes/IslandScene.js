/**
 * IslandScene - main hub with player movement and interactables
 */
import { Player } from '../entities/Player.js';
import { Interactable } from '../entities/Interactable.js';

export class IslandScene {
  constructor(game, sceneManager) {
    this.game = game;
    this.sceneManager = sceneManager;
  }

  init(data = {}) {
    this.returnData = data; // Data from mini-games
  }

  create() {
    // Player setup
    this.player = new Player(400, 300, this.game.assetLoader);

    // Set walkable bounds (players can move within this area)
    this.bounds = {
      x: 100,
      y: 100,
      width: 600,
      height: 400
    };

    // Obstacles (palms, rocks, etc.) - simple rectangles for collision
    this.obstacles = [
      { x: 200, y: 150, width: 30, height: 40 }, // Palm tree 1
      { x: 500, y: 180, width: 30, height: 40 }, // Palm tree 2
      { x: 350, y: 250, width: 40, height: 30 }, // Rock
      { x: 150, y: 350, width: 25, height: 25 }, // Bush
      { x: 600, y: 350, width: 25, height: 25 }, // Bush
    ];

    // Create interactables
    this.interactables = [
      new Interactable(250, 450, 50, 50, {
        label: 'Go Fishing',
        targetScene: 'fishing'
      }),
      new Interactable(150, 200, 50, 50, {
        label: 'Count Fish',
        targetScene: 'counting'
      }),
      new Interactable(550, 220, 50, 50, {
        label: 'Learn Letters',
        targetScene: 'letters'
      })
    ];
  }

  update(deltaTime) {
    // Update player
    this.player.update(
      deltaTime,
      this.game.input,
      this.bounds,
      this.obstacles
    );

    // Check proximity to interactables
    for (const interactable of this.interactables) {
      interactable.checkProximity(this.player);

      // Handle interaction
      if (interactable.isNearby && this.game.input.spacePressed) {
        interactable.interact(this.sceneManager);
      }
    }

    // Clear "just pressed" states
    this.game.input.update();
  }

  render(ctx) {
    const atlas = this.game.assetLoader;

    // Draw background - simple sky and ground
    ctx.fillStyle = '#87CEEB'; // Sky
    ctx.fillRect(0, 0, 800, 200);

    ctx.fillStyle = '#F4D03F'; // Sand
    ctx.fillRect(0, 200, 800, 400);

    // Draw water edges
    ctx.fillStyle = '#2E86AB';
    ctx.fillRect(0, 430, 300, 170); // Left water
    ctx.fillRect(500, 430, 300, 170); // Right water

    // Draw decorations
    this.renderDecorations(ctx, atlas);

    // Draw obstacles (for visual reference - palms, rocks, bushes)
    this.renderObstacles(ctx, atlas);

    // Draw player
    this.player.render(ctx);

    // Draw interactables
    for (const interactable of this.interactables) {
      // Use appropriate sprites for each interactable
      let frameName = 'rock_small_1';
      if (interactable.label === 'Go Fishing') {
        frameName = 'wave_shallow'; // Fishing spot
      } else if (interactable.label === 'Count Fish') {
        frameName = 'bush_medium'; // Counting hut
      } else if (interactable.label === 'Learn Letters') {
        frameName = 'rock_cluster'; // Letter area
      }

      interactable.render(ctx, atlas, 'terrain', frameName);
    }

    // Draw UI
    this.renderUI(ctx);
  }

  renderDecorations(ctx, atlas) {
    // Draw some palms and bushes in the background
    const decorations = [
      { x: 50, y: 120, frame: 'palm_small' },
      { x: 700, y: 110, frame: 'palm_big' },
      { x: 300, y: 480, frame: 'wave_shallow' },
      { x: 400, y: 480, frame: 'wave_deep' },
    ];

    for (const deco of decorations) {
      atlas.drawSprite(ctx, 'terrain', deco.frame, deco.x, deco.y, 1);
    }
  }

  renderObstacles(ctx, atlas) {
    // Render visual obstacles
    const obstacleSprites = [
      { obstacle: this.obstacles[0], frame: 'palm_big' },
      { obstacle: this.obstacles[1], frame: 'palm_small' },
      { obstacle: this.obstacles[2], frame: 'rock_cluster' },
      { obstacle: this.obstacles[3], frame: 'bush_large' },
      { obstacle: this.obstacles[4], frame: 'bush_medium' },
    ];

    for (const { obstacle, frame } of obstacleSprites) {
      atlas.drawSprite(ctx, 'terrain', frame, obstacle.x, obstacle.y, 1);
    }
  }

  renderUI(ctx) {
    // Title
    ctx.fillStyle = '#0F380F';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("Maxi's Island", 400, 40);

    // Instructions
    ctx.font = '14px monospace';
    ctx.fillText('Arrow keys to move • Space to interact', 400, 580);

    ctx.textAlign = 'left';
  }

  destroy() {
    // Cleanup if needed
  }
}
