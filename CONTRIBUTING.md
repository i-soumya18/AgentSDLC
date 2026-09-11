# Contributing to Agentic AI SDLC OS (`engineering-os` / `eos`)

First off, thank you for your interest in contributing! 🎉

The **Agentic AI SDLC OS** is an open-source engineering operating system designed to bring industrial rigor, predictability, and safety to AI-assisted software development. Whether you are fixing a typo, adding a new reusable skill, hardening an adversarial evaluation dataset, or proposing a new architecture gate, we welcome your contribution.

---

## 🧭 Core Philosophy & Tenets

All contributions to this project adhere to Google Senior Engineering and Agentic SDLC standards:

1. **Specification Before Implementation**: We do not accept ad-hoc code changes without clear requirements or architectural rationale. Significant features start with a spec (`specs/`) or an Architecture Decision Record (`docs/adr/`).
2. **Machine-Verifiable Evidence Over Opinions**: Every change must prove its correctness through deterministic tests (`npm test`), contract validation, AI behavioral evaluations (`eos eval`), and gate checks (`eos gate all`).
3. **Vertical Slices Over Layered Silos**: When building features, deliver complete end-to-end vertical slices (`UI → API → DB → AI Tool → Test → Telemetry`) rather than disconnected partial layers.
4. **Bounded Autonomy & BeyondCorp Security**: We practice least-privilege tool execution, defense against prompt injection (OWASP GenAI Top 10), and strict secret hygiene.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher (Native ESM support required; v22+ recommended).
- **npm**: `v10.0.0` or higher.
- **Git**: Modern git client.
- **Bash**: Unix-compatible shell (Linux, macOS, or WSL2 on Windows).

### Getting the Code
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/<your-username>/AgentSDLC.git
cd AgentSDLC

# 3. Add upstream remote
git remote add upstream https://github.com/i-soumya18/AgentSDLC.git

# 4. Verify test suite and gates
npm test
bash scripts/verify.sh
```

---

## 🔄 The Contribution Workflow

We follow a structured 6-step lifecycle for all changes:

```text
1. DISCUSS / ISSUE ──► 2. SPEC / ADR ──► 3. BRANCH ──► 4. IMPLEMENT ──► 5. VERIFY GATES ──► 6. PULL REQUEST
```

### Step 1: Open an Issue or Discussion
- For bugs: Open a [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md).
- For new features or CLI commands: Open a [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md).
- For architectural proposals: Open an [ADR Proposal](.github/ISSUE_TEMPLATE/adr_proposal.md).
- For new reusable agent playbooks: Open a [Skill Proposal](.github/ISSUE_TEMPLATE/skill_proposal.md).

### Step 2: Branch Naming Convention
Create a descriptive branch off `main`:
- `feat/<short-description>`: New features or capabilities
- `fix/<short-description>`: Bug fixes and defect repairs
- `skill/<skill-name>`: New or updated reusable skills in `skills/`
- `eval/<dataset-name>`: Additions to `tests/evals/`
- `docs/<short-description>`: Documentation, ADRs, or specification changes
- `chore/<short-description>`: Maintenance, CI, or dependency updates

```bash
git checkout -b feat/add-fastapi-template
```

### Step 3: Authoring or Updating Specifications
- If introducing a new feature, run the CLI stage helper:
  ```bash
  node bin/engineering-os.js stage specify <feature-name>
  ```
- Tag every requirement with a unique identifier (`REQ-001`, `REQ-002`) and provide clear Given-When-Then criteria.

### Step 4: Implementation & Test Co-Location
- Follow **Native ESM** (`import`/`export`) standards.
- Keep dependencies minimal. This repository prioritizes zero-bloat standard library solutions where possible.
- If introducing an API endpoint, document the OpenAPI 3.1 contract in `contracts/openapi.yaml` and reference RFC 7807 Problem Details schemas in `contracts/schemas/error-response.schema.json`.
- Add unit tests in `tests/unit/<feature>.test.js`.
- If modifying AI behaviors or prompts, update the relevant evaluation datasets:
  - `tests/evals/golden.jsonl`: Curated canonical inputs/outputs.
  - `tests/evals/adversarial.jsonl`: Security probes, jailbreaks, and injection tests.
  - `tests/evals/regression.jsonl`: Bug regressions to ensure fixed bugs never return.
  - `tests/evals/tool-use.jsonl`: Agent tool-calling schema validations.

### Step 5: Verification (Run All Quality Gates)
Before committing, you **MUST** run the full verification suite:

```bash
# 1. Run unit & contract tests
npm test

# 2. Check for drift between specifications, tasks, and code
node bin/engineering-os.js drift

# 3. Check all machine-enforced quality gates
node bin/engineering-os.js gate all

# 4. Run AI evaluation benchmarks
node bin/engineering-os.js eval --threshold 0.8

# 5. Run end-to-end verification script
bash scripts/verify.sh
```

All 5 steps must pass with **0 errors and 0 warnings**.

### Step 6: Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat(cli): add support for python-fastapi template in init`
- `fix(drift): resolve unmapped REQ-002 in task slice`
- `docs(readme): enrich quickstart and open source guidelines`
- `skill(security): add prompt injection defense playbook`
- `test(evals): add tool parameter validation benchmarks`

---

## 🤖 AI Agent Collaboration Guidelines

If you use AI coding agents (Claude Code, Antigravity, GitHub Copilot, Cursor, etc.) to generate or refine contributions:

1. **Honor the Hierarchy**: Instruct your agent that [AGENTS.md](AGENTS.md) and [.ai/constitution.md](.ai/constitution.md) are binding contracts.
2. **No "Vibe Coding" PRs**: Do not submit large, unreviewed AI dumps. You as the human contributor are personally responsible for verifying every line of code, ensuring types/schemas match, and running `scripts/verify.sh`.
3. **Traceability Required**: Ensure any generated code maps directly to a requirement tag (`REQ-xxx`) and task slice (`TASK-xxx.y`).
4. **Eval Datasets**: Any AI-facing prompt or agent tool created with an LLM must be accompanied by benchmark entries in `tests/evals/`.

---

## 📋 Pull Request Submission Checklist

When opening a Pull Request, confirm that:
- [ ] Branch is rebased against latest `upstream/main`.
- [ ] `npm test` passes 100%.
- [ ] `node bin/engineering-os.js drift` reports **ZERO DRIFT DETECTED**.
- [ ] `node bin/engineering-os.js gate all` passes with machine-verifiable evidence.
- [ ] `bash scripts/verify.sh` completes successfully.
- [ ] No secrets, keys, or sensitive environment variables are committed.
- [ ] Documentation (`README.md`, `docs/`, or specs) has been updated to reflect the change.
- [ ] PR template is filled out completely with requirement links.

---

## ⚖️ Code of Conduct
All participants and contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [conduct@engineering-os.org](mailto:conduct@engineering-os.org).

Thank you for helping build the future of rigorous, reliable AI-native software engineering! 🚀
