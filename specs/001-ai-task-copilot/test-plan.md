# Test Plan: AI Task Copilot

**Feature ID:** `TEST-001` (maps to `SPEC-001`)  

---

## 1. Traceability Matrix

| Requirement | Test Type | File | Description |
|---|---|---|---|
| `REQ-001.1` | Unit | `tests/unit/task.test.js` | Successfully create task with valid title and return 201 |
| `REQ-001.2` | Unit | `tests/unit/task.test.js` | Reject empty title with 400 Bad Request RFC 7807 |
| `REQ-001.3` | AI Eval | `tests/evals/tool-use.jsonl` | Verify tool-call schema conformity and argument extraction |
