# Implementation Plan: Space Invaders Polish Features - Background Music, Bonus UFO, and Authentic UI Display

**Branch**: `002-space-invaders-polish` | **Date**: July 30, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/jflam/src/sdd-space-invaders-claude/specs/002-space-invaders-polish/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Enhance the existing Space Invaders game with authentic 1978 arcade polish features: continuous background music with four descending bass notes and dynamic tempo acceleration, random bonus UFO mystery ships with strategic scoring system (50-300 points), and authentic arcade UI display matching original layout. Implementation builds on existing Web Audio API architecture and single HTML file pattern, maintaining 60fps performance and pixel-perfect authenticity.

## Technical Context
**Language/Version**: JavaScript ES6+ (modern browser compatibility)  
**Primary Dependencies**: Web Audio API, HTML5 Canvas API, existing game-logic.js functions  
**Storage**: N/A (single session game, no persistence required)  
**Testing**: Node.js unit tests for pure game logic (existing pattern), manual browser testing for integration  
**Target Platform**: Modern web browsers (Chrome 60+, Firefox 55+, Safari 12+)
**Project Type**: single (extending existing HTML file with embedded JavaScript)  
**Performance Goals**: 60 fps gameplay, <16ms frame time, smooth audio synthesis, <200ms audio latency  
**Constraints**: Single HTML file architecture, Web Audio API frequency synthesis, authentic 1978 sound chip emulation, four descending bass note frequencies (C4-196Hz, B♭3-185Hz, G3-156Hz, F3-131Hz)  
**Scale/Scope**: Background music system, UFO entity with scoring logic, UI display formatting enhancements

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (single HTML file game extension)
- Using framework directly? YES (Web Audio API, Canvas API directly)
- Single data model? YES (game state in memory, extending existing entities)
- Avoiding patterns? YES (direct implementation, extending existing architecture)

**Architecture**:
- EVERY feature as library? EXCEPTION JUSTIFIED - Single HTML file constraint requires embedded approach, but pure logic functions will be extracted to game-logic.js for testing
- Libraries listed: game-logic.js (extended with UFO and music functions)
- CLI per library: N/A (browser-based game)
- Library docs: N/A (single file game with inline documentation)

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? YES - Node.js unit tests for UFO scoring logic, music tempo calculations
- Git commits show tests before implementation? YES  
- Order: Unit tests for pure functions → Implementation → Manual browser integration testing
- Real dependencies used? YES - Web Audio API integration tests, actual frequency synthesis
- Integration tests for: Manual browser testing (game actually playable with new features)

**Observability**:
- Structured logging included? Console logging for debugging audio synthesis and UFO timing
- Frontend logs → backend? N/A (no backend)
- Error context sufficient? Browser console errors, Web Audio API error handling

**Versioning**:
- Version number assigned? 2.0.0 (major feature addition)
- BUILD increments on every change? YES
- Breaking changes handled? N/A (single file game, backwards compatible)

## Project Structure

### Documentation (this feature)
```
specs/002-space-invaders-polish/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
space-invaders.html      # Enhanced single file implementation
game-logic.js           # Extended with UFO and music functions for testing
game-logic.test.js      # Enhanced Jest unit tests
package.json            # Test dependencies (unchanged)
```

**Structure Decision**: Extending existing single file architecture to maintain consistency with 001-use-the-specify implementation

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Exact frequencies for four descending bass notes in original 1978 Space Invaders
   - Web Audio API synthesis patterns for authentic SN76477 sound chip emulation
   - Original UFO appearance timing algorithms and randomization patterns
   - Authentic 1978 arcade UI layout measurements and font specifications

2. **Generate and dispatch research agents**:
   ```
   Research exact musical frequencies for Space Invaders four-note bass pattern
   Research Web Audio API synthesis techniques for retro arcade sound emulation
   Research original Space Invaders UFO scoring algorithm implementation details
   Research authentic 1978 arcade cabinet UI layout and typography specifications
   Research dynamic tempo calculation formulas based on alien count reduction
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all technical specifications resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - BackgroundMusic entity with tempo calculation and frequency arrays
   - BonusUFO entity with movement, timing, scoring, and sound properties
   - UIDisplay entity with layout coordinates and formatting rules
   - AudioManager entity with synthesis and timing coordination

2. **Generate API contracts** from functional requirements:
   - For each audio function → interface specification
   - For each UFO behavior → function signature
   - For each UI update → rendering contract
   - Output function contracts to `/contracts/`

3. **Generate contract tests** from contracts:
   - Test file for music tempo calculations
   - Test file for UFO scoring algorithm
   - Test file for UI formatting functions
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each acceptance scenario → integration test scenario
   - Quickstart test = story validation steps

5. **Update CLAUDE.md incrementally**:
   - Add Web Audio API synthesis patterns
   - Add UFO scoring algorithm details
   - Add music frequency specifications
   - Update recent changes

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Generate tasks following TDD pattern from research and design docs
- Each contract → contract test task [P]
- Each entity → pure function creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass
- Audio synthesis and UFO timing require special integration tasks

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Pure functions → Audio system → UFO system → UI updates
- Mark [P] for parallel execution (independent functions)
- Special attention to Web Audio API initialization timing

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Embedded library approach | Single HTML file architectural constraint | Separate library files would break existing game structure and user requirements |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (with justified exception for single-file architecture)
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (embedded library justified by architectural constraint)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*