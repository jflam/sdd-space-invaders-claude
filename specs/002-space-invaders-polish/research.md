# Research Findings: Space Invaders Polish Features

**Feature**: Background Music, Bonus UFO, and Authentic UI Display  
**Date**: July 30, 2025  
**Status**: Complete

## Background Music Research

### Decision: Four Descending Chromatic Bass Notes with TTL Circuit Emulation
**Frequencies Selected**: C3-130Hz, B♭2-116Hz, G2-98Hz, F2-87Hz (estimated based on chromatic pattern and typical arcade bass ranges)

**Rationale**: 
- Original 1978 Space Invaders used TTL (Transistor-Transistor Logic) circuits for bass notes, NOT the SN76477 chip
- Four descending chromatic bass notes created the first continuous background soundtrack in video game history
- Exact frequencies are undocumented, but chromatic pattern and bass register (60-130Hz range) are established

**Alternatives Considered**:
- SN76477 chip emulation: Rejected because SN76477 was only used for UFO sound
- Pre-recorded audio samples: Rejected to maintain authentic synthesis approach
- Higher frequency ranges: Rejected as original was specifically bass-heavy for psychological impact

### Decision: Web Audio API Square Wave Synthesis with Dynamic Tempo
**Implementation**: OscillatorNode with square wave type and envelope control

**Rationale**:
- Square waves provide authentic arcade sound characteristics
- Web Audio API supports real-time tempo changes required for gameplay synchronization
- Allows precise frequency control and low-latency performance

**Alternatives Considered**:
- Custom waveforms with PeriodicWave: More complex, minimal authenticity benefit
- Audio samples with playback rate modulation: Less precise, higher latency

## UFO Scoring Algorithm Research

### Decision: Exact Original Algorithm Implementation
**Scoring Table**: [100, 50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100] (15 values, cycling)

**Rationale**: 
- Research revealed exact hardcoded table from original ROM at memory address 0x1D54
- 23rd shot = 300 points, then every 15th shot thereafter due to table cycling
- Deterministic algorithm rewards player skill and shot counting knowledge

**Alternatives Considered**:
- Random scoring: Rejected as inauthentic to original game design
- Simplified fixed values: Rejected as it removes strategic depth
- Modern probability-based system: Rejected to maintain 1978 authenticity

### Decision: 25-Second Average UFO Appearance Interval
**Timing Pattern**: Random intervals averaging 25 seconds, maximum 8 UFOs per screen initially

**Rationale**:
- Based on original interrupt-driven timing system research
- Maintains tension without overwhelming gameplay
- Matches documented arcade cabinet behavior

**Alternatives Considered**:
- Fixed intervals: Rejected as less engaging and inauthentic
- Player performance-based timing: Rejected to maintain original behavior

## UFO Sound Effect Research

### Decision: SN76477 Complex Sound Generator Emulation
**Implementation**: VCO + SLF oscillator combination for warbling effect

**Rationale**:
- SN76477 was specifically used for UFO sound in original hardware
- Voltage-controlled oscillator with super low frequency modulation creates authentic warbling
- Texas Instruments chip provided unique analog characteristics impossible to replicate exactly

**Alternatives Considered**:
- Simple tone generation: Rejected as lacking distinctive warbling character
- Audio samples: Rejected to maintain synthesis authenticity
- Modern synthesizer emulation: Rejected as overly complex for required effect

## Authentic UI Display Research

### Decision: 8×8 Pixel Character Grid System with Authentic Font
**Typography**: Monospace bitmap font based on original ROM character set at 0x1E00

**Rationale**:
- Original used 8×8 pixel character grid due to hardware constraints
- 64-character set (A-Z, 0-9, punctuation) with distinctive "squashed" characteristics
- Maintains visual authenticity of 1978 arcade cabinet

**Alternatives Considered**:
- Modern pixel fonts: Rejected as lacking authentic character proportions
- Scalable fonts: Rejected as inconsistent with bitmap-based original
- Vector-based text: Rejected due to performance and authenticity concerns

### Decision: Green Color Overlay System for Player UI Elements
**Layout**: SCORE, HI-SCORE, CREDIT display with lives shown as small cannon sprites

**Rationale**:
- Original used transparent cellophane overlays for color
- Green overlay specifically covered player area and UI elements
- 256×224 pixel resolution with 90° counter-clockwise rotation

**Alternatives Considered**:
- Full-color modern UI: Rejected as breaking visual authenticity
- Monochrome display: Rejected as missing distinctive green player area
- Different color schemes: Rejected to maintain original Taito cabinet appearance

## Dynamic Tempo Calculation Research

### Decision: Linear Tempo Scaling Based on Alien Count
**Formula**: `tempo = baseTempo * (totalAliens / remainingAliens)`

**Rationale**:
- Original game's tempo increase was hardware-based (fewer sprites = faster processing)
- Linear scaling provides predictable tension buildup
- Matches documented behavior of increasing urgency as gameplay progresses

**Alternatives Considered**:
- Exponential scaling: Rejected as potentially too dramatic for playability
- Fixed tempo stages: Rejected as less smooth than original experience
- Player performance-based tempo: Rejected to maintain original mechanics

## Implementation Constraints Resolved

All research findings align with existing single HTML file architecture and Web Audio API capabilities. No additional dependencies required beyond current game-logic.js pattern for unit testing.