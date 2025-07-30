# Game Interface Contract: Space Invaders

## Game State API

### Game Initialization
```javascript
// Initialize new game
function initializeGame(canvasElement)
// Returns: GameState object
// Preconditions: Canvas element exists and is 1600x1200
// Postconditions: Game state is 'playing', player has 3 lives, 55 aliens alive
```

### Input Handling
```javascript
// Process player input
function handleInput(keyCode, isPressed)
// Parameters: keyCode (ArrowLeft|ArrowRight|Space), isPressed (boolean)
// Effects: Updates player movement state and shooting
// Constraints: Only one player shot allowed on screen
```

### Game Loop
```javascript
// Main game update cycle
function updateGame(deltaTime)
// Parameters: deltaTime in milliseconds
// Effects: Updates all entity positions, handles collisions, checks win/lose
// Returns: Updated game state
// Frequency: Called at 60fps via requestAnimationFrame
```

### Collision Detection
```javascript
// Check bullet vs alien collision
function checkBulletAlienCollision(bullet, alien)
// Returns: boolean (true if collision occurred)
// Effects: If collision, alien.alive = false, bullet.active = false

// Check bullet vs shield collision  
function checkBulletShieldCollision(bullet, shield)
// Returns: boolean (true if collision occurred)
// Effects: If collision, updates shield.damageMap, bullet.active = false

// Check bullet vs player collision
function checkBulletPlayerCollision(bullet, player)
// Returns: boolean (true if collision occurred)
// Effects: If collision, player.lives--, bullet.active = false
```

### Rendering Pipeline
```javascript
// Render current game state
function renderGame(gameState, canvasContext)
// Parameters: Current game state, 2D canvas context
// Effects: Draws all sprites, UI elements, and effects to canvas
// Performance: Must complete within 16ms for 60fps
```

## Data Contracts

### Player State Contract
```javascript
{
  x: number,              // Range: [0, canvas.width - player.width]
  y: number,              // Fixed: canvas.height - player.height - 10
  lives: number,          // Range: [0, 3]
  score: number,          // Range: [0, Infinity)
  canShoot: boolean,      // true when no player bullet active
  invulnerable: boolean,  // true for 2 seconds after hit
  invulnerableTimer: number // Range: [0, 120] frames
}
```

### Alien Formation Contract
```javascript
{
  aliens: Alien[5][11],   // Fixed 5x11 grid
  direction: number,      // Values: 1 or -1
  speed: number,          // Base: 2, increases as aliens die
  aliveCount: number,     // Range: [0, 55]
  movementTimer: number,  // Countdown from baseMovementDelay
  baseMovementDelay: 48   // Constant: 48 frames between moves
}
```

### Bullet Physics Contract
```javascript
{
  x: number,              // Current position
  y: number,              // Current position  
  speed: number,          // Player: +4px/frame, Alien: -2px/frame
  active: boolean,        // false when off-screen or collision
  type: 'player'|'alien'  // Determines collision behavior
}
```

### Shield Damage Contract
```javascript
{
  x: number,              // Fixed position
  y: number,              // Fixed position
  damageMap: boolean[88][64], // true = destroyed pixel
  active: boolean,        // false when >90% destroyed
  collisionMask: ImageData    // For pixel-perfect collision
}
```

## Event Contracts

### Game Events
```javascript
// Alien destroyed event
{
  type: 'alien_destroyed',
  alien: Alien,
  pointsAwarded: number,
  totalScore: number
}

// Player hit event  
{
  type: 'player_hit', 
  livesRemaining: number,
  invulnerabilityStarted: boolean
}

// Level complete event
{
  type: 'level_complete',
  finalScore: number,
  aliensDestroyed: number
}

// Game over event
{
  type: 'game_over',
  cause: 'no_lives'|'aliens_reached_bottom',
  finalScore: number
}
```

## Performance Contracts

### Frame Rate Requirements
- Target: 60 FPS (16.67ms per frame)
- Game update: <10ms per frame
- Rendering: <6ms per frame on 1600x1200 canvas
- Input processing: <1ms per frame

### Memory Constraints
- Maximum objects: 100 active bullets, 55 aliens, 4 shields, 1 player
- Garbage collection: Minimize object creation/destruction during gameplay
- Canvas operations: Use putImageData for 2x scaled sprites, avoid frequent getImageData on large canvas

### Timing Contracts
- Alien movement: Every 48 frames (0.8 seconds at 60fps)
- Alien shooting: Random interval, 1-4 seconds between shots
- Player invulnerability: 120 frames (2 seconds)
- Input responsiveness: <1 frame delay from keypress to action

## Testing Strategy

### Node.js Unit Tests (Automated)
Test pure game logic functions in isolation:

```javascript
// game-logic.test.js - Run with Node.js
const { checkCollision, updateScore, moveAliens, updateGameState } = require('./game-logic.js');

describe('Collision Detection', () => {
  test('bullet-alien overlap returns true when coordinates intersect')
  test('bullet-alien no overlap returns false')
  test('bullet-shield collision updates damage bitmap correctly')
})

describe('Game Rules', () => {
  test('alien death awards correct points (squid=10, crab=20, octopus=30)')
  test('player hit decrements lives by 1')
  test('game over when lives = 0')
  test('level complete when alien count = 0')
})

describe('Movement Logic', () => {
  test('alien formation moves 2 pixels horizontally')
  test('aliens drop 8 pixels when hitting edge')
  test('formation direction reverses at screen boundaries')
  test('speed increases when fewer aliens remain')
})
```

### Manual Browser Integration (Human-Performed)
Test complete game functionality:
- Game loads and is playable
- Controls work (arrow keys, spacebar)
- Visual elements render correctly
- Game feels authentic to 1980s arcade experience

### Architecture for Testing
```javascript
// Separate pure logic from browser APIs
const GameLogic = {
  checkCollision: (obj1, obj2) => { /* pure math */ },
  updateScore: (currentScore, alienType) => { /* pure logic */ },
  moveAliens: (aliens, direction) => { /* pure logic */ },
  // ... other pure functions
};

// Browser-specific code uses GameLogic
function gameLoop() {
  // Get input from browser
  // Call GameLogic functions  
  // Render to canvas
}
```

### What NOT to Test (Infrastructure):
- Canvas API calls
- Keyboard event handling
- RequestAnimationFrame timing
- DOM manipulation
- Browser performance