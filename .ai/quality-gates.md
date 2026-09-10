# The 15 Enforced Quality Gates

> **Core Rule**: No phase succeeds merely because an agent completed an action. A phase succeeds only when its required evidence is verified by machine checks or designated human authority.

---

| Gate | Primary Purpose | Required Verifiable Evidence | Evaluator |
|---|---|---|---|
| **1. Product Gate** | Validate problem legitimacy & user value | Documented problem statement, target personas, quantified success metrics, explicit non-goals in `charter.md` or `assessment.md` | Human Product Owner |
| **2. Spec Gate** | Ensure completeness & testability | Every functional requirement has a unique `REQ-xxx` tag with measurable acceptance criteria and non-functional requirements | Spec Agent + Human Gate |
| **3. UX Gate** | Ensure complete UI coverage | All 8 interaction states (initial, loading, success, empty, error, partial, offline, destructive) designed + a11y standards met | Design QA Agent |
| **4. Architecture Gate** | Prevent systemic failure modes | C4 architecture diagrams updated, ADR approved in `docs/adr/`, and 14-point failure resilience checklist answered | Principal Architect |
| **5. Contract Gate** | Ensure schema & API synchronization | OpenAPI 3.1 specification validated with zero lint errors; request/response/error schemas defined | API Architect / Linter |
| **6. Data Gate** | Protect data integrity & uptime | Migration scripts tested both UP and DOWN; backward compatibility confirmed; no unconstrained locks | Data Architect / DBA |
| **7. Code Gate** | Guarantee clean implementation | Zero syntax/linter errors; zero TypeScript/typecheck errors; clean modular structure | Automated CI |
| **8. Integration Gate** | Verify boundary communication | Database integration tests pass; external client API mock tests pass; event envelope validation passes | Test Agent / CI |
| **9. E2E Gate** | Confirm critical user journeys | Automated Playwright / browser journeys pass for primary flows; zero unhandled JS exceptions | Test Agent / CI |
| **10. Security Gate** | Neutralize vulnerabilities & leaks | Dependency vulnerability audit clean; secret scan passes; OWASP Top 10 evaluated; prompt injection tests pass | Security Agent |
| **11. AI Eval Gate** | Prevent regression & hallucinations | `eval-runner.js` executes against `golden.jsonl`, `adversarial.jsonl`, `tool-use.jsonl`; accuracy >= threshold | AI Eval Agent |
| **12. Performance Gate** | Maintain latency & resource SLA | P95 API response time within SLA (<200ms for core endpoints; <3.0s for AI streams); memory leaks absent | Performance Agent |
| **13. Operations Gate** | Ensure production diagnosability | Structured logging active; W3C trace propagation enabled; health/readiness endpoints live; SLOs defined | SRE Agent |
| **14. Release Gate** | Verify safe deployment & rollback | Automated rollback procedure verified; smoke test script passes in staging environment | Release Agent |
| **15. Docs Gate** | Prevent knowledge drift | Architecture docs, runbooks, README, and API references synchronized with code changes | Convergence Agent |

---

## The Definition of Done (DoD) Checklist

A feature is considered **DONE** only when all checkboxes below are verified:

```text
[ ] Feature specification approved with testable REQ tags
[ ] Clarification critic passed: zero unresolved ambiguities or race conditions
[ ] UX states covered: Initial, Loading, Success, Empty, Error, Partial, Offline, Destructive
[ ] Architecture decision record (ADR) committed in docs/adr/
[ ] API contracts and schemas updated in contracts/
[ ] Implementation delivered in vertical slices
[ ] Unit tests pass (100% acceptance criteria covered)
[ ] Integration and contract tests pass
[ ] E2E golden journey tests pass
[ ] Security checks pass (no secrets, prompt injection mitigated)
[ ] AI evaluation benchmarks pass score threshold
[ ] Performance and latency within defined budget
[ ] Observability instrumentation present (metrics, logs, traces)
[ ] Zero-downtime database migration verified with rollback script
[ ] Documentation and runbooks synchronized
[ ] Independent review signoff completed
```
