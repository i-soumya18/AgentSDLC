# AGENTS.md — The Master Cross-Agent Engineering Contract & Universal Project Control Plane

> **Scope**: Repository-wide permanent governance contract and master control manifest for all AI coding agents (Claude Code, GitHub Copilot, Codex, Antigravity), autonomous subagents, and human engineers.
> **Operating System**: Agentic AI SDLC OS (`engineering-os` / `eos`)
> **Standard**: Google Senior Engineering Team Standards (Staff Architect / Principal SWE / SRE / BeyondCorp Security)

---

# 📋 PART 1: THE UNIVERSAL PROJECT MANIFEST
<!-- 
====================================================================================
FILL OUT THIS SECTION FOR YOUR SPECIFIC PROJECT.
When any AI agent starts a session or receives a command, it reads this Manifest 
as the absolute source of truth and uses the REPOSITORY PROPAGATION PROTOCOL below
to adapt, configure, and generate every specification, architecture doc, contract,
schema, test, and source file in this repository.
====================================================================================
-->

```yaml
project_manifest:
  identity:
    name: "AI Task Copilot"                     # [FILLUP]: e.g., "MedFlow EHR", "FinPulse Analytics"
    codename: "TaskCopilot"                      # [FILLUP]: Internal codename
    version: "1.0.0"
    one_line_pitch: "AI-native task decomposition and contract validation engine for engineering teams" # [FILLUP]
    target_users:                                # [FILLUP]: Key user personas
      - persona: "Lead Software Architect"
        needs: "Wants automated vertical slice decomposition and contract drift detection"
      - persona: "Autonomous AI Agent"
        needs: "Requires unambiguous specs, clear tool boundaries, and machine-verifiable gates"

  outcomes_and_metrics:
    primary_kpi: "100% specification-to-code traceability across all delivered features" # [FILLUP]
    business_goals:                              # [FILLUP]: Measurable outcomes
      - "Zero unresolved drift between OpenAPI contracts and implementation code"
      - "Sub-150ms P95 latency on core synchronous endpoints"
      - "100% mitigation against prompt injection and tool hijacking attacks"
    slo_targets:
      availability: "99.9%"
      latency_p95: "150ms"
      ai_latency_p95: "2500ms"
      error_budget: "0.1% allowable failures per rolling 30 days"
    explicit_non_goals:                          # [FILLUP]: What this project will NOT do
      - "Will not support unstructured ad-hoc code generation without a prior spec"
      - "Will not grant autonomous agents unconstrained production write permissions"

  architecture_and_stack:
    archetype: "api_service_with_ai"             # [FILLUP]: fullstack_web | api_service_with_ai | distributed_microservices | cli_tool
    frontend:
      framework: "Vanilla JS / Modern CSS"       # [FILLUP]: Next.js 15 | React 19 + Vite | Flutter | SvelteKit | None
      styling: "Design Tokens & HSL CSS"         # [FILLUP]: Tailwind CSS | Vanilla CSS | Material UI
      state_management: "8-State UI Contract"
    backend:
      runtime: "Node.js (v24+ Native ESM)"       # [FILLUP]: Node.js / TypeScript | Python FastAPI | Go | Java Spring
      framework: "Native HTTP / Express"         # [FILLUP]: Fastify | Express | FastAPI | Gin
      api_protocol: "REST OpenAPI 3.1 + JSON"    # [FILLUP]: REST | GraphQL | gRPC
    database:
      primary_db: "SQLite / PostgreSQL"          # [FILLUP]: PostgreSQL | MySQL | SQLite | Spanner | Firestore
      migration_tool: "SQL Expand-Contract"      # [FILLUP]: Prisma | Drizzle | Alembic | Flyway | Raw SQL
      caching: "Redis / In-Memory Cache"         # [FILLUP]: Redis | Valkey | Memcached | None
    ai_and_agents:
      primary_model: "Gemini 2.5/3 Flash"        # [FILLUP]: Gemini 2.5 Flash | Claude 3.7 Sonnet | GPT-4o
      eval_framework: "eos-eval-runner"          # [FILLUP]: Version-controlled JSONL datasets in tests/evals/
      safety_guardrails: "OWASP GenAI Top 10"    # [FILLUP]
    infra_and_cloud:
      cloud_provider: "Google Cloud / Docker"    # [FILLUP]: GCP | AWS | Azure | Local Docker
      container_engine: "Docker (Distroless)"    # [FILLUP]: Docker | Kubernetes | Cloud Run
      iac_tool: "Terraform"                      # [FILLUP]: Terraform | Pulumi | CloudFormation

  deliverables_and_milestones:
    - milestone_id: "M0"
      name: "Core Foundation & Governance"
      status: "COMPLETED"
      deliverables:
        - "Complete instruction hierarchy and quality gates"
        - "C4 architecture diagrams and resilience matrix"
        - "OpenAPI 3.1 baseline contract and RFC 7807 error schema"
    - milestone_id: "M1"
      name: "Core Feature Slices"
      status: "COMPLETED"
      deliverables:
        - "Feature 001: AI Task Copilot vertical slice (UI + API + DB + AI Tool + Tests)"
        - "Automated contract and unit test suite passing 100%"
    - milestone_id: "M2"
      name: "Production Hardening & Operations"
      status: "COMPLETED"
      deliverables:
        - "Dual-track AI evaluation datasets (golden, adversarial, regression, tool-use)"
        - "Automated rollback verification and synthetic smoke tests"
        - "Zero drift detected between spec, tasks, contracts, and implementation"
    - milestone_id: "M4"
      name: "Agent Context Compiler & Minimum Sufficient Context"
      status: "COMPLETED"
      deliverables:
        - "6-level context hierarchy (L0 to L5) and canonical role profiles for 14 agents"
        - "Deterministic graph-driven context compilation pipeline with negative noise filters"
        - "Canonical context pack JSON schema (schemas/context-pack.schema.json) and validation"
        - "Context efficiency metrics (token estimation, compression ratio, relevance density)"
        - "100% explainability: every included item has an explicit reason"
        - "CLI command 'eos context' with multi-format rendering (JSON, Markdown, System Prompt)"
```

---

# 🔄 PART 2: THE REPOSITORY PROPAGATION & TRANSFORMATION PROTOCOL
<!-- 
====================================================================================
HOW AGENTS USE THIS MANIFEST TO EDIT AND ADAPT THE ENTIRE REPOSITORY
====================================================================================
-->

When the human user updates the **Project Manifest** above, or instructs an agent to adapt the repo for a new project, the agent **MUST** follow this deterministic 8-step transformation protocol:

```text
               USER UPDATES MANIFEST IN AGENTS.md
                               │
                               ▼
 1. ADAPT CORE CONTEXT ────────► Rewrite .ai/context.md and specs/000-project-charter.md
                               │
 2. ALIGN CONSTITUTION ────────► Calibrate .ai/constitution.md with project-specific invariants
                               │
 3. SPECIFY FEATURES ──────────► Scaffold specs/<feature-id>/ (spec.md, clarification.md, ux.md)
                               │
 4. REFRESH ARCHITECTURE ──────► Update docs/architecture/ (C4 diagrams, resilience-matrix.md, ADRs)
                               │
 5. UPDATE CONTRACTS ──────────► Regenerate contracts/openapi.yaml & schemas/ matching domain
                               │
 6. PLAN VERTICAL SLICES ──────► Generate specs/<feature-id>/tasks.md (TASK-xxx mapped to REQ-xxx)
                               │
 7. IMPLEMENT & TEST ──────────► Code in src/ + deterministic tests in tests/ + evals in tests/evals/
                               │
 8. RUN GATE VERIFICATION ─────► Run 'bash scripts/verify.sh' until all 15 gates are 100% green
```

### Transformation Step-by-Step Checklist:
1. **Context & Charter Sync**:
   - Extract `project_manifest.identity` and `project_manifest.outcomes_and_metrics`.
   - Update `.ai/context.md` with active project milestones.
   - Update `specs/000-project-charter.md` with Problem Statement, Personas, Success Metrics, and Non-Goals.
2. **Architecture & ADR Sync**:
   - Map `project_manifest.architecture_and_stack` to C4 diagrams in `docs/architecture/system-context.md` and `docs/architecture/container.md`.
   - Update `docs/architecture/resilience-matrix.md` with specific failure handling for the chosen database and downstream APIs.
   - Author a new ADR in `docs/adr/` capturing the technology stack selection.
3. **Contract & Schema Sync**:
   - Update `contracts/openapi.yaml` with the domain resources, endpoints, and schemas declared in the manifest.
   - Ensure all error responses link to `contracts/schemas/error-response.schema.json`.
4. **Feature Specification & Tasks**:
   - Decompose active milestones into `specs/<feature-id>/spec.md` with testable `REQ-xxx` tags.
   - Decompose into vertical slices in `specs/<feature-id>/tasks.md` (`TASK-xxx.y`).
5. **Dual-Track AI Evaluation Datasets**:
   - If AI models are used, update `tests/evals/golden.jsonl`, `adversarial.jsonl`, and `tool-use.jsonl` with domain prompts and tool schemas.
6. **Vertical Slice Implementation**:
   - Implement `src/` following vertical slice rules (`UI → API → DB → AI → Test → Telemetry`).
   - Co-locate tests in `tests/unit/` and `tests/contract/`.
7. **Verification & Zero Drift**:
   - Run `node bin/engineering-os.js drift` to confirm zero unmapped requirements.
   - Run `bash scripts/verify.sh` to confirm all 15 quality gates pass with machine-verifiable evidence.

---

# 🏛️ PART 3: THE PERMANENT INSTRUCTION HIERARCHY

Agents must strictly honor this precedence order. When directives conflict, higher layers override lower layers:

```text
1. AGENTS.md                          (Global cross-agent engineering contract & Master Manifest)
   ↓
2. .ai/constitution.md                (Project-wide inviolable laws & constraints)
   ↓
3. docs/adr/* & docs/architecture/*   (System architecture & recorded decisions)
   ↓
4. specs/<feature>/spec.md            (Active feature specification & acceptance criteria)
   ↓
5. .github/instructions/*             (Path-specific domain rules: frontend, backend, etc.)
   ↓
6. specs/<feature>/tasks.md           (Current granular vertical task being executed)
```

---

# ⚖️ PART 4: THE 12 NON-NEGOTIABLE ENGINEERING PRINCIPLES
*(Google Senior Engineering Staff Standard)*

1. **Specification Before Implementation**: Never write implementation code before a spec (`specs/<feature>/spec.md`), contracts (`contracts/openapi.yaml`), and vertical tasks exist and are clarified.
2. **Evidence Before Completion Claims**: Never claim a task is "done" without machine-verifiable proof (terminal test logs, typecheck pass, contract match, eval score). "Looks good" is rejected.
3. **Secure by Default (BeyondCorp / OWASP)**: OWASP API Security & OWASP GenAI Top 10 baselines are mandatory. Secrets must never enter code, logs, or prompt transcripts.
4. **Observable by Default (SRE Core)**: Structured logs with correlation IDs, OpenTelemetry spans, RED metrics (Rate, Errors, Duration), and health checks are required for every endpoint.
5. **Zero-Downtime Backward Compatibility**: Contracts and databases must maintain backward compatibility via expand-contract migrations. Destructive changes require an explicit waiver.
6. **Small Reversible Changes**: Keep commits, PRs, and changesets small, isolated, and cleanly revertible via automated rollback.
7. **Vertical Slices Over Layered Monoliths**: Deliver complete vertical slices (`UI → API → DB → AI → Test → Telemetry`) rather than building all frontend or all backend in isolation.
8. **Explicit Architecture Decisions (ADR)**: All architectural forks, database changes, or library additions require an approved ADR in `docs/adr/`.
9. **No Hidden State or Undocumented Magic**: All state transitions, side effects, and environment variables must be documented in `docs/` and `.env.example`.
10. **Operational Readiness Is Part of Done**: A feature is not done until runbooks, rollback plans, and alert thresholds are recorded in `docs/operations/`.
11. **Dual-Track AI Evaluation**: Probabilistic AI/LLM features must be evaluated against version-controlled golden, adversarial, and regression datasets (`tests/evals/`) separate from deterministic tests.
12. **Human Approval for High-Risk Actions**: Production deployments, destructive DB operations, and secret rotations strictly require human authorization.

---

# 👥 PART 5: AGENT COLLABORATION PROTOCOL & ROSTER

The agent that writes code must never be the sole evaluator of its correctness. Agents collaborate across 14 specialized roles with bounded autonomy:

| Agent Role | Primary Focus | Writes Code? | Authority / Gate |
|---|---|:---:|---|
| **Product Agent** | User problem, business value, success metrics, non-goals | No | Advisory |
| **Spec Agent** | Functional & non-functional requirements, acceptance criteria | No | Human Gate |
| **Requirements Critic** | Edge cases, ambiguities, race conditions, attack vectors | No | Advisory |
| **UX Architect** | Information architecture, interaction states (8-state matrix) | Minimal | Human Gate |
| **Principal Architect** | System context, 14-point failure resilience, ADR authorship | No | Human Gate |
| **API / Data Agent** | OpenAPI 3.1 contracts, JSON schemas, SQL migrations | Yes | Contract Gate |
| **Technical Planner** | Vertical slice task breakdown (`TASK-xxx`) | No | Advisory |
| **Builder / Coding Agent** | Implementation of isolated tasks | Yes | Code Gate |
| **Test Agent** | Unit, integration, contract, and E2E test verification | Yes | Test Gate |
| **Security Agent** | Threat modeling, secret scanning, prompt-injection defense | No | Security Gate |
| **AI Eval Agent** | Model benchmarking, eval dataset execution, latency/cost | Yes | AI Eval Gate |
| **Release Agent** | CI/CD, migration execution, smoke testing, rollback verification | Yes | Release Gate |
| **SRE Agent** | Observability, SLOs, error budgets, incident postmortems | Yes | Operations Gate |
| **Convergence Agent** | Drift detection between spec, contract, code, and docs | No | Convergence Gate |

---

# ⛓️ PART 6: STANDARD ARTIFACT TRACEABILITY CHAIN

Every requirement must remain 100% traceable from conception to production:
```text
REQ-001 (Requirement in spec.md)
  ↓
SPEC-001 (Functional specification)
  ↓
UX-001 (Interaction flow & 8-state contract in ux.md)
  ↓
ADR-0001 (Architectural decision record in docs/adr/)
  ↓
API-001 (OpenAPI endpoint schema in contracts/openapi.yaml)
  ↓
TASK-001.1 .. TASK-001.n (Vertical slice execution tasks in tasks.md)
  ↓
TEST-001 (Deterministic unit/contract tests & AI evals)
  ↓
VER-001 (Machine-verifiable evidence artifact in verification.md)
```

---

# 🚫 PART 7: FORBIDDEN ACTIONS

Agents must NEVER under any circumstances:
- ❌ Modify `.ai/constitution.md` or quality gate criteria without explicit human instruction.
- ❌ Claim a task is complete without running automated verification (`bash scripts/verify.sh` or `eos gate`).
- ❌ Bypass or delete failing tests to force a build to pass.
- ❌ Commit credentials, private keys, or API tokens into source control.
- ❌ Execute raw destructive database operations (`DROP`, `TRUNCATE`, unconstrained `DELETE`) without human confirmation.
- ❌ Add new dependencies without recording an ADR and auditing for vulnerabilities.
- ❌ Edit files outside the immediate scope of the active vertical task.

---

# 🐛 PART 8: BUG-FIXING DISCIPLINE

When resolving defects, agents must strictly follow:
```text
REPRODUCE → LOCALIZE → ROOT CAUSE → PATCH → REGRESSION TEST → VERIFY → DOCUMENT
```
Every resolved bug must leave behind an automated regression test in `tests/unit/` or `tests/evals/regression.jsonl`.
