# Agentic AI SDLC OS — Reusable Production-Grade Engineering Workflow

## Executive recommendation

Use **Spec-Driven Development as the backbone**, then add an agent orchestration layer, design system, quality/security gates, observability, and production operations around it.

The core loop should be:

**Assess → Constitution → Specify → Clarify → UX/Architecture → Plan → Contract → Tasks → Implement → Verify → Review → Secure → Deploy → Observe → Converge**

GitHub Spec Kit is currently the strongest open reference for the specification backbone: it explicitly structures work around Constitution → Specify → Plan → Tasks → Implement and adds Clarify, Checklist, Analyze, and Converge quality gates. It also supports multiple coding agents. The important idea to copy is not the exact CLI; it is the artifact chain and traceability model.

There is no workflow that guarantees production quality by itself. The closest practical approach is to make quality a set of **enforced gates** with machine-verifiable evidence.

## 1. The operating model

### Layer A — Human intent
You own:
- product goal
- target user
- business constraints
- priorities
- acceptable trade-offs
- final approval

### Layer B — Durable project knowledge
Agents consume versioned project truth rather than conversation history.

Required sources of truth:
- constitution
- product spec
- architecture plan
- ADRs
- UX/design system
- API/data contracts
- test strategy
- deployment/runbook
- current status

### Layer C — Specialized agents
Use role-based agents rather than one giant agent trying to reason about everything.

### Layer D — Tool layer
Connect agents to source control, issue tracker, design, databases, cloud, observability, documentation, and browsers through MCP or equivalent tool interfaces.

### Layer E — Gates
No agent should be considered successful because it produced code. A phase succeeds only when its acceptance conditions and evidence are satisfied.

## 2. Recommended repository structure

```text
project/
├── AGENTS.md
├── CLAUDE.md                         # optional if using Claude Code
├── .github/
│   ├── copilot-instructions.md      # optional if using GitHub Copilot
│   ├── instructions/
│   │   ├── frontend.instructions.md
│   │   ├── backend.instructions.md
│   │   ├── tests.instructions.md
│   │   └── infra.instructions.md
│   ├── workflows/
│   ├── CODEOWNERS
│   └── pull_request_template.md
│
├── .ai/
│   ├── constitution.md              # project-wide engineering rules
│   ├── context.md                   # concise current project context
│   ├── glossary.md                  # domain vocabulary
│   ├── quality-gates.md             # definition of done / gate policy
│   ├── agent-map.md                 # agent roles and permissions
│   ├── tool-policy.md               # MCP/tool permissions
│   ├── risk-register.md
│   ├── coding-standards.md
│   ├── testing-standards.md
│   ├── security-standards.md
│   └── prompts/
│       ├── bootstrap.md
│       ├── review.md
│       ├── bugfix.md
│       ├── incident.md
│       └── migration.md
│
├── specs/
│   ├── 000-project-charter.md
│   ├── 001-feature-name/
│   │   ├── spec.md
│   │   ├── clarification.md
│   │   ├── ux.md
│   │   ├── architecture.md
│   │   ├── api-contract.md
│   │   ├── data-model.md
│   │   ├── test-plan.md
│   │   ├── tasks.md
│   │   └── verification.md
│   └── ...
│
├── docs/
│   ├── adr/
│   │   ├── 0001-....md
│   │   └── ...
│   ├── architecture/
│   │   ├── system-context.md
│   │   ├── container.md
│   │   ├── deployment.md
│   │   └── data-flow.md
│   ├── product/
│   ├── api/
│   └── operations/
│       ├── slo.md
│       ├── runbook.md
│       ├── rollback.md
│       └── disaster-recovery.md
│
├── design/
│   ├── design-system.md
│   ├── flows.md
│   ├── screens.md
│   └── assets/
│
├── contracts/
│   ├── openapi.yaml
│   ├── events/
│   └── schemas/
│
├── tests/
│   ├── contract/
│   ├── integration/
│   ├── e2e/
│   ├── evals/
│   ├── fixtures/
│   └── performance/
│
├── infra/
│   ├── terraform/                  # or equivalent IaC
│   ├── docker/
│   └── environments/
│
├── scripts/
│   ├── verify.sh
│   ├── smoke-test.sh
│   └── migrate.sh
│
└── README.md
```

Do not create every file for every project. Some are conditional. The important invariant is that the project has **one durable place for intent, decisions, contracts, verification, and operations**.

## 3. The permanent instruction hierarchy

Use several levels instead of a huge prompt.

### `AGENTS.md`
Primary cross-agent engineering contract.

Put here:
- project mission
- architecture summary
- repo map
- commands
- coding rules
- testing expectations
- security rules
- forbidden actions
- change workflow
- required evidence before claiming completion

Codex and GitHub Copilot both support `AGENTS.md`-style agent instructions, and Copilot also supports path-specific instruction files.

### `CLAUDE.md`
Keep Claude-specific operational guidance here when using Claude Code.

Claude Code also supports skills and hooks, which makes it useful to package repeatable operations such as review, deployment checks, or environment validation.

### `.github/copilot-instructions.md`
Use this only for GitHub Copilot-specific repository guidance.

### Path-specific instructions
Use them for rules that should not pollute global context:
- frontend
- backend
- database
- infrastructure
- tests
- ML/LLM evaluation

## 4. Constitution — the project law

Create a short constitution with non-negotiable principles.

Recommended principles:

1. **Specification before implementation**
2. **Evidence before completion claims**
3. **Secure by default**
4. **Observable by default**
5. **Backward compatibility unless explicitly waived**
6. **Small reversible changes**
7. **Automated tests for important behavior**
8. **Explicit architecture decisions**
9. **No hidden state or undocumented magic**
10. **Operational readiness is part of done**
11. **AI behavior is evaluated separately from deterministic software behavior**
12. **Human approval is required for irreversible or high-risk actions**

## 5. Product / feature artifact chain

Every meaningful feature should produce this chain:

**Idea → Decision → Spec → Design → Architecture → Contract → Tasks → Code → Tests → Evidence**

Each artifact should reference the previous one.

Example:

```text
REQ-014
  ↓
SPEC-014
  ↓
UX-014
  ↓
ADR-007
  ↓
API-014
  ↓
TASK-014.1 ... TASK-014.n
  ↓
TEST-014.*
  ↓
VER-014
```

This creates traceability and makes future maintenance dramatically easier.

## 6. The full agentic workflow

### Phase 0 — Idea assessment
Agent: **Product/Research Agent**

Outputs:
- problem statement
- target users
- alternatives
- assumptions
- risks
- MVP boundary
- success metrics
- build / do-not-build recommendation

Gate:
- clear problem
- clear user
- measurable outcome
- explicit non-goals

### Phase 1 — Constitution
Agent: **Engineering Lead Agent**

Outputs:
- constitution
- stack constraints
- engineering principles
- quality bar

Gate: human approval.

### Phase 2 — Specification
Agent: **Product Spec Agent**

Outputs:
- user journeys
- functional requirements
- non-functional requirements
- edge cases
- acceptance criteria
- telemetry requirements
- error states

Every requirement should be testable.

### Phase 3 — Clarification / ambiguity hunt
Agent: **Requirements Critic**

Its job is to attack the spec:
- ambiguous language
- contradictory rules
- missing states
- missing permissions
- race conditions
- failure modes
- scalability assumptions

Do not let the implementation agent fill important gaps silently.

### Phase 4 — UX / UI
Agents:
- **UX Architect**
- **UI Designer**
- **Design QA Agent**

Outputs:
- information architecture
- user flows
- screen list
- interaction states
- empty/loading/error/success states
- responsive behavior
- accessibility requirements
- design tokens
- component mapping
- implementation notes

For Figma-based work, the design artifact should be treated as a contract rather than a mood board.

### Phase 5 — Architecture
Agent: **Principal Architect**

Outputs:
- system context
- component boundaries
- data flow
- deployment topology
- API style
- auth model
- storage model
- cache strategy
- async/event strategy
- failure handling
- scaling path
- cost assumptions
- threat model

Every significant decision gets an ADR.

### Phase 6 — Contracts first
Agents:
- **API Architect**
- **Data Architect**

Produce:
- OpenAPI / API contract
- request/response schemas
- error model
- authorization matrix
- database schema
- migration strategy
- event schemas
- idempotency rules

The frontend and backend should consume the same contracts rather than re-inventing them.

### Phase 7 — Implementation planning
Agent: **Technical Planner**

Break work into vertical slices instead of giant layers.

Good:
```text
Auth login end-to-end
  UI → API → DB → session → tests → observability
```

Less useful as first decomposition:
```text
Build all frontend
Build all backend
Build database
Build APIs
```

Each slice should be independently verifiable.

### Phase 8 — Implementation
Agent: **Builder / Coding Agent**

Rules:
- inspect before editing
- change only what the task needs
- reuse existing abstractions
- write tests with code
- run narrow checks early
- keep commits small
- update docs/contracts when behavior changes

### Phase 9 — Parallel verification
Never rely on the same agent that wrote the code as the only reviewer.

Use independent agents:
- **Code Reviewer**
- **Test Agent**
- **Security Agent**
- **Performance Agent**
- **UX/Visual QA Agent**
- **AI Evaluation Agent** when LLM/agent features exist

### Phase 10 — Convergence
Agent: **Release Gatekeeper**

Compare:
- spec vs code
- plan vs code
- API contract vs implementation
- tests vs acceptance criteria
- architecture vs deployment
- docs vs actual behavior

Any drift creates new tasks.

### Phase 11 — Release
Agent: **Release/DevOps Agent**

Checks:
- CI green
- migrations safe
- secrets correct
- image/build reproducible
- health checks pass
- smoke tests pass
- rollback exists
- observability exists
- SLOs defined
- costs within threshold

### Phase 12 — Operate
Agents:
- **SRE Agent**
- **Incident Agent**
- **Maintenance Agent**

Inputs:
- logs
- metrics
- traces
- alerts
- support issues
- user feedback
- cloud costs

Outputs become future specs/tasks.

## 7. Agent roster

| Agent | Main responsibility | Writes code? | Approval level |
|---|---|---:|---|
| Product Agent | problem / scope / success | No | advisory |
| Spec Agent | requirements / acceptance | No | human gate |
| UX Agent | flows / interaction | Sometimes | human gate |
| Design QA | visual/accessibility validation | No | gate |
| Architect | system design / ADRs | No | human gate |
| API/Data Agent | schemas / contracts / migrations | Sometimes | gate |
| Planner | vertical-slice tasks | No | advisory |
| Builder | implementation | Yes | bounded |
| Test Agent | tests / validation | Yes | gate |
| Security Agent | threat model / security review | Rarely | gate |
| Performance Agent | profiling / load checks | Rarely | gate |
| AI Eval Agent | model / agent behavior evals | Yes | gate |
| Release Agent | CI/CD / deployment | Yes | gate |
| SRE Agent | reliability / observability | Yes | gate |
| Incident Agent | diagnosis / remediation | Sometimes | human approval for risky changes |
| Convergence Agent | drift detection | Sometimes | gate |

A smaller project can collapse these into 4–6 agents. The roles matter more than the number of processes.

## 8. Skills to build once and reuse

Create an internal skill library.

```text
skills/
├── project-bootstrap/
├── spec-review/
├── architecture-review/
├── adr-create/
├── ux-flow-review/
├── api-design/
├── db-design/
├── migration-review/
├── code-review/
├── test-generation/
├── e2e-test/
├── security-review/
├── dependency-audit/
├── performance-review/
├── llm-eval/
├── prompt-security/
├── observability/
├── release-readiness/
├── incident-triage/
├── rollback/
└── documentation-sync/
```

A skill should define:
- purpose
- inputs
- allowed tools
- steps
- required evidence
- failure conditions
- output artifact
- examples

Skills should be deterministic playbooks, not giant free-form prompts.

## 9. MCP / tool layer

Think in **capabilities**, not a random pile of MCP servers.

Recommended capability classes:

### Source control
- GitHub/GitLab
- PRs
- issues
- code review

### Design
- Figma
- design files
- assets
- design tokens

### Knowledge
- docs / wiki
- project library
- architecture docs

### Database
- schema inspection
- migrations
- read-only query tool
- safe admin operations

### Cloud / infrastructure
- cloud inventory
- deployment status
- logs
- metrics
- cost data

### Observability
- traces
- logs
- metrics
- incidents

### Product operations
- analytics
- support tickets
- feature flags

### Browser validation
- Playwright/browser automation
- screenshots
- accessibility inspection

### Rule of thumb
Give agents the **minimum permission required**. Prefer read-only tools for analysis agents and explicitly gated write access for deployment, production DB, secrets, or destructive operations.

## 10. Quality gates

Use a standard gate matrix for every project.

| Gate | Required evidence |
|---|---|
| Product | problem, user, success metric, non-goals |
| Spec | testable acceptance criteria |
| UX | all major states + accessibility |
| Architecture | diagram + decisions + risks |
| API | versioned contract + auth/error behavior |
| Data | schema + migration/rollback plan |
| Code | lint/typecheck/unit tests |
| Integration | contract/integration tests |
| E2E | critical user journeys |
| Security | threat model + dependency/secrets checks |
| AI | eval dataset + pass threshold |
| Performance | baseline + target |
| Operations | logs/metrics/traces + health checks |
| Release | smoke test + rollback |
| Docs | behavior and architecture synchronized |

## 11. Definition of Done

A feature is **Done** only when:

```text
[ ] Spec approved
[ ] Acceptance criteria mapped to tests
[ ] UX states covered
[ ] Architecture decisions recorded
[ ] API/data contracts updated
[ ] Implementation complete
[ ] Unit tests pass
[ ] Integration tests pass
[ ] E2E critical paths pass
[ ] Security checks pass
[ ] AI evals pass where applicable
[ ] Performance targets pass
[ ] Observability present
[ ] Deployment tested
[ ] Rollback path verified
[ ] Documentation updated
[ ] No known high-severity defects
[ ] Independent review completed
```

## 12. Testing pyramid for AI-native applications

### Deterministic software
- unit
- component
- integration
- contract
- E2E
- load/performance
- security

### AI behavior
Add a separate evaluation stack:
- golden examples
- adversarial examples
- regression set
- task success rate
- tool-call correctness
- structured output validity
- hallucination / unsupported-claim checks
- latency and cost
- safety policy tests
- prompt-injection tests
- long-context tests

The AI evaluation set should live in version control just like ordinary tests.

## 13. Security model

For standard web/API systems apply OWASP API Security guidance.

For LLM/agent systems additionally evaluate prompt injection, insecure output handling, excessive agency, data leakage, tool misuse, and other GenAI-specific risks.

Use an explicit **agent permission matrix**:

| Agent | Repo read | Repo write | DB read | DB write | Prod deploy | Secrets |
|---|---:|---:|---:|---:|---:|---:|
| Research | ✓ |  |  |  |  |  |
| Planner | ✓ | ✓ docs |  |  |  |  |
| Builder | ✓ | ✓ | dev | dev |  |  |
| Test | ✓ | ✓ tests | test |  |  |  |
| Security | ✓ | reports |  |  |  |  |
| Release | ✓ | ✓ CI/infra | limited | migrations | gated | gated |
| Incident | ✓ | gated | read | gated | gated | never raw |

No agent should have unrestricted production credentials by default.

## 14. Architecture principles

Use the cloud-provider-neutral version of a well-architected review:
- operational excellence
- security
- reliability
- performance efficiency
- cost optimization
- sustainability

For every service ask:
- What happens when dependency X is down?
- What happens when a request is duplicated?
- What happens when a message is delayed?
- What happens when the DB is slow?
- What happens when cache is stale?
- What happens during partial deployment?
- What is the rollback path?
- How is the failure detected?
- How is the user affected?

## 15. Observability baseline

Adopt OpenTelemetry-style telemetry as the default mental model:
- traces
- metrics
- logs

Every critical request should be traceable across boundaries.

Every service should have:
- health/readiness signals
- latency metric
- error metric
- saturation/resource metric
- structured logs
- correlation/request ID

For mature services add SLOs and error budgets.

## 16. Git / PR workflow

Use short-lived branches and protected main/release branches.

Every PR should contain:
- linked spec/task
- what changed
- why
- testing performed
- screenshots for UI work
- migrations / rollback notes
- security impact
- operational impact

Use CODEOWNERS for sensitive areas and protected branch checks for production branches.

## 17. Bug-fixing workflow

Do not start with "fix this bug" and immediately edit code.

Use:

**Reproduce → Localize → Explain → Patch → Regression Test → Verify → Converge**

Create a small bug artifact:

```text
bug/
  symptom
  reproduction
  expected
  actual
  suspected cause
  root cause
  fix
  regression test
  verification evidence
```

The most important rule: every fixed bug gets a regression test unless there is a documented reason not to.

## 18. Database workflow

Agents must never casually mutate production.

Preferred lifecycle:

**Model → Migration → Validate → Backfill strategy → Deploy → Verify → Rollback plan**

For schema changes ask:
- backward compatible?
- old app can run with new schema?
- new app can run with old schema?
- data loss risk?
- lock duration?
- rollback possible?

## 19. Cache workflow

Every cache decision should document:
- cache key
- TTL
- invalidation rule
- consistency expectations
- stampede protection
- fallback behavior
- cache outage behavior

"Add Redis" is not a design. The consistency and invalidation semantics are the design.

## 20. API workflow

Treat the contract as a product artifact.

For each endpoint define:
- authentication
- authorization
- request schema
- response schema
- status codes
- error body
- idempotency
- pagination
- rate limiting
- versioning
- observability

Generate or validate SDK/types when practical.

## 21. AI / agent feature workflow

For an AI feature use this additional mini-SDLC:

**Capability spec → model/tool architecture → prompt/system behavior → eval dataset → implementation → adversarial eval → cost/latency benchmark → production guardrails → monitoring → feedback loop**

Never treat an LLM prompt as the only specification.

Track:
- model version
- prompt version
- tool version
- retrieval/index version
- eval set version
- important output metrics

## 22. Release strategy

Prefer progressive delivery where the product warrants it:
- feature flags
- canary
- staged rollout
- rollback
- post-release smoke tests

The release agent must know how to answer:

**"How do I undo the last deployment safely?"**

before shipping it.

## 23. Production operating loop

Once deployed, the lifecycle becomes:

```text
Observe
  ↓
Detect
  ↓
Diagnose
  ↓
Decide
  ↓
Change
  ↓
Verify
  ↓
Document
  ↓
Update spec / ADR / tests
```

This turns production data into future engineering knowledge instead of tribal memory.

## 24. What should be universal vs project-specific

### Universal template
Keep these stable across projects:
- agent roles
- skill library
- quality gates
- security baseline
- PR rules
- testing philosophy
- observability baseline
- incident workflow
- release workflow
- permission model

### Project-specific
Generate these per project:
- constitution details
- product spec
- architecture
- ADRs
- API schema
- DB schema
- design system
- eval dataset
- SLO values
- deployment topology

## 25. The ideal bootstrap experience

Your future project creation should feel like:

```text
new-project myapp

→ choose product type
→ choose stack
→ initialize Git
→ initialize Spec Kit / SDD artifacts
→ install agent instructions
→ install skills
→ configure MCP capability set
→ create constitution
→ create quality gates
→ create CI
→ create test harness
→ create observability skeleton
→ create deployment skeleton
→ ready for idea assessment
```

Then your normal working commands become conceptually:

```text
/assess
/specify
/clarify
/design
/architect
/contract
/plan
/tasks
/implement
/verify
/review
/security
/eval
/release
/converge
```

Exact command syntax can vary by coding agent; the workflow and artifacts should remain stable.

## 26. The most important architectural idea

Do not build a "prompt library".

Build a **development control plane**.

The control plane consists of:

```text
                    HUMAN INTENT
                         │
                    ┌────▼────┐
                    │  SPEC   │
                    └────┬────┘
                         │
           ┌─────────────▼─────────────┐
           │ PROJECT KNOWLEDGE / ADRs │
           └─────────────┬─────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  AGENT ORCHESTRATION + SKILLS  │
        └────────────────┬────────────────┘
                         │
              ┌──────────▼──────────┐
              │ CODE / INFRA / AI   │
              └──────────┬──────────┘
                         │
       ┌─────────────────▼─────────────────┐
       │ TEST / SECURITY / EVAL / QA GATES│
       └─────────────────┬─────────────────┘
                         │
                    ┌────▼────┐
                    │ RELEASE │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │ PROD    │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │OBSERVE  │
                    └────┬────┘
                         │
                    feedback
                         │
                         └──────→ next spec
```

## 27. Recommended baseline stack

The exact stack should remain adaptable. A strong modern baseline could be:

- GitHub + protected main branch + CODEOWNERS
- GitHub Spec Kit as the SDD reference implementation
- one primary coding agent plus one independent review agent
- Figma for product/design work
- OpenAPI for HTTP contracts
- SQL migrations for relational data when applicable
- Docker for reproducible builds
- Terraform/OpenTofu or cloud-native IaC
- GitHub Actions or equivalent CI/CD
- Playwright for critical browser journeys where applicable
- OpenTelemetry for instrumentation
- OWASP security baselines
- version-controlled AI eval datasets for AI features

## 28. What not to automate blindly

Keep human approval for:
- irreversible production DB changes
- destructive cloud actions
- secret rotation or exposure
- major architecture changes
- security exceptions
- legal/compliance claims
- high-cost infrastructure changes
- public releases with material business impact

The strongest agentic systems are not fully autonomous. They are **bounded-autonomy systems with excellent verification**.

## 29. Final target state

The goal is not:

> "AI writes my entire application."

The goal is:

> "My application is continuously produced from explicit intent, governed by reusable engineering rules, implemented by specialized agents, verified by independent gates, deployed through repeatable automation, and continuously reconciled with production reality."

That is the model I would standardize for every serious project.
