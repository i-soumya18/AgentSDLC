---
name: clarification
description: Hunts for ambiguities, omissions, race conditions, and hostile edge cases in feature specifications.
---

# Skill: Requirements Clarification & Ambiguity Hunt

## PURPOSE
Subject the specification to hostile criticism to expose implicit assumptions, concurrency flaws, or missing states before engineering begins.

## INPUTS
- `specContent`: Content of `specs/<feature-id>/spec.md`.

## TOOLS
- `view_file`
- `write_to_file` (`specs/<feature-id>/clarification.md`)

## STEPS
1. Read the specification with a hostile, skeptical mindset.
2. Formulate probe questions in five key vectors:
   - Concurrency & Race Conditions (e.g. what if two requests arrive simultaneously?)
   - Authorization & Multi-tenancy (e.g. what if user tries to update another tenant's object?)
   - Network & Timeout Failures (e.g. what if third-party API times out after 10s?)
   - State Machine Gaps (e.g. what if status transition is skipped?)
   - Edge Inputs (e.g. empty strings, emojis, 10MB payloads, SQL metacharacters).
3. Document each defect with Severity (Blocker / High / Medium / Low) in `clarification.md`.
4. Collaborate with Spec Agent or Human to resolve all Blocker/High issues.

## CONSTRAINTS
- Do not let implementation agents fill in blanks silently.
- Do not mark clarification complete while unresolved Blocker findings remain.

## FAILURE CONDITIONS
- Spec assumes network is always available, database is always fast, and users never make mistakes.

## EXPECTED OUTPUT
`specs/<feature-id>/clarification.md` with resolved ambiguity log.

## REQUIRED EVIDENCE
- Signoff showing all identified Blocker/High ambiguities have documented answers.
