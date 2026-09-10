---
name: rollback
description: Executes and verifies safe, automated rollback of application code and database migrations.
---

# Skill: Safe Rollback Execution

## PURPOSE
Safely revert a faulty deployment to the previous known-good release without introducing data corruption or service disruption.

## INPUTS
- `targetReleaseTag`: Git commit hash or container tag of previous stable release.

## TOOLS
- `run_command` (`bash scripts/rollback.sh`)
- `view_file`

## STEPS
1. Verify target rollback version exists and passed previous quality gates.
2. If database migrations occurred, confirm that the down-migration script is backward-compatible with remaining live code.
3. Execute traffic diversion / image rollback using `scripts/rollback.sh`.
4. Run synthetic smoke tests (`scripts/smoke-test.sh`) to confirm system health post-rollback.
5. Notify engineering team and record rollback event in operations log.

## CONSTRAINTS
- Rollback must not execute destructive data operations (e.g. dropping tables with newly written user data) without deliberate data extraction.

## FAILURE CONDITIONS
- Rollback fails due to unhandled forward-only database migrations.

## EXPECTED OUTPUT
Restored stable service and rollback log.

## REQUIRED EVIDENCE
- Verification of healthy `/healthz` endpoint returning 200 OK after rollback.
