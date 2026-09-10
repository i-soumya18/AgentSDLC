---
name: security-review
description: Evaluates code, architecture, and tool configurations against OWASP API and GenAI security standards.
---

# Skill: Security Review

## PURPOSE
Identify security vulnerabilities, unauthorized data exposure, injection flaws, or permission boundary violations before shipping.

## INPUTS
- `featureFiles`: Source files, schemas, and prompts.
- `standards`: `.ai/security-standards.md`.

## TOOLS
- `view_file`
- `run_command` (Secret scanner, dependency checker)
- `write_to_file` (`specs/<feature-id>/security-review.md`)

## STEPS
1. Audit authentication & authorization checks (verify BOLA defense).
2. Scan for hardcoded credentials, JWT private keys, or API tokens.
3. Validate SQL and NoSQL queries for parameterized execution (prevent injection).
4. For AI components, evaluate against prompt injection vectors using `tests/evals/adversarial.jsonl`.
5. Check tool-call safety: verify agents cannot execute unauthorized commands or access sensitive files.
6. Compile findings and sign off or issue security blockers.

## CONSTRAINTS
- Security findings of severity High or Critical block the Security Gate immediately.
- Never suppress security alerts without an approved exception in `docs/adr/`.

## FAILURE CONDITIONS
- Direct string interpolation of user inputs into database queries or shell commands.

## EXPECTED OUTPUT
`specs/<feature-id>/security-review.md` with security clearance or remediation tasks.

## REQUIRED EVIDENCE
- Green scan outputs from secret scanners and prompt-injection evaluation test suite.
