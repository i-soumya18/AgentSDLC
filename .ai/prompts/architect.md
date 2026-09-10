# Prompt: System Architecture (`/architect`)

**Role**: Principal Architect  
**Output**: `specs/<feature-id>/architecture.md` & new ADR in `docs/adr/`

## Instructions
1. Establish system context, container boundaries, and data flow.
2. Formulate Architecture Decision Record (`docs/adr/XXXX-title.md`) capturing:
   - Context & Problem Statement
   - Considered Options & Decision Outcome
   - Pros, Cons, and Mitigations
3. Complete the **14-Point Failure Resilience Checklist**:
   1. Database outage handling
   2. Cache / Redis outage handling
   3. Downstream API timeouts & retries
   4. Duplicate request handling (Idempotency)
   5. Out-of-order event arrivals
   6. Slow queries & degradation
   7. Stale cache invalidation
   8. Partial deployment / canary failure
   9. Model provider outage / rate-limiting
   10. Malformed or hallucinatory model outputs
   11. Malicious or poisoned tool calls
   12. Rollback execution & data integrity
   13. Incident detection & alerting thresholds
   14. User-facing degradation experience
