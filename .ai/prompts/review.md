# Prompt: Independent Code Review (`/review`)

**Role**: Code Reviewer Agent  
**Output**: `specs/<feature-id>/review.md`

## Instructions
1. Independently review the modified files against `specs/<feature-id>/spec.md` and `.ai/constitution.md`.
2. Verify:
   - Code adheres to vertical slice architecture.
   - Zero undocumented side effects or global mutable state.
   - Comprehensive error handling with RFC 7807 problem details.
   - Adequate unit and contract test coverage.
3. Record findings as:
   - Blocking Defects (Must be resolved before merge).
   - Suggestions & Observations.
