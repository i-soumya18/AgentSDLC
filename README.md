# ⚡ Agentic AI SDLC OS (`engineering-os` / `eos`)

> **The Reusable Engineering Operating System for AI-Native Software Factories**  
> Built on Spec-Driven Development (SDD), specialized bounded-autonomy agents, reusable skills, least-privilege MCP capability profiles, dual-track testing, and machine-verifiable quality gates.

---

## 🎯 Executive Overview

For modern AI-assisted engineering, the loop of *"open IDE → prompt → code → debug"* is primitive and error-prone. The **Agentic AI SDLC Operating System** turns software creation into an industrial-grade, predictable software factory:

```text
YOUR IDEA
   │
   ▼
[ ASSESS ] ───────────► Problem, Personas, Success Metrics, Non-Goals
   │
   ▼
[ CONSTITUTION ] ─────► 12 Inviolable Engineering Laws & Governance
   │
   ▼
[ SPECIFY ] ──────────► Functional (REQ-xxx) & Non-Functional Requirements
   │
   ▼
[ CLARIFY ] ──────────► Requirements Critic Attacks Ambiguities & Edge Cases
   │
   ┌─────────────────┴─────────────────┐
   ▼                                   ▼
[ UX ARCHITECTURE ]            [ SYSTEM ARCHITECTURE ]
8-State Contract               C4 Diagrams, 14 Failure Scenarios, ADRs
   │                                   │
   └─────────────────┬─────────────────┘
                     ▼
[ CONTRACTS FIRST ] ──► OpenAPI 3.1, JSON Schemas, Expand-Contract DB Migrations
   │
   ▼
[ PLAN & TASKS ] ─────► Granular Vertical Slices (UI → API → DB → AI → Test → Telemetry)
   │
   ▼
[ IMPLEMENT ] ────────► Builder Agent with Scoped Code Access
   │
   ┌─────────────────┼─────────────────┐
   ▼                 ▼                 ▼
[ TEST GATE ]   [ SECURITY GATE ]  [ AI EVAL HARNESS ]
Unit, Contract, OWASP API / Web    Golden, Adversarial,
Integration     GenAI Guardrails   Regression, Tool-Use
   │                 │                 │
   └─────────────────┼─────────────────┘
                     ▼
[ INDEPENDENT REVIEW ] ─► Peer Code Review
   │
   ▼
[ CONVERGENCE ] ──────► Automated Drift Detection (Spec vs Code vs Contracts)
   │
   ▼
[ RELEASE GATE ] ─────► Zero-Downtime Migration, Synthetic Smoke Tests, Rollback Verified
   │
   ▼
[ PRODUCTION ] ───────► Immutable Container Deployment
   │
   ▼
[ OBSERVABILITY ] ────► OpenTelemetry Traces, Metrics, Structured Logs, SLOs
   │
   ▼
[ FEEDBACK FLYWHEEL ] ─► Incident Postmortems generate new Tests, Rules & Skills
   │
   └───────────────────────────────────► Next Spec
```

---

## 🚀 Quickstart

### 1. Installation & CLI Usage
You can run `engineering-os` (aliased as `eos`) directly or install it:

```bash
# Display help and command directory
node bin/engineering-os.js --help

# Display visual SDLC status dashboard
node bin/engineering-os.js status

# Audit all machine-enforced quality gates
node bin/engineering-os.js gate all

# Run artifact drift and convergence detector
node bin/engineering-os.js drift

# Run the AI evaluation harness
node bin/engineering-os.js eval --dataset tests/evals/tool-use.jsonl
node bin/engineering-os.js eval --dataset tests/evals/adversarial.jsonl

# Execute full end-to-end repository verification
bash scripts/verify.sh
```

### 2. Bootstrapping a New Project
Initialize a new project with the complete SDLC OS skeleton:

```bash
node bin/engineering-os.js init my-new-app --preset strict
cd my-new-app
node bin/engineering-os.js status
```

---

## 🏛️ The Instruction Hierarchy

Agents must strictly honor this precedence order. Higher layers override lower layers:

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

## 🤖 Specialized Agent Roster

The agent that authors code is never the sole arbiter of its correctness. Work is distributed across 14 specialized roles operating under **bounded autonomy**:

| Agent Role | Primary Focus | Writes Code? | Authority / Gate |
|---|---|:---:|---|
| **Product Agent** | User problem, business value, success metrics, non-goals | No | Advisory |
| **Spec Agent** | Functional & non-functional requirements, acceptance criteria | No | Human Gate |
| **Requirements Critic** | Edge cases, ambiguities, race conditions, attack vectors | No | Advisory |
| **UX Architect** | Information architecture, 8-state interaction contract | Minimal | Human Gate |
| **Principal Architect** | System context, 14-scenario failure resilience, ADRs | No | Human Gate |
| **API / Data Agent** | OpenAPI 3.1 contracts, JSON schemas, SQL migrations | Yes | Contract Gate |
| **Technical Planner** | Vertical slice task breakdown (`TASK-xxx`) | No | Advisory |
| **Builder Agent** | Implementation of isolated tasks | Yes | Code Gate |
| **Test Agent** | Unit, integration, contract, and E2E test verification | Yes | Test Gate |
| **Security Agent** | Threat modeling, secret scanning, prompt-injection defense | No | Security Gate |
| **AI Eval Agent** | Model benchmarking, eval dataset execution, latency/cost | Yes | AI Eval Gate |
| **Release Agent** | CI/CD, migration execution, smoke testing, rollback verification | Yes | Release Gate |
| **SRE Agent** | Observability, SLOs, error budgets, incident postmortems | Yes | Operations Gate |
| **Convergence Agent** | Drift detection between spec, contract, code, and docs | No | Convergence Gate |

---

## 🧰 Reusable Skills Library (`skills/`)

Each skill is a deterministic engineering playbook defining **PURPOSE, INPUTS, TOOLS, STEPS, CONSTRAINTS, FAILURE CONDITIONS, EXPECTED OUTPUT, and REQUIRED EVIDENCE**:

1. `skills/project-bootstrap`: Repository scaffolding and calibration.
2. `skills/idea-assessment`: Objective idea vetting, alternatives, and viability.
3. `skills/spec-review`: Requirements completeness and testability audit.
4. `skills/clarification`: Hostile ambiguity and race condition hunt.
5. `skills/ux-flow-review`: 8-state UI interaction contract and a11y audit.
6. `skills/architecture-review`: Cloud-neutral design and 14-point failure resilience review.
7. `skills/adr-create`: Standardized Fowler-style architecture decision records.
8. `skills/api-design`: Contract-first OpenAPI 3.1 and RFC 7807 error modeling.
9. `skills/db-design`: Normalized relational data models and covering index design.
10. `skills/migration-review`: Zero-downtime expand-contract audit and rollback verification.
11. `skills/code-review`: Independent peer review verifying vertical slice boundaries.
12. `skills/test-generation`: Automated test creation mapped to `REQ-xxx` criteria.
13. `skills/e2e-testing`: Headless Playwright browser automation for critical user journeys.
14. `skills/security-review`: OWASP API Top 10 and GenAI prompt-injection audit.
15. `skills/dependency-audit`: CVE scanning, supply-chain safety, and license checks.
16. `skills/performance-review`: Latency histograms (P50/P95/P99), memory, and token cost profiling.
17. `skills/llm-eval`: Benchmark suite runner for probabilistic AI features.
18. `skills/prompt-security`: System prompt hardening and delimiter defense.
19. `skills/observability`: OpenTelemetry traces, RED metrics, and structured logs.
20. `skills/release-readiness`: Pre-release multi-gate audit.
21. `skills/incident-triage`: SEV classification, containment, and postmortem analysis.
22. `skills/rollback`: Automated safe rollback execution and health verification.
23. `skills/documentation-sync`: Continuous reconciliation of docs and code.

---

## 🛡️ The 15 Quality Gates & Machine-Verifiable Evidence

| Gate | Scope | Required Machine-Verifiable Evidence |
|---|---|---|
| **Product** | Intent | Documented problem statement, target users, and metrics in `charter.md` |
| **Spec** | Requirements | All functional requirements tagged `REQ-xxx` with Given-When-Then criteria |
| **UX** | UI Contract | 8 states specified: Initial, Loading, Success, Empty, Error, Partial, Offline, Destructive |
| **Architecture** | System Design | C4 diagrams, approved ADR, and 14-point failure resilience checklist completed |
| **Contract** | API Schema | Valid OpenAPI 3.1 definition and RFC 7807 problem details error schemas |
| **Data** | Storage | Expand-contract migration with tested forward and rollback SQL |
| **Code** | Implementation | Zero lint errors; clean modular structure |
| **Integration** | Boundaries | Database integration and client adapter tests pass |
| **E2E** | User Journeys | Automated Playwright journeys pass critical paths |
| **Security** | Vulnerabilities | 0 high/critical CVEs, 0 committed secrets, prompt injections mitigated |
| **AI Eval** | AI Behavior | `eval-runner.js` passes accuracy threshold on `tests/evals/` datasets |
| **Performance** | SLA | P95 latency < 200ms for APIs; token budgets within thresholds |
| **Operations** | Telemetry | Structured logs, OpenTelemetry spans, and `/healthz` endpoints live |
| **Release** | Deployment | Automated rollback verified; synthetic smoke tests pass in staging |
| **Docs** | Knowledge | Zero drift detected between code, contracts, and documentation |

---

## 🧪 Dual-Track Testing Architecture

Traditional deterministic tests are insufficient for probabilistic AI systems:

1. **Deterministic Track** (`tests/unit/`, `tests/contract/`, `tests/e2e/`):
   - Fast, isolated unit tests.
   - OpenAPI schema and payload conformity tests.
   - Database repository and migration tests.
2. **Probabilistic Track** (`tests/evals/`):
   - `golden.jsonl`: Curated high-quality representative prompts and expected responses.
   - `adversarial.jsonl`: Jailbreaks, prompt injections, and boundary violation probes.
   - `regression.jsonl`: Captured historical production bugs preventing recurring failures.
   - `tool-use.jsonl`: Agent tool-call schema accuracy and excess agency prevention.

---

## 🔒 MCP Least-Privilege Capability Model

| Agent Role | Repo Read | Repo Write | DB Read | DB Write | Deploy Staging | Deploy Prod | Secrets |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Research / Product**| ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Planner / Spec** | ✓ | `specs/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Builder** | ✓ | `src/` | Dev | Dev | ✗ | ✗ | ✗ |
| **Test** | ✓ | `tests/` | Test | Test DB | ✗ | ✗ | ✗ |
| **Security** | ✓ | Reports | ✗ | ✗ | ✗ | ✗ | Read Audit |
| **AI Eval** | ✓ | `tests/evals/` | ✗ | ✗ | ✗ | ✗ | Test Keys |
| **Release** | ✓ | `infra/`, CI | Staging | Migrations | ✓ | 🔒 Human Gate | 🔒 CI KMS |
| **SRE** | ✓ | Runbooks | Read Staging | ✗ | ✗ | ✗ | ✗ |

---

## 🔄 The Self-Improving Feedback Flywheel

The true power of this operating system is that it becomes self-improving:

```text
Production ──► Incident ──► Root Cause ──► New Regression Test / Skill / ADR ──► Future Projects Inherit It
```

Project #20 will be vastly more resilient, secure, and autonomous than Project #1 because every bug leaves behind an automated regression test in `tests/evals/regression.jsonl` and every architectural lesson is codified in `docs/adr/`.

---

## 📄 License
MIT © 2026 Engineering OS Contributors
