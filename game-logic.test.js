// game-logic.test.js - Node.js unit tests for Space Invaders game logic
// These tests MUST FAIL initially (RED phase) before implementation

const {
  initializeGame,
  checkBulletAlienCollision,
  checkBulletShieldCollision, 
  checkBulletPlayerCollision,
  updateScore,
  updateGameState,
  moveAliens,
  Player,
  Alien,
  Bullet,
  Shield,
  GameState
} = require('./game-logic.js');

describe('T004: Game Initialization Tests', () => {
  test('initializeGame creates game state with 55 aliens', () => {
    const gameState = initializeGame();
    expect(gameState.alienFormation.aliveCount).toBe(55);
    expect(gameState.player.lives).toBe(3);
    expect(gameState.player.score).toBe(0);
    expect(gameState.state).toBe('playing');
  });

  test('Player entity constructor creates valid player', () => {
    const player = new Player(400, 1100);
    expect(player.x).toBe(400);
    expect(player.y).toBe(1100);
    expect(player.lives).toBe(3);
    expect(player.score).toBe(0);
    expect(player.canShoot).toBe(true);
    expect(player.invulnerable).toBe(false);
  });

  test('Alien entity constructor creates valid aliens with correct types', () => {
    const octopus = new Alien(100, 100, 'octopus');
    expect(octopus.type).toBe('octopus');
    expect(octopus.pointValue).toBe(30);
    expect(octopus.alive).toBe(true);
    expect(octopus.width).toBe(24);
    expect(octopus.height).toBe(16);

    const crab = new Alien(100, 200, 'crab');
    expect(crab.pointValue).toBe(20);
    expect(crab.width).toBe(22);

    const squid = new Alien(100, 300, 'squid');
    expect(squid.pointValue).toBe(10);
    expect(squid.width).toBe(16);
  });

  test('Bullet entity constructor creates valid bullets', () => {
    const playerBullet = new Bullet(400, 1000, 8, 'player');
    expect(playerBullet.x).toBe(400);
    expect(playerBullet.y).toBe(1000);
    expect(playerBullet.speed).toBe(8);
    expect(playerBullet.type).toBe('player');
    expect(playerBullet.active).toBe(true);
  });

  test('Shield entity constructor creates valid shields', () => {
    const shield = new Shield(200, 800);
    expect(shield.x).toBe(200);
    expect(shield.y).toBe(800);
    expect(shield.width).toBe(44);
    expect(shield.height).toBe(32);
    expect(shield.active).toBe(true);
    expect(shield.damageMap).toBeDefined();
  });
});

describe('T005: Collision Detection Tests', () => {
  test('checkBulletAlienCollision returns true when coordinates overlap', () => {
    const bullet = new Bullet(100, 100, 8, 'player');
    const alien = new Alien(95, 95, 'squid');
    expect(checkBulletAlienCollision(bullet, alien)).toBe(true);
  });

  test('checkBulletAlienCollision returns false when no overlap', () => {
    const bullet = new Bullet(100, 100, 8, 'player');
    const alien = new Alien(200, 200, 'squid');
    expect(checkBulletAlienCollision(bullet, alien)).toBe(false);
  });

  test('checkBulletShieldCollision updates shield damage map', () => {
    const bullet = new Bullet(220, 820, 8, 'player');
    const shield = new Shield(200, 800);
    const result = checkBulletShieldCollision(bullet, shield);
    expect(result).toBe(true);
    expect(shield.damageMap[20][20]).toBe(true); // Damage at collision point
  });

  test('checkBulletPlayerCollision detects player hits', () => {
    const bullet = new Bullet(410, 1110, -2, 'alien');
    const player = new Player(400, 1100);
    expect(checkBulletPlayerCollision(bullet, player)).toBe(true);
  });
});

describe('T006: Score Calculation Tests', () => {
  test('updateScore awards correct points for alien types', () => {
    expect(updateScore(0, 'squid')).toBe(10);
    expect(updateScore(100, 'crab')).toBe(120);
    expect(updateScore(200, 'octopus')).toBe(230);
  });

  test('alien death increments score by correct amount', () => {
    const player = new Player(400, 1100);
    const squidScore = updateScore(player.score, 'squid');
    expect(squidScore).toBe(10);
    
    const crabScore = updateScore(squidScore, 'crab');
    expect(crabScore).toBe(30);
  });
});

describe('T007: Game State Transition Tests', () => {
  test('updateGameState handles game over when lives = 0', () => {
    const gameState = initializeGame();
    gameState.player.lives = 0;
    const newState = updateGameState(gameState);
    expect(newState.state).toBe('game_over');
  });

  test('updateGameState handles level complete when aliens = 0', () => {
    const gameState = initializeGame();
    gameState.alienFormation.aliveCount = 0;
    const newState = updateGameState(gameState);
    expect(newState.state).toBe('level_complete');
  });

  test('game state transitions work correctly', () => {
    const gameState = initializeGame();
    expect(gameState.state).toBe('playing');
    
    // Test normal playing state
    const playing = updateGameState(gameState);
    expect(playing.state).toBe('playing');
  });
});

describe('T008: Alien Movement Calculation Tests', () => {
  test('moveAliens moves formation horizontally by correct amount', () => {
    const aliens = [];
    for (let row = 0; row < 5; row++) {
      aliens[row] = [];
      for (let col = 0; col < 11; col++) {
        // Position aliens safely away from edges for 448px canvas
        aliens[row][col] = new Alien(col * 20 + 50, row * 32 + 50, 'squid');
      }
    }
    
    const formation = {
      aliens: aliens,
      direction: 1,
      speed: 4,
      aliveCount: 55
    };

    const moved = moveAliens(formation);
    expect(moved.aliens[0][0].x).toBe(54); // Moved 4 pixels right (50 + 4)
  });

  test('alien formation reverses direction at screen edges', () => {
    const aliens = [];
    for (let row = 0; row < 5; row++) {
      aliens[row] = [];
      for (let col = 0; col < 11; col++) {
        aliens[row][col] = new Alien(420, row * 32 + 50, 'squid'); // Near right edge for 448px canvas
      }
    }

    const formation = {
      aliens: aliens,
      direction: 1,
      speed: 4,
      aliveCount: 55
    };

    const moved = moveAliens(formation);
    expect(moved.direction).toBe(-1); // Direction reversed
    expect(moved.aliens[0][0].y).toBe(66); // Dropped down 16 pixels (50 + 16)
  });
});

describe('T009: Shield Damage Logic Tests', () => {
  test('shield damage bitmap updates correctly on bullet hit', () => {
    const shield = new Shield(200, 800);
    const bullet = new Bullet(222, 816, 8, 'player');
    
    checkBulletShieldCollision(bullet, shield);
    
    // Check damage was applied at collision point
    const damageX = Math.floor(bullet.x - shield.x);
    const damageY = Math.floor(bullet.y - shield.y); 
    expect(shield.damageMap[damageX][damageY]).toBe(true);
  });

  test('shield becomes inactive when heavily damaged', () => {
    const shield = new Shield(200, 800);
    
    // Simulate heavy damage (>90% of pixels)
    let damageCount = 0;
    const totalPixels = shield.width * shield.height;
    
    for (let x = 0; x < shield.width; x++) {
      for (let y = 0; y < shield.height; y++) {
        if (damageCount < totalPixels * 0.95) {
          shield.damageMap[x][y] = true;
          damageCount++;
        }
      }
    }
    
    // Call _updateActiveStatus to check if shield should become inactive
    shield._updateActiveStatus();
    
    // Shield should become inactive
    expect(shield.active).toBe(false);
  });
});

describe('T010: Player Lifecycle Integration Tests', () => {
  test('player hit reduces lives by 1 and triggers invulnerability', () => {
    const player = new Player(400, 1100);
    const bullet = new Bullet(410, 1110, -2, 'alien');
    
    if (checkBulletPlayerCollision(bullet, player)) {
      player.lives--;
      player.invulnerable = true;
      player.invulnerableTimer = 120;
    }
    
    expect(player.lives).toBe(2);
    expect(player.invulnerable).toBe(true);
    expect(player.invulnerableTimer).toBe(120);
  });

  test('full player hit and respawn cycle', () => {
    const gameState = initializeGame();
    const originalLives = gameState.player.lives;
    
    // Player gets hit
    gameState.player.lives--;
    gameState.player.invulnerable = true;
    gameState.player.invulnerableTimer = 120;
    
    expect(gameState.player.lives).toBe(originalLives - 1);
    expect(gameState.player.invulnerable).toBe(true);
    
    // Simulate invulnerability wearing off
    gameState.player.invulnerableTimer = 0;
    gameState.player.invulnerable = false;
    
    expect(gameState.player.invulnerable).toBe(false);
  });
});

describe('T011: Alien Formation Behavior Integration Tests', () => {
  test('formation moves together and changes direction at edges', () => {
    const gameState = initializeGame();
    const formation = gameState.alienFormation;
    
    // Move formation to right edge
    formation.aliens[0][10].x = 1580; // Rightmost alien near edge
    
    const moved = moveAliens(formation);
    
    expect(moved.direction).toBe(-1); // Direction reversed
    // All aliens should have dropped down
    expect(moved.aliens[0][0].y).toBeGreaterThan(formation.aliens[0][0].y);
  });

  test('formation speed increases when alien count decreases', () => {
    const gameState = initializeGame();
    const formation = gameState.alienFormation;
    const originalSpeed = formation.speed;
    
    // Reduce alien count to trigger speed increase
    formation.aliveCount = 10; // Fewer than threshold
    
    const moved = moveAliens(formation);
    expect(moved.speed).toBeGreaterThan(originalSpeed);
  });
});

describe('T013: Game Loop Integration Tests', () => {
  test('aliens move after exact movement delay ticks', () => {
    const gameState = initializeGame();
    const originalAlienX = gameState.alienFormation.aliens[0][0].x;
    
    // Simulate game ticks - aliens should move after baseMovementDelay frames
    for (let frame = 0; frame < gameState.alienFormation.baseMovementDelay - 1; frame++) {
      gameState.alienFormation.movementTimer++;
      if (gameState.alienFormation.movementTimer >= gameState.alienFormation.baseMovementDelay) {
        gameState.alienFormation = moveAliens(gameState.alienFormation);
        gameState.alienFormation.movementTimer = 0;
      }
    }
    
    // After 47 frames, aliens should NOT have moved yet
    expect(gameState.alienFormation.aliens[0][0].x).toBe(originalAlienX);
    
    // On the 48th frame, they should move
    gameState.alienFormation.movementTimer++;
    if (gameState.alienFormation.movementTimer >= gameState.alienFormation.baseMovementDelay) {
      gameState.alienFormation = moveAliens(gameState.alienFormation);
      gameState.alienFormation.movementTimer = 0;
    }
    
    // Now aliens should have moved by their speed (4 pixels)
    expect(gameState.alienFormation.aliens[0][0].x).toBe(originalAlienX + 4);
  });
  
  test('full game loop simulation shows alien movement over multiple cycles', () => {
    const gameState = initializeGame();
    const originalAlienX = gameState.alienFormation.aliens[0][0].x;
    let totalFrames = 0;
    let movements = 0;
    
    // Simulate 200 frames of the game loop (about 3.3 seconds at 60fps)
    for (let frame = 0; frame < 200; frame++) {
      totalFrames++;
      
      // This mirrors the browser updateGame() function
      gameState.alienFormation.movementTimer++;
      if (gameState.alienFormation.movementTimer >= gameState.alienFormation.baseMovementDelay) {
        gameState.alienFormation = moveAliens(gameState.alienFormation);
        gameState.alienFormation.movementTimer = 0;
        movements++;
      }
    }
    
    // After 200 frames, we should have had at least 4 movement cycles (200/48 = 4.16)
    expect(movements).toBeGreaterThanOrEqual(4);
    
    // The alien should have moved from its original position
    const finalAlienX = gameState.alienFormation.aliens[0][0].x; 
    expect(finalAlienX).not.toBe(originalAlienX);
  });

  test('collision detection works between player bullet and aliens', () => {
    const gameState = initializeGame();
    
    // Position player bullet to hit first alien
    const firstAlien = gameState.alienFormation.aliens[0][0];
    gameState.playerBullet = new Bullet(
      firstAlien.x + 5, // Inside alien bounds
      firstAlien.y + 5,
      8,
      'player'
    );
    
    // Test collision
    const collision = checkBulletAlienCollision(gameState.playerBullet, firstAlien);
    expect(collision).toBe(true);
    
    // After collision, alien should be marked as dead and bullet as inactive
    if (collision) {
      firstAlien.alive = false;
      gameState.playerBullet.active = false;
      gameState.alienFormation.aliveCount--;
      gameState.player.score = updateScore(gameState.player.score, firstAlien.type);
    }
    
    expect(firstAlien.alive).toBe(false);
    expect(gameState.playerBullet.active).toBe(false);
    expect(gameState.alienFormation.aliveCount).toBe(54);
    expect(gameState.player.score).toBe(30); // Octopus = 30 points
  });
});

describe('T012: Win/Lose Condition Integration Tests', () => {
  test('game over triggered when player lives reach 0', () => {
    const gameState = initializeGame();
    gameState.player.lives = 0;
    
    const newState = updateGameState(gameState);
    expect(newState.state).toBe('game_over');
  });

  test('game over triggered when aliens reach bottom', () => {
    const gameState = initializeGame();
    
    // Move aliens to bottom of screen
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 11; col++) {
        if (gameState.alienFormation.aliens[row][col]) {
          gameState.alienFormation.aliens[row][col].y = 1100; // Near player level
        }
      }
    }
    
    const newState = updateGameState(gameState);
    expect(newState.state).toBe('game_over');
  });

  test('level complete triggered when alien count = 0', () => {
    const gameState = initializeGame();
    gameState.alienFormation.aliveCount = 0;
    
    const newState = updateGameState(gameState);
    expect(newState.state).toBe('level_complete');
  });
});