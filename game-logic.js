// game-logic.js - Pure game logic functions for Space Invaders
// Testable in Node.js, used by browser integration layer

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 26;  // 2x scaled from 13x8 original
    this.height = 16;
    this.lives = 3;   // Starting lives
    this.score = 0;   // Starting score
    this.canShoot = true;  // Only one shot at a time
    this.invulnerable = false;  // Temporary invulnerability after hit
    this.invulnerableTimer = 0; // Frames remaining for invulnerability
  }
}

class Alien {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.alive = true;
    this.animationFrame = 0; // 0 or 1 for sprite animation
    this.height = 16; // All aliens same height (2x scaled)
    
    // Set width and point value based on type (2x scaled dimensions)
    switch (type) {
      case 'octopus':
        this.width = 24;    // 2x scaled from 12x8
        this.pointValue = 30;
        break;
      case 'crab':
        this.width = 22;    // 2x scaled from 11x8  
        this.pointValue = 20;
        break;
      case 'squid':
        this.width = 16;    // 2x scaled from 8x8
        this.pointValue = 10;
        break;
      default:
        throw new Error(`Invalid alien type: ${type}`);
    }
  }
}

class Bullet {
  constructor(x, y, speed, type) {
    this.x = x;
    this.y = y;
    this.width = 2;   // 2x scaled from 1x4 original (now 2x8)
    this.height = 8;
    this.speed = speed;  // Positive = up (player), negative = down (alien)
    this.active = true;  // Is bullet in flight
    this.type = type;    // 'player' or 'alien'
  }
}

class Shield {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 44;  // 2x scaled from 22x16 original (now 44x32)
    this.height = 32;
    this.active = true;
    
    // Initialize damage map - 2D boolean array for pixel-perfect damage
    this.damageMap = [];
    for (let x = 0; x < this.width; x++) {
      this.damageMap[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.damageMap[x][y] = false; // false = intact, true = destroyed
      }
    }
    
    this._updateActiveStatus();
  }
  
  // Check if shield should become inactive due to heavy damage
  _updateActiveStatus() {
    let damagedPixels = 0;
    const totalPixels = this.width * this.height;
    
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.damageMap[x][y]) {
          damagedPixels++;
        }
      }
    }
    
    // Shield becomes inactive when >90% damaged
    if (damagedPixels > totalPixels * 0.9) {
      this.active = false;
    }
  }
}

// Collision detection functions - pure coordinate math

function checkBulletAlienCollision(bullet, alien) {
  if (!bullet.active || !alien.alive) {
    return false;
  }
  
  // Simple bounding box collision detection
  return (bullet.x < alien.x + alien.width &&
          bullet.x + bullet.width > alien.x &&
          bullet.y < alien.y + alien.height &&
          bullet.y + bullet.height > alien.y);
}

function checkBulletShieldCollision(bullet, shield) {
  if (!bullet.active || !shield.active) {
    return false;
  }
  
  // Check if bullet overlaps shield bounds
  if (bullet.x >= shield.x && bullet.x < shield.x + shield.width &&
      bullet.y >= shield.y && bullet.y < shield.y + shield.height) {
    
    // Apply damage to shield at collision point - create explosion-shaped damage
    const centerX = Math.floor(bullet.x - shield.x);
    const centerY = Math.floor(bullet.y - shield.y);
    
    // Create explosion-shaped damage pattern (based on original 1978 implementation)
    // Pattern varies by bullet type - player bullets vs alien bullets
    let damagePattern;
    if (bullet.type === 'player') {
      // Player bullets create smaller, more precise damage
      damagePattern = [
        [-1, -2], [0, -2], [1, -2],
        [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
        [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
        [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
        [-1, 2], [0, 2], [1, 2]
      ];
    } else {
      // Alien bullets create larger, more destructive damage
      damagePattern = [
        [-1, -3], [0, -3], [1, -3],
        [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
        [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1],
        [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0],
        [-3, 1], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1],
        [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
        [-1, 3], [0, 3], [1, 3]
      ];
    }
    
    // Apply damage pattern
    for (const [dx, dy] of damagePattern) {
      const damageX = centerX + dx;
      const damageY = centerY + dy;
      
      // Ensure damage coordinates are within bounds
      if (damageX >= 0 && damageX < shield.width && 
          damageY >= 0 && damageY < shield.height) {
        shield.damageMap[damageX][damageY] = true;
      }
    }
    
    shield._updateActiveStatus(); // Update shield active status after damage
    
    bullet.active = false; // Bullet is destroyed on impact
    return true;
  }
  
  return false;
}

function checkBulletPlayerCollision(bullet, player) {
  if (!bullet.active || player.invulnerable) {
    return false;
  }
  
  // Simple bounding box collision detection
  return (bullet.x < player.x + player.width &&
          bullet.x + bullet.width > player.x &&
          bullet.y < player.y + player.height &&
          bullet.y + bullet.height > player.y);
}

// Movement calculation functions

function moveAliens(formation) {
  const canvasWidth = 448; // 2x scaled canvas width  
  const edgeBuffer = 20;    // Margin from screen edge
  
  // Create a copy to avoid mutation
  const newFormation = {
    aliens: formation.aliens.map(row => row.map(alien => alien ? {...alien} : null)),
    direction: formation.direction,
    speed: formation.speed,
    aliveCount: formation.aliveCount,
    movementTimer: formation.movementTimer,
    baseMovementDelay: formation.baseMovementDelay
  };
  
  // Find the leftmost and rightmost alive aliens
  let leftmostX = canvasWidth;
  let rightmostX = 0;
  let shouldDrop = false;
  
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 11; col++) {
      const alien = newFormation.aliens[row][col];
      if (alien && alien.alive) {
        leftmostX = Math.min(leftmostX, alien.x);
        rightmostX = Math.max(rightmostX, alien.x + alien.width);
      }
    }
  }
  
  // Check if formation should drop and reverse direction
  if (newFormation.direction === 1 && rightmostX >= canvasWidth - edgeBuffer) {
    shouldDrop = true;
    newFormation.direction = -1;
  } else if (newFormation.direction === -1 && leftmostX <= edgeBuffer) {
    shouldDrop = true;
    newFormation.direction = 1;
  }
  
  // Apply movement to all living aliens
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 11; col++) {
      const alien = newFormation.aliens[row][col];
      if (alien && alien.alive) {
        if (shouldDrop) {
          // Drop down 16 pixels (2x scaled from 8 pixels)
          alien.y += 16;
        } else {
          // Move horizontally by speed
          alien.x += newFormation.direction * newFormation.speed;
        }
        
        // Toggle animation frame
        alien.animationFrame = alien.animationFrame === 0 ? 1 : 0;
      }
    }
  }
  
  // Adjust speed based on remaining alien count
  if (newFormation.aliveCount <= 10) {
    newFormation.speed = Math.max(newFormation.speed, 8); // 2x faster when few aliens remain
  }
  
  return newFormation;
}

class GameState {
  constructor() {
    this.state = 'playing'; // 'playing', 'game_over', 'level_complete'
    this.player = new Player(224, 450); // Center bottom with clearance above UI elements
    this.alienFormation = this._createAlienFormation();
    this.playerBullet = null; // Only one player bullet at a time
    this.alienBullets = []; // Array of alien bullets
    this.shields = this._createShields();
    this.frameCount = 0;
    this.lastAlienShot = 0;
  }
  
  _createAlienFormation() {
    const aliens = [];
    let aliveCount = 0;
    
    // Create 5x11 grid of aliens (55 total)
    for (let row = 0; row < 5; row++) {
      aliens[row] = [];
      for (let col = 0; col < 11; col++) {
        let alienType;
        // Top row: octopus (30 points)
        if (row === 0) alienType = 'octopus';
        // Middle 2 rows: crab (20 points)  
        else if (row === 1 || row === 2) alienType = 'crab';
        // Bottom 2 rows: squid (10 points)
        else alienType = 'squid';
        
        const x = col * 30 + 50; // Space aliens out horizontally for 448px width
        const y = row * 32 + 50;  // Space aliens out vertically
        
        aliens[row][col] = new Alien(x, y, alienType);
        aliveCount++;
      }
    }
    
    return {
      aliens: aliens,
      direction: 1, // 1 = right, -1 = left
      speed: 4,     // 2x scaled movement speed
      aliveCount: aliveCount,
      movementTimer: 0,
      baseMovementDelay: 48 // 48 frames between movements (0.8 seconds at 60fps)
    };
  }
  
  _createShields() {
    const shields = [];
    const shieldSpacing = 90; // Space shields evenly for 448px width
    const startX = 50;
    const shieldY = 400; // Position between aliens and player
    
    for (let i = 0; i < 4; i++) {
      shields.push(new Shield(startX + i * shieldSpacing, shieldY));
    }
    
    return shields;
  }
}

// Initialize new game
function initializeGame() {
  return new GameState();
}

// Update game state and check win/lose conditions
function updateGameState(gameState) {
  // Create a copy to avoid mutation
  const newState = {...gameState};
  
  // Check game over conditions
  if (newState.player.lives <= 0) {
    newState.state = 'game_over';
    return newState;
  }
  
  // Check if aliens reached player level (game over)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 11; col++) {
      const alien = newState.alienFormation.aliens[row][col];
      if (alien && alien.alive && alien.y >= newState.player.y - 50) {
        newState.state = 'game_over';
        return newState;
      }
    }
  }
  
  // Check level complete condition
  if (newState.alienFormation.aliveCount <= 0) {
    newState.state = 'level_complete';
    return newState;
  }
  
  // Game continues
  newState.state = 'playing';
  return newState;
}

// Score calculation function
function updateScore(currentScore, alienType) {
  const points = {
    'squid': 10,
    'crab': 20,
    'octopus': 30
  };
  
  return currentScore + (points[alienType] || 0);
}

// =============================================== 
// POLISH FEATURES - PURE LOGIC FUNCTIONS
// TDD Implementation: T024-T043
// ===============================================

// T024: Background Music System - Pure Logic Functions
function calculateTempo(totalAliens, remainingAliens, baseTempo) {
  // Validation
  if (totalAliens <= 0 || remainingAliens <= 0 || baseTempo <= 0) {
    throw new Error('Invalid parameters: all values must be positive');
  }
  
  // Calculate tempo based on alien count ratio: faster as fewer aliens remain
  const ratio = totalAliens / remainingAliens;
  const calculatedTempo = baseTempo * ratio;
  
  // Clamp to min/max limits - but handle edge case where more aliens than total
  const minTempo = 50;
  const maxTempo = 2000;
  
  if (remainingAliens > totalAliens) {
    return minTempo; // If somehow more aliens than total, return min tempo
  }
  
  return Math.max(minTempo, Math.min(maxTempo, calculatedTempo));
}

function createMusicState(frequencies, baseTempo) {
  // Validation
  if (!Array.isArray(frequencies) || frequencies.length !== 4) {
    throw new Error('Frequencies must be an array of exactly 4 numbers');
  }
  if (baseTempo < 50 || baseTempo > 2000) {
    throw new Error('Base tempo must be between 50 and 2000 milliseconds');
  }
  
  return {
    frequencies: [...frequencies], // Copy array
    currentNoteIndex: 0,
    baseTempo: baseTempo,
    currentTempo: baseTempo,
    isPlaying: false
  };
}

function updateMusicState(musicState, remainingAliens, totalAliens) {
  // Calculate new tempo
  const newTempo = calculateTempo(totalAliens, remainingAliens, musicState.baseTempo);
  
  // Advance note index (cycle 0->1->2->3->0)
  const newNoteIndex = (musicState.currentNoteIndex + 1) % 4;
  
  // Return new state object (immutable)
  return {
    ...musicState,
    currentNoteIndex: newNoteIndex,
    currentTempo: newTempo
  };
}

function getMusicCommands(musicState) {
  if (!musicState.isPlaying) {
    return [{ type: 'stop' }];
  }
  
  return [{
    type: 'play',
    frequency: musicState.frequencies[musicState.currentNoteIndex],
    tempo: musicState.currentTempo
  }];
}

function resetMusicState(musicState) {
  return {
    ...musicState,
    currentNoteIndex: 0,
    currentTempo: musicState.baseTempo,
    isPlaying: false
  };
}

// T029-T035: UFO System - Pure Logic Functions
function createUFO(screenWidth, direction) {
  // Validation
  if (screenWidth <= 0) {
    throw new Error('Screen width must be positive');
  }
  if (direction !== 1 && direction !== -1) {
    throw new Error('Direction must be 1 (right) or -1 (left)');
  }
  
  return {
    x: direction === 1 ? 0 : screenWidth, // Start at appropriate edge
    y: 32, // Fixed top position
    width: 16,
    height: 8,
    speed: 2,
    direction: direction,
    isActive: true,
    scoreValue: 0 // Set by scoring system
  };
}

function updateUFO(ufo, screenWidth) {
  // Move UFO horizontally
  ufo.x += ufo.speed * ufo.direction;
  
  // Check if UFO is off screen
  if (ufo.direction === 1 && ufo.x > screenWidth + ufo.width) {
    return false; // Should be removed
  }
  if (ufo.direction === -1 && ufo.x < -ufo.width) {
    return false; // Should be removed
  }
  
  return true; // Still active
}

function shouldSpawnUFO(lastSpawnTime, currentTime, averageInterval = 25000) {
  // Validation
  if (lastSpawnTime < 0 || currentTime < 0) {
    throw new Error('Times must be non-negative');
  }
  
  const timeSince = currentTime - lastSpawnTime;
  
  // Don't spawn if not enough time has passed
  if (timeSince < averageInterval * 0.5) { // At least half the average interval
    return false;
  }
  
  // Random chance increases over time
  const probability = Math.min(1.0, timeSince / averageInterval);
  return Math.random() < probability * 0.1; // 10% max chance per check
}

function calculateUFOScore(shotCount) {
  // Validation
  if (shotCount <= 0) {
    throw new Error('Shot count must be positive');
  }
  
  // Original 15-value scoring table from research - 23rd shot (index 7) = 300 points
  const scoringTable = [100, 50, 50, 100, 150, 100, 100, 300, 50, 100, 100, 100, 50, 150, 100];
  
  // Convert to 0-based index and cycle through table
  const tableIndex = (shotCount - 1) % 15;
  return scoringTable[tableIndex];
}

function getUFOSoundConfig(baseFrequency = 400, modulationRate = 6) {
  return {
    baseFrequency: baseFrequency,
    modulationRate: modulationRate
  };
}

function checkUFOCollision(ufo, shot) {
  // Simple rectangle intersection
  return (shot.x < ufo.x + ufo.width &&
          shot.x + shot.width > ufo.x &&
          shot.y < ufo.y + ufo.height &&
          shot.y + shot.height > ufo.y);
}

function processUFOHit(ufo, scoreValue, soundControl) {
  // Mark UFO as inactive
  ufo.isActive = false;
  
  // Stop UFO sound
  if (soundControl && typeof soundControl.stop === 'function') {
    soundControl.stop();
  }
  
  // Return score display info
  return {
    x: ufo.x,
    y: ufo.y,
    score: scoreValue,
    displayTime: 2000
  };
}

// T036-T043: Authentic UI System - Pure Logic Functions  
function formatScore(score, digits = 4) {
  // Validation
  if (score < 0) {
    throw new Error('Score must be non-negative');
  }
  if (digits <= 0) {
    throw new Error('Digits must be positive');
  }
  
  return score.toString().padStart(digits, '0');
}

function createCharacterBitmap(character) {
  // Simplified 8x8 bitmap font data (just enough to pass tests)
  const fontData = {
    'A': [
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,0,0,1,1,1,
      0,0,0,0,0,0,0,0
    ],
    '0': [
      0,1,1,1,1,1,1,0,
      1,1,1,1,1,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,1,1,1,1,1,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ],
    'S': [
      0,1,1,1,1,1,1,0,
      1,1,1,0,0,0,0,0,
      1,1,1,0,0,0,0,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,1,1,1,0,
      0,0,0,0,1,1,1,1,
      1,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ],
    'C': [
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,0,0,0,
      1,1,1,0,0,0,0,0,
      1,1,1,0,0,0,0,0,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    'O': [
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    'R': [
      1,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      1,1,1,1,1,1,0,0,
      1,1,1,1,1,0,0,0,
      1,1,1,0,1,1,0,0,
      1,1,1,0,0,1,1,0,
      0,0,0,0,0,0,0,0
    ],
    'E': [
      1,1,1,1,1,1,1,0,
      1,1,1,0,0,0,0,0,
      1,1,1,0,0,0,0,0,
      1,1,1,1,1,1,0,0,
      1,1,1,0,0,0,0,0,
      1,1,1,0,0,0,0,0,
      1,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ],
    '1': [
      0,0,1,1,0,0,0,0,
      0,1,1,1,0,0,0,0,
      1,1,1,1,0,0,0,0,
      0,0,1,1,0,0,0,0,
      0,0,1,1,0,0,0,0,
      0,0,1,1,0,0,0,0,
      1,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    '2': [
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      0,0,0,0,0,1,1,0,
      0,0,0,0,1,1,1,0,
      0,0,1,1,1,0,0,0,
      1,1,1,0,0,0,0,0,
      1,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ],
    '3': [
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      0,0,0,0,0,1,1,0,
      0,0,1,1,1,1,0,0,
      0,0,0,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    '4': [
      0,0,0,0,1,1,0,0,
      0,0,0,1,1,1,0,0,
      0,0,1,1,1,1,0,0,
      0,1,1,0,1,1,0,0,
      1,1,1,1,1,1,1,0,
      0,0,0,0,1,1,0,0,
      0,0,0,0,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    '5': [
      1,1,1,1,1,1,1,0,
      1,1,1,0,0,0,0,0,
      1,1,1,1,1,1,0,0,
      0,0,0,0,0,1,1,0,
      0,0,0,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    '6': [
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,0,0,0,
      1,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    '7': [
      1,1,1,1,1,1,1,0,
      0,0,0,0,0,1,1,0,
      0,0,0,0,1,1,0,0,
      0,0,0,1,1,0,0,0,
      0,0,1,1,0,0,0,0,
      0,1,1,0,0,0,0,0,
      1,1,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ],
    '8': [
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    '9': [
      0,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,1,1,0,
      0,0,0,0,0,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    'D': [
      1,1,1,1,1,1,0,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      1,1,1,0,0,1,1,0,
      1,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0
    ],
    'I': [
      1,1,1,1,1,1,1,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      1,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ],
    'T': [
      1,1,1,1,1,1,1,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,1,1,1,0,0,0,
      0,0,0,0,0,0,0,0
    ],
    '-': [
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      1,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ],
    '<': [
      0,0,0,0,1,1,0,0,
      0,0,1,1,0,0,0,0,
      1,1,0,0,0,0,0,0,
      1,1,0,0,0,0,0,0,
      0,0,1,1,0,0,0,0,
      0,0,0,0,1,1,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ],
    '>': [
      0,0,1,1,0,0,0,0,
      0,0,0,0,1,1,0,0,
      0,0,0,0,0,0,1,1,
      0,0,0,0,0,0,1,1,
      0,0,0,0,1,1,0,0,
      0,0,1,1,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ],
    '*': [
      0,0,0,0,0,0,0,0,
      0,0,1,0,1,0,0,0,
      0,0,0,1,0,0,0,0,
      1,1,1,1,1,1,1,0,
      0,0,0,1,0,0,0,0,
      0,0,1,0,1,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ],
    '=': [
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      1,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0,
      1,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ],
    'H': [
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      1,1,1,0,0,1,1,1,
      0,0,0,0,0,0,0,0
    ],
    ' ': [
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ]
  };
  
  const bitmap = fontData[character];
  if (!bitmap) {
    throw new Error(`Unsupported character: ${character}`);
  }
  
  return [...bitmap]; // Return copy
}

function generateTextBitmaps(text) {
  if (text === '') {
    return [];
  }
  
  return text.split('').map(char => createCharacterBitmap(char));
}

function createLivesSprites(livesCount) {
  // Validation
  if (livesCount < 0 || livesCount > 3) {
    throw new Error('Lives count must be between 0 and 3');
  }
  
  // Small cannon sprite (8x6 pixels)
  const cannonBitmap = [
    0,0,0,1,1,0,0,0,
    0,0,0,1,1,0,0,0,
    0,1,1,1,1,1,1,0,
    1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1
  ];
  
  const sprites = [];
  for (let i = 0; i < livesCount; i++) {
    sprites.push({
      x: i * 10, // 8-pixel width + 2-pixel spacing
      y: 0,
      bitmap: [...cannonBitmap]
    });
  }
  
  return sprites;
}

function calculateUIPositions(canvasWidth, canvasHeight) {
  // Based on original arcade layout proportions
  return {
    score: { x: Math.floor(canvasWidth * 0.07), y: Math.floor(canvasHeight * 0.03) },
    hiScore: { x: Math.floor(canvasWidth * 0.36), y: Math.floor(canvasHeight * 0.03) },
    credit: { x: Math.floor(canvasWidth * 0.71), y: Math.floor(canvasHeight * 0.94) },
    lives: { x: Math.floor(canvasWidth * 0.07), y: Math.floor(canvasHeight * 0.94) }
  };
}

function prepareScoreData(score, hiScore, positions) {
  const scoreText = formatScore(score, 4);
  const hiScoreText = formatScore(hiScore, 4);
  
  return {
    scoreText: scoreText,
    hiScoreText: hiScoreText,
    scorePosition: positions,
    hiScorePosition: { x: positions.x + 160, y: positions.y }, // Offset for hi-score
    scoreBitmaps: generateTextBitmaps(`SCORE<1> ${scoreText}`),
    hiScoreBitmaps: generateTextBitmaps(`HI-SCORE ${hiScoreText}`)
  };
}

function prepareLivesData(livesCount, position) {
  return {
    livesCount: livesCount,
    livesPosition: position,
    livesSprites: createLivesSprites(livesCount)
  };
}

function prepareCreditData(credits, position) {
  const creditText = `CREDIT ${formatScore(credits, 2)}`;
  
  return {
    creditText: creditText,
    creditPosition: position,
    creditBitmaps: generateTextBitmaps(creditText)
  };
}

// Export for Node.js testing (only when in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Player,
    Alien,
    Bullet,
    Shield,
    GameState,
    updateScore,
    checkBulletAlienCollision,
    checkBulletShieldCollision,
    checkBulletPlayerCollision,
    moveAliens,
    initializeGame,
    updateGameState,
    // Polish Features - Pure Logic Functions
    calculateTempo,
    createMusicState,
    updateMusicState,
    getMusicCommands,
    resetMusicState,
    createUFO,
    updateUFO,
    shouldSpawnUFO,
    calculateUFOScore,
    getUFOSoundConfig,
    checkUFOCollision,
    processUFOHit,
    formatScore,
    createCharacterBitmap,
    generateTextBitmaps,
    createLivesSprites,
    calculateUIPositions,
    prepareScoreData,
    prepareLivesData,
    prepareCreditData
  };
}