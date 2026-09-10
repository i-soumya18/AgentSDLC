# Universal Testing Standards

## 1. Traceability: REQ to TEST Mapping
Every test case must document which specific requirement it exercises:
```javascript
// @trace REQ-001.3: User receives 400 Bad Request when title is blank
test('should reject task creation with blank title', async () => {
  const res = await createTask({ title: '' });
  assert.equal(res.status, 400);
});
```

## 2. Deterministic Testing Pyramid
- **Unit Tests**: Must run in milliseconds, completely offline, mocking I/O.
- **Contract Tests**: Verify live API routes against `contracts/openapi.yaml`.
- **Integration Tests**: Verify database queries and external integrations against real instances (e.g. SQLite / Testcontainers).
- **End-to-End Tests**: Run critical browser workflows using headless Playwright.

## 3. Probabilistic AI Evaluation Stack
- Golden prompt testing (`tests/evals/golden.jsonl`): Assesses reasoning accuracy and formatting consistency.
- Adversarial prompt testing (`tests/evals/adversarial.jsonl`): Verifies guardrails against prompt injection and jailbreaks.
- Tool-Use precision (`tests/evals/tool-use.jsonl`): Validates schema and argument correctness for agent tool invocations.
