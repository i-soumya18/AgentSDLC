# AI Evaluation Path-Specific Instructions

> Applies to: `tests/evals/`, `src/ai/`, `src/eval/`, `prompts/`

## 1. Dual-Track Evaluation Philosophy
Probabilistic LLM behavior must never be evaluated solely with deterministic unit tests. All AI-driven features must maintain version-controlled datasets in `tests/evals/`:
- `golden.jsonl`: Curated high-quality representative prompts and expected responses/tool calls.
- `adversarial.jsonl`: Edge cases, prompt injection attempts, adversarial jailbreaks, jailbreak variants.
- `regression.jsonl`: Captured real-world failure cases, hallucinations, or user-reported defects.
- `tool-use.jsonl`: Tool calling schema validation, argument correctness, and excess agency prevention.

## 2. Evaluation Metrics & Gates
- **Tool-Call Accuracy**: >= 95% schema and argument match.
- **Safety / Prompt-Injection Pass Rate**: 100% defense against known attack vectors.
- **Structured Output Validity**: 100% valid JSON conforming to target schemas.
- **Latency & Cost Budget**: Must stay within predefined P95 latency (< 3.0s) and token cost caps.
