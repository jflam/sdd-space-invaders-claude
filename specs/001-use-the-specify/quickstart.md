# Quickstart: Classic 1980s Space Invaders Game

## Testing Strategy Overview

### Automated Tests (Node.js)
Run unit tests for pure game logic functions:
```bash
npm test  # Runs game-logic.test.js in Node.js
```

### Manual Integration Testing (Browser)
Human verification that complete game works as intended.

## Node.js Unit Test Validation

### Prerequisites
- Node.js installed
- Jest or similar test framework
- `game-logic.js` module exported for testing

### Test Execution
```bash
# Run automated unit tests
npm test

# Expected output:
# ✓ Collision detection math
# ✓ Score calculation rules  
# ✓ Game state transitions
# ✓ Alien movement logic
```

## Manual Browser Integration Testing

### Prerequisites
- Modern web browser
- Local copy of `space-invaders.html` file

### Integration Verification
**Objective**: Verify complete game experience

### Steps:
1. Open `space-invaders.html` in browser
2. Play the game normally using keyboard
3. Verify game behaves authentically

### Expected Results:
- [ ] Game loads and starts properly
- [ ] Arrow keys move player cannon
- [ ] Spacebar fires bullets
- [ ] Aliens move in formation and can be destroyed
- [ ] Score increases when aliens destroyed  
- [ ] Player loses lives when hit
- [ ] Game over/victory conditions work
- [ ] Visual appearance matches 1980s arcade style

## Success Criteria
- All Node.js unit tests pass (automated verification)
- Manual browser testing confirms playable game (human verification)
- No testing of rendering infrastructure, input handling, or performance