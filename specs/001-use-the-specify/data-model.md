# Data Model: Classic 1980s Space Invaders Game

## Core Entities

### Player Entity
```javascript
{
  x: number,              // Horizontal position (pixels)
  y: number,              // Vertical position (fixed at bottom)
  width: 52,              // Sprite width (scaled)
  height: 32,             // Sprite height (scaled)
  lives: number,          // Remaining lives (starts at 3)
  score: number,          // Current score
  canShoot: boolean,      // Can fire (only one shot at a time)
  invulnerable: boolean,  // Temporary invulnerability after hit
  invulnerableTimer: number // Frames remaining for invulnerability
}
```

**Validation Rules**:
- `x` must be >= 0 and <= (canvas.width - player.width)
- `y` is constant at (canvas.height - player.height - 10)
- `lives` must be >= 0 and <= 3
- `score` must be >= 0
- `invulnerableTimer` decrements each frame when > 0

**State Transitions**:
- Normal → Invulnerable (when hit by alien bullet)
- Invulnerable → Normal (when invulnerableTimer reaches 0)
- Lives > 0 → Lives = 0 (game over condition)

### Alien Entity
```javascript
{
  x: number,              // Horizontal position
  y: number,              // Vertical position
  type: string,           // 'octopus', 'crab', or 'squid'
  pointValue: number,     // 30, 20, or 10 respectively
  alive: boolean,         // Is alien active
  animationFrame: number, // 0 or 1 for sprite animation
  width: number,          // Sprite width (varies by type)
  height: 32              // All aliens same height (scaled)
}
```

**Validation Rules**:
- `type` must be one of: 'octopus', 'crab', 'squid'
- `pointValue` correlates with type: octopus=30, crab=20, squid=10
- `animationFrame` must be 0 or 1
- `x, y` must be within canvas bounds when alive=true

**State Transitions**:
- Alive → Dead (when hit by player bullet)
- animationFrame toggles between 0 and 1 each movement cycle

### Alien Formation Entity
```javascript
{
  aliens: Alien[][],      // 5x11 grid of aliens
  direction: number,      // 1 (right) or -1 (left)
  speed: number,          // Pixels per movement cycle
  dropDistance: 32,       // Pixels to drop when changing direction
  movementTimer: number,  // Frames until next movement
  baseMovementDelay: 48,  // Base frames between movements
  aliveCount: number      // Count of living aliens
}
```

**Validation Rules**:
- `aliens` must be 5 rows × 11 columns
- `direction` must be 1 or -1
- `speed` increases as `aliveCount` decreases
- `movementTimer` counts down from `baseMovementDelay`

**State Transitions**:
- Direction reverses when formation hits screen edge
- Speed increases when aliveCount drops below thresholds
- Formation drops down when direction reverses

### Bullet Entity
```javascript
{
  x: number,              // Horizontal position
  y: number,              // Vertical position
  width: 4,               // Bullet width (scaled)
  height: 16,             // Bullet height (scaled)
  speed: number,          // Pixels per frame (positive=up, negative=down)
  active: boolean,        // Is bullet in flight
  type: string            // 'player' or 'alien'
}
```

**Validation Rules**:
- `x, y` must be within extended canvas bounds (including off-screen)
- `speed` is positive for player bullets, negative for alien bullets
- Only one player bullet can be active at a time
- Multiple alien bullets can be active simultaneously

**State Transitions**:
- Inactive → Active (when fired)
- Active → Inactive (when hits target or goes off-screen)

### Shield Entity
```javascript
{
  x: number,              // Horizontal position
  y: number,              // Vertical position
  width: 88,              // Shield width (scaled)
  height: 64,             // Shield height (scaled)
  damageMap: boolean[][],  // Pixel-level damage tracking
  active: boolean         // Is shield still providing cover
}
```

**Validation Rules**:
- `damageMap` is 88×64 boolean array (true = destroyed pixel)
- `active` becomes false when shield is completely destroyed
- Position is fixed after initial placement

**State Transitions**:
- Intact → Damaged (when hit by bullets)
- Damaged → Destroyed (when damage exceeds threshold)

### Game State Entity
```javascript
{
  state: string,          // 'playing', 'game_over', 'level_complete'
  player: Player,         // Player entity
  alienFormation: AlienFormation, // Alien formation entity
  playerBullet: Bullet,   // Player's bullet (only one)
  alienBullets: Bullet[], // Array of alien bullets
  shields: Shield[],      // Array of 4 shields
  frameCount: number,     // Total frames elapsed
  lastAlienShot: number   // Frame count of last alien shot
}
```

**Validation Rules**:
- `state` must be one of: 'playing', 'game_over', 'level_complete'
- `shields` array must contain exactly 4 shield entities
- `alienBullets` array size is managed dynamically
- `frameCount` increments each game loop iteration

**State Transitions**:
- Playing → Game Over (when player lives = 0 or aliens reach bottom)
- Playing → Level Complete (when all aliens destroyed)
- Frame-based timers drive alien shooting frequency

## Relationships

### Player ↔ Bullets
- Player can fire only when `canShoot = true`
- Player bullet creation sets `canShoot = false`
- Player bullet destruction sets `canShoot = true`

### Aliens ↔ Bullets
- Random alien selection for shooting
- Alien bullets fired from alien position
- Multiple alien bullets can exist simultaneously

### All Entities ↔ Shields
- All bullets can collide with shields
- Collisions cause pixel-level damage to shield damageMap
- Shields provide cover until completely destroyed

### Collision Relationships
- Player bullets destroy aliens (alien → dead, bullet → inactive)
- Alien bullets destroy player (player lives--, bullet → inactive)
- All bullets destroy shield pixels (pixel → damaged, bullet → inactive)
- Aliens reaching player level trigger game over

## Performance Considerations

### Memory Management
- Bullet object pooling to avoid garbage collection
- Shield damage maps use bitwise operations for efficiency
- Alien grid uses sparse representation (dead aliens = null)

### Rendering Optimization
- Dirty rectangle tracking for partial screen updates
- Sprite caching with pre-scaled pixel data
- Efficient collision detection using bounding boxes before pixel-perfect checks