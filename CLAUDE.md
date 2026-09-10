# CLAUDE.md — Claude Code Operational Integration Guide

> This file is read automatically by Claude Code at session start. It configures agent behaviors, slash commands, tool usage rules, and development workflows.

---

## 1. Quick Reference & Commands

```bash
# General SDLC commands via the Engineering OS CLI (eos)
node bin/engineering-os.js status                     # View current pipeline status & feature gates
node bin/engineering-os.js stage <stage> <feature-id> # Scaffold or transition a stage
node bin/engineering-os.js gate <gate-name>           # Run machine-verifiable gate audit
node bin/engineering-os.js drift [feature-id]         # Detect spec-to-code drift
node bin/engineering-os.js eval                       # Run AI evaluation suite
node bin/engineering-os.js verify                     # Run full end-to-end repository verification

# Standard npm scripts
npm test                 # Run deterministic tests (unit & contract)
npm run test:eval        # Run AI behavioral evaluation benchmarks
npm run drift            # Check for specification & implementation drift
npm run verify           # Full quality-gate audit
```

---

## 2. Slash Command Workflow Mappings

When the user invokes these concepts or slash commands, invoke the corresponding prompt playbook from `.ai/prompts/` and run the matching `eos stage` command:

| Command | Action / Prompt Playbook | Primary Role | Output Artifact |
|---|---|---|---|
| `/assess` | `.ai/prompts/assess.md` | Product Agent | `specs/<feature>/assessment.md` |
| `/specify` | `.ai/prompts/specify.md` | Spec Agent | `specs/<feature>/spec.md` |
| `/clarify` | `.ai/prompts/clarify.md` | Requirements Critic | `specs/<feature>/clarification.md` |
| `/design` | `.ai/prompts/design.md` | UX Architect | `specs/<feature>/ux.md` |
| `/architect` | `.ai/prompts/architect.md` | Principal Architect | `specs/<feature>/architecture.md`, ADR |
| `/contract` | `.ai/prompts/contract.md` | API/Data Agent | `contracts/openapi.yaml`, schemas |
| `/plan` | `.ai/prompts/plan.md` | Technical Planner | `specs/<feature>/plan.md` |
| `/tasks` | `.ai/prompts/tasks.md` | Technical Planner | `specs/<feature>/tasks.md` |
| `/implement`| `.ai/prompts/implement.md`| Builder Agent | Source code in vertical slices |
| `/verify` | `.ai/prompts/verify.md` | Test Agent | `specs/<feature>/verification.md` |
| `/review` | `.ai/prompts/review.md` | Code Reviewer | `specs/<feature>/review.md` |
| `/security`| `.ai/prompts/security.md`| Security Agent | `specs/<feature>/security-review.md` |
| `/eval` | `.ai/prompts/eval.md` | AI Eval Agent | `specs/<feature>/eval-report.md` |
| `/converge`| `.ai/prompts/converge.md`| Convergence Agent | `specs/<feature>/drift-analysis.md` |
| `/release` | `.ai/prompts/release.md` | Release Agent | `specs/<feature>/release-checklist.md` |
| `/observe` | `.ai/prompts/incident.md`| SRE Agent | `specs/<feature>/observability-plan.md` |

---

## 3. Session Startup Instructions

1. Always check `.ai/context.md` at session start to understand the active project state and current feature target.
2. Read the active feature spec in `specs/<active-feature>/` before modifying any application source code.
3. Comply with the instruction hierarchy in `AGENTS.md`.
4. Work in **vertical slices**: implement UI, API, database changes, tests, and telemetry together for each slice before moving to the next.
5. Provide verifiable evidence for all completion claims.
