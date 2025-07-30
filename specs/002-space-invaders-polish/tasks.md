# Tasks: Space Invaders Polish Features - Background Music, Bonus UFO, and Authentic UI Display

**Input**: Design documents from `/specs/002-space-invaders-polish/`
**Prerequisites**: plan.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: JavaScript ES6+, Web Audio API, HTML5 Canvas
   → Structure: Single HTML file with game-logic.js for testing
2. Load design documents:
   → data-model.md: 5 entities (BackgroundMusic, BonusUFO, UFOScoringSystem, AuthenticUIDisplay, AudioManager)
   → contracts/: 3 files with 16 functions total
   → research.md: Frequency specifications and timing algorithms
3. Generate tasks by category: Setup → Tests → Core → Integration → Polish
4. Apply TDD rules: All tests before implementation
5. Mark [P] for parallel execution (different files, independent)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to repository root

## Phase 3.1: Setup
- [ ] T001 Verify existing project structure and dependencies are compatible with Web Audio API
- [ ] T002 [P] Add JSDoc comments to existing game-logic.js for new function documentation
- [ ] T003 [P] Configure ESLint rules for Web Audio API and enhanced test coverage

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Background Music Contract Tests [P] - Pure Logic Only
- [ ] T004 [P] Contract test calculateTempo() in game-logic.test.js - tempo calculation algorithm (alien count ratio)
- [ ] T005 [P] Contract test createMusicState() in game-logic.test.js - music state object creation (no Web Audio)
- [ ] T006 [P] Contract test updateMusicState() in game-logic.test.js - state transitions and note progression
- [ ] T007 [P] Contract test getMusicCommands() in game-logic.test.js - observable commands for tempo changes
- [ ] T008 [P] Contract test resetMusicState() in game-logic.test.js - clean state reset

### UFO System Contract Tests [P] - Pure Logic Only  
- [ ] T009 [P] Contract test createUFO() in game-logic.test.js - UFO entity creation (position, properties)
- [ ] T010 [P] Contract test updateUFO() in game-logic.test.js - UFO movement and bounds checking
- [ ] T011 [P] Contract test shouldSpawnUFO() in game-logic.test.js - spawn timing logic (time-based)
- [ ] T012 [P] Contract test calculateUFOScore() in game-logic.test.js - original 23rd shot algorithm
- [ ] T013 [P] Contract test getUFOSoundConfig() in game-logic.test.js - sound parameters (no Web Audio)
- [ ] T014 [P] Contract test checkUFOCollision() in game-logic.test.js - collision detection (rectangle math)
- [ ] T015 [P] Contract test processUFOHit() in game-logic.test.js - scoring logic and state changes

### Authentic UI Contract Tests [P] - Pure Logic Only
- [ ] T016 [P] Contract test formatScore() in game-logic.test.js - score padding and formatting (string logic)
- [ ] T017 [P] Contract test createCharacterBitmap() in game-logic.test.js - 8x8 bitmap font data (arrays)
- [ ] T018 [P] Contract test generateTextBitmaps() in game-logic.test.js - text to bitmap conversion (no canvas)
- [ ] T019 [P] Contract test createLivesSprites() in game-logic.test.js - lives sprite data generation
- [ ] T020 [P] Contract test calculateUIPositions() in game-logic.test.js - layout positioning (coordinate math)
- [ ] T021 [P] Contract test prepareScoreData() in game-logic.test.js - score display data structures
- [ ] T022 [P] Contract test prepareLivesData() in game-logic.test.js - lives display data structures  
- [ ] T023 [P] Contract test prepareCreditData() in game-logic.test.js - credit display data structures

## Phase 3.3: Core Implementation (ONLY after tests are failing)

**🔴 TDD REMINDER: RED-GREEN-REFACTOR CYCLE**
1. **BEFORE EVERY IMPLEMENTATION TASK**: Run `npm test` and verify the corresponding test is FAILING (RED)
2. **DURING IMPLEMENTATION**: Write the MINIMAL code needed to make that specific test pass (GREEN)
3. **AFTER TEST PASSES**: Refactor for quality while keeping tests green
4. **NEVER**: Write implementation without a failing test first
5. **GOAL**: Hill-climb by making one failing test pass at a time

### Background Music System Implementation - Pure Logic (TDD: Make Tests Pass)
- [ ] T024 [P] TDD: Implement calculateTempo() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T004 pass
- [ ] T025 [P] TDD: Implement createMusicState() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T005 pass
- [ ] T026 [P] TDD: Implement updateMusicState() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T006 pass
- [ ] T027 [P] TDD: Implement getMusicCommands() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T007 pass
- [ ] T028 [P] TDD: Implement resetMusicState() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T008 pass

### UFO System Implementation - Pure Logic (TDD: Make Tests Pass)
- [ ] T029 [P] TDD: Implement createUFO() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T009 pass
- [ ] T030 [P] TDD: Implement updateUFO() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T010 pass
- [ ] T031 [P] TDD: Implement shouldSpawnUFO() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T011 pass
- [ ] T032 [P] TDD: Implement calculateUFOScore() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T012 pass
- [ ] T033 [P] TDD: Implement getUFOSoundConfig() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T013 pass
- [ ] T034 [P] TDD: Implement checkUFOCollision() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T014 pass
- [ ] T035 [P] TDD: Implement processUFOHit() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T015 pass

### Authentic UI System Implementation - Pure Logic (TDD: Make Tests Pass)
- [ ] T036 [P] TDD: Implement formatScore() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T016 pass
- [ ] T037 [P] TDD: Implement createCharacterBitmap() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T017 pass
- [ ] T038 [P] TDD: Implement generateTextBitmaps() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T018 pass
- [ ] T039 [P] TDD: Implement createLivesSprites() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T019 pass
- [ ] T040 [P] TDD: Implement calculateUIPositions() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T020 pass
- [ ] T041 [P] TDD: Implement prepareScoreData() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T021 pass
- [ ] T042 [P] TDD: Implement prepareLivesData() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T022 pass
- [ ] T043 [P] TDD: Implement prepareCreditData() in game-logic.js - RUN FAILING TESTS FIRST, then write minimal code to make T023 pass

## Phase 3.4: Integration (HTML File Updates)

### Background Music Integration - Connect Logic to Web Audio API
- [ ] T044 Add music state management to game loop in space-invaders.html (using createMusicState)
- [ ] T045 Create Web Audio API interpreter for music commands in space-invaders.html
- [ ] T046 Connect alien elimination to getMusicCommands() output in space-invaders.html
- [ ] T047 Implement audio synthesis based on music state data in space-invaders.html

### UFO System Integration - Connect Logic to Game Systems
- [ ] T048 Add UFO state management to game loop in space-invaders.html (using createUFO/updateUFO)
- [ ] T049 Connect spawn timing to shouldSpawnUFO() logic in space-invaders.html
- [ ] T050 Integrate checkUFOCollision() with existing collision system in space-invaders.html
- [ ] T051 Create Web Audio API interpreter for UFO sound config in space-invaders.html
- [ ] T052 Connect processUFOHit() results to scoring display in space-invaders.html

### Authentic UI Integration - Connect Logic to Canvas Rendering
- [ ] T053 Create canvas renderer for prepareScoreData() output in space-invaders.html
- [ ] T054 Create canvas renderer for prepareLivesData() output in space-invaders.html
- [ ] T055 Create canvas renderer for prepareCreditData() output in space-invaders.html
- [ ] T056 Integrate generateTextBitmaps() with pixel rendering system in space-invaders.html

## Phase 3.5: Polish & Validation

### Performance Optimization
- [ ] T057 [P] Optimize Web Audio API oscillator creation/destruction to prevent memory leaks
- [ ] T058 [P] Verify 60fps performance with background music and UFO sound synthesis
- [ ] T059 [P] Test audio latency remains under 200ms for responsive gameplay

### Integration Testing (Manual)
- [ ] T060 Execute quickstart.md Test Scenario 1: Background Music Startup validation
- [ ] T061 Execute quickstart.md Test Scenario 2: Dynamic Tempo Acceleration validation  
- [ ] T062 Execute quickstart.md Test Scenario 3: UFO Appearance and Scoring validation
- [ ] T063 Execute quickstart.md Test Scenario 4: Authentic UI Display validation
- [ ] T064 Execute quickstart.md Test Scenario 5: Audio System Integration validation

### Final Polish
- [ ] T065 [P] Add error handling for Web Audio API compatibility across browsers
- [ ] T066 [P] Add console logging for debugging audio synthesis and UFO timing
- [ ] T067 [P] Verify all acceptance criteria from spec.md are met
- [ ] T068 [P] Update inline code documentation for new audio and UI systems

## Dependencies

### Critical TDD Dependencies
- **All T004-T023 (contract tests) MUST complete and FAIL before any T024-T043 (implementation)**
- **T024-T043 (core implementation) MUST complete before T044-T056 (integration)**

### Specific Dependencies
- T024 blocks T026, T027 (tempo calculation needed for music system)
- T029 blocks T030, T049 (UFO creation needed for movement and spawning)
- T032 blocks T035, T052 (scoring algorithm needed for UFO destruction)
- T037 blocks T038, T041-T043 (bitmap font needed for UI rendering)  
- T044-T047 blocks T060-T061 (music integration needed for tempo testing)
- T048-T052 blocks T062 (UFO integration needed for scoring testing)
- T053-T056 blocks T063 (UI integration needed for display testing)

## Parallel Execution Examples

### Phase 3.2: All Contract Tests (Launch Together)
```bash
# Background Music Tests [P] - Pure Logic Only
Task: "Contract test calculateTempo() in game-logic.test.js"
Task: "Contract test createMusicState() in game-logic.test.js"
Task: "Contract test updateMusicState() in game-logic.test.js"
Task: "Contract test getMusicCommands() in game-logic.test.js"
Task: "Contract test resetMusicState() in game-logic.test.js"

# UFO System Tests [P] - Pure Logic Only
Task: "Contract test createUFO() in game-logic.test.js" 
Task: "Contract test updateUFO() in game-logic.test.js"
Task: "Contract test shouldSpawnUFO() in game-logic.test.js"
Task: "Contract test calculateUFOScore() in game-logic.test.js"
Task: "Contract test getUFOSoundConfig() in game-logic.test.js"
Task: "Contract test checkUFOCollision() in game-logic.test.js"
Task: "Contract test processUFOHit() in game-logic.test.js"

# UI System Tests [P] - Pure Logic Only
Task: "Contract test formatScore() in game-logic.test.js"
Task: "Contract test createCharacterBitmap() in game-logic.test.js"
Task: "Contract test generateTextBitmaps() in game-logic.test.js"
Task: "Contract test createLivesSprites() in game-logic.test.js"
Task: "Contract test calculateUIPositions() in game-logic.test.js"
Task: "Contract test prepareScoreData() in game-logic.test.js"
Task: "Contract test prepareLivesData() in game-logic.test.js"
Task: "Contract test prepareCreditData() in game-logic.test.js"
```

### Phase 3.3: TDD Implementation - Hill Climb to Make Tests Pass [P]
```bash
# 🔴 RED PHASE COMPLETE: All T004-T023 tests written and failing
# 🟢 GREEN PHASE: Implement minimal code to make each test pass

# CRITICAL: Run `npm test` before each task to verify test is failing!
Task: "TDD: Run failing T004 test, then implement calculateTempo() to make it pass"
Task: "TDD: Run failing T005 test, then implement createMusicState() to make it pass"
Task: "TDD: Run failing T006 test, then implement updateMusicState() to make it pass"
Task: "TDD: Run failing T007 test, then implement getMusicCommands() to make it pass"
Task: "TDD: Run failing T008 test, then implement resetMusicState() to make it pass"
Task: "TDD: Run failing T009 test, then implement createUFO() to make it pass"
Task: "TDD: Run failing T010 test, then implement updateUFO() to make it pass"
Task: "TDD: Run failing T011 test, then implement shouldSpawnUFO() to make it pass"
Task: "TDD: Run failing T012 test, then implement calculateUFOScore() to make it pass"
Task: "TDD: Run failing T013 test, then implement getUFOSoundConfig() to make it pass"
Task: "TDD: Run failing T014 test, then implement checkUFOCollision() to make it pass"
Task: "TDD: Run failing T015 test, then implement processUFOHit() to make it pass"
Task: "TDD: Run failing T016 test, then implement formatScore() to make it pass"
Task: "TDD: Run failing T017 test, then implement createCharacterBitmap() to make it pass"
Task: "TDD: Run failing T018 test, then implement generateTextBitmaps() to make it pass"
Task: "TDD: Run failing T019 test, then implement createLivesSprites() to make it pass"
Task: "TDD: Run failing T020 test, then implement calculateUIPositions() to make it pass"
Task: "TDD: Run failing T021 test, then implement prepareScoreData() to make it pass"
Task: "TDD: Run failing T022 test, then implement prepareLivesData() to make it pass"
Task: "TDD: Run failing T023 test, then implement prepareCreditData() to make it pass"
```

## Validation Checklist
*GATE: Checked before task execution*

- [x] All 16 contract functions have corresponding tests (T004-T023)
- [x] All 5 entities have implementation tasks (BackgroundMusic, BonusUFO, UFOScoringSystem, AuthenticUIDisplay, AudioManager)
- [x] All tests come before implementation (T004-T023 before T024-T043)
- [x] Parallel tasks are truly independent (different functions, no shared state)
- [x] Each task specifies exact file path (game-logic.js, game-logic.test.js, space-invaders.html)
- [x] No task modifies same function as another [P] task
- [x] Integration scenarios from quickstart.md are covered (T060-T064)
- [x] Performance and browser compatibility addressed (T057-T059, T065)

## Success Criteria

### 🧪 TDD Success Metrics
- **RED Phase Complete**: All 20 contract tests (T004-T023) written and failing before any implementation
- **GREEN Phase Complete**: All 20 implementation tasks (T024-T043) make their corresponding test pass
- **Test Coverage**: Every business logic function has passing unit tests
- **Hill Climbing**: Each implementation task moves from failing test to passing test

### 🎮 Feature Success Metrics  
- Background music plays four descending bass notes with dynamic tempo
- UFO appears randomly and awards 300 points for 23rd shot pattern
- UI displays authentic "SCORE<1>", "HI-SCORE", lives sprites with 8x8 bitmap font
- Game maintains 60fps performance with <200ms audio latency
- All quickstart.md integration scenarios pass manual validation

### 🔬 TDD Workflow Verification
```bash
# Before starting Phase 3.3, verify RED phase:
npm test
# Should show: 20/20 tests failing (T004-T023 all RED)

# During Phase 3.3, verify GREEN phase progress:
npm test -- --grep "calculateTempo"  # Should pass after T024
npm test -- --grep "createUFO"       # Should pass after T029
# ... continue for each function

# After Phase 3.3, verify all GREEN:
npm test
# Should show: 20/20 tests passing (all GREEN)
```

---
**Total Tasks**: 68 tasks across 5 phases
**Parallel Opportunities**: 44 tasks marked [P] for concurrent execution
**Estimated Completion**: 5-7 days following TDD methodology