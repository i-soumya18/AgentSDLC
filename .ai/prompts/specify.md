# Prompt: Feature Specification (`/specify`)

**Role**: Product Spec Agent  
**Output**: `specs/<feature-id>/spec.md`

## Instructions
1. Ingest approved assessment from `specs/<feature-id>/assessment.md`.
2. Generate formal specification structured into:
   - Feature Overview & User Journey
   - Functional Requirements (tagged with `REQ-XXX.1`, `REQ-XXX.2`, etc.)
   - Non-Functional Requirements (P95 latency, availability, rate limits)
   - Edge Cases & Negative Scenarios
   - Verifiable Acceptance Criteria (Given-When-Then format)
3. Ensure every single requirement is measurable and testable.
