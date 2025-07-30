# sdd-space-invaders-claude Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-07-30

## Active Technologies
- JavaScript ES6+ + HTML5 Canvas API (001-use-the-specify)
- Web Audio API synthesis for authentic arcade sound (002-space-invaders-polish)
- Browser APIs: requestAnimationFrame, keyboard events
- Single HTML file architecture

## Project Structure
```
space-invaders.html      # Single file implementation
game-logic.js           # Pure functions for Node.js testing
specs/001-use-the-specify/   # Core game features
specs/002-space-invaders-polish/   # Audio & UI polish features
├── spec.md              # Feature specification
├── plan.md              # Implementation plan
├── research.md          # Technical research
├── data-model.md        # Data structures
├── quickstart.md        # Testing guide
└── contracts/           # API contracts
```

## Commands
# Testing
npm test                 # Run unit tests for pure functions
# Manual testing via browser
# Open space-invaders.html in modern browser
# Use arrow keys and spacebar for gameplay

## Code Style
- Pixel-perfect sprite rendering with Canvas putImageData()
- 60fps game loop using requestAnimationFrame
- Authentic 1980s arcade timing and visual appearance
- Web Audio API synthesis for retro sound effects
- No external dependencies, pure JavaScript/HTML5

## Recent Changes
- 002-space-invaders-polish: Added Web Audio API synthesis for background music and UFO sounds
<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->