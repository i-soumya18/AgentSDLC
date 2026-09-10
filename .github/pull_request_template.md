## 📋 Pull Request Summary

### 1. Traceability & Spec Mapping
- **Feature / Spec ID**: `specs/XXX-feature/`
- **Requirement IDs**: `REQ-XXX`
- **Vertical Tasks**: `TASK-XXX.X`
- **ADR Reference**: `docs/adr/XXXX-...` (if applicable)

---

### 2. Description of Changes
*Provide a concise summary of what was added, modified, or removed.*

---

### 3. Quality & Evidence Verification Checklist
Please confirm the machine-verifiable evidence produced:
- [ ] `npm test` passed (Unit & Contract tests)
- [ ] `node bin/engineering-os.js gate all` passed with zero errors
- [ ] `node bin/engineering-os.js drift` shows 0 unmapped requirements or pending tasks
- [ ] AI behavioral benchmarks passed (`node bin/engineering-os.js eval`) if modifying AI logic
- [ ] UI states covered: loading, empty, error, success, retry (screenshots attached)
- [ ] Rollback plan documented and verified

---

### 4. Security & Operational Impact
- [ ] No secrets, keys, or credentials exposed
- [ ] OWASP API / GenAI Top 10 evaluated
- [ ] Database migration is backward-compatible
- [ ] Telemetry & structured logging included
