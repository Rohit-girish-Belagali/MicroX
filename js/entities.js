// ===================== entities.js =====================
// World-space gameplay entities. Units: 1 unit = one lane width.
// z is distance ahead of the turtle along the track (turtle sits at z = 0).

const LANE_X = [-1, 0, 1];
const GRAVITY = 36;
const SPAWN_AHEAD = 88;

// w = sprite width in world units; height = collision height (turtle must be above it).
const OBSTACLE_SPECS = {
  bottle:  { w: 0.95, height: 0.95, hover: 0.05 },
  bag:     { w: 1.15, height: 0.9,  hover: 0.08 },
  cup:     { w: 0.95, height: 0.95, hover: 0.05 },
  straw:   { w: 1.1,  height: 0.6,  hover: 0.04 },
  wrapper: { w: 1.1,  height: 0.7,  hover: 0.1 },
  net:     { w: 1.25, height: 99,   hover: 0, tall: true },
  sixpack: { w: 1.2,  height: 0.7,  hover: 0.06 },
  balloon: { w: 0.9,  height: 1.05, hover: 0.12 },
  microbeads: { w: 1.3, height: 0.85, hover: 0.1 }
};

const COLLECTIBLE_SPECS = {
  fish: { w: 0.62 }, seaweed: { w: 0.58 }, shell: { w: 0.58 },
  goldenShell: { w: 0.78 }, shieldBubble: { w: 0.85 }, cleanupToken: { w: 0.74 },
  rescuePod: { w: 0.95 }
};

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ---------------------------------------------------------------- Player --
// The swimmer the user picked. Movement feel comes from char.stats, so the
// dolphin jumps higher and the manta banks between lanes faster.
class Player {
  constructor(character) {
    this.char = character || CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
    this.lane = 1;
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.roll = 0;
    this.phase = 0;       // swim-stroke animation phase
    this.hitT = 0;
    this.collectT = 0;
    this.invulnT = 0;
    this.squash = 0;
    this.bumpT = 0;
  }

  get airborne() { return this.y > 0.001 || this.vy > 0; }

  moveLeft() {
    if (this.lane > 0) { this.lane--; return true; }
    this.bumpT = 0.25;
    return false;
  }

  moveRight() {
    if (this.lane < 2) { this.lane++; return true; }
    this.bumpT = 0.25;
    return false;
  }

  jump() {
    if (this.airborne) return false;
    this.vy = this.char.stats.jump;
    return true;
  }

  dive() {
    if (!this.airborne) return false;
    this.vy = Math.min(this.vy, -22);
    return true;
  }

  tickTimers(dt) {
    this.hitT = Math.max(0, this.hitT - dt);
    this.collectT = Math.max(0, this.collectT - dt);
    this.invulnT = Math.max(0, this.invulnT - dt);
    this.squash = Math.max(0, this.squash - dt);
    this.bumpT = Math.max(0, this.bumpT - dt);
  }

  idle(dt, strokeRate) {
    this.phase += dt * strokeRate;
    this.roll = lerp(this.roll, 0, Math.min(1, dt * 6));
    this.tickTimers(dt);
  }

  update(dt, strokeRate) {
    const tx = LANE_X[this.lane];
    const prevX = this.x;
    this.x = lerp(this.x, tx, Math.min(1, dt * this.char.stats.laneLerp));
    const vx = (this.x - prevX) / Math.max(dt, 0.0001);
    this.roll = lerp(this.roll, clamp(vx * 0.07, -0.45, 0.45), Math.min(1, dt * 12));

    if (this.airborne) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) {
        this.y = 0;
        if (this.vy < -4) this.squash = 0.18;
        this.vy = 0;
      }
    }

    this.phase += dt * strokeRate * (this.airborne ? 0.55 : 1);
    this.tickTimers(dt);
  }
}

// --------------------------------------------------------- World objects --
class WorldObject {
  constructor(kind, subtype, lane, worldZ, y, speciesId) {
    this.kind = kind;       // "obstacle" | "collectible"
    this.subtype = subtype;
    this.lane = lane;
    this.worldZ = worldZ;
    this.y = y;
    this.speciesId = speciesId || null;  // set on rescuePod only
    this.alive = true;
    this.bob = Math.random() * Math.PI * 2;
  }
  get laneX() { return LANE_X[this.lane]; }
}

class ShuffleBag {
  constructor(items) { this.items = items; this.bag = []; }
  next() {
    if (this.bag.length === 0) {
      this.bag = [...this.items];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.pop();
  }
}

const FOOD_TYPES = ["fish", "seaweed", "shell"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function otherLanes(...taken) { return [0, 1, 2].filter(l => !taken.includes(l)); }

class Spawner {
  constructor(isDiscovered) {
    this.bag = new ShuffleBag(OBSTACLE_TYPES);
    this.nextAt = 55;
    this.sinceRescue = 0;
    // predicate the game supplies so undiscovered species are favoured
    this.isDiscovered = isDiscovered || (() => false);
  }

  update(distance, speedFactor, objects) {
    while (this.nextAt < distance + SPAWN_AHEAD) {
      this.spawnPattern(this.nextAt, objects);
      this.sinceRescue++;
      if (this.sinceRescue >= 3 && Math.random() < 0.55) {
        this.sinceRescue = 0;
        this.rescue(objects, this.nextAt + 9);
      }
      this.nextAt += lerp(26, 15, speedFactor) + Math.random() * 6;
    }
  }

  // A rescue pod holds one species. Weight heavily towards species the player
  // has not met yet so the Codex fills up instead of repeating.
  rescue(objects, z) {
    const unknown = MARINE_SPECIES.filter(s => !this.isDiscovered(s.id));
    const pool = unknown.length && Math.random() < 0.85 ? unknown : MARINE_SPECIES;
    const species = pick(pool);
    const lane = Math.floor(Math.random() * 3);
    objects.push(new WorldObject("collectible", "rescuePod", lane, z, 0.62, species.id));
  }

  obstacle(objects, lane, z, type) {
    const spec = OBSTACLE_SPECS[type];
    objects.push(new WorldObject("obstacle", type, lane, z, spec.hover));
  }

  row(objects, lane, z, count, type, y = 0.45) {
    for (let i = 0; i < count; i++) {
      objects.push(new WorldObject("collectible", type, lane, z + i * 1.8, y));
    }
  }

  spawnPattern(z, objects) {
    const r = Math.random();
    const food = pick(FOOD_TYPES);

    if (r < 0.26) {
      // one obstacle, food trail in a neighbouring lane
      const lane = Math.floor(Math.random() * 3);
      this.obstacle(objects, lane, z, this.bag.next());
      this.row(objects, pick(otherLanes(lane)), z - 5, 5, food);
    } else if (r < 0.48) {
      // two blocked lanes, one open lane with reward
      const open = Math.floor(Math.random() * 3);
      const [a, b] = otherLanes(open);
      this.obstacle(objects, a, z, this.bag.next());
      this.obstacle(objects, b, z + (Math.random() < 0.5 ? 0 : 3), this.bag.next());
      this.row(objects, open, z - 3, 4, food);
    } else if (r < 0.7) {
      // jump arc over a low obstacle
      const lane = Math.floor(Math.random() * 3);
      const type = this.bag.next();
      this.obstacle(objects, lane, z, type);
      if (OBSTACLE_SPECS[type].tall) {
        this.row(objects, pick(otherLanes(lane)), z - 3, 4, food);
      } else {
        for (let i = 0; i < 5; i++) {
          const t = (i - 2) / 2;
          objects.push(new WorldObject("collectible", food, lane, z + (i - 2) * 1.7, 0.5 + 1.25 * (1 - t * t)));
        }
      }
    } else if (r < 0.9) {
      // zig-zag food trail, occasionally with a bonus in the middle
      let lane = Math.floor(Math.random() * 3);
      for (let i = 0; i < 7; i++) {
        if (i === 3 && Math.random() < 0.35) {
          objects.push(new WorldObject("collectible", this.pickBonus(), lane, z + i * 1.8, 0.5));
        } else {
          objects.push(new WorldObject("collectible", food, lane, z + i * 1.8, 0.45));
        }
        if (i % 3 === 2) lane = clamp(lane + (Math.random() < 0.5 ? -1 : 1), 0, 2);
      }
    } else {
      const lane = Math.floor(Math.random() * 3);
      objects.push(new WorldObject("collectible", this.pickBonus(), lane, z, 0.55));
    }
  }

  pickBonus() {
    const r = Math.random();
    if (r < 0.45) return "goldenShell";
    if (r < 0.78) return "cleanupToken";
    return "shieldBubble";
  }
}
