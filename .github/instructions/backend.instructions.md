# Backend Path-Specific Instructions

> Applies to: `src/server/`, `src/api/`, `api/`, `controllers/`, `services/`

## 1. Contract-First Development
- Every HTTP endpoint must match `contracts/openapi.yaml`.
- Request bodies must be validated with strict schema enforcement before executing business logic.
- Errors must conform to RFC 7807 problem details defined in `contracts/schemas/error-response.schema.json`:
  ```json
  {
    "type": "https://api.example.com/errors/invalid-argument",
    "title": "Invalid Argument",
    "status": 400,
    "detail": "The 'prompt' field cannot exceed 4000 characters.",
    "instance": "/api/v1/tasks/123",
    "requestId": "req-98f21b7c"
  }
  ```

## 2. Idempotency & Concurrency
- State-mutating POST/PUT requests must accept an `Idempotency-Key` header for critical financial or destructive operations.
- Handle distributed concurrency using optimistic locking or conditional updates.

## 3. Observability & Context Propagation
- Extract and propagate W3C TraceContext headers (`traceparent`, `tracestate`).
- Emit structured JSON logs with correlation IDs (`requestId`, `userId`, `traceId`).
- Never log plaintext secrets, authorization tokens, or customer PII.
