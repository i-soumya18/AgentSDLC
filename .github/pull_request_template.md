## 📋 Pull Request Summary

> Before submitting, please ensure you have read [CONTRIBUTING.md](CONTRIBUTING.md) and executed the local verification suite: `bash scripts/verify.sh`.

---

### 1. Traceability & Spec Mapping
- **Feature / Spec ID**: `specs/XXX-feature/` (or N/A for chore/docs)
- **Requirement IDs**: `REQ-XXX` (or N/A)
- **Vertical Tasks**: `TASK-XXX.X` (or N/A)
- **ADR Reference**: `docs/adr/XXXX-...` (if applicable)
- **Related Issue**: Fixes # (if applicable)

---

### 2. Description of Changes
*Provide a concise summary of what was added, modified, or removed, and the technical rationale behind the implementation.*

---

### 3. Quality & Evidence Verification Checklist
Please confirm the machine-verifiable evidence produced prior to opening this PR:
- [ ] `npm test` passes (Unit & Contract tests)
- [ ] `node bin/engineering-os.js gate all` passes with 100% green evidence
- [ ] `node bin/engineering-os.js drift` reports zero unmapped requirements or pending tasks
- [ ] `node bin/engineering-os.js eval --threshold 0.8` passes (if modifying AI prompts or tools)
- [ ] `bash scripts/verify.sh` executes all 5 stages successfully
- [ ] UI states covered if frontend: loading, empty, error, success (8-state contract)
- [ ] Rollback plan documented and verified (if database schema was touched)

---

### 4. Security & Operational Impact
- [ ] **Secret Hygiene**: No API keys, credentials, or secrets in git history
- [ ] **OWASP Compliance**: Evaluated against OWASP API Top 10 & OWASP GenAI Top 10
- [ ] **Backward Compatibility**: Contracts maintain backward compatibility; no breaking changes without an approved ADR
- [ ] **Observability**: Structured logs, correlation IDs, or telemetry included
