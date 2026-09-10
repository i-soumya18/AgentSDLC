---
name: release-readiness
description: Validates that all gates, tests, smoke verifications, and rollback scripts are green prior to production release.
---

# Skill: Release Readiness

## PURPOSE
Prevent broken builds from entering production through systematic verification of the Release Gate.

## INPUTS
- `featureId`: Target feature identifier.

## TOOLS
- `run_command` (`node bin/engineering-os.js gate release`)
- `view_file`

## STEPS
1. Audit the 15 Quality Gates: confirm all gates are green.
2. Confirm zero pending tasks in `specs/<feature-id>/tasks.md`.
3. Verify that staging deployment succeeded and synthetic smoke tests (`scripts/smoke-test.sh`) pass.
4. Verify automated rollback script (`scripts/rollback.sh --verify-only`).
5. Require explicit human authorization before deploying to production.

## CONSTRAINTS
- A release cannot proceed with failing CI checks or unresolved P1 bugs.
- Must know how to undo the deployment before shipping it.

## FAILURE CONDITIONS
- Lack of an automated rollback mechanism or unverified database migration.

## EXPECTED OUTPUT
`specs/<feature-id>/release-checklist.md` with complete signoffs.

## REQUIRED EVIDENCE
- Green terminal report from `eos gate release` and `smoke-test.sh`.
