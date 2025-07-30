# Data Model: Space Invaders Polish Features

**Feature**: Background Music, Bonus UFO, and Authentic UI Display  
**Date**: July 30, 2025  
**Status**: Complete

## Core Entities

### BackgroundMusic
Represents the continuous four-note bass loop with dynamic tempo management.

**Properties**:
- `frequencies`: Array of four bass note frequencies [130, 116, 98, 87] Hz
- `currentNoteIndex`: Integer (0-3) tracking current note in sequence
- `baseTempo`: Base milliseconds between notes (500ms)
- `currentTempo`: Current milliseconds between notes (calculated dynamically)
- `isPlaying`: Boolean indicating if music is active
- `noteTimer`: Timer reference for note progression

**Behaviors**:
- Calculate tempo based on alien count ratio
- Cycle through frequency array
- Start/stop music based on game state
- Synchronize with alien movement speed

**Validation Rules**:
- Frequencies must be positive numbers
- Tempo must be between 50ms and 2000ms
- Note index must be 0-3

**State Transitions**:
```
Stopped → Playing (on game start)
Playing → Playing (tempo changes during gameplay)
Playing → Stopped (on game over/pause)
```

### BonusUFO
Represents the mystery ship with movement, timing, scoring, and sound properties.

**Properties**:
- `x`: Horizontal position (pixels)
- `y`: Fixed vertical position (top of screen)
- `width`: 16 pixels (2x scaled from original 8px)
- `height`: 8 pixels (2x scaled from original 4px)
- `speed`: Horizontal velocity (2 pixels per frame)
- `direction`: Movement direction (-1 for left, 1 for right)
- `isActive`: Boolean indicating if UFO is on screen
- `scoreValue`: Points awarded when hit (50-300)
- `soundOscillator`: Web Audio API oscillator for warbling sound
- `lastAppearanceTime`: Timestamp of last UFO spawn

**Behaviors**:
- Move horizontally across screen
- Determine score value based on shot count
- Generate SN76477-style warbling sound
- Spawn at random intervals
- Remove when hit or off-screen

**Validation Rules**:
- Position must be within screen bounds when active
- Score value must be one of: 50, 100, 150, 200, 300
- Speed must be positive
- Direction must be -1 or 1

**State Transitions**:
```
Inactive → Active (random spawn)
Active → Scoring (when hit by player shot)
Active → Inactive (when off-screen)
Scoring → Inactive (after score display)
```

### UFOScoringSystem
Tracks player shot count and determines UFO point values following original algorithm.

**Properties**:
- `shotCount`: Total shots fired by player this game
- `scoringTable`: [100, 50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100]
- `tableIndex`: Current position in scoring table (0-14)

**Behaviors**:
- Increment shot count on each player fire
- Calculate table index from shot count
- Return score value for UFO hit
- Reset on new game

**Validation Rules**:
- Shot count must be non-negative integer
- Table index must be 0-14
- Scoring table must contain exactly 15 values

**State Transitions**:
```
Initialized → Tracking (on game start)
Tracking → Tracking (shot count increments)
Tracking → Reset (on new game)
```

### AuthenticUIDisplay
Represents score, high score, credits, and lives display with original layout formatting.

**Properties**:
- `scoreText`: Current player score formatted as string
- `hiScoreText`: High score formatted as string  
- `creditText`: Number of credits available
- `livesSprites`: Array of small cannon sprites for remaining lives
- `fontData`: 8×8 pixel bitmap font from original ROM
- `characterWidth`: 8 pixels
- `characterHeight`: 8 pixels
- `scorePosition`: {x: 32, y: 16} (scaled coordinates)
- `hiScorePosition`: {x: 160, y: 16}
- `creditPosition`: {x: 320, y: 480}
- `livesPosition`: {x: 32, y: 480}

**Behaviors**:
- Format numbers with proper spacing
- Render bitmap text at specified positions
- Display lives as small cannon sprites
- Apply green color overlay to player elements

**Validation Rules**:
- Scores must be non-negative integers
- Lives count must be 0-3
- Positions must be within screen bounds
- Font data must be 8×8 pixel arrays

**State Transitions**:
```
Hidden → Visible (on game start)
Visible → Visible (values update during gameplay)
Visible → Hidden (during level transitions)
```

### AudioManager
Manages dynamic tempo changes, UFO sound effects, and audio timing coordination.

**Properties**:
- `audioContext`: Web Audio API context
- `musicOscillators`: Array of active music oscillators
- `ufoOscillator`: Dedicated UFO sound oscillator
- `masterGain`: Global volume control
- `musicGain`: Background music volume
- `effectsGain`: Sound effects volume

**Behaviors**:
- Initialize Web Audio API context
- Create and manage oscillator nodes
- Coordinate music tempo with game state
- Handle UFO sound synthesis (VCO + SLF emulation)
- Clean up audio resources

**Validation Rules**:
- Audio context must be valid
- Gain values must be 0.0-1.0
- Oscillator frequencies must be positive

**State Transitions**:
```
Uninitialized → Ready (context creation)
Ready → Playing (music/effects active)
Playing → Paused (context suspended)
Paused → Playing (context resumed)
```

## Entity Relationships

```
GameState (existing)
├── BackgroundMusic (1:1)
├── BonusUFO (0:1) - only when active
├── UFOScoringSystem (1:1)
├── AuthenticUIDisplay (1:1)
└── AudioManager (1:1)

AudioManager
├── BackgroundMusic (manages music oscillators)
└── BonusUFO (manages UFO sound)

UFOScoringSystem
└── BonusUFO (determines score value)
```

## Data Flow Patterns

1. **Music Tempo Update**: GameState alien count → BackgroundMusic → AudioManager
2. **UFO Spawning**: Random timer → BonusUFO creation → AudioManager sound start
3. **UFO Scoring**: Player shot → UFOScoringSystem → BonusUFO score value
4. **UI Updates**: GameState changes → AuthenticUIDisplay formatting → Canvas rendering
5. **Audio Coordination**: Game events → AudioManager → Web Audio API synthesis

## Integration Points with Existing System

- Extends existing `GameState` object with new properties
- Integrates with existing collision detection system for UFO hits
- Uses existing canvas rendering pipeline for UI display
- Coordinates with existing input handling for shot counting
- Maintains existing single HTML file architecture pattern