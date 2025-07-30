# Research: Classic 1980s Space Invaders Game

## Technical Research Findings

### Canvas API Best Practices for Pixel Art
**Decision**: Use HTML5 Canvas with `imageSmoothingEnabled = false` for crisp pixel art
**Rationale**: Maintains authentic 8-bit appearance without anti-aliasing blur
**Alternatives considered**: SVG (too complex for pixel-perfect sprites), CSS sprites (limited animation control)

### Sprite Rendering Approach
**Decision**: Use pixel arrays and putImageData() for authentic pixel-level control
**Rationale**: Matches original arcade hardware approach, enables pixel-perfect collision detection
**Alternatives considered**: drawImage() with sprite sheets (less control), CSS animation (performance issues)

### Game Loop Architecture
**Decision**: requestAnimationFrame with fixed timestep logic for consistent gameplay
**Rationale**: Ensures 60fps on modern browsers while maintaining authentic arcade timing
**Alternatives considered**: setInterval (inconsistent timing), pure RAF (speed varies by framerate)

### Authentic Sprite Specifications (From Research)

#### Screen Layout
- Original resolution: 224×256 pixels (rotated 90° in arcade cabinet)
- Modern adaptation: 1600×1200 canvas with 8x scaling for modern displays
- Movement grid: 16-pixel vertical steps, 4-pixel horizontal steps (2x scaled from 8px/2px)

#### Alien Specifications (Original → Scaled 2x)
- **Octopus (Top row)**: 12×8 → 24×16 pixels, 30 points, dome-shaped with tentacles
- **Crab (Middle 2 rows)**: 11×8 → 22×16 pixels, 20 points, crab-like with claws
- **Squid (Bottom 2 rows)**: 8×8 → 16×16 pixels, 10 points, simple squid design
- **Animation**: 2 frames per alien type, alternating every movement cycle
- **Formation**: 5 rows × 11 columns = 55 total aliens

#### Shield Specifications (Original → Scaled 2x)
- **Dimensions**: 22×16 → 44×32 pixels each
- **Quantity**: 4 shields positioned between player and aliens
- **Design**: Classic angular bunker shape with hollow interior
- **Damage**: Pixel-perfect destruction using collision masks

#### Player Cannon (Original → Scaled 2x)
- **Dimensions**: 13×8 → 26×16 pixels
- **Color**: Green (authentic arcade coloring)
- **Movement**: Horizontal only, confined to bottom screen area
- **Shot**: 1×4 → 2×8 pixel laser, only one shot on screen at a time

#### Color Scheme (Authentic Arcade)
- **Background**: Black
- **Aliens**: White (monochrome sprites)
- **Player/Shields**: Green (matches original color overlay)
- **UI Text**: White
- **Score Numbers**: White

### Input Handling
**Decision**: Standard keyboard events (ArrowLeft, ArrowRight, Space)
**Rationale**: Matches modern browser game conventions, accessible
**Alternatives considered**: Touch controls (not needed for desktop), WASD (less intuitive)

### Collision Detection Strategy
**Decision**: Pixel-perfect collision using sprite bounds and pixel data
**Rationale**: Required for authentic shield destruction and accurate hit detection
**Alternatives considered**: Bounding box only (less accurate), physics engine (overkill)

### Performance Optimization
**Decision**: Object pooling for bullets, selective redraw regions
**Rationale**: Maintains 60fps with large numbers of sprites and particle effects
**Alternatives considered**: Full screen clear/redraw (slower), complex dirty rectangle system (premature optimization)

### Audio Strategy
**Decision**: Deferred to future iteration (focus on visual accuracy first)
**Rationale**: Visual pixel-perfect implementation is primary requirement
**Alternatives considered**: Web Audio API (adds complexity), HTML5 audio (limited control)

## Implementation Architecture

### Core Game Systems
1. **Sprite System**: Pixel array management and rendering
2. **Input System**: Keyboard event handling and state management
3. **Physics System**: Movement, collision detection, and game rules
4. **Render System**: Canvas drawing and animation coordination
5. **Game State**: Score, lives, level progression, and game over conditions

### Data Structures
- **Alien Array**: 5×11 grid with type, position, animation frame, alive status
- **Shield Array**: 4 destructible bitmap masks for pixel-perfect damage
- **Bullet Pool**: Reusable bullet objects with position and direction
- **Player State**: Position, lives, invulnerability timer, score

### Timing Constants (Authentic Arcade, Scaled 2x)
- **Alien Movement**: 48 frames between steps (0.8 seconds at 60fps)
- **Alien Speed Increase**: 2x faster when ≤10 aliens remain
- **Shot Speed**: 480 pixels/second (8 pixels per frame at 60fps, 2x scaled from 4px)
- **Player Invulnerability**: 120 frames (2 seconds) after hit