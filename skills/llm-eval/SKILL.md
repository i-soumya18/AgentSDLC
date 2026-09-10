---
name: llm-eval
description: Executes the AI evaluation harness against golden, adversarial, regression, and tool-use datasets.
---

# Skill: LLM Evaluation

## PURPOSE
Evaluate probabilistic AI features using deterministic, version-controlled benchmark datasets to guarantee accuracy, safety, and reliability.

## INPUTS
- `datasetPath`: Path to dataset in `tests/evals/` (`golden.jsonl`, `tool-use.jsonl`, etc.).
- `threshold`: Required pass threshold (0.0 to 1.0, e.g. 0.85).

## TOOLS
- `run_command` (`node src/eval/eval-runner.js --dataset <dataset> --threshold <threshold>`)
- `view_file`

## STEPS
1. Select target evaluation suite in `tests/evals/`.
2. Execute `node src/eval/eval-runner.js --dataset <datasetPath> --threshold <threshold>`.
3. Evaluate metrics:
   - Tool-call accuracy (schema and arguments match)
   - Refusal/mitigation rate for adversarial prompts
   - JSON structured output validity
   - Average latency and cost estimation.
4. If score is below threshold, identify failed test IDs and trace back to prompt or system instructions.
5. Record evaluation scorecard in `specs/<feature-id>/eval-report.md`.

## CONSTRAINTS
- AI features must never be promoted to production without passing the AI Eval Gate.
- Regression datasets (`regression.jsonl`) require 100% pass rate.

## FAILURE CONDITIONS
- Pass rate falling below the specified threshold.
- Successful prompt injection in adversarial suite.

## EXPECTED OUTPUT
`specs/<feature-id>/eval-report.md` with benchmark scorecards.

## REQUIRED EVIDENCE
- Terminal output from `src/eval/eval-runner.js` demonstrating pass rate >= threshold.
