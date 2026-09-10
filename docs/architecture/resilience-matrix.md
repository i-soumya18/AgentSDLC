# Production Resilience Matrix — The 14 Critical Failure Scenarios

This matrix governs how the system handles runtime failures without data loss, cascading crashes, or broken user experiences.

---

### 1. What happens if DB is down?
- **System Behavior**: Connection pool attempts reconnection with exponential backoff (100ms, 200ms, 400ms, max 1s). Fast-fail circuit breaker trips after 5 consecutive failed connection attempts.
- **User Experience**: Returns HTTP 503 Service Unavailable with `Retry-After: 10` and an informative banner: "Service temporarily unavailable. We are reconnecting."
- **Data Protection**: In-flight mutating transactions are rolled back; background jobs pause and retain messages in the queue with dead-letter backoff.

### 2. What happens if Redis / Cache is down?
- **System Behavior**: Cache-aside wrapper catches Redis connection errors, logs a warning with error telemetry, and gracefully bypasses the cache to read directly from the database.
- **Throttling Protection**: Rate-limiter falls back to local in-memory token bucket to prevent database saturation.
- **Alert**: Emits metric `cache_fallback_total` and triggers P2 operational alert if sustained for > 60 seconds.

### 3. What happens if downstream API times out?
- **System Behavior**: Client enforces strict timeouts (max 3000ms). Uses retry policy with exponential backoff and randomized full jitter (max 2 retries).
- **Circuit Breaker**: If error rate exceeds 50% over 10 requests, circuit opens for 30s.
- **Fallback**: Returns cached response if available; otherwise returns clean error with degraded functionality indicator.

### 4. What happens if the same request arrives twice?
- **System Behavior**: All state-mutating endpoints (`POST`, `PUT`, `DELETE`) require or generate an `Idempotency-Key` header.
- **Handling**: First request acquires a temporary lock with a 30s TTL and stores result upon completion. Second identical request waits on lock or immediately receives cached result without re-executing business logic.

### 5. What happens if an event is delivered twice?
- **System Behavior**: Message consumers enforce idempotent message processing.
- **Implementation**: Each event carries a unique `eventId` and `occurredAt` timestamp adhering to CloudEvents. The consumer records processed `eventId`s in an atomic transaction; duplicate events are discarded with `200 OK ACK`.

### 6. What happens if an event arrives late?
- **System Behavior**: Events carry version and sequence counters.
- **Handling**: If an event with an older timestamp or lower sequence number arrives after a newer state has already been applied, the event is acknowledged and logged as an out-of-order no-op.

### 7. What happens during partial deployment?
- **System Behavior**: New code and old code run concurrently in production during rolling or canary deployments.
- **Invariants**: API contracts and database migrations must follow the expand-contract pattern. New code must be able to read old schema; old code must be able to ignore new nullable columns.

### 8. What happens if the AI model provider fails?
- **System Behavior**: Client catches provider HTTP 500/503/429 errors.
- **Fallback Strategy**:
  1. Secondary model provider invocation (e.g. Gemini Flash fallback or Claude Haiku).
  2. If all LLM providers fail, degrade to deterministic rule-based template generation.
- **User Notice**: "AI assistant currently offline; generated using standard template."

### 9. What happens if the model returns garbage or hallucination?
- **System Behavior**: Model output must strictly conform to a predefined JSON Schema.
- **Validation**: Runtime JSON schema validator intercepts the response. If schema validation fails, system triggers a single automatic retry with a repair prompt ("Your output was invalid JSON schema: <errors>. Re-emit only valid JSON."). If repair fails, returns a structured 422 Unprocessable Content.

### 10. What happens if a tool call is malicious or poisoned?
- **System Behavior**: Least-privilege tool execution layer strictly enforces schema boundaries.
- **Guardrails**:
  - Tool arguments undergo strict regex and type validation.
  - Dangerous commands (shell scripts, file deletion, raw SQL execution) are hard-blocked by policy.
  - Destructive tools require human confirmation before invocation.

### 11. What happens when cache is stale?
- **System Behavior**: Event-driven cache invalidation publishes purge events on entity mutations.
- **Ceiling**: Maximum TTL of 60 seconds on all read caches to prevent indefinite staleness in the event of dropped invalidation messages.

### 12. What happens during rollback?
- **System Behavior**: The deployment script reverts traffic to the previous known-good release tag.
- **Database Safety**: Database migrations are strictly non-breaking (expand-contract), ensuring the previous code version runs seamlessly against the current database schema without requiring emergency down-migrations.

### 13. How is the incident detected?
- **System Behavior**: Prometheus / OpenTelemetry metrics measure request rate, error rate, and P95 latency.
- **Alerting Threshold**: High error rate (>1% over 5m) or elevated P95 latency (>1000ms over 5m) automatically triggers PagerDuty / alert notifications to the on-call SRE.

### 14. How does the user experience failure?
- **System Behavior**: The UI never crashes, blanks out, or shows raw technical stack traces.
- **UX Display**: Displays an inline banner matching the RFC 7807 problem details with a clear, non-technical explanation and an interactive "Retry" button.
