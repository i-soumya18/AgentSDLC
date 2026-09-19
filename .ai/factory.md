# The Software Production Factory — Operating Model

> **Status**: Core Architecture Standard  
> **Model**: Intent ──► Discovery ──► Contract ──► Scope Lock ──► Design ──► Build ──► Verify ──► Accept ──► Release ──► Converge

---

## 1. Paradigm Shift: From Agent Orchestration to Software Factory

AgentSDLC operates not as a generic prompt-to-code agent runner, but as an **industrial software production factory**:
1. **Idea Intake & Discovery**: Raw ideas are converted into structured domain knowledge via adaptive questioning (Question Value = Impact × Uncertainty × Dependency × Risk).
2. **Product Contract & Scope Lock**: Intent is crystallized into an immutable, versioned, mutually approved contract (`product-contract.md` & `contract.json`). No silent scope expansion.
3. **Traceable Knowledge Graph**: Requirements (`REQ-xxx`), Tasks (`TASK-xxx`), Tests (`TEST-xxx`), and Evidence (`EVID-xxx`) form a directed acyclic graph.
4. **Minimal Context Packs**: Agents receive role-bounded context packs compiled from the dependency graph instead of raw repository dumps.
5. **Independent Verification**: Implementation agents never approve their own work. Independent verifiers validate functional behavior, contracts, security, and user simulation.
6. **Machine-Verifiable Evidence**: Every milestone requires concrete test logs, contract validations, and eval scores.

---

## 2. Factory State Machine

```text
IDEA ──► DISCOVERY ──► CLARIFICATION ──► CONTRACT_REVIEW ──► APPROVED (SCOPE LOCK)
                                                                     │
┌────────────────────────────────────────────────────────────────────┘
▼
DESIGN ──► ARCHITECTURE ──► CONTRACTS ──► PLANNING ──► BUILDING ──► VERIFYING
                                                                        │
┌───────────────────────────────────────────────────────────────────────┘
▼
ACCEPTANCE (USER SIMULATION)
    ├── PASS ──► RELEASED ──► OBSERVING ──► CONVERGING
    └── FAIL ──► CONVERGE ──► BUILDING
```

---

## 3. Agency Thresholds & Guardrails

| Level | Name | Permitted Autonomous Actions | Human Approval Required? |
|:---:|---|---|:---:|
| **L0** | Suggest Only | Architectural forks, scope changes, business invariants | **Yes** (Strict) |
| **L1** | Approval Required | Authentication changes, production releases, destructive DB migrations | **Yes** |
| **L2** | Bounded Task Execution | Adding vetted dependencies, non-destructive schema migrations | No (Audited) |
| **L3** | Feature Autonomy | Implementing single vertical slice (`UI → API → DB → Test`) | No |
| **L4** | MVP Autonomy | Unit test authoring, code linting, bug fixes with regression tests | No |
| **L5** | Continuous Operation | Telemetry monitoring, drift detection, anomaly alerting | No |
