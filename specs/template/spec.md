# Feature Specification: [FEATURE_NAME]

**Feature ID:** `SPEC-XXX`  
**Status:** Draft / In Review / Approved  
**Author:** Spec Agent  
**Reviewer:** Requirements Critic / Human Lead  

---

## 1. Overview & User Journey
*Describe what this feature enables for the user and provide a high-level journey.*

---

## 2. Functional Requirements
- **REQ-XXX.1**: [Description of requirement]
  - *Given* [precondition]
  - *When* [action]
  - *Then* [expected outcome]
- **REQ-XXX.2**: [Description of requirement]
  - *Given* [precondition]
  - *When* [action]
  - *Then* [expected outcome]

---

## 3. Non-Functional Requirements
- **P95 Latency**: < [Target, e.g. 200ms]
- **Availability**: 99.9%
- **Rate Limit**: [e.g. 100 req/min per user]

---

## 4. Edge Cases & Negative Paths
1. Network timeout during external call.
2. Malformed request payload.
3. Concurrent duplicate mutations.

---

## 5. Telemetry & Observability Requirements
- Metric: `feature_action_total` (counter)
- Span: `FeatureService.execute`
- Log: Structured JSON with `requestId` and `userId`.
