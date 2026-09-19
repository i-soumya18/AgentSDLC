# Acceptance Criteria & Verification Matrix

**Contract Version:** 1  
**Contract Hash:** `sha256-ad5c7965d1949b6f79029e59f95fb88645cfccd82bbb740636534880534058d6`  

---

## 1. Global Acceptance Criteria
1. **All must-have MVP features implemented and verified with automated tests**
2. **Zero critical or high security vulnerabilities detected by static analysis**
3. **Offline transactions successfully commit locally and survive unexpected restarts**
4. **Verification suite passes 100% with zero unresolved requirement drift**

## 2. Success Criteria
1. **100% requirement-to-test traceability demonstrated in verification report**
2. **Zero data loss on unexpected terminal shutdown**
3. **Positive user acceptance sign-off on core billing and inventory workflows**

---

## 3. Feature-Level Requirement Acceptance Criteria
### Requirement REQ-001: Inventory Management
- **Classification:** `confirmed`
- **Description:** Track stock levels, reorder points, and item batches

| # | Given / When / Then Condition |
|---|---|
| 1 | Given an active store catalog, When an item quantity changes, Then the stock level updates immediately with timestamped audit logging. |
| 2 | Given an item with stock below reorder threshold, When inventory status is queried, Then an alert flag is emitted. |
| 3 | Given a concurrent sale and restock event, When transactions are committed, Then inventory updates are strictly serialized without negative balances. |

### Requirement REQ-002: Billing & POS
- **Classification:** `confirmed`
- **Description:** Process sales transactions, taxes, and receipt generation

| # | Given / When / Then Condition |
|---|---|
| 1 | Given a cart with valid items, When checkout is finalized, Then a tax-compliant receipt is generated with unique transaction ID. |
| 2 | Given an offline terminal with cached product catalog, When a bill is processed, Then the sale is committed locally and queued for synchronization. |
| 3 | Given an invalid or negative total, When checkout is attempted, Then the transaction is rejected with RFC 7807 problem details. |

### Requirement REQ-003: Prescription Tracking
- **Classification:** `confirmed`
- **Description:** Record doctor prescriptions and patient dispensation history

| # | Given / When / Then Condition |
|---|---|
| 1 | Given a patient record and prescribing doctor name, When prescription is registered, Then items and dosage instructions are durably stored. |
| 2 | Given a prescription-only drug, When dispensed at POS, Then the system verifies matching prescription ID before authorizing sale. |
| 3 | Given an expired or fully dispensed prescription, When dispensation is attempted, Then the action is blocked with an explicit error. |

