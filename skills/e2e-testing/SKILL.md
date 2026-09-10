---
name: e2e-testing
description: Builds and executes end-to-end browser journeys covering critical user paths using headless automation.
---

# Skill: End-to-End Testing

## PURPOSE
Verify that integrated systems, frontend UI, APIs, and databases work together seamlessly across critical user journeys.

## INPUTS
- `userJourneys`: Primary workflows documented in `specs/<feature-id>/spec.md` or `ux.md`.

## TOOLS
- `view_file`
- `write_to_file` (`tests/e2e/<journey>.spec.js`)
- `run_command` (`npx playwright test` or test runner)

## STEPS
1. Identify the critical user journeys (e.g. signup, create project, run task, view report).
2. Author test scripts using Playwright or equivalent browser runner.
3. Test against realistic test fixtures or ephemeral local servers.
4. Verify visual rendering and ensure zero unhandled browser console errors.
5. Capture screenshots on test failures to aid root-cause analysis.

## CONSTRAINTS
- Reserve E2E tests for high-value user journeys; do not replicate unit test combinatorial checks in E2E.
- Implement explicit locator waits; avoid arbitrary `sleep()` statements.

## FAILURE CONDITIONS
- Tests failing due to race conditions or asynchronous DOM element detachment.

## EXPECTED OUTPUT
Executable E2E specs in `tests/e2e/`.

## REQUIRED EVIDENCE
- Test execution report showing green pass across all critical journeys.
