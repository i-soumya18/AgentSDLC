# Systemic Risk Register

| Risk ID | Category | Description | Severity | Likelihood | Mitigation Strategy |
|---|---|---|:---:|:---:|---|
| **RSK-001** | AI / GenAI | Prompt injection attacks bypassing tool execution safeguards | High | Medium | Dual-track evaluation with `adversarial.jsonl`, strict input sanitization, and output boundary validators. |
| **RSK-002** | SDLC | Code drift: implementation divergence from OpenAPI and specifications | High | High | Automated drift detection via `eos drift` and `eos gate drift` in CI. |
| **RSK-003** | Operations | Database lock contention during high-volume table migration | High | Low | Mandatory expand-contract zero-downtime policy and concurrent indexing. |
| **RSK-004** | AI / Latency | LLM provider timeout or rate-limiting stalling user requests | Medium | Medium | Circuit breaker, client-side fallback, and streaming with aggressive TTL caching. |
| **RSK-005** | Security | Unintended secret leakage into git commit logs or PR transcripts | Critical | Low | Automated git pre-commit hooks, secret scanners in CI, and `.ai/tool-policy.md` restrictions. |
| **RSK-006** | Architecture | Unhandled distributed transaction inconsistency across services | Medium | Medium | Idempotency keys on state-mutating endpoints and dead-letter queues. |
