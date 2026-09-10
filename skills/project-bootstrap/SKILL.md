---
name: project-bootstrap
description: Initializes or calibrates a project repository with the complete Agentic AI SDLC OS skeleton and configuration.
---

# Skill: Project Bootstrap

## PURPOSE
Scaffold and configure a new or existing repository with the full Agentic AI SDLC OS structure, including directory skeleton, instruction hierarchy, quality gates, contracts, skills, and CI workflows.

## INPUTS
- `projectName`: Name of the target project directory.
- `template`: Technology template (`fullstack`, `api`, `ai-agent`, `library`).
- `preset`: Governance preset (`standard`, `strict`, `minimal`).

## TOOLS
- `run_command` (`eos init`, `git init`)
- `write_to_file`
- `view_file`

## STEPS
1. Run `node bin/engineering-os.js init <projectName> --template <template> --preset <preset>`.
2. Inspect target directory to confirm all required directories exist.
3. Customize `.ai/constitution.md` with project-specific invariants.
4. Populate `specs/000-project-charter.md` with product vision and metrics.
5. Initialize local git repository and make initial commit: `feat: initialize Agentic AI SDLC OS`.
6. Run `eos verify` to audit base repository health.

## CONSTRAINTS
- Never overwrite existing project source code files without explicit confirmation.
- Ensure all created shell scripts have executable permissions (`chmod +x`).

## FAILURE CONDITIONS
- Missing critical configuration files (`AGENTS.md`, `.ai/constitution.md`, `package.json`).
- Gate verification failure upon initialization.

## EXPECTED OUTPUT
A fully configured, compliant project repository ready for Phase 0 (Idea Assessment).

## REQUIRED EVIDENCE
- Terminal log of successful `eos init` execution.
- Directory listing showing all 15 core folders.
- Green status report from `eos status`.
