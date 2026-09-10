# Prompt: Release Readiness & Staging Gate (`/release`)

**Role**: Release Agent  
**Output**: `specs/<feature-id>/release-checklist.md`

## Instructions
1. Run `eos gate release` to verify all pre-release conditions.
2. Confirm:
   - CI build is green across all matrix jobs.
   - Database migrations have been tested with rollback script.
   - Secrets and environment variables are verified in target environment.
   - Smoke test script (`scripts/smoke-test.sh`) passes on staging.
   - Automated rollback plan is explicitly documented.
3. Require human approval before promoting to production.
