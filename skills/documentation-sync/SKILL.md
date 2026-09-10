---
name: documentation-sync
description: Reconciles system documentation, architecture diagrams, and API references with code reality.
---

# Skill: Documentation Synchronization

## PURPOSE
Prevent knowledge rot by continuously reconciling documentation with the actual implementation and active contracts.

## INPUTS
- `changedFeatures`: Features modified in active release.

## TOOLS
- `view_file`
- `write_to_file`
- `run_command` (`node bin/engineering-os.js drift`)

## STEPS
1. Audit `docs/architecture/` against any newly created services or data flows.
2. Ensure new environment variables are documented in `README.md` and `.env.example`.
3. Verify that `docs/api/standards.md` reflects updated API versioning and error envelopes.
4. Check that new failure modes discovered in incidents are recorded in `docs/architecture/resilience-matrix.md`.
5. Run `eos drift` to verify zero documentation drift.

## CONSTRAINTS
- Never allow a PR that changes public API behavior or runtime requirements to merge without updating documentation.

## FAILURE CONDITIONS
- Discrepancy between API specification and documentation examples.

## EXPECTED OUTPUT
Updated documentation synchronized with code.

## REQUIRED EVIDENCE
- Passing Docs Gate signoff in `.ai/quality-gates.md`.
