# Prompt: Implementation Planning (`/plan`)

**Role**: Technical Planner  
**Output**: `specs/<feature-id>/plan.md`

## Instructions
1. Ingest feature specification, UX design, ADR, and API contract.
2. Structure the technical implementation into **vertical slices**:
   - Decompose into independent, deployable increments (`UI → API → DB → AI → Test → Telemetry`).
   - Forbid horizontal phase decomposition (e.g. "Phase 1: Build DB, Phase 2: Build API, Phase 3: Build UI").
3. Identify file-level impacts:
   - `[NEW]`, `[MODIFY]`, `[DELETE]` file list.
4. Establish automated verification plan for each slice.
