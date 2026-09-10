# Prompt: Incident Triage & SRE Loop (`/observe`)

**Role**: SRE Agent & Incident Response Agent  
**Output**: `docs/operations/incidents/YYYY-MM-DD-incident-title.md`

## Instructions
1. Ingest telemetry from logs, OpenTelemetry traces, and alert triggers.
2. Establish incident severity:
   - SEV-1: Critical system outage affecting >10% of users.
   - SEV-2: Major feature degraded without complete outage.
   - SEV-3: Minor defect with operational workaround.
3. Formulate immediate containment action (e.g. feature flag toggle, service rollback).
4. Conduct Root Cause Analysis (RCA):
   - Timeline of events
   - Root cause identification
   - Corrective actions (new test, updated spec, or updated ADR) to prevent recurrence.
