---
name: code-review
description: Conducts an independent, objective review of implementation code against specification and coding standards.
---

# Skill: Code Review

## PURPOSE
Provide independent evaluation of written code to catch bugs, anti-patterns, security risks, or drift before merge.

## INPUTS
- `changedFiles`: List of modified files.
- `featureSpec`: `specs/<feature-id>/spec.md`.

## TOOLS
- `view_file`
- `write_to_file` (`specs/<feature-id>/review.md`)

## STEPS
1. Compare changed files against the requirements in `spec.md`.
2. Inspect for compliance with `.ai/coding-standards.md`:
   - Are vertical slice boundaries respected?
   - Is error handling complete with RFC 7807 problem details?
   - Are edge cases and null values handled defensively?
   - Are there any hidden side-effects or leaky abstractions?
3. Verify test co-location and coverage of modified logic.
4. Categorize feedback into:
   - **BLOCKERS**: Critical flaws that prevent merging.
   - **SUGGESTIONS**: Non-blocking improvements for readability or performance.

## CONSTRAINTS
- The agent that authored the code cannot perform the code review.
- Subjective stylistic nitpicks that could be enforced by automated formatters are forbidden.

## FAILURE CONDITIONS
- Unhandled promise rejections, unchecked array indexing, or hardcoded magic values.

## EXPECTED OUTPUT
`specs/<feature-id>/review.md` signed off with approval or blocking defects.

## REQUIRED EVIDENCE
- Documented review artifact with zero remaining blocking defects.
