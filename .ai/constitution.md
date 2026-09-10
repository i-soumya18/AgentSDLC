# The Project Constitution — Non-Negotiable System Laws

> **Authority**: Supreme engineering law of the repository. All agents, tools, PRs, and human contributors must comply.

---

## Article I: The Primacy of the Specification
1. No implementation code shall be merged or committed without an approved feature specification (`specs/<feature>/spec.md`).
2. Code is not the source of truth; code is a derived artifact of the specification, architecture, and contracts.
3. If code diverges from the specification, the divergence must be resolved by updating the specification first or reverting the offending code.

## Article II: Machine-Verifiable Evidence
1. No claim of task completion ("done", "fixed", "passed") shall be accepted without concrete, machine-verifiable evidence.
2. Acceptable evidence includes terminal test outputs, lint results, contract validation reports, and AI eval scorecards.
3. Subjective assertions ("looks good to me", "should work") are strictly rejected as evidence.

## Article III: Security and Safety by Default
1. Zero secrets in code: No credentials, API tokens, connection strings, or private keys shall ever be committed.
2. Least privilege: Agents and services must be assigned the absolute minimum permissions required to perform their explicit function.
3. Prompt injection defenses, output sanitization, and tool-call boundary validations are mandatory for all AI-driven components.

## Article IV: Observability as a Delivery Requirement
1. Every new API endpoint, background worker, and asynchronous event consumer must emit structured logs, OpenTelemetry spans, and health metrics.
2. A feature without instrumentation and alert thresholds is incomplete and cannot pass the Release Gate.

## Article V: Backward Compatibility & Zero-Downtime Data
1. All public API schemas and database migrations must remain backward-compatible with preceding active versions.
2. Schema migrations must follow the expand-contract methodology. Destructive alterations require explicit human waiver.

## Article VI: Small Reversible Vertical Slices
1. Development must occur in small, testable vertical slices delivering end-to-end functionality (`UI → API → DB → AI → Test → Telemetry`).
2. Monolithic layer-by-layer delivery (building all UI, then all backend) is expressly prohibited.

## Article VII: Separation of Generation and Verification
1. The agent or author that creates a code artifact shall not be the sole authority that approves it.
2. Independent review agents (Test, Security, AI Eval, Convergence) must evaluate artifacts against independent criteria.

## Article VIII: Explicit Architectural Decisions (ADR)
1. Any structural decision, new dependency, concurrency model, or storage selection must be recorded in an Architecture Decision Record (`docs/adr/`).
2. Architecture documents cannot be silently rewritten; obsolete decisions must be marked `Superseded` by a subsequent ADR.

## Article IX: Probabilistic vs Deterministic Separation
1. Deterministic code must be validated with deterministic unit, contract, and integration tests.
2. Probabilistic LLM/agent features must be validated with version-controlled evaluation datasets (`tests/evals/`) measuring accuracy, safety, and latency.

## Article X: Human In The Loop for Irreversible Actions
1. High-risk, irreversible operations—including production database drops, production releases, infrastructure teardowns, and secret rotations—require explicit, affirmative human consent.
