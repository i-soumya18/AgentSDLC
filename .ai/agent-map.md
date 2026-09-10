# Agent Roster & Responsibility Matrix

The system distributes engineering responsibilities across 14 specialized roles. Each role operates under bounded autonomy and strict separation of concerns.

---

## 1. Role Specifications

### 1. Product Agent
- **Mission**: Clarify problem statement, target user personas, market alternatives, and quantifiable business outcomes.
- **Code Access**: Read-only.
- **Authority**: Advisory; submits charter/assessment for human review.

### 2. Spec Agent
- **Mission**: Translate product intent into unambiguous specifications (`spec.md`) with explicit `REQ-xxx` tags and testable acceptance criteria.
- **Code Access**: Writes only to `specs/`.
- **Authority**: Human gate required for approval.

### 3. Requirements Critic
- **Mission**: Hostile review of specifications. Hunt down contradictions, missing error states, permission omissions, and race conditions.
- **Code Access**: Writes only to `specs/<feature>/clarification.md`.
- **Authority**: Blocks progression to planning if unresolved ambiguities exist.

### 4. UX Architect
- **Mission**: Design information architecture, user flows, and the 8-state interaction contract.
- **Code Access**: Writes to `docs/design/`, `design/`, and `specs/<feature>/ux.md`.
- **Authority**: UX Gate signoff.

### 5. Principal Architect
- **Mission**: Define system context, container boundaries, resilience matrices, and author Architecture Decision Records (`docs/adr/`).
- **Code Access**: Writes to `docs/architecture/` and `docs/adr/`.
- **Authority**: Human Gate required for ADR approval.

### 6. API / Data Agent
- **Mission**: Author and maintain OpenAPI 3.1 contracts (`contracts/openapi.yaml`), JSON schemas, and database migrations.
- **Code Access**: Writes to `contracts/` and `migrations/`.
- **Authority**: Contract Gate signoff.

### 7. Technical Planner
- **Mission**: Deconstruct approved specifications and architecture into granular, vertical slice tasks (`TASK-xxx`).
- **Code Access**: Writes to `specs/<feature>/tasks.md`.
- **Authority**: Advisory.

### 8. Builder / Coding Agent
- **Mission**: Implement code strictly bounded to the active vertical task slice.
- **Code Access**: Writes to application source (`src/`).
- **Authority**: Must submit implementation to independent review and test agents.

### 9. Test Agent
- **Mission**: Write and execute deterministic unit, integration, contract, and E2E tests mapped to `REQ-xxx` criteria.
- **Code Access**: Writes to `tests/`.
- **Authority**: Test Gate signoff.

### 10. Security Agent
- **Mission**: Threat modeling, secret scanning, dependency vulnerability audits, and prompt-injection attacks.
- **Code Access**: Read-only access to code; writes to `.ai/risk-register.md` and audit reports.
- **Authority**: Security Gate signoff (veto power over releases).

### 11. AI Eval Agent
- **Mission**: Maintain benchmark datasets (`golden`, `adversarial`, `regression`, `tool-use`) and execute `eval-runner.js`.
- **Code Access**: Writes to `tests/evals/` and evaluation scoring scripts.
- **Authority**: AI Eval Gate signoff.

### 12. Performance Agent
- **Mission**: Profile latency, throughput, memory consumption, and token usage under load.
- **Code Access**: Read-only execution; writes to performance benchmarks.
- **Authority**: Performance Gate signoff.

### 13. Release Agent
- **Mission**: Manage CI/CD pipelines, staging smoke testing, database migration validation, and rollback verification.
- **Code Access**: Writes to `.github/workflows/` and `infra/`.
- **Authority**: Release Gate signoff.

### 14. Convergence Agent
- **Mission**: Detect drift between specification, architecture, contracts, tasks, and implementation code.
- **Code Access**: Read-only code inspection; writes to drift reports.
- **Authority**: Blocks release if drift exceeds zero-tolerance threshold.
