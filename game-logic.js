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
    
    // Apply damage to shield at collision point - create 3x3 damage area
    const centerX = Math.floor(bullet.x - shield.x);
    const centerY = Math.floor(bullet.y - shield.y);
    
    // Create 3x3 damage area around impact point
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const damageX = centerX + dx;
        const damageY = centerY + dy;
        
        // Ensure damage coordinates are within bounds
        if (damageX >= 0 && damageX < shield.width && 
            damageY >= 0 && damageY < shield.height) {
          shield.damageMap[damageX][damageY] = true;
        }
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
    this.player = new Player(224, 480); // Center bottom of 448x512 canvas
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
    updateGameState
  };
}