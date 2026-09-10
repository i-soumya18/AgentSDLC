---
name: test-generation
description: Generates deterministic unit and contract tests mapped directly to acceptance criteria tags.
---

# Skill: Test Generation

## PURPOSE
Create comprehensive, fast, deterministic automated tests providing 100% verification coverage for specification requirements (`REQ-XXX`).

## INPUTS
- `specPath`: `specs/<feature-id>/spec.md`.
- `sourceFile`: Target source code under test.

## TOOLS
- `view_file`
- `write_to_file` (`tests/unit/<name>.test.js`)
- `run_command` (`npm test`)

## STEPS
1. Read all acceptance criteria tags (`REQ-XXX.Y`) from `spec.md`.
2. For each requirement, generate:
   - Happy path assertion
   - Boundary condition assertion (e.g. empty input, max length, zero values)
   - Negative error path assertion (e.g. invalid type, unauthorized access).
3. Co-locate the test file or place it in `tests/unit/`.
4. Include `@trace REQ-XXX.Y` annotation in test descriptions.
5. Execute `npm test` and ensure 100% test pass rate with zero flaky behavior.

## CONSTRAINTS
- Tests must be deterministic: no reliance on live network connections or uncontrolled system time.
- Never write tautological assertions (e.g. `assert(true)`).

## FAILURE CONDITIONS
- Tests that pass even when the underlying implementation logic is broken.

## EXPECTED OUTPUT
Executable test files in `tests/unit/` or `tests/contract/`.

## REQUIRED EVIDENCE
- Test execution terminal output showing passing test cases mapped to REQ tags.
