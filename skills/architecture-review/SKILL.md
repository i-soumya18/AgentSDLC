---
name: architecture-review
description: Evaluates system design, component boundaries, and failure modes against the 14-point resilience checklist.
---

# Skill: Architecture Review

## PURPOSE
Conduct a comprehensive, cloud-neutral architectural review to ensure high availability, fault tolerance, and security before writing implementation code.

## INPUTS
- `archPath`: Path to `specs/<feature-id>/architecture.md`.
- `adrPath`: Path to proposed ADR in `docs/adr/`.

## TOOLS
- `view_file`
- `write_to_file`

## STEPS
1. Verify system context and C4 container boundaries.
2. Review proposed data flow and data storage models.
3. Validate answers to the **14-Point Failure Resilience Checklist**:
   - DB down behavior
   - Redis/Cache down behavior
   - Third-party API timeout behavior
   - Duplicate request behavior (Idempotency)
   - Out-of-order event behavior
   - Slow DB query degradation
   - Stale cache handling
   - Partial deployment / canary failure behavior
   - AI model provider outage / rate-limiting
   - Malformed/hallucinatory model output handling
   - Poisoned or malicious tool-call defense
   - Database rollback feasibility
   - Incident detection and SLO telemetry
   - End-user degradation experience
4. Approve ADR or return with required mitigations.

## CONSTRAINTS
- Hand-wavy answers like "we assume high availability" are rejected.
- Every architectural decision must produce an ADR.

## FAILURE CONDITIONS
- Single points of failure without failover or circuit breakers.
- Missing idempotency handling on financial or mutating actions.

## EXPECTED OUTPUT
Architecture Gate approval recorded in `architecture.md`.

## REQUIRED EVIDENCE
- Completed 14-point checklist with concrete code or infrastructure mitigation for each point.
