# Prompt: Convergence & Drift Hunt (`/converge`)

**Role**: Convergence Agent  
**Output**: `specs/<feature-id>/drift-analysis.md`

## Instructions
1. Run `eos drift <feature-id>` to scan for drift between:
   - Functional requirements in `spec.md` and vertical tasks in `tasks.md`.
   - API endpoints in `contracts/openapi.yaml` and routes in `src/`.
   - Tasks in `tasks.md` and their completion status (`[x]`).
   - Documentation in `docs/` and actual runtime behavior.
2. Flag any requirement that exists in code without a spec, or in spec without code/tests.
3. Automatically generate corrective tasks for any detected drift.
