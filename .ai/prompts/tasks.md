# Prompt: Task Decomposition (`/tasks`)

**Role**: Technical Planner  
**Output**: `specs/<feature-id>/tasks.md`

## Instructions
1. Break vertical slices into granular, executable task items.
2. Label each task with `TASK-XXX.Y` and map to `REQ-XXX.Y`.
3. Include explicit acceptance check for each task:
   ```markdown
   - [ ] TASK-001.1: Implement Task entity and SQLite table migration (maps to REQ-001.1)
     - Acceptance: Migration applies cleanly and passes down-migration test.
   - [ ] TASK-001.2: Implement POST /api/v1/tasks endpoint with OpenAPI validation (maps to REQ-001.2)
     - Acceptance: Returns 201 Created on valid payload, 400 Bad Request on empty title.
   ```
4. Check off tasks only after verifiable test evidence is produced.
