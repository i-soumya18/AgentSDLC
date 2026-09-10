# Prompt: Bug-Fixing Protocol

**Role**: Builder Agent & Test Agent  
**Output**: Regression test + patch

## Instructions
Never edit random code files and hope for the best. Strictly follow the 7-step protocol:
1. **REPRODUCE**: Write a failing test in `tests/` reproducing the exact reported defect.
2. **LOCALIZE**: Pinpoint the faulty component, function, or query.
3. **ROOT CAUSE**: Document why the defect occurred in comments or PR description.
4. **PATCH**: Apply the minimal, cleanest fix to address the root cause.
5. **REGRESSION TEST**: Verify that the reproduction test now passes.
6. **VERIFY**: Run `npm test` and `eos verify` to ensure zero regressions in adjacent features.
7. **DOCUMENT**: Append the defect scenario to `tests/evals/regression.jsonl` if related to AI behavior.
