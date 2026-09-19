# ADR-0004: Establish Foundation Hardening & Canonical Registries

- **Status**: Accepted
- **Date**: 2026-09-20
- **Deciders**: Principal Software Engineer & Architecture Council
- **Technical Story**: Phase 0 Foundation Hardening of AgentSDLC Software Factory

---

## 1. Context and Problem Statement
During initial repository reconnaissance, several inconsistencies between documentation and implementation were uncovered:
1. Lifecycle stages were duplicated across `.ai/quality-gates.md`, `CLAUDE.md`, and `src/cli/stage.js`, causing drift.
2. Quality gates listed in the CLI had missing evaluator functions, resulting in vacuous passes (`results.every()` returning true on skipped gates).
3. Hardcoded feature directory defaults (`001-feature`) caused CLI checks to fail against the active feature `001-ai-task-copilot`.
4. Artifact metadata was informal markdown with no machine-enforceable JSON schema.

Before adding advanced autonomous capabilities (Discovery Engine, Product Graph, Context Compiler), the kernel must be hardened and made trustworthy.

---

## 2. Decision Outcome
Chosen Option: Implement Phase 0 Foundation Hardening:
1. **Canonical Lifecycle Registry** (`src/lifecycle/stages.js`): Single programmatic source of truth for all 17 SDLC stages and their artifacts.
2. **Canonical Gate Registry** (`src/gates/registry.js`): Every gate is registered as strictly `IMPLEMENTED` or `EXPLICITLY_UNIMPLEMENTED`, with zero silent vacuous passes.
3. **Canonical Artifact Schemas** (`schemas/`): JSON Schemas for Artifacts, Decisions, Assumptions, Evidence, and Gates.
4. **Modular Architecture** under `src/core/`, `src/lifecycle/`, `src/gates/`, `src/artifacts/`, and `src/verification/` while preserving 100% backward compatibility for existing CLI commands.
5. **Dynamic Active Feature Resolution**: CLI dynamically detects features in `specs/`.

### Positive Consequences
- Elimination of false-positive gate passes.
- Consistent stage progression and artifact scaffolding.
- Machine-verifiable artifact and evidence schemas.
- Stable base for subsequent factory phases (Discovery, Graph, Orchestration).

### Negative Consequences / Trade-offs
- Stricter gate checks may fail previously overlooked incomplete gates if run without prerequisites.
