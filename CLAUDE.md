# CLAUDE.md — Claude Code Universal Project Cockpit & Master Controller

> **Authority**: This file is read automatically by Claude Code at session start. It acts as the operational steering wheel and autonomous orchestration cockpit for the entire repository.
> **Philosophy**: Spec-Driven Development (SDD) governed by Google Senior Engineering Standards (Staff Architect / Principal SWE / SRE / BeyondCorp Security).

---

## 🎯 1. CLAUDE CODE MASTER DIRECTIVE

When Claude Code is initiated in this repository, it must:
1. **Read the Project Manifest**: Inspect [AGENTS.md](file:///home/soumya/Projects/SDLC/AGENTS.md) (`PART 1: THE UNIVERSAL PROJECT MANIFEST`) and Section 2 below to identify the active project identity, architecture stack, deliverables, and targets.
2. **Honor the Instruction Hierarchy**: `AGENTS.md` → `.ai/constitution.md` → `docs/adr/` → `specs/<feature>/spec.md` → `.github/instructions/` → `specs/<feature>/tasks.md`.
3. **Execute the Transformation Protocol**: If the user provides a new project idea or updates the manifest, autonomously propagate the changes across all repository artifacts using the **5-Step Transformation Playbook** below.
4. **Produce Machine-Verifiable Evidence**: Never claim a task or feature is "done" without executing terminal verification (`bash scripts/verify.sh` or `eos gate`).

---

## 📋 2. PROJECT QUICK-FILL CONFIGURATION
<!-- 
====================================================================================
FILL OUT OR EDIT THIS QUICK CONFIG FOR YOUR PROJECT.
Claude Code uses this configuration to immediately anchor session context.
====================================================================================
-->

```yaml
project_quick_config:
  name: "AI Task Copilot"                     # [FILLUP]: e.g., "MedFlow EHR", "FinPulse Analytics"
  stack: "Node.js v24 + SQLite + OpenAPI 3.1 + Gemini Flash" # [FILLUP]: Tech stack summary
  active_milestone: "M1 - Core Feature Slices" # [FILLUP]: Active milestone
  current_feature_focus: "001-ai-task-copilot" # [FILLUP]: specs/<feature-dir>
  governance_mode: "strict"                   # [FILLUP]: strict | standard | minimal
  primary_eval_threshold: 0.80                # [FILLUP]: AI evaluation passing threshold
```

---

## 🚀 3. THE "RAW IDEA TO PRODUCTION" TRANSFORMATION PLAYBOOK
*(How Claude Code takes your raw idea and adapts the entire repo like a senior Google project team)*

When given a new project prompt or an updated manifest, Claude Code executes:

### Step 1: Re-Anchor State & Manifest
- Read the user's idea and populate `AGENTS.md` (`project_manifest`) and `CLAUDE.md` (`project_quick_config`).
- Rewrite [.ai/context.md](file:///home/soumya/Projects/SDLC/.ai/context.md) with active project milestones and invariants.
- Update [specs/000-project-charter.md](file:///home/soumya/Projects/SDLC/specs/000-project-charter.md) with Problem, Personas, Success Metrics, and Non-Goals.

### Step 2: Architecture & Contracts First
- Update C4 architecture diagrams in [docs/architecture/](file:///home/soumya/Projects/SDLC/docs/architecture/) (`system-context.md`, `container.md`, `deployment.md`).
- Answer the **14-point failure resilience checklist** in [docs/architecture/resilience-matrix.md](file:///home/soumya/Projects/SDLC/docs/architecture/resilience-matrix.md) for the chosen database, cache, and downstream APIs.
- Author the founding ADR in [docs/adr/](file:///home/soumya/Projects/SDLC/docs/adr/) explaining technology choices.
- Update [contracts/openapi.yaml](file:///home/soumya/Projects/SDLC/contracts/openapi.yaml) and [contracts/schemas/](file:///home/soumya/Projects/SDLC/contracts/schemas/) with domain endpoints and RFC 7807 error envelopes.

### Step 3: Feature Specification & Ambiguity Attack
- Scaffold the first feature: `node bin/engineering-os.js stage specify <feature-id>`.
- Generate [specs/<feature-id>/spec.md](file:///home/soumya/Projects/SDLC/specs/) with measurable `REQ-xxx` tags and Given-When-Then criteria.
- Act as the **Requirements Critic** (`/clarify`): Attack the spec in `clarification.md` to expose race conditions, missing error states, and unhandled edge cases.
- Define the **8-State UI Interaction Contract** in `ux.md` (Initial, Loading, Success, Empty, Error, Partial, Offline, Destructive).

### Step 4: Vertical Slice Task Breakdown & Implementation
- Break the feature into vertical slice tasks in `tasks.md` (`TASK-xxx.y` mapped to `REQ-xxx.y`).
- Implement the vertical slice in `src/` (`UI → API → DB → AI → Test → Telemetry`).
- Co-locate deterministic unit tests in `tests/unit/` and contract tests in `tests/contract/`.
- If AI models or agent tools are involved, populate benchmark prompts in `tests/evals/` (`golden.jsonl`, `adversarial.jsonl`, `tool-use.jsonl`).

### Step 5: Machine-Verifiable Verification & Zero Drift
- Run `node bin/engineering-os.js drift <feature-id>` to verify zero unmapped requirements or pending tasks.
- Run `bash scripts/verify.sh` to confirm all 15 quality gates, deterministic tests, and AI evaluations pass.
- Present completed deliverables with machine evidence to the user.

---

## ⚡ 4. SLASH COMMANDS & STAGE RUNNERS

Claude Code maps these commands directly to the stage prompts in `.ai/prompts/` and the `eos` CLI:

| Slash Command | Role | Prompt Playbook | Target Artifact / Action |
|---|---|---|---|
| `/assess` | Product Agent | `.ai/prompts/assess.md` | `specs/<feature>/assessment.md` |
| `/specify` | Spec Agent | `.ai/prompts/specify.md` | `specs/<feature>/spec.md` (`REQ-xxx`) |
| `/clarify` | Requirements Critic | `.ai/prompts/clarify.md` | `specs/<feature>/clarification.md` |
| `/design` | UX Architect | `.ai/prompts/design.md` | `specs/<feature>/ux.md` (8-state contract) |
| `/architect` | Principal Architect | `.ai/prompts/architect.md` | `specs/<feature>/architecture.md`, ADR |
| `/contract` | API/Data Agent | `.ai/prompts/contract.md` | `contracts/openapi.yaml`, schemas |
| `/plan` | Technical Planner | `.ai/prompts/plan.md` | `specs/<feature>/plan.md` (vertical slices) |
| `/tasks` | Technical Planner | `.ai/prompts/tasks.md` | `specs/<feature>/tasks.md` (`TASK-xxx.y`) |
| `/implement`| Builder Agent | `.ai/prompts/implement.md` | Application source in `src/` |
| `/verify` | Test Agent | `.ai/prompts/verify.md` | `specs/<feature>/verification.md` |
| `/review` | Code Reviewer | `.ai/prompts/review.md` | `specs/<feature>/review.md` |
| `/security` | Security Agent | `.ai/prompts/security.md` | Threat model & prompt-injection audit |
| `/eval` | AI Eval Agent | `.ai/prompts/eval.md` | `specs/<feature>/eval-report.md` |
| `/converge` | Convergence Agent | `.ai/prompts/converge.md` | `node bin/engineering-os.js drift` |
| `/release` | Release Agent | `.ai/prompts/release.md` | Staging smoke test & rollback verify |
| `/observe` | SRE Agent | `.ai/prompts/incident.md` | Telemetry, SLOs, and postmortems |

---

## 🛠️ 5. OPERATIONAL CLI COMMANDS

```bash
# Engineering OS CLI (eos)
node bin/engineering-os.js status                     # Terminal dashboard of pipeline & gates
node bin/engineering-os.js stage <stage> <feature-id> # Transition/scaffold one of 15 stages
node bin/engineering-os.js gate all [feature-id]      # Audit machine-verifiable gate evidence
node bin/engineering-os.js drift [feature-id]         # Detect spec-to-code drift
node bin/engineering-os.js eval --threshold 0.8       # Run AI evaluation suite
bash scripts/verify.sh                                # Full end-to-end repository verification

# Deterministic Test Execution
npm test                 # Run unit and contract tests via node:test
npm run test:eval        # Run AI behavioral benchmark evaluations
npm run drift            # Check specification and task convergence
```

---

## 🎖️ 6. GOOGLE SENIOR PROJECT TEAM BEHAVIORAL PROTOCOLS

When Claude Code operates in this repository, it embodies the discipline of a **Senior Google Staff Software Engineer & SRE Team**:

1. **Never Guess or Assume**: When requirements are ambiguous, invoke `/clarify` and ask or log the edge case in `clarification.md` rather than silently improvising.
2. **Vertical Slice Discipline**: Never write all database models first, then all routes, then all frontend. Build one thin slice end-to-end (`UI → API → DB → AI → Test → Telemetry`) and prove it works before starting the next slice.
3. **Defense in Depth**:
   - Treat all input as hostile: validate with schemas before processing.
   - Format all API errors as RFC 7807 problem details.
   - Enforce idempotency on state-mutating endpoints.
   - Defend against prompt injection using delimited prompts and adversarial evals.
4. **Evidence Before Claims**: Never inform the user a task is done without providing the actual terminal command output proving that tests, gates, and drift checks passed.
5. **Zero Broken Windows**: If a test is failing, fix the underlying defect immediately following the 7-step protocol (`reproduce → localize → root cause → patch → regression test → verify → document`). Never delete, comment out, or bypass failing tests.
