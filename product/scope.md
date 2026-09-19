# Scope Specification & Boundary Lock

**Contract Version:** 1  
**Scope Lock Status:** 🔒 LOCKED  
**Contract Hash:** `sha256-ad5c7965d1949b6f79029e59f95fb88645cfccd82bbb740636534880534058d6`  

---

## 1. IN MVP SCOPE (What We Are Building)
MVP release delivering core operational capabilities for Pharmacist, Cashier

### Included Feature Capabilities:
| Feature | Priority | Confirmation |
|---|:---:|:---:|
| **Inventory Management** | MUST | confirmed |
| **Billing & POS** | MUST | confirmed |
| **Prescription Tracking** | MUST | confirmed |

### Specific Deliverables:
- **REQ-001**: Inventory Management
- **REQ-002**: Billing & POS
- **REQ-003**: Prescription Tracking

---

## 2. EXPLICITLY OUT OF SCOPE (What We Are NOT Building)
> [!WARNING]
> Downstream engineering agents MUST NOT implement features or workflows listed below without an approved Scope Change Request.

- ❌ **Multi-hospital enterprise EHR synchronization (Deferred to v2)**
- ❌ **Third-party health insurance claim clearinghouse gateway (Deferred to v2)**
- ❌ **Custom peripheral firmware drivers / hardware manufacturing**

---

## 3. Scope Change Protocol
1. Any modification, addition, or removal of in-scope capabilities requires a formal Change Request.
2. A Change Request automatically increments `contract_version` and unlocks the scope.
3. Implementation cannot resume until the revised contract is formally approved with a new cryptographic hash.
