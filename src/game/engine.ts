import { COLLECTIBLE_ORDER, type CollectibleId } from '@/data/content';

export const WORLD_W = 800;
export const WORLD_H = 240;
export const GROUND_Y = 200;
export const SPRITE_SCALE = 3;

const PLAYER_X = 72;
const PLAYER_STAND_W = 10 * SPRITE_SCALE;
const PLAYER_STAND_H = 14 * SPRITE_SCALE;
const PLAYER_DUCK_W = 14 * SPRITE_SCALE;
const PLAYER_DUCK_H = 8 * SPRITE_SCALE;
const GRAVITY = 2600;
const JUMP_VELOCITY = 900;
const BASE_SPEED = 300;
const MAX_SPEED = 680;
const SPAWN_X = WORLD_W + 20;
const HITBOX_INSET = 4;
const PICKUP_SIZE = 9 * SPRITE_SCALE;
const PICKUP_TOP = GROUND_Y - 108;
const PICKUP_SPAWN_X = WORLD_W + 40;
const PICKUP_DISTANCES_M = [180, 420, 660, 900];

export type ObstacleKind = 'cactus' | 'bird-low' | 'bird-high';

export interface Obstacle {
  kind: ObstacleKind;
  x: number;
}

export interface Pickup {
  id: CollectibleId;
  x: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RunState {
  distancePx: number;
  speed: number;
  lift: number;
  verticalSpeed: number;
  ducking: boolean;
  elapsed: number;
  obstacles: Obstacle[];
  pickups: Pickup[];
  nextPickupIndex: number;
  nextObstacleIn: number;
}

export type RunEvent = { type: 'crash' } | { type: 'pickup'; id: CollectibleId };

const OBSTACLE_KINDS: ObstacleKind[] = ['cactus', 'bird-low', 'bird-high'];

export function createRun(): RunState {
  return {
    distancePx: 0,
    speed: BASE_SPEED,
    lift: 0,
    verticalSpeed: 0,
    ducking: false,
    elapsed: 0,
    obstacles: [],
    pickups: [],
    nextPickupIndex: 0,
    nextObstacleIn: 1.2,
  };
}

export function metersOf(run: RunState): number {
  return Math.floor(run.distancePx / 10);
}

export function jump(run: RunState): void {
  if (run.lift === 0 && run.verticalSpeed === 0) {
    run.verticalSpeed = JUMP_VELOCITY;
  }
}

export function playerBox(run: RunState): Box {
  if (run.ducking) {
    return { x: PLAYER_X, y: GROUND_Y - PLAYER_DUCK_H, w: PLAYER_DUCK_W, h: PLAYER_DUCK_H };
  }
  return { x: PLAYER_X, y: GROUND_Y - run.lift - PLAYER_STAND_H, w: PLAYER_STAND_W, h: PLAYER_STAND_H };
}

export function obstacleBox(obstacle: Obstacle): Box {
  switch (obstacle.kind) {
    case 'cactus':
      return { x: obstacle.x, y: GROUND_Y - 24, w: 30, h: 24 };
    case 'bird-low':
      return { x: obstacle.x, y: GROUND_Y - 18, w: 30, h: 18 };
    case 'bird-high':
      return { x: obstacle.x, y: GROUND_Y - 46, w: 30, h: 18 };
  }
}

export function pickupBox(pickup: Pickup): Box {
  return { x: pickup.x, y: PICKUP_TOP, w: PICKUP_SIZE, h: PICKUP_SIZE };
}

function shrink(box: Box, inset: number): Box {
  return { x: box.x + inset, y: box.y + inset, w: box.w - inset * 2, h: box.h - inset * 2 };
}

function intersects(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function updateVertical(run: RunState, dt: number): void {
  if (run.lift === 0 && run.verticalSpeed <= 0) {
    run.verticalSpeed = 0;
    return;
  }
  run.verticalSpeed -= GRAVITY * dt;
  run.lift += run.verticalSpeed * dt;
  if (run.lift <= 0) {
    run.lift = 0;
    run.verticalSpeed = 0;
  }
}

function spawnPickupIfDue(run: RunState): void {
  const meters = run.distancePx / 10;
  const threshold = PICKUP_DISTANCES_M[run.nextPickupIndex];
  if (threshold === undefined || meters < threshold) return;
  run.pickups.push({ id: COLLECTIBLE_ORDER[run.nextPickupIndex], x: PICKUP_SPAWN_X });
  run.nextPickupIndex += 1;
  run.nextObstacleIn = Math.max(run.nextObstacleIn, 1.5);
}

export function stepRun(run: RunState, dt: number, duckHeld: boolean): RunEvent | null {
  run.elapsed += dt;
  const dx = run.speed * dt;
  run.distancePx += dx;
  run.speed = Math.min(MAX_SPEED, BASE_SPEED + run.distancePx * 0.025);

  updateVertical(run, dt);
  run.ducking = duckHeld && run.lift === 0;

  for (const obstacle of run.obstacles) obstacle.x -= dx;
  run.obstacles = run.obstacles.filter((obstacle) => obstacle.x > -60);
  for (const pickup of run.pickups) pickup.x -= dx;
  run.pickups = run.pickups.filter((pickup) => pickup.x > -PICKUP_SIZE);

  spawnPickupIfDue(run);

  run.nextObstacleIn -= dt;
  if (run.nextObstacleIn <= 0) {
    const kind = OBSTACLE_KINDS[Math.floor(Math.random() * OBSTACLE_KINDS.length)];
    run.obstacles.push({ kind, x: SPAWN_X });
    run.nextObstacleIn = 0.9 + Math.random() * 0.9;
  }

  const player = shrink(playerBox(run), HITBOX_INSET);
  for (const obstacle of run.obstacles) {
    if (intersects(player, shrink(obstacleBox(obstacle), HITBOX_INSET))) {
      return { type: 'crash' };
    }
  }

  for (let index = 0; index < run.pickups.length; index += 1) {
    const pickup = run.pickups[index];
    if (intersects(playerBox(run), pickupBox(pickup))) {
      run.pickups.splice(index, 1);
      return { type: 'pickup', id: pickup.id };
    }
  }

  return null;
}
