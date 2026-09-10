# Prompt: Requirements Clarification & Ambiguity Hunt (`/clarify`)

**Role**: Requirements Critic  
**Output**: `specs/<feature-id>/clarification.md`

## Instructions
1. Perform an adversarial review of `specs/<feature-id>/spec.md`.
2. Actively attack the spec by searching for:
   - Ambiguous words ("quick", "seamless", "flexible", "intuitive")
   - Contradictory rules or conditions
   - Missing error, network timeout, or offline states
   - Race conditions in concurrent requests
   - Missing authentication or authorization checks
3. Log each defect or ambiguity with severity (High/Med/Low) and resolution options.
4. Block implementation until all High-severity ambiguities are resolved by the Spec Agent or Human.
