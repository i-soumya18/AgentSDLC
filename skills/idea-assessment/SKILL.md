---
name: idea-assessment
description: Evaluates new feature or product ideas against user personas, business value, technical viability, and risks.
---

# Skill: Idea Assessment

## PURPOSE
Provide rigorous, objective vetting of a proposed product feature or capability before committing engineering resources.

## INPUTS
- `ideaSummary`: Free-form description of the proposed feature.
- `targetPersonas`: Intended users.
- `businessGoals`: Expected outcomes or KPIs.

## TOOLS
- `view_file` (inspecting `specs/000-project-charter.md` and `.ai/context.md`)
- `write_to_file` (`specs/<feature-id>/assessment.md`)

## STEPS
1. Extract problem statement and validate that it solves a real pain point.
2. Identify 2-3 market or architectural alternatives (e.g. build vs buy vs existing OSS).
3. Document core assumptions, technical unknowns, and systemic risks.
4. Establish quantifiable success metrics (e.g. conversion rate +15%, latency <200ms).
5. Explicitly list non-goals (what this feature will NOT do).
6. Issue formal recommendation: BUILD / DEFER / DO NOT BUILD.

## CONSTRAINTS
- Non-goals must be explicit; generic statements like "make it good" are forbidden.
- Success metrics must be measurable and verifiable.

## FAILURE CONDITIONS
- Vague problem statement with no identified user persona.
- Missing success metrics or failure to define boundaries.

## EXPECTED OUTPUT
`specs/<feature-id>/assessment.md` signed off with recommendation.

## REQUIRED EVIDENCE
- Completed `assessment.md` artifact meeting all Product Gate criteria in `.ai/quality-gates.md`.
