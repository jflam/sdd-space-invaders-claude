# Tasks: Classic 1980s Space Invaders Game

**Input**: Design documents from `/specs/001-use-the-specify/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Task Generation Analysis

**From Plan.md**: JavaScript ES6+ single HTML file, Node.js testing, Canvas API
**From Data-model.md**: Player, Alien, Bullet, Shield, Game State entities
**From Contracts**: Game initialization, input handling, collision detection, rendering
**From Research.md**: Pixel-perfect sprites, authentic timing, Canvas techniques
**From Quickstart.md**: Node.js unit tests + manual browser integration testing

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- File paths are absolute for clarity

## Phase 3.1: Setup
- [ ] T001 Create package.json with Jest for testing Node.js game logic functions
- [ ] T002 [P] Create .gitignore for node_modules and test coverage files
- [ ] T003 [P] Set up ESLint config for ES6+ JavaScript code standards

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Pure Game Logic Tests (Node.js)
- [ ] T004 [P] Contract test game initialization in `game-logic.test.js` - verify initializeGame() function
- [ ] T005 [P] Contract test collision detection in `game-logic.test.js` - verify checkBulletAlienCollision() math
- [ ] T006 [P] Contract test score calculation in `game-logic.test.js` - verify updateScore() for alien types
- [ ] T007 [P] Contract test game state transitions in `game-logic.test.js` - verify updateGameState() logic
- [ ] T008 [P] Contract test alien movement calculation in `game-logic.test.js` - verify moveAliens() function
- [ ] T009 [P] Contract test shield damage logic in `game-logic.test.js` - verify shield bitmap updates

### Integration Test Scenarios
- [ ] T010 [P] Integration test player lifecycle in `game-logic.test.js` - full player hit/respawn cycle
- [ ] T011 [P] Integration test alien formation behavior in `game-logic.test.js` - movement, direction changes, speed
- [ ] T012 [P] Integration test win/lose conditions in `game-logic.test.js` - game over and level complete triggers

### Test Execution Verification
- [ ] T013 Run `npm test` to verify all tests FAIL (no implementation exists yet) - RED phase of TDD

## Phase 3.3: Core Implementation (ONLY after tests are failing)
**TDD Hill Climbing**: Each task must make specific failing tests pass. Run `npm test` after each task to verify progress.

### Pure Game Logic Module (Node.js testable)
- [ ] T014 [P] Create Player entity in `game-logic.js` - constructor and state management
  - **Target**: Make T004 game initialization tests pass for Player creation
  - **Verify**: Run `npm test` - Player creation tests should go from RED to GREEN
  
- [ ] T015 [P] Create Alien entity in `game-logic.js` - constructor with type/points validation  
  - **Target**: Make T004 game initialization tests pass for Alien creation + T006 score calculation tests
  - **Verify**: Run `npm test` - Alien constructor and point value tests should go GREEN
  
- [ ] T016 [P] Create Bullet entity in `game-logic.js` - constructor with direction/speed
  - **Target**: Make T004 game initialization tests pass for Bullet creation
  - **Verify**: Run `npm test` - Bullet creation tests should go GREEN
  
- [ ] T017 [P] Create Shield entity in `game-logic.js` - constructor with damage bitmap
  - **Target**: Make T004 game initialization tests pass for Shield creation + T009 shield damage tests
  - **Verify**: Run `npm test` - Shield constructor and damage bitmap tests should go GREEN
  
- [ ] T018 [P] Create Game State entity in `game-logic.js` - manages all entities and state transitions
  - **Target**: Make T007 game state transition tests pass for state management
  - **Verify**: Run `npm test` - Game state creation and transition tests should go GREEN
  
- [ ] T019 Collision detection functions in `game-logic.js` - pure coordinate math for all collision types
  - **Target**: Make T005 collision detection tests pass completely
  - **Verify**: Run `npm test` - All collision math tests should go from RED to GREEN
  
- [ ] T020 Movement calculation functions in `game-logic.js` - alien formation movement, player bounds checking
  - **Target**: Make T008 alien movement tests + T011 alien formation behavior tests pass
  - **Verify**: Run `npm test` - Movement and formation tests should go GREEN
  
- [ ] T021 Score and game rules in `game-logic.js` - point calculation, life management, win/lose conditions
  - **Target**: Make T010 player lifecycle tests + T012 win/lose condition tests pass
  - **Verify**: Run `npm test` - ALL game logic tests should now be GREEN

### Browser Integration Layer
**Note**: These tasks use Playwright automation for verification instead of manual testing.

- [ ] T022 Create main HTML structure in `space-invaders.html` - canvas element and basic DOM
  - **Verify**: Use Playwright to navigate to file, check HTML loads without errors, canvas element present
  
- [ ] T023 Canvas setup and configuration in `space-invaders.html` - 1600x1200, disable smoothing for pixel art
  - **Verify**: Use Playwright JavaScript execution to check canvas.width=1600, canvas.height=1200, imageSmoothingEnabled=false
  
- [ ] T024 Input handling system in `space-invaders.html` - keyboard event listeners for arrow keys and spacebar
  - **Verify**: Use Playwright to send keyboard events, check console logs capture ArrowLeft/ArrowRight/Space correctly
  
- [ ] T025 Game loop implementation in `space-invaders.html` - requestAnimationFrame with fixed timestep
  - **Verify**: Use Playwright to execute JS and verify requestAnimationFrame is called, check frame timing in console
  
- [ ] T026 Sprite rendering system in `space-invaders.html` - putImageData for pixel-perfect sprites
  - **Verify**: Use Playwright to execute test sprite rendering, check putImageData is called without errors

## Phase 3.4: Sprite and Visual Implementation
- [ ] T027 [P] Alien sprite data in `space-invaders.html` - 2x scaled pixel arrays for octopus (24×16), crab (22×16), squid (16×16)
- [ ] T028 [P] Player cannon sprite in `space-invaders.html` - green laser cannon (26×16 pixels)
- [ ] T029 [P] Shield sprite patterns in `space-invaders.html` - classic angular bunker shapes (44×32 pixels each)
- [ ] T030 [P] Bullet sprites in `space-invaders.html` - player and alien bullet pixel data (2×8 pixels)
- [ ] T031 Sprite animation system in `space-invaders.html` - frame switching for alien movement
- [ ] T032 Color system implementation in `space-invaders.html` - authentic monochrome with selective green
- [ ] T033 UI rendering in `space-invaders.html` - score display, lives counter, game over/complete messages

## Phase 3.5: Game Integration and Polish
- [ ] T034 Connect game logic to rendering in `space-invaders.html` - call GameLogic functions from browser code
- [ ] T035 Authentic timing implementation in `space-invaders.html` - 48-frame alien movement delay, 2x scaled speeds (8px/frame shots)
- [ ] T036 Sound placeholders in `space-invaders.html` - comments for future audio integration
- [ ] T037 Performance optimization in `space-invaders.html` - object pooling for bullets, efficient rendering
- [ ] T038 [P] Browser compatibility testing - manual verification in Chrome, Firefox, Safari
- [ ] T039 [P] Run quickstart validation - execute all test scenarios from quickstart.md
- [ ] T040 Code cleanup and documentation - add comments explaining authentic arcade mechanics

## Dependencies

**Critical TDD Flow**:
- Tests (T004-T012) MUST be written and FAILING before T013 (test execution)
- T013 (verify tests fail) MUST complete before implementation (T014-T040)
- **TDD Hill Climbing**: Each T014-T021 task MUST run `npm test` to verify specific tests go GREEN
- T001-T003 (setup) before all others
- T014-T021 (pure logic with unit test verification) before T022-T040 (browser integration)
- T027-T033 (sprites) can run parallel but need T023 (canvas setup)
- T034-T037 (integration) need both logic and sprites complete

**Parallel Execution Blocks**:
- Block 1: T002, T003 (setup files)
- Block 2: T004-T012 (all test files - different test cases)
- Block 3: T014-T018 (entity constructors in same file but independent)
- Block 4: T027-T030 (sprite data - independent pixel arrays)

## Parallel Example
```bash
# Phase 3.2 - Write all failing tests together:
Task: "Contract test game initialization in game-logic.test.js"
Task: "Contract test collision detection in game-logic.test.js" 
Task: "Contract test score calculation in game-logic.test.js"
Task: "Integration test player lifecycle in game-logic.test.js"
```

## Validation Checklist
- [x] All contract functions have corresponding tests (T004-T012)
- [x] All entities have model tasks (T014-T018)
- [x] All tests come before implementation (T004-T013 before T014+)
- [x] Test execution verification included (T013 - RED phase)
- [x] Parallel tasks are truly independent (different sections of files)
- [x] Each task specifies exact file path (game-logic.js, space-invaders.html, etc.)
- [x] TDD enforced: tests must fail before implementation begins

## Notes
- `game-logic.js` exports pure functions for Node.js testing
- `space-invaders.html` imports and uses GameLogic module  
- **TDD Hill Climbing**: Each implementation task (T014-T021) MUST run `npm test` to verify progress
- Tests must go from RED → GREEN with each implementation step
- Manual browser testing by human after automated tests pass
- Focus on authentic 1980s arcade experience throughout implementation