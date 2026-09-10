# Production Operations Runbook

## 1. Triage Workflow
When alerted of an incident:
1. Acknowledge alert in PagerDuty / monitoring dashboard.
2. Check `/healthz` and `/readyz` endpoints across deployment nodes.
3. Inspect structured logs for spike in HTTP 5xx errors:
   ```bash
   # Filter logs by error level and trace ID
   tail -f logs/app.log | grep '"level":"error"'
   ```
4. Check database connection pool saturation.

## 2. Common Failure Playbooks

### A. Database Connection Starvation
- **Symptom**: HTTP 503 errors; log shows `connection pool exhausted`.
- **Immediate Mitigation**: Temporarily increase pool size max limits or restart stalled worker pods.
- **Root Cause Action**: Identify slow unindexed queries holding connections open.

### B. High AI Error Rate / Provider Outage
- **Symptom**: AI task decomposition failing; rate limit 429 errors from LLM provider.
- **Immediate Mitigation**: Flip feature flag `ENABLE_LOCAL_MOCK_FALLBACK=true` in environment.
- **Root Cause Action**: Rotate API keys or engage backup provider in `src/ai/`.
