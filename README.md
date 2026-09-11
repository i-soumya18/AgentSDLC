# ⚡ Agentic AI SDLC OS (`engineering-os` / `eos`)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: >=20.0.0](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933?logo=node.js&logoColor=white)](package.json)
[![CI: Multi-Gate](https://img.shields.io/badge/CI-15%20Quality%20Gates%20Passing-brightgreen?logo=github-actions&logoColor=white)](.github/workflows/ci.yml)
[![Drift: Zero](https://img.shields.io/badge/Spec%20Drift-0%25%20Verified-brightgreen)](bin/engineering-os.js)
[![AI Eval: 100%](https://img.shields.io/badge/AI%20Behavioral%20Eval-100%25%20Pass-success)](tests/evals/)
[![Security: OWASP Top 10](https://img.shields.io/badge/Security-OWASP%20API%20%26%20GenAI-blueviolet)](.ai/security-standards.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**The Reusable Engineering Operating System for AI-Native Software Factories**  
*Built on Spec-Driven Development (SDD), bounded-autonomy agent collaboration, contract-first OpenAPI schemas, reusable engineering skills, dual-track testing, and 15 machine-verifiable quality gates.*

[Why Use It](#-why-use-it-the-problem--solution) •
[Quickstart](#-quickstart--how-to-use-it) •
[CLI Commands](#-complete-cli-reference) •
[15-Stage SDLC](#-the-15-stage-sdlc-pipeline) •
[Quality Gates](#-the-15-machine-verifiable-quality-gates) •
[Agent Roles](#-14-specialized-agent-roles) •
[Skills Library](#-reusable-skills-library-skills) •
[Contributing](#-contributing--open-source-standards)

</div>

---

## 🎯 Executive Overview

For modern AI-assisted software development, the unstructured loop of **"open IDE → prompt LLM → paste code → debug errors"** is fragile, unmaintainable, and dangerous for production systems. 

The **Agentic AI SDLC Operating System (`engineering-os` / `eos`)** transforms raw LLMs and AI coding tools into an **industrial-grade, predictable software factory**. By wrapping AI capabilities in formal governance contracts, deterministic engineering playbooks, OpenAPI contracts, dual-track testing, and machine-verifiable gates, it ensures that every line of code written by humans or AI agents remains 100% traceable to business intent.

```text
                       THE AGENTIC AI SDLC PIPELINE
                                     
   IDEA / CHARTER ──► CONSTITUTION ──► SPECIFY (REQ-xxx) ──► CLARIFY (Critic)
                                                                 │
   ┌─────────────────────────────────────────────────────────────┘
   ▼
[ ARCHITECTURE & CONTRACTS ]
   ├── UX 8-State Contract (Loading, Empty, Error, Success, Retry, Partial, Offline, Destructive)
   ├── System C4 Architecture, 14 Failure Scenarios & ADRs (docs/adr/)
   └── OpenAPI 3.1 & RFC 7807 Error Contracts (contracts/)
   │
   ▼
[ GRANULAR VERTICAL SLICES ]
   └── Plan & Task Breakdown (UI → API → DB → AI Tool → Test → Telemetry)
   │
   ▼
[ BUILDER AGENT (Scoped Access) ]
   │
   ├───────────────┬───────────────────┬───────────────────┐
   ▼               ▼                   ▼                   ▼
[ TEST GATE ]  [ CONTRACT GATE ]  [ SECURITY GATE ]   [ AI EVAL HARNESS ]
Unit, Integ.   OpenAPI & RFC7807   OWASP API & GenAI   Golden, Adversarial,
& Regression   Schema Validation   Injection Defense   Tool-Use Benchmarks
   │               │                   │                   │
   └───────────────┴───────────────────┴───────────────────┘
   │
   ▼
[ DRIFT DETECTOR ] ──► Zero Unmapped Requirements / Zero Drift
   │
   ▼
[ RELEASE GATE ] ──► Expand-Contract Migration, Automated Rollback Verified
   │
   ▼
[ PRODUCTION & OBSERVE ] ──► Telemetry, Structured Logs, SLO Feedback Flywheel
```

---

## 💡 Why Use It? (The Problem & Solution)

### The "Vibe Coding" Trap vs. Engineering OS

| Challenge | Raw AI Coding ("Vibe Coding") | Agentic AI SDLC OS (`eos`) |
|---|---|---|
| **Traceability** | Code exists with zero record of requirements or business rationale. | **100% Traceable**: Every commit and test maps to an explicit `REQ-xxx` and `TASK-xxx.y`. |
| **Architectural Drift** | AI silently changes schemas, leaks abstractions, or invents libraries. | **Zero Drift**: `eos drift` detects discrepancies between specs, contracts, tasks, and code. |
| **Contract Integrity** | Endpoints break unpredictably as AI rewrites route handlers. | **Contract-First**: OpenAPI 3.1 definitions & RFC 7807 problem details are validated in CI. |
| **AI Reliability** | Prompt changes break agent behavior without warning. | **Dual-Track Testing**: Version-controlled golden, adversarial, and tool-use benchmarks (`tests/evals/`). |
| **Security & Safety** | Vulnerable to prompt injection, excessive agency, and secret leaks. | **BeyondCorp Model**: Least-privilege MCP profiles, system prompt delimiters, OWASP Top 10 gates. |
| **Quality Verification** | Human manually reviews thousands of lines of code ("looks good to me"). | **15 Machine Gates**: Automated scripts produce verifiable machine proof before code merges. |
| **Knowledge Retention** | Bugs recur because the AI forgets past incidents. | **Self-Improving Flywheel**: Postmortems convert bugs into permanent regression benchmarks & skills. |

---

## 🚀 Quickstart & How to Use It

### Prerequisites
- **Node.js**: `v20.0.0` or higher (Native ESM support required; v22+ recommended).
- **Git**: Modern git client.
- **Bash**: Standard Unix shell (Linux, macOS, or WSL2 on Windows).

### 1. Installation

#### Option A: Clone & Local Development (Recommended for Contributors)
```bash
git clone https://github.com/i-soumya18/AgentSDLC.git
cd AgentSDLC

# Run deterministic test suite
npm test

# Run full end-to-end verification
bash scripts/verify.sh
```

#### Option B: Global CLI Usage
You can alias or symlink `bin/engineering-os.js` to your system path:
```bash
npm link
eos --help
```

---

### 2. Bootstrapping a New Project in Seconds

You can use `engineering-os` to initialize a brand new project endowed with the complete SDLC architecture, constitution, quality gates, and folder layout:

```bash
# Initialize a new service with strict governance and fullstack template
node bin/engineering-os.js init my-new-service --preset strict --template fullstack

cd my-new-service

# Check visual pipeline status
node bin/engineering-os.js status
```

Available init options:
- `--preset`: `standard` (default), `strict` (enterprise governance), `minimal` (rapid prototype).
- `--template`: `fullstack` (UI + API + DB), `node-ts` (TypeScript backend), `python-fastapi` (FastAPI + AI), `library` (reusable package).

---

### 3. Step-by-Step Workflow Example: Delivering Feature 001

This repository comes pre-loaded with a working reference feature: `specs/001-ai-task-copilot`. Here is how a feature advances through the system:

```bash
# 1. View current project dashboard & status
node bin/engineering-os.js status

# 2. Advance or scaffold a stage for a feature
node bin/engineering-os.js stage specify 001-ai-task-copilot
node bin/engineering-os.js stage contract 001-ai-task-copilot

# 3. Detect drift between specification, vertical tasks, and code
node bin/engineering-os.js drift 001-ai-task-copilot

# 4. Audit machine-verifiable evidence for quality gates
node bin/engineering-os.js gate contract 001-ai-task-copilot
node bin/engineering-os.js gate all 001-ai-task-copilot

# 5. Run the AI behavioral evaluation harness
node bin/engineering-os.js eval --dataset tests/evals/tool-use.jsonl --threshold 0.8
node bin/engineering-os.js eval --dataset tests/evals/adversarial.jsonl --threshold 0.8

# 6. Execute full repository verification across all 15 gates
bash scripts/verify.sh
```

---

## 🛠️ Complete CLI Reference

The CLI is available as `engineering-os` and `eos`:

```text
USAGE:
  eos <command> [options]
  engineering-os <command> [options]

COMMANDS:
  init <project-dir>           Bootstrap a complete project skeleton with full SDLC OS
  stage <stage-name> [feature] Transition / scaffold one of 15 SDLC stages
  gate <gate-name|all> [feat]  Evaluate machine-verifiable gate evidence
  status                       Display visual SDLC pipeline dashboard
  drift [feature]              Detect spec, contract, task, and code drift
  eval [options]               Execute AI evaluation harness against test datasets
  verify                       Run full repository verification across all gates

OPTIONS:
  -h, --help                   Show CLI help
  -v, --version                Show version (v1.0.0)
  -p, --preset                 Init preset: standard (default), strict, minimal
  -t, --template               Tech stack: fullstack, node-ts, python-fastapi, library
  --threshold                  Evaluation score threshold (0.0 - 1.0, default: 0.8)
  --dataset                    Path to JSONL eval dataset
  --json                       Output result in structured JSON format
```

---

## 🏛️ The Permanent Instruction Hierarchy

AI agents and human developers operating in this repository strictly honor this precedence hierarchy. When instructions conflict, higher layers supersede lower layers:

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

## 🛡️ The 15 Machine-Verifiable Quality Gates

Every feature must clear 15 objective gates before merging or releasing. No claims of "done" are accepted without machine evidence:

| # | Quality Gate | Scope | Required Machine-Verifiable Evidence |
|---|---|---|---|
| 1 | **Product Gate** | Business Intent | Validated problem statement, personas, non-goals, and KPIs in `charter.md` |
| 2 | **Spec Gate** | Requirements | All functional requirements tagged `REQ-xxx` with Given-When-Then criteria |
| 3 | **UX Gate** | Interaction Contract | 8 states defined: Initial, Loading, Success, Empty, Error, Partial, Offline, Destructive |
| 4 | **Architecture Gate** | System Design | Approved ADR in `docs/adr/`, C4 diagrams, and 14-point failure resilience audit |
| 5 | **Contract Gate** | API & Schemas | Validated OpenAPI 3.1 contract and RFC 7807 problem details error schemas |
| 6 | **Data Gate** | Storage & DB | Tested zero-downtime expand-contract migration SQL (forward and rollback) |
| 7 | **Code Gate** | Source Quality | Zero syntax errors, modular architecture, strict ESM imports |
| 8 | **Integration Gate** | System Boundaries | Database and service integration tests pass in isolated environments |
| 9 | **E2E Gate** | User Journeys | Automated Playwright browser journeys verify critical end-to-end paths |
| 10 | **Security Gate** | Vulnerabilities | 0 committed secrets, 0 high/crit CVEs, OWASP API & GenAI Top 10 compliance |
| 11 | **AI Eval Gate** | Probabilistic AI | `eval-runner.js` achieves >= 80% accuracy on golden, adversarial, and tool datasets |
| 12 | **Performance Gate** | Latency & SLA | P95 latency < 150ms on core APIs; LLM token usage within budget |
| 13 | **Operations Gate** | Observability | OpenTelemetry traces, RED metrics, correlation IDs, and `/healthz` endpoints live |
| 14 | **Release Gate** | Deployment | Automated rollback verified, synthetic smoke tests pass in staging |
| 15 | **Convergence Gate** | Zero Drift | `node bin/engineering-os.js drift` confirms 100% specification-to-code alignment |

---

## 🤖 14 Specialized Agent Roles

Work in this operating system is divided among 14 specialized agent personas operating under **bounded autonomy**. The agent that writes code is never the sole arbiter of its correctness:

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

Skills are deterministic, version-controlled engineering playbooks executed by human engineers and AI agents:

```text
skills/
├── project-bootstrap       # Project calibration and environment initialization
├── idea-assessment         # Market viability, alternatives, and non-goals
├── spec-review             # Requirements completeness and testability audit
├── clarification           # Hostile ambiguity and race condition hunt
├── ux-flow-review          # 8-state UI contract and accessibility (a11y) audit
├── architecture-review     # C4 context mapping and 14 failure scenario analysis
├── adr-create              # Architecture Decision Record authoring
├── api-design              # OpenAPI 3.1 & RFC 7807 contract modeling
├── db-design               # Normalized relational schema & index design
├── migration-review        # Zero-downtime expand-contract SQL audit
├── code-review             # Peer review verifying vertical slice boundaries
├── test-generation         # Automated unit & contract test synthesis
├── e2e-testing             # Headless Playwright journey testing
├── security-review         # OWASP API & GenAI Top 10 penetration audit
├── dependency-audit        # CVE scanning and supply-chain integrity
├── performance-review      # Latency histograms (P50/P95/P99) and token budgets
├── llm-eval                # Benchmark suite execution for probabilistic AI
├── prompt-security         # Delimiter hardening and jailbreak mitigation
├── observability           # OpenTelemetry spans, metrics, and structured logs
├── release-readiness       # Multi-gate pre-deployment audit
├── incident-triage         # Severity classification and containment playbooks
├── rollback                # Automated safe rollback execution
└── documentation-sync      # Continuous reconciliation of docs and code
```

---

## 🧪 Dual-Track Testing Architecture

Software with probabilistic AI features requires two distinct, complementary test tracks:

```text
                     DUAL-TRACK TESTING HARNESS
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
[ DETERMINISTIC TRACK ]                         [ PROBABILISTIC TRACK ]
  tests/unit/                                     tests/evals/
  tests/contract/                                 ├── golden.jsonl
  tests/e2e/                                      ├── adversarial.jsonl
                                                  ├── regression.jsonl
  • Isolated unit tests                           └── tool-use.jsonl
  • OpenAPI 3.1 schema validation
  • RFC 7807 problem details verification         • Expected outputs & accuracy
  • Database expand-contract migrations           • Prompt injection & jailbreaks
  • Sub-millisecond execution                     • Excess agency mitigation
                                                  • Historical bug regressions
```

---

## 🔒 MCP Least-Privilege Capability Matrix

Autonomous agents are bound by Model Context Protocol (MCP) capability profiles to ensure security:

| Agent Role | Repo Read | Repo Write | DB Read | DB Write | Deploy Staging | Deploy Prod | Secrets |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Product / Spec** | ✓ | `specs/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **UX / Architect** | ✓ | `docs/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **API / Data** | ✓ | `contracts/` | Test | Migrations | ✗ | ✗ | ✗ |
| **Builder Agent** | ✓ | `src/` | Dev | Dev | ✗ | ✗ | ✗ |
| **Test Agent** | ✓ | `tests/` | Test | Test DB | ✗ | ✗ | ✗ |
| **Security Agent** | ✓ | Reports | ✗ | ✗ | ✗ | ✗ | Read Audit |
| **AI Eval Agent** | ✓ | `tests/evals/` | ✗ | ✗ | ✗ | ✗ | Test Keys |
| **Release Agent** | ✓ | `infra/`, CI | Staging | Migrations | ✓ | 🔒 Human Gate | 🔒 CI KMS |
| **SRE Agent** | ✓ | Runbooks | Read Staging | ✗ | ✗ | ✗ | ✗ |

---

## 📁 Repository Anatomy

```text
.
├── .ai/                    # Master constitution, quality gates, and security policies
│   ├── constitution.md     # Inviolable engineering laws
│   ├── quality-gates.md    # Gate criteria definitions
│   ├── security-standards.md # OWASP API & GenAI Top 10 standards
│   └── tool-policy.md      # MCP least-privilege permission matrix
├── .github/                # Open source workflows and community templates
│   ├── ISSUE_TEMPLATE/     # Bug, feature, skill, and ADR templates
│   ├── workflows/          # CI, eval, release, and security scan actions
│   ├── pull_request_template.md # Multi-gate PR verification template
│   └── CODEOWNERS          # Code ownership assignments
├── bin/
│   └── engineering-os.js   # CLI entry point (eos / engineering-os)
├── contracts/              # OpenAPI 3.1 contracts & RFC 7807 JSON schemas
├── docs/                   # System architecture, C4 models, ADRs, operations
│   ├── adr/                # Architecture Decision Records
│   ├── architecture/       # C4 diagrams, resilience matrix, failure scenarios
│   └── operations/         # Runbooks, SLOs, rollback procedures
├── scripts/
│   └── verify.sh           # Master repository verification script
├── skills/                 # 23 reusable engineering playbooks
├── specs/                  # Feature specifications, clarification, UX, tasks
│   └── 001-ai-task-copilot/# Live reference feature (Spec, UX, ADR, Tasks)
├── src/                    # Implementation code, CLI core, AI eval runner
│   ├── cli/                # Init, stage, gate, drift, status, verify handlers
│   ├── core/               # SDLC pipeline engine
│   └── eval/               # Dual-track AI evaluation runner
├── tests/                  # Deterministic tests & AI evaluation datasets
│   ├── contract/           # OpenAPI 3.1 & JSON schema tests
│   ├── evals/              # JSONL datasets: golden, adversarial, tool-use
│   └── unit/               # Fast, isolated unit tests
├── AGENTS.md               # Master Cross-Agent Engineering Contract & Manifest
├── CLAUDE.md               # Claude Code & Antigravity orchestration cheat-sheet
├── CODE_OF_CONDUCT.md      # Contributor Covenant v2.1
├── CONTRIBUTING.md         # Full open-source contribution guide
├── LICENSE                 # MIT License
├── package.json            # Core npm package definition
├── README.md               # This document
└── SECURITY.md             # Responsible disclosure & security policy
```

---

## 🤝 Contributing & Open Source Standards

Contributions of all types are warmly welcomed! We are committed to building an inclusive, transparent, and rigorous open-source ecosystem.

- **Contribution Guide**: Read [CONTRIBUTING.md](CONTRIBUTING.md) for full instructions on our spec-driven development process, branch naming conventions, PR requirements, and local setup.
- **Code of Conduct**: This project has adopted the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold its standards.
- **Security & Responsible Disclosure**: If you discover a security vulnerability or prompt injection exploit, please consult our [Security Policy](SECURITY.md) to report it privately.
- **Issue Tracker**:
  - [Report a Bug](.github/ISSUE_TEMPLATE/bug_report.md)
  - [Request a Feature](.github/ISSUE_TEMPLATE/feature_request.md)
  - [Propose a Reusable Skill](.github/ISSUE_TEMPLATE/skill_proposal.md)
  - [Propose an ADR](.github/ISSUE_TEMPLATE/adr_proposal.md)

---

## 📄 License & Copyright

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

Copyright © 2026 Engineering OS Contributors. Built with standard-setting rigor for human software engineers and autonomous AI agents.
