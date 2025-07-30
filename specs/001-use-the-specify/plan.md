# Implementation Plan: Classic 1980s Space Invaders Game

**Branch**: `001-use-the-specify` | **Date**: July 30, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-use-the-specify/spec.md`

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
Create a pixel-perfect recreation of the classic 1980s Space Invaders arcade game using plain JavaScript in a single HTML file. The game features 55 aliens in a 5x11 grid (squids, crabs, octopi), 4 destructible shield barriers, player cannon with 3 lives, authentic monochrome graphics with selective green coloring, and classic arcade mechanics including increasing speed as aliens are eliminated.

## Technical Context
**Language/Version**: JavaScript ES6+ (modern browser compatibility)  
**Primary Dependencies**: HTML5 Canvas API, browser keyboard events, requestAnimationFrame  
**Storage**: N/A (single session game, no persistence required)  
**Testing**: Node.js unit tests for game logic, manual browser testing for integration  
**Target Platform**: Modern web browsers (Chrome 60+, Firefox 55+, Safari 12+)
**Project Type**: single (one HTML file with embedded JavaScript)  
**Performance Goals**: 60 fps gameplay, <16ms frame time, smooth animation  
**Constraints**: Single HTML file, no external dependencies, pixel-perfect sprites, authentic arcade timing, 1600x1200 canvas (2x scaling)  
**Scale/Scope**: Single-player game, 1 level, 55 aliens, 4 shields, authentic 1980s arcade experience on modern displays

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (single HTML file game)
- Using framework directly? YES (Canvas API, browser events directly)
- Single data model? YES (game state in memory, no DTOs)
- Avoiding patterns? YES (direct implementation, no unnecessary abstractions)

**Architecture**:
- EVERY feature as library? EXCEPTION JUSTIFIED - Single HTML file constraint requires embedded approach
- Libraries listed: N/A (single file constraint)
- CLI per library: N/A (browser-based game)
- Library docs: N/A (single file game)

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? YES - Node.js unit tests for pure game logic
- Git commits show tests before implementation? YES  
- Order: Node.js unit tests → Implementation → Manual browser integration testing
- Real dependencies used? N/A (pure logic functions tested in Node.js)
- Integration tests for: Manual browser testing by human (game actually playable)

**Observability**:
- Structured logging included? Console logging for debugging
- Frontend logs → backend? N/A (no backend)
- Error context sufficient? Browser console errors

**Versioning**:
- Version number assigned? 1.0.0
- BUILD increments on every change? YES
- Breaking changes handled? N/A (single file game)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: 
- `space-invaders.html`: Single file game implementation
- `game-logic.js`: Extracted pure functions for Node.js testing
- `game-logic.test.js`: Jest unit tests
- `package.json`: Test dependencies only

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update CLAUDE.md incrementally** (O(1) operation):
   - Run `/scripts/update-claude-md.sh`
   - If no CLAUDE.md exists: Create from template
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

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
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


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
- [x] Initial Constitution Check: PASS (with justified exceptions for single-file constraint)
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (library-first exception due to single HTML file requirement)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*