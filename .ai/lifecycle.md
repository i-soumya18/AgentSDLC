# Canonical Lifecycle Stages & State Machine

> **Authority**: Absolute single source of truth for all lifecycle stages in AgentSDLC (`engineering-os` / `eos`).
> All CLI commands, agents, schemas, and verification harnesses must adhere to this sequence.

---

## 1. Canonical Stage Sequence

The SDLC processes work strictly along this deterministic sequence:

```text
assess ──► constitution ──► specify ──► clarify ──► design ──► architect ──►
contract ──► plan ──► tasks ──► implement ──► verify ──► review ──►
security ──► eval ──► release ──► observe ──► converge
```

| Order | Stage ID | Stage Name | Owner Role | Primary Required Artifact | Transition Guard / Prerequisite |
|:---:|---|---|---|---|---|
| **1** | `assess` | Problem & Market Assessment | Product Agent | `specs/<feature>/assessment.md` | Initial idea or request |
| **2** | `constitution` | Project Constitution Check | Principal SWE | `.ai/constitution.md` | Approved project principles |
| **3** | `specify` | Feature Specification | Spec Agent | `specs/<feature>/spec.md` | Measurable `REQ-xxx` tags |
| **4** | `clarify` | Requirements & Ambiguity Attack | Requirements Critic | `specs/<feature>/clarification.md` | Zero unresolved blocker ambiguities |
| **5** | `design` | UX & Interaction Design | UX Architect | `specs/<feature>/ux.md` | 8 interaction states defined |
| **6** | `architect` | C4 Architecture & Resilience | Principal Architect | `specs/<feature>/architecture.md` | ADR approved in `docs/adr/` |
| **7** | `contract` | API & Event Contract | API / Data Agent | `contracts/openapi.yaml` | Valid OpenAPI 3.1 & RFC 7807 error schema |
| **8** | `plan` | Technical Vertical Slices | Technical Planner | `specs/<feature>/plan.md` | Cross-cutting slice breakdown |
| **9** | `tasks` | Vertical Tasks Decomposition | Technical Planner | `specs/<feature>/tasks.md` | Every `TASK-xxx.y` mapped to `REQ-xxx` |
| **10** | `implement` | Vertical Slice Implementation | Builder / Coding Agent | Source code in `src/` | Bounded to active task |
| **11** | `verify` | Deterministic Verification | Test Agent | `specs/<feature>/verification.md` | Unit & contract tests pass |
| **12** | `review` | Independent Code Review | Code Reviewer | `specs/<feature>/review.md` | Independent reviewer approval |
| **13** | `security` | Threat Model & Secret Scan | Security Agent | `specs/<feature>/security-review.md` | 0 secrets, prompt injection mitigated |
| **14** | `eval` | AI Model Evaluation | AI Eval Agent | `specs/<feature>/eval-report.md` | Benchmarks meet score threshold |
| **15** | `release` | Release Staging & Rollback | Release Agent | `specs/<feature>/release-checklist.md` | Rollback dry-run & smoke test pass |
| **16** | `observe` | Telemetry & Observability | SRE Agent | `specs/<feature>/observability-plan.md` | RED metrics, logs, spans configured |
| **17** | `converge` | Drift Analysis & Convergence | Convergence Agent | `specs/<feature>/drift-analysis.md` | Zero unmapped requirements or pending tasks |

---

## 2. Stage Invariants

1. **No Out-of-Order Execution**: No implementation code shall be merged or claimed complete in `implement` before `specify`, `contract`, and `tasks` exist.
2. **Deterministic Artifact Naming**: Each stage produces or updates its corresponding standardized artifact in `specs/<feature>/`.
3. **Traceability Chain**:
   ```text
   REQ-xxx (specify) ──► UX-xxx (design) ──► API-xxx (contract) ──► TASK-xxx (tasks) ──► TEST-xxx (verify)
   ```
