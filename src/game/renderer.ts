import { SPRITES, COLLECTIBLE_COLORS, type Sprite } from '@/game/sprites';
import {
  GROUND_Y,
  SPRITE_SCALE,
  WORLD_H,
  WORLD_W,
  obstacleBox,
  pickupBox,
  playerBox,
  type RunState,
} from '@/game/engine';

const PEBBLE_COUNT = 9;

interface WorldPalette {
  ink: string;
  paper: string;
}

function readPalette(): WorldPalette {
  const styles = getComputedStyle(document.documentElement);
  return {
    ink: `rgb(${styles.getPropertyValue('--ink').trim()})`,
    paper: `rgb(${styles.getPropertyValue('--paper').trim()})`,
  };
}

function drawSprite(ctx: CanvasRenderingContext2D, rows: Sprite, x: number, y: number) {
  const px = Math.round(x);
  const py = Math.round(y);
  rows.forEach((row, rowIndex) => {
    for (let col = 0; col < row.length; col += 1) {
      if (row[col] === '#') {
        ctx.fillRect(px + col * SPRITE_SCALE, py + rowIndex * SPRITE_SCALE, SPRITE_SCALE, SPRITE_SCALE);
      }
    }
  });
}

export function drawWorld(ctx: CanvasRenderingContext2D, run: RunState): void {
  const { ink, paper } = readPalette();

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  ctx.fillStyle = ink;
  ctx.fillRect(0, GROUND_Y, WORLD_W, 2);

  for (let index = 0; index < PEBBLE_COUNT; index += 1) {
    const x = (((index * 157 - run.distancePx) % WORLD_W) + WORLD_W) % WORLD_W;
    ctx.fillRect(Math.round(x), GROUND_Y + 8 + (index % 3) * 6, 2 + (index % 2) * 4, 2);
  }

  ctx.fillStyle = ink;
  for (const obstacle of run.obstacles) {
    const box = obstacleBox(obstacle);
    if (obstacle.kind === 'cactus') {
      drawSprite(ctx, SPRITES.cactus, box.x, box.y);
    } else {
      const flapFrame = Math.floor(run.elapsed * 4) % 2 === 0 ? SPRITES.birdUp : SPRITES.birdDown;
      drawSprite(ctx, flapFrame, box.x, box.y);
    }
  }

  run.pickups.forEach((pickup, index) => {
    const box = pickupBox(pickup);
    const bob = Math.round(Math.sin(run.elapsed * 4 + index) * 3);
    const y = box.y + bob;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(box.x) - 6, y - 6, box.w + 12, box.h + 12);
    ctx.fillStyle = COLLECTIBLE_COLORS[pickup.id];
    drawSprite(ctx, SPRITES.icons[pickup.id], box.x, y);
  });

  const player = playerBox(run);
  let playerSprite: Sprite;
  if (run.ducking) {
    playerSprite = SPRITES.duck;
  } else if (run.lift > 0) {
    playerSprite = SPRITES.runA;
  } else {
    playerSprite = Math.floor(run.elapsed * 8) % 2 === 0 ? SPRITES.runA : SPRITES.runB;
  }
  ctx.fillStyle = ink;
  drawSprite(ctx, playerSprite, player.x, player.y);
}
