---
name: incident-triage
description: Diagnoses and mitigates production incidents, establishing root causes and generating regression safeguards.
---

# Skill: Incident Triage

## PURPOSE
Rapidly stabilize degraded systems, diagnose root causes, execute safe mitigation, and convert lessons into permanent tests and rules.

## INPUTS
- `alertPayload`: Telemetry or alert notifications.
- `logs`: System and application logs.

## TOOLS
- `view_file`
- `run_command` (`bash scripts/rollback.sh`, log inspection)
- `write_to_file` (`docs/operations/incidents/YYYY-MM-DD-incident.md`)

## STEPS
1. **Detect & Triage**: Classify incident severity (SEV-1, SEV-2, SEV-3) based on user impact.
2. **Contain**: Take immediate stabilization action (e.g. toggle feature flag, scale up replicas, execute rollback).
3. **Diagnose**: Analyze logs and OpenTelemetry traces around the initial failure timestamp.
4. **Fix & Verify**: Formulate minimal patch following the bug-fix protocol (`reproduce -> localize -> root cause -> patch -> test`).
5. **Post-Mortem**: Author post-incident review documenting:
   - Root cause
   - Impact duration and user impact
   - Preventive action items (new regression test in `tests/evals/regression.jsonl`, updated spec, or updated ADR).

## CONSTRAINTS
- Mitigation and system stabilization take precedence over deep root-cause debugging during an active SEV-1.
- Every incident must result in a permanent regression test.

## FAILURE CONDITIONS
- Incidents resolved without documenting root cause or leaving behind regression tests.

## EXPECTED OUTPUT
Post-mortem document in `docs/operations/incidents/`.

## REQUIRED EVIDENCE
- Completed incident post-mortem with linked regression test commit.
