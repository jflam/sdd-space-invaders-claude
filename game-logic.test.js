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
  GameState,
  // NEW POLISH FEATURE FUNCTIONS - These don't exist yet (RED phase)
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

// =============================================== 
// T004-T023: POLISH FEATURES CONTRACT TESTS (RED PHASE)
// These tests MUST FAIL first before implementation
// ===============================================

describe('T004-T008: Background Music System Tests - Pure Logic', () => {
  test('T004: calculateTempo() - tempo calculation algorithm', () => {
    // Test tempo calculation based on alien count ratio
    expect(calculateTempo(55, 55, 500)).toBe(500); // Initial tempo
    expect(calculateTempo(55, 28, 500)).toBeCloseTo(982, 0); // Roughly 2x faster
    expect(calculateTempo(55, 1, 500)).toBe(2000); // Max tempo limit
    expect(calculateTempo(55, 100, 500)).toBe(50); // Min tempo limit
    
    // Test edge cases
    expect(() => calculateTempo(0, 1, 500)).toThrow();
    expect(() => calculateTempo(55, 0, 500)).toThrow();
    expect(() => calculateTempo(-1, 1, 500)).toThrow();
  });

  test('T005: createMusicState() - music state object creation', () => {
    const frequencies = [130, 116, 98, 87];
    const baseTempo = 500;
    
    const state = createMusicState(frequencies, baseTempo);
    
    expect(state.frequencies).toEqual([130, 116, 98, 87]);
    expect(state.currentNoteIndex).toBe(0);
    expect(state.baseTempo).toBe(500);
    expect(state.currentTempo).toBe(500);
    expect(state.isPlaying).toBe(false);
    
    // Test validation
    expect(() => createMusicState([130, 116, 98], 500)).toThrow(); // Wrong array length
    expect(() => createMusicState([130, 116, 98, 87], 30)).toThrow(); // Tempo too low
    expect(() => createMusicState([130, 116, 98, 87], 3000)).toThrow(); // Tempo too high
  });

  test('T006: updateMusicState() - state transitions and note progression', () => {
    const initialState = createMusicState([130, 116, 98, 87], 500);
    
    const updatedState = updateMusicState(initialState, 25, 55);
    
    expect(updatedState.currentNoteIndex).toBe(1); // Advanced to next note
    expect(updatedState.currentTempo).toBeCloseTo(1100, 0); // Faster tempo due to fewer aliens
    expect(updatedState.frequencies).toEqual([130, 116, 98, 87]); // Unchanged
    
    // Test note index cycling (0->1->2->3->0)
    let state = createMusicState([130, 116, 98, 87], 500);
    state.currentNoteIndex = 3;
    const cycledState = updateMusicState(state, 55, 55);
    expect(cycledState.currentNoteIndex).toBe(0); // Cycled back to start
  });

  test('T007: getMusicCommands() - observable commands for audio system', () => {
    const musicState = createMusicState([130, 116, 98, 87], 500);
    musicState.isPlaying = true;
    musicState.currentNoteIndex = 1;
    musicState.currentTempo = 300;
    
    const commands = getMusicCommands(musicState);
    
    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);
    expect(commands[0]).toEqual({
      type: 'play',
      frequency: 116, // frequencies[1]
      tempo: 300
    });
    
    // Test stopped state
    const stoppedState = { ...musicState, isPlaying: false };
    const stopCommands = getMusicCommands(stoppedState);
    expect(stopCommands[0]).toEqual({ type: 'stop' });
  });

  test('T008: resetMusicState() - clean state reset', () => {
    const initialState = createMusicState([130, 116, 98, 87], 500);
    // Modify the state
    const modifiedState = {
      ...initialState,
      currentNoteIndex: 2,
      currentTempo: 200,
      isPlaying: true
    };
    
    const resetState = resetMusicState(modifiedState);
    
    expect(resetState.currentNoteIndex).toBe(0);
    expect(resetState.currentTempo).toBe(500); // Back to baseTempo
    expect(resetState.isPlaying).toBe(false);
    expect(resetState.frequencies).toEqual([130, 116, 98, 87]); // Preserved
  });
});

describe('T009-T015: UFO System Tests - Pure Logic', () => {
  test('T009: createUFO() - UFO entity creation', () => {
    const screenWidth = 448;
    
    // Test left-to-right UFO
    const ufoRight = createUFO(screenWidth, 1);
    expect(ufoRight.x).toBe(0); // Starts at left edge
    expect(ufoRight.y).toBe(32); // Fixed top position
    expect(ufoRight.width).toBe(16);
    expect(ufoRight.height).toBe(8);
    expect(ufoRight.speed).toBe(2);
    expect(ufoRight.direction).toBe(1);
    expect(ufoRight.isActive).toBe(true);
    expect(ufoRight.scoreValue).toBe(0); // Set later by scoring system
    
    // Test right-to-left UFO
    const ufoLeft = createUFO(screenWidth, -1);
    expect(ufoLeft.x).toBe(screenWidth); // Starts at right edge
    expect(ufoLeft.direction).toBe(-1);
    
    // Test validation
    expect(() => createUFO(0, 1)).toThrow(); // Invalid screen width
    expect(() => createUFO(448, 2)).toThrow(); // Invalid direction
  });

  test('T010: updateUFO() - movement logic and bounds checking', () => {
    const screenWidth = 448;
    const ufo = createUFO(screenWidth, 1);
    
    // Test normal movement
    const stillActive = updateUFO(ufo, screenWidth);
    expect(stillActive).toBe(true);
    expect(ufo.x).toBe(2); // Moved by speed (2 pixels)
    
    // Test off-screen removal
    ufo.x = screenWidth + 20; // Move off screen
    const shouldRemove = updateUFO(ufo, screenWidth);
    expect(shouldRemove).toBe(false); // Should be removed
  });

  test('T011: shouldSpawnUFO() - spawn timing logic', () => {
    const currentTime = 30000; // 30 seconds
    const lastSpawnTime = 5000; // 5 seconds ago
    const averageInterval = 25000; // 25 second average
    
    // Should potentially spawn (25+ seconds have passed)
    const shouldSpawn = shouldSpawnUFO(lastSpawnTime, currentTime, averageInterval);
    expect(typeof shouldSpawn).toBe('boolean');
    
    // Should not spawn (too soon)
    const tooSoon = shouldSpawnUFO(25000, 30000, 25000); // Only 5 seconds
    expect(tooSoon).toBe(false);
    
    // Test edge cases
    expect(() => shouldSpawnUFO(-1, 1000, 25000)).toThrow(); // Invalid times
  });

  test('T012: calculateUFOScore() - original 23rd shot algorithm', () => {
    // Test the famous 23rd shot pattern
    expect(calculateUFOScore(23)).toBe(300); // 23rd shot = 300 points
    expect(calculateUFOScore(38)).toBe(300); // 23 + 15 = 38th shot
    expect(calculateUFOScore(53)).toBe(300); // 38 + 15 = 53rd shot
    
    // Test other values from the scoring table
    expect(calculateUFOScore(1)).toBe(100); // First entry in table
    expect(calculateUFOScore(2)).toBe(50);  // Second entry
    expect(calculateUFOScore(4)).toBe(100); // Fourth entry
    
    // Test cycling through 15-value table
    expect(calculateUFOScore(16)).toBe(calculateUFOScore(1)); // 16 % 15 = 1
    
    // Test validation
    expect(() => calculateUFOScore(0)).toThrow(); // Invalid shot count
    expect(() => calculateUFOScore(-1)).toThrow();
  });

  test('T013: getUFOSoundConfig() - sound parameters', () => {
    const soundConfig = getUFOSoundConfig();
    
    expect(soundConfig).toHaveProperty('baseFrequency');
    expect(soundConfig).toHaveProperty('modulationRate');
    expect(soundConfig.baseFrequency).toBeGreaterThan(200);
    expect(soundConfig.baseFrequency).toBeLessThan(800);
    expect(soundConfig.modulationRate).toBeGreaterThan(1);
    expect(soundConfig.modulationRate).toBeLessThan(20);
    
    // Test with custom parameters
    const customConfig = getUFOSoundConfig(450, 8);
    expect(customConfig.baseFrequency).toBe(450);
    expect(customConfig.modulationRate).toBe(8);
  });

  test('T014: checkUFOCollision() - rectangle intersection math', () => {
    const ufo = { x: 100, y: 32, width: 16, height: 8 };
    
    // Test collision
    const hitShot = { x: 105, y: 35, width: 2, height: 6 };
    expect(checkUFOCollision(ufo, hitShot)).toBe(true);
    
    // Test miss
    const missShot = { x: 200, y: 35, width: 2, height: 6 };
    expect(checkUFOCollision(ufo, missShot)).toBe(false);
    
    // Test edge cases
    const edgeShot = { x: 116, y: 32, width: 2, height: 6 }; // Right edge
    expect(checkUFOCollision(ufo, edgeShot)).toBe(false); // Should not overlap
  });

  test('T015: processUFOHit() - scoring logic and state changes', () => {
    const ufo = createUFO(448, 1);
    const scoreValue = 300;
    const soundControl = { stop: jest.fn() };
    
    const result = processUFOHit(ufo, scoreValue, soundControl);
    
    expect(ufo.isActive).toBe(false);
    expect(soundControl.stop).toHaveBeenCalled();
    expect(result).toEqual({
      x: ufo.x,
      y: ufo.y,
      score: 300,
      displayTime: 2000
    });
  });
});

describe('T016-T023: Authentic UI System Tests - Pure Logic', () => {
  test('T016: formatScore() - score padding and formatting', () => {
    expect(formatScore(0, 4)).toBe('0000');
    expect(formatScore(1250, 4)).toBe('1250');
    expect(formatScore(50, 4)).toBe('0050');
    expect(formatScore(999999, 6)).toBe('999999');
    expect(formatScore(42, 6)).toBe('000042');
    
    // Test default digits
    expect(formatScore(1234)).toBe('1234'); // Default 4 digits
    
    // Test validation
    expect(() => formatScore(-1, 4)).toThrow();
    expect(() => formatScore(1000, 0)).toThrow();
  });

  test('T017: createCharacterBitmap() - 8x8 bitmap font data', () => {
    const charA = createCharacterBitmap('A');
    expect(Array.isArray(charA)).toBe(true);
    expect(charA.length).toBe(64); // 8x8 = 64 pixels
    expect(charA.every(pixel => pixel === 0 || pixel === 1)).toBe(true);
    
    const char0 = createCharacterBitmap('0');
    expect(char0.length).toBe(64);
    
    // Test supported characters
    expect(() => createCharacterBitmap('<')).not.toThrow();
    expect(() => createCharacterBitmap('>')).not.toThrow();
    expect(() => createCharacterBitmap('*')).not.toThrow();
    expect(() => createCharacterBitmap('=')).not.toThrow();
    expect(() => createCharacterBitmap(' ')).not.toThrow();
    
    // Test unsupported character
    expect(() => createCharacterBitmap('@')).toThrow();
  });

  test('T018: generateTextBitmaps() - text to bitmap conversion', () => {
    const textBitmaps = generateTextBitmaps('SCORE');
    
    expect(Array.isArray(textBitmaps)).toBe(true);
    expect(textBitmaps.length).toBe(5); // 5 characters
    textBitmaps.forEach(charBitmap => {
      expect(charBitmap.length).toBe(64); // Each char is 8x8
    });
    
    // Test empty string
    expect(generateTextBitmaps('').length).toBe(0);
    
    // Test with numbers and symbols
    const mixed = generateTextBitmaps('SCORE<1>');
    expect(mixed.length).toBe(8);
  });

  test('T019: createLivesSprites() - lives sprite data generation', () => {
    const threeSprites = createLivesSprites(3);
    expect(threeSprites.length).toBe(3);
    
    threeSprites.forEach((sprite, index) => {
      expect(sprite).toHaveProperty('x');
      expect(sprite).toHaveProperty('y');
      expect(sprite).toHaveProperty('bitmap');
      expect(Array.isArray(sprite.bitmap)).toBe(true);
      expect(sprite.bitmap.length).toBe(48); // 8x6 pixels for small cannon
      expect(sprite.x).toBe(index * 10); // 2-pixel spacing with 8-pixel width
    });
    
    // Test zero lives
    expect(createLivesSprites(0).length).toBe(0);
    
    // Test validation
    expect(() => createLivesSprites(-1)).toThrow();
    expect(() => createLivesSprites(4)).toThrow(); // Max 3 lives
  });

  test('T020: calculateUIPositions() - layout positioning', () => {
    const positions = calculateUIPositions(448, 512);
    
    expect(positions).toHaveProperty('score');
    expect(positions).toHaveProperty('hiScore');
    expect(positions).toHaveProperty('credit');
    expect(positions).toHaveProperty('lives');
    
    // Check reasonable positioning (based on original arcade layout)
    expect(positions.score.x).toBeGreaterThanOrEqual(0);
    expect(positions.score.y).toBeGreaterThanOrEqual(0);
    expect(positions.hiScore.x).toBeGreaterThan(positions.score.x);
    expect(positions.lives.y).toBeGreaterThan(positions.score.y);
    
    // Test different canvas sizes
    const smallPositions = calculateUIPositions(224, 256);
    expect(smallPositions.score.x).toBeLessThan(positions.score.x);
  });

  test('T021: prepareScoreData() - score display data structures', () => {
    const scoreData = prepareScoreData(1250, 5000, { x: 32, y: 16 });
    
    expect(scoreData).toHaveProperty('scoreText');
    expect(scoreData).toHaveProperty('hiScoreText');
    expect(scoreData).toHaveProperty('scorePosition');
    expect(scoreData).toHaveProperty('hiScorePosition');
    expect(scoreData).toHaveProperty('scoreBitmaps');
    expect(scoreData).toHaveProperty('hiScoreBitmaps');
    
    expect(scoreData.scoreText).toBe('1250');
    expect(scoreData.hiScoreText).toBe('5000');
    expect(Array.isArray(scoreData.scoreBitmaps)).toBe(true);
  });

  test('T022: prepareLivesData() - lives display data structures', () => {
    const livesData = prepareLivesData(2, { x: 32, y: 480 });
    
    expect(livesData).toHaveProperty('livesCount');
    expect(livesData).toHaveProperty('livesPosition');
    expect(livesData).toHaveProperty('livesSprites');
    
    expect(livesData.livesCount).toBe(2);
    expect(Array.isArray(livesData.livesSprites)).toBe(true);
    expect(livesData.livesSprites.length).toBe(2);
  });

  test('T023: prepareCreditData() - credit display data structures', () => {
    const creditData = prepareCreditData(1, { x: 320, y: 480 });
    
    expect(creditData).toHaveProperty('creditText');
    expect(creditData).toHaveProperty('creditPosition');
    expect(creditData).toHaveProperty('creditBitmaps');
    
    expect(creditData.creditText).toBe('CREDIT 01');
    expect(Array.isArray(creditData.creditBitmaps)).toBe(true);
    
    // Test zero credits
    const zeroCredit = prepareCreditData(0, { x: 320, y: 480 });
    expect(zeroCredit.creditText).toBe('CREDIT 00');
  });
});