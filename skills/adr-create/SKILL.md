---
name: adr-create
description: Authors an immutable Architecture Decision Record (ADR) capturing context, choices, and consequences.
---

# Skill: ADR Create

## PURPOSE
Standardize the capture of architectural decisions in durable version control to eliminate tribal knowledge and prevent undocumented changes.

## INPUTS
- `title`: Short descriptive title of the decision.
- `context`: Background problem, drivers, and constraints.
- `decision`: Chosen architectural pattern or technology.
- `consequences`: Trade-offs, benefits, and drawbacks.

## TOOLS
- `run_command` (listing existing ADRs to determine next sequence number)
- `write_to_file` (`docs/adr/XXXX-<title>.md`)

## STEPS
1. Inspect `docs/adr/` to determine the next sequential number (e.g. `0004-`).
2. Read `docs/adr/template.md` for standard structure.
3. Formulate sections:
   - **Status**: Proposed / Accepted / Superseded / Deprecated
   - **Context**: Why are we faced with this choice?
   - **Decision**: What are we committing to?
   - **Alternatives Considered**: What options did we reject and why?
   - **Consequences**: Positive, negative, and neutral impacts.
4. Commit ADR into git.

## CONSTRAINTS
- Never overwrite or rewrite an existing Accepted ADR.
- If a decision changes, create a new ADR that marks the old one as `Superseded by ADR-XXXX`.

## FAILURE CONDITIONS
- Lack of "Alternatives Considered" or ignoring negative consequences.

## EXPECTED OUTPUT
`docs/adr/XXXX-<title>.md` committed in git.

## REQUIRED EVIDENCE
- Validated ADR document following Fowler-style structure.
