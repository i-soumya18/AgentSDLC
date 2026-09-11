---
name: 🐛 Bug Report
about: Create a report to help us reproduce and fix a defect
title: '[BUG]: '
labels: ['bug', 'triage']
assignees: ''
---

## 🐛 Bug Description
A clear and concise description of what the bug is.

## 👣 Steps to Reproduce
1. Run command '...'
2. Open file '...'
3. See error

## 💻 Expected Behavior
A clear and concise description of what you expected to happen.

## 📋 Observed Logs & Evidence
```text
Paste terminal output, gate failures, or stack traces here
```

## 🔍 Quality Gate or Component Affected
- [ ] CLI (`bin/engineering-os.js`)
- [ ] Quality Gate Validator (`src/cli/gate.js`)
- [ ] Drift Detector (`src/cli/drift.js`)
- [ ] AI Evaluation Harness (`src/eval/eval-runner.js`)
- [ ] Contracts & Schemas (`contracts/`)
- [ ] Specific Feature (`specs/`)
- [ ] Other (please specify)

## 🖥️ Environment Information
- **OS**: [e.g. Ubuntu 24.04, macOS 15, Windows WSL2]
- **Node.js Version**: [e.g. 20.12.0, 22.2.0]
- **Repository Branch / Commit**: [e.g. main, commit sha]

## 💡 Additional Context & Workaround
Add any other context about the problem here, or workarounds you used.
