# Quickstart Testing Guide: Space Invaders Polish Features

**Feature**: Background Music, Bonus UFO, and Authentic UI Display  
**Date**: July 30, 2025  
**Testing Framework**: Jest (Node.js) + Manual Browser Testing

## Prerequisites

```bash
# Ensure dependencies are installed
npm install

# Verify existing tests pass
npm test
```

## Unit Testing (TDD Red Phase)

### Background Music System Tests

```bash
# Test tempo calculation algorithm
npm test -- --grep "calculateTempo"

# Expected failures (RED phase):
# ✗ should calculate tempo based on alien count ratio
# ✗ should enforce minimum tempo of 50ms
# ✗ should enforce maximum tempo of 2000ms
# ✗ should handle edge case of 1 remaining alien
```

### UFO Scoring Algorithm Tests

```bash
# Test UFO scoring system
npm test -- --grep "calculateUFOScore"

# Expected failures (RED phase):
# ✗ should return 300 points for 23rd shot
# ✗ should return 300 points for 38th shot (23+15)
# ✗ should cycle through scoring table correctly
# ✗ should handle shot count wraparound
```

### Authentic UI Display Tests

```bash
# Test UI formatting functions
npm test -- --grep "formatScore|createCharacterBitmap"

# Expected failures (RED phase):
# ✗ should format score with leading zeros
# ✗ should create valid 8x8 bitmap for each character
# ✗ should calculate correct UI positions
# ✗ should handle invalid characters gracefully
```

## Integration Testing (Manual Browser)

### Test Scenario 1: Background Music Startup
1. Open `space-invaders.html` in browser
2. **VERIFY**: Background music starts immediately when game begins
3. **VERIFY**: Four descending bass notes play in continuous loop
4. **VERIFY**: Music tempo is slow initially (500ms between notes)

### Test Scenario 2: Dynamic Tempo Acceleration  
1. Start game and eliminate some aliens
2. **VERIFY**: Music tempo increases as alien count decreases
3. **VERIFY**: Tempo change is smooth and proportional
4. **VERIFY**: Music synchronizes with alien movement speed

### Test Scenario 3: UFO Appearance and Scoring
1. Play game for 25-30 seconds
2. **VERIFY**: UFO appears flying horizontally across top of screen
3. **VERIFY**: UFO makes distinctive warbling sound effect
4. Count shots and hit UFO on 23rd shot
5. **VERIFY**: UFO awards 300 points
6. Continue counting and hit next UFO on 38th shot (23+15)
7. **VERIFY**: UFO awards 300 points again

### Test Scenario 4: Authentic UI Display
1. Start game and observe UI layout
2. **VERIFY**: "SCORE<1>" label displayed in upper left with proper bitmap font
3. **VERIFY**: "HI-SCORE" label displayed in upper center
4. **VERIFY**: Score values use monospace arcade-style digits
5. **VERIFY**: Lives displayed as small cannon sprites in bottom area
6. **VERIFY**: All player UI elements are green color

### Test Scenario 5: Audio System Integration
1. Start game with multiple aliens
2. **VERIFY**: Background music and game sound effects play simultaneously
3. When UFO appears:
   - **VERIFY**: UFO warbling sound plays over background music
   - **VERIFY**: No audio conflicts or distortion
4. **VERIFY**: Music stops during game over screen
5. **VERIFY**: Music resumes when new game starts

## Performance Validation

### Frame Rate Test
1. Open browser developer tools (F12)
2. Navigate to Performance tab
3. Start recording while playing game
4. **VERIFY**: Game maintains 60 FPS during active gameplay
5. **VERIFY**: Audio synthesis doesn't cause frame drops

### Audio Latency Test
1. Use precise timing to fire shot exactly when background music note plays
2. **VERIFY**: Shot sound effect plays immediately (<200ms latency)
3. **VERIFY**: UFO sound starts immediately when UFO appears
4. **VERIFY**: Music tempo changes are responsive to alien elimination

## Acceptance Criteria Validation

### ✅ Pass Criteria
- [ ] Background music plays four descending bass notes continuously
- [ ] Music tempo increases dynamically with alien elimination
- [ ] UFO appears randomly every 20-30 seconds average
- [ ] UFO scoring follows original algorithm (300 for 23rd shot)
- [ ] UFO makes authentic warbling sound effect
- [ ] UI displays use authentic 8x8 pixel bitmap font
- [ ] Score, hi-score, and lives display in correct positions
- [ ] All player UI elements use green color
- [ ] Game maintains 60 FPS with new features
- [ ] Audio latency remains under 200ms

### ❌ Fail Criteria (Immediate Fix Required)
- Background music doesn't start or stops unexpectedly
- UFO never appears or appears too frequently
- UFO scoring doesn't match algorithm (wrong points awarded)
- UI text is not readable or positioned incorrectly
- Frame rate drops below 50 FPS
- Audio has noticeable distortion or latency >500ms

## Troubleshooting Guide

### No Background Music
1. Check browser console for Web Audio API errors
2. Verify user interaction has occurred (required for audio context)
3. Check audio frequency values are within valid range (50-300Hz)

### UFO Not Appearing
1. Verify `shouldSpawnUFO` function timing logic
2. Check UFO creation and positioning code
3. Ensure UFO rendering is called in game loop

### UI Display Issues
1. Check character bitmap data for corruption
2. Verify canvas context and positioning calculations
3. Ensure font rendering uses correct pixel scaling

### Performance Problems
1. Check for memory leaks in oscillator cleanup
2. Verify efficient canvas rendering (no unnecessary redraws)
3. Monitor Web Audio API node creation/destruction

## Success Metrics

**Unit Tests**: All contract tests pass (GREEN phase)  
**Integration Tests**: All manual scenarios pass without issues  
**Performance**: 60 FPS maintained, <200ms audio latency  
**User Experience**: Authentic 1978 arcade feel with modern browser compatibility

---

*Ready for implementation once all RED phase tests are written and failing*