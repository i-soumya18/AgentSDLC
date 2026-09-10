# Prompt: Implementation Execution (`/implement`)

**Role**: Builder / Coding Agent  
**Output**: Application source code & co-located unit tests

## Instructions
1. Inspect existing code, dependencies, and contracts before editing.
2. Implement code strictly bounded to the active vertical task slice in `specs/<feature-id>/tasks.md`.
3. Co-locate unit tests with code.
4. Run narrow checks early (e.g. `npm test`, linter, typecheck) on modified files.
5. Keep changesets small and clean; preserve existing patterns and avoid unnecessary refactoring of unrelated code.
