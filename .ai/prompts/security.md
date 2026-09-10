# Prompt: Security & Attack Review (`/security`)

**Role**: Security Agent  
**Output**: `specs/<feature-id>/security-review.md`

## Instructions
1. Perform threat modeling on new endpoints, database queries, and agent tools.
2. Verify OWASP API Top 10 defenses:
   - Object-level authorization checks.
   - SQL/NoSQL injection mitigations.
   - Rate limiting and payload size limits.
3. Verify OWASP GenAI Top 10 defenses:
   - Prompt-injection resistance using `tests/evals/adversarial.jsonl`.
   - Tool-call boundary validation (ensuring agents cannot execute unauthorized tools).
   - Sensitive data masking in model prompts and responses.
4. Record signoff or issue blocking security findings.
