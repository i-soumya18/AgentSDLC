---
name: spec-review
description: Audits feature specifications for completeness, testability, and traceability.
---

# Skill: Spec Review

## PURPOSE
Validate that a written specification (`spec.md`) is sufficiently rigorous, complete, and free of untestable assertions before proceeding to design and architecture.

## INPUTS
- `specPath`: Path to `specs/<feature-id>/spec.md`.

## TOOLS
- `view_file`
- `write_to_file`

## STEPS
1. Verify that every requirement has a unique, permanent identifier (`REQ-XXX.Y`).
2. Audit acceptance criteria: verify they follow Given-When-Then or quantifiable boundary format.
3. Check for presence of non-functional requirements (throughput, P95 latency, rate limits).
4. Verify error handling scenarios and negative test paths are enumerated.
5. Check that data sensitivity or privacy implications are documented.

## CONSTRAINTS
- Reject any requirement containing subjective qualifiers ("fast", "modern", "user-friendly").
- Every requirement must have at least one testable assertion.

## FAILURE CONDITIONS
- Missing `REQ-` tags.
- Missing acceptance criteria or error states.

## EXPECTED OUTPUT
Review report appended to `spec.md` or logged as review findings.

## REQUIRED EVIDENCE
- Checkmark signoff against Spec Gate in `.ai/quality-gates.md`.
