# Domain Glossary & Controlled Vocabulary

| Term | Definition |
|---|---|
| **SDD (Spec-Driven Development)** | Engineering methodology where specifications are the primary source of truth and code is a generated, verified artifact. |
| **Quality Gate** | A binary, machine-verifiable checkpoint that requires concrete evidence before advancing to the next SDLC stage. |
| **Artifact Chain** | The unbroken traceable sequence: `REQ → SPEC → UX → ADR → API → TASK → TEST → VER`. |
| **Vertical Slice** | A cross-cutting implementation delivering end-to-end functionality (`UI → API → DB → AI → Test → Telemetry`) rather than a horizontal layer. |
| **Convergence** | The active process of detecting and eliminating drift between specifications, contracts, tasks, and implementation code. |
| **ADR** | Architecture Decision Record: a short, immutable document capturing a key architectural choice, context, and consequences. |
| **MCP** | Model Context Protocol: standard interface connecting agents to tools (GitHub, Databases, Browser, Filesystem, Cloud). |
| **AI Evaluation Harness** | Version-controlled benchmark suites (`golden`, `adversarial`, `regression`, `tool-use`) measuring accuracy, safety, and cost. |
| **Expand-Contract** | Database migration pattern ensuring zero downtime by separating additive changes from destructive removals. |
| **RFC 7807** | Problem Details for HTTP APIs: standard format for machine-readable error responses. |
| **8-State UI Contract** | Universal frontend states: Initial, Loading, Success, Empty, Error, Partial, Offline, Destructive. |
