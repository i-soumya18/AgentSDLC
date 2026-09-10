# AGENTS.md — The Master Cross-Agent Engineering Contract

> **Scope**: Repository-wide permanent governance contract for all AI coding agents, autonomous subagents, and human engineers.

---

## 1. Executive Mission & Philosophy

This repository is governed by the **Agentic AI SDLC Operating System**.
We operate under a single central thesis:
> **Specification is the single source of truth; code is merely one generated and machine-verified artifact of that specification.**

The traditional loop of *"open IDE → prompt → code → hope"* is forbidden. All non-trivial engineering work must flow through explicit, verifiable stages:
```text
ASSESS → CONSTITUTION → SPECIFY → CLARIFY → UX / ARCHITECTURE → CONTRACTS → PLAN → TASKS → IMPLEMENT → TEST / SECURITY / AI EVAL → REVIEW → CONVERGE → RELEASE → OBSERVE
```

---

## 2. Permanent Instruction Hierarchy

Agents must strictly honor this precedence order. When directives conflict, higher layers override lower layers:

```text
1. AGENTS.md                          (Global cross-agent engineering contract)
   ↓
2. .ai/constitution.md                (Project-wide inviolable laws & constraints)
   ↓
3. docs/adr/* & docs/architecture/*   (System architecture & recorded decisions)
   ↓
4. specs/<feature>/spec.md            (Active feature specification & acceptance criteria)
   ↓
5. .github/instructions/*             (Path-specific domain rules: frontend, backend, etc.)
   ↓
6. specs/<feature>/tasks.md           (Current granular task being executed)
```

---

## 3. The 12 Non-Negotiable Engineering Principles

1. **Specification Before Implementation**: Never write implementation code before a spec, contracts, and tasks exist and are clarified.
2. **Evidence Before Completion Claims**: Never claim a task is "done" without machine-verifiable proof (test logs, typecheck pass, contract match, eval score). "Looks good" is not acceptable.
3. **Secure by Default**: OWASP API Security & OWASP GenAI Top 10 baselines are mandatory. Secrets must never enter code or logs.
4. **Observable by Default**: Structured logs, OpenTelemetry spans, metrics, and health checks are required for every new endpoint and component.
5. **Backward Compatibility**: Contracts and databases must maintain backward compatibility unless an explicit migration waiver is approved.
6. **Small Reversible Changes**: Keep commits, PRs, and changesets small, isolated, and cleanly revertible.
7. **Vertical Slices Over Layered Monoliths**: Deliver complete vertical slices (`UI → API → DB → AI → Test → Telemetry`) rather than building all frontend or all backend in isolation.
8. **Explicit Architecture Decisions**: All architectural forks, database changes, or library additions require an approved ADR in `docs/adr/`.
9. **No Hidden State or Undocumented Magic**: All state transitions, side effects, and environment variables must be documented.
10. **Operational Readiness Is Part of Done**: A feature is not done until runbooks, rollback plans, and alert thresholds are recorded.
11. **Dual-Track AI Evaluation**: Probabilistic AI/LLM features must be evaluated against version-controlled golden, adversarial, and regression datasets (`tests/evals/`) separate from deterministic tests.
12. **Human Approval for High-Risk Actions**: Production deployments, destructive DB operations, and secret rotations strictly require human authorization.

---

## 4. Agent Collaboration Protocol & Roster

The agent that writes code must never be the sole evaluator of its correctness. Agents collaborate across specialized roles:

| Agent Role | Primary Focus | Writes Code? | Authority / Gate |
|---|---|:---:|---|
| **Product Agent** | User problem, business value, success metrics, non-goals | No | Advisory |
| **Spec Agent** | Functional & non-functional requirements, acceptance criteria | No | Human Gate |
| **Requirements Critic** | Edge cases, ambiguities, race conditions, attack vectors | No | Advisory |
| **UX Architect** | Information architecture, interaction states (8 states matrix) | Minimal | Human Gate |
| **Principal Architect** | System context, failure resilience matrix, ADR authorship | No | Human Gate |
| **API / Data Agent** | OpenAPI contracts, JSON schemas, SQL migrations | Yes | Contract Gate |
| **Technical Planner** | Vertical slice task breakdown (`TASK-xxx`) | No | Advisory |
| **Builder / Coding Agent** | Implementation of isolated tasks | Yes | Code Gate |
| **Test Agent** | Unit, integration, contract, and E2E test verification | Yes | Test Gate |
| **Security Agent** | Threat modeling, secret scanning, prompt-injection defense | No | Security Gate |
| **AI Eval Agent** | Model benchmarking, eval dataset execution, latency/cost | Yes | AI Eval Gate |
| **Release Agent** | CI/CD, migration execution, smoke testing, rollback verification | Yes | Release Gate |
| **SRE Agent** | Observability, SLOs, error budgets, incident postmortems | Yes | Operations Gate |
| **Convergence Agent** | Drift detection between spec, contract, code, and docs | No | Convergence Gate |

---

## 5. Standard Artifact Traceability Chain

Every requirement must remain 100% traceable from conception to production:
```text
REQ-001 (Requirement in spec.md)
  ↓
SPEC-001 (Functional specification)
  ↓
UX-001 (Interaction flow & state contract)
  ↓
ADR-0001 (Architectural decision record)
  ↓
API-001 (OpenAPI endpoint schema in contracts/)
  ↓
TASK-001.1 .. TASK-001.n (Vertical slice execution tasks)
  ↓
TEST-001 (Deterministic tests & AI evals)
  ↓
VER-001 (Machine-verifiable evidence artifact)
```

---

## 6. Forbidden Actions

Agents must NEVER under any circumstances:
- ❌ Modify `.ai/constitution.md` or quality gate criteria without explicit human instruction.
- ❌ Claim a task is complete without running automated verification (`eos gate`, tests, or linter).
- ❌ Bypass or delete failing tests to force a build to pass.
- ❌ Commit credentials, private keys, or API tokens into source control.
- ❌ Execute raw destructive database operations (`DROP`, `TRUNCATE`, unconstrained `DELETE`) without human confirmation.
- ❌ Add new dependencies without recording an ADR and auditing for vulnerabilities.
- ❌ Edit files outside the immediate scope of the active vertical task.

---

## 7. Bug-Fixing Discipline

When resolving defects, agents must strictly follow:
```text
REPRODUCE → LOCALIZE → ROOT CAUSE → PATCH → REGRESSION TEST → VERIFY → DOCUMENT
```
Every resolved bug must leave behind an automated regression test in `tests/` or `tests/evals/regression.jsonl`.
