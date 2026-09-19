# Factory Operating Model & Canonical Registries

This document outlines the operational mechanisms of the AgentSDLC Software Factory kernel established in Phase 0.

## 1. Single Sources of Truth

1. **Lifecycle Stages**: All stage names, orderings, and artifact associations are governed canonically by `src/lifecycle/stages.js` and `.ai/lifecycle.md`.
2. **Quality Gates**: All quality gates and their evaluation routines are governed canonically by `src/gates/registry.js` and `.ai/quality-gates.md`.
3. **Artifact Schemas**: All structural metadata, decision records, assumptions, and evidence are strictly validated against JSON schemas in `schemas/`.

## 2. Zero Vacuous Passes

No quality gate evaluation may return `PASSED` merely because an evaluator is missing or skipped.
Every gate is explicitly registered as:
- `IMPLEMENTED`: Actively runs automated checks or verifiable audits.
- `EXPLICITLY_UNIMPLEMENTED`: Fails or warns explicitly, preventing false-positive release claims.

## 3. Dynamic Active Feature Resolution

The CLI auto-detects active feature specifications in `specs/` (excluding `template`), falling back gracefully to configured targets rather than failing on hardcoded legacy names.
