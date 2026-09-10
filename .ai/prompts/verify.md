# Prompt: Verification & Gate Auditing (`/verify`)

**Role**: Test Agent  
**Output**: `specs/<feature-id>/verification.md`

## Instructions
1. Execute full deterministic test suite across unit, integration, and contract tests.
2. Run `eos gate all` to audit all machine-enforced gates.
3. Record exact command invocations, exit codes, test counts, and timestamped outputs in `specs/<feature-id>/verification.md`.
4. Fail with explicit error if any requirement in `spec.md` lacks test evidence.
