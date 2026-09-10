# Test Plan & Traceability Matrix

**Feature ID:** `TEST-PLAN-XXX` (maps to `SPEC-XXX`)  

---

## 1. Traceability Matrix

| Requirement ID | Test Type | Test File | Assertion / Scenario |
|---|---|---|---|
| `REQ-XXX.1` | Unit | `tests/unit/feature.test.js` | Valid payload returns 201 and persists record |
| `REQ-XXX.2` | Unit / Validation | `tests/unit/feature.test.js` | Empty title returns 400 Bad Request |
| `REQ-XXX.3` | Contract | `tests/contract/contract.test.js` | API matches OpenAPI schema |
| `REQ-XXX.4` | AI Eval | `tests/evals/tool-use.jsonl` | Agent invokes tool with correct schema |

---

## 2. Automated Test Execution
```bash
npm test
node bin/engineering-os.js eval --dataset tests/evals/tool-use.jsonl
```
