# Prompt: AI Model Evaluation (`/eval`)

**Role**: AI Eval Agent  
**Output**: `specs/<feature-id>/eval-report.md`

## Instructions
1. Run evaluation suite across version-controlled datasets:
   - `node src/eval/eval-runner.js --dataset tests/evals/golden.jsonl --threshold 0.85`
   - `node src/eval/eval-runner.js --dataset tests/evals/adversarial.jsonl --threshold 0.95`
   - `node src/eval/eval-runner.js --dataset tests/evals/tool-use.jsonl --threshold 0.90`
2. Evaluate accuracy, refusal rate for malicious prompts, latency, and estimated token cost.
3. Compare results against historical baseline to detect model/prompt regression.
4. Record metrics in `specs/<feature-id>/eval-report.md`.
