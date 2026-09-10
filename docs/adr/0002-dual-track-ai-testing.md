# ADR-0002: Dual-Track Testing Architecture for Deterministic vs Probabilistic Systems

- **Status**: Accepted
- **Date**: 2026-09-11
- **Deciders**: Quality Engineering Lead & AI Architect

---

## 1. Context and Problem Statement
Traditional software testing assumes deterministic inputs and outputs. AI features built on LLMs are probabilistic, making binary unit tests insufficient to detect model drift, prompt degradation, or hallucination. Conversely, purely probabilistic evaluation is too slow and loose for deterministic business logic.

---

## 2. Decision Outcome
Chosen Option: Implement **Dual-Track Testing**:
1. **Track 1 (Deterministic)**: Fast, offline unit, contract, and integration tests for all business logic, validation, and storage.
2. **Track 2 (Probabilistic AI Evals)**: Version-controlled `.jsonl` datasets (`golden`, `adversarial`, `regression`, `tool-use`) executed via `eval-runner.js` measuring statistical accuracy, safety mitigation rate, latency, and token cost.

### Positive Consequences
- High-confidence testing of both deterministic backend logic and non-deterministic agent behaviors.
- Eval datasets committed to Git provide historical regression baselines.
