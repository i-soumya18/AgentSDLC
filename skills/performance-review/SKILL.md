---
name: performance-review
description: Profiles response latency, throughput, memory consumption, and token usage budgets.
---

# Skill: Performance Review

## PURPOSE
Verify that endpoints and components meet strict latency, memory, and cost SLAs under expected operational loads.

## INPUTS
- `endpoints`: Target API routes or functions.
- `performanceTargets`: Documented in `docs/operations/slo.md`.

## TOOLS
- `run_command` (Benchmark runners, load generators)
- `view_file`

## STEPS
1. Measure baseline P50, P95, and P99 latencies under single-user load.
2. Run micro-benchmarks or synthetic load checks (e.g., 50 concurrent requests).
3. Verify memory allocation: check for unbounded array growth or memory leaks in long-running processes.
4. For AI components, calculate token usage, cost per request, and streaming chunk latencies.
5. Compare observed metrics against SLAs in `docs/operations/slo.md` (e.g. P95 < 200ms).

## CONSTRAINTS
- Reject changes that cause latency regressions > 20% without documented architectural justification.

## FAILURE CONDITIONS
- Endpoints exceeding P95 latency thresholds or unbounded heap growth under sustained load.

## EXPECTED OUTPUT
Performance audit summary recorded in verification report.

## REQUIRED EVIDENCE
- Benchmark execution log demonstrating compliance with defined latency and cost budgets.
