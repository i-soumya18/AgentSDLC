---
name: observability
description: Implements OpenTelemetry traces, metrics, and structured logs for complete runtime transparency.
---

# Skill: Observability Instrumentation

## PURPOSE
Ensure all production services emit the three pillars of observability (logs, metrics, traces) to enable automated diagnosis and SLO enforcement.

## INPUTS
- `serviceCode`: Source files implementing API endpoints or workers.
- `sloDefinitions`: Targets in `docs/operations/slo.md`.

## TOOLS
- `view_file`
- `write_to_file`

## STEPS
1. Configure structured JSON logging:
   - Include timestamp, level, correlation ID (`traceId`, `requestId`), and message.
   - Forbid unstructured `console.log("here")` statements.
2. Instrument W3C Distributed Tracing:
   - Create spans for HTTP handlers, database queries, and external API requests.
3. Emit core RED metrics:
   - Rate (requests per second)
   - Errors (failed requests per second)
   - Duration (latency histogram: P50, P95, P99).
4. Implement `/healthz` (liveness) and `/readyz` (readiness) endpoints.

## CONSTRAINTS
- Never log plaintext secrets, customer passwords, or PII.
- Avoid excessive tracing overhead on high-frequency internal loops.

## FAILURE CONDITIONS
- Unhandled errors that fail without emitting an error-level log and span status error.

## EXPECTED OUTPUT
Instrumented application modules emitting standard telemetry.

## REQUIRED EVIDENCE
- Verification of structured JSON log output and live `/healthz` endpoint.
