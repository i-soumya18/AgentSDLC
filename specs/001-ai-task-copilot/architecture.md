# System Architecture: AI Task Copilot

**Feature ID:** `ARCH-001` (maps to `SPEC-001`)  
**Linked ADR:** `docs/adr/0001-mcp-least-privilege-model.md`  

---

## 1. Component Boundaries
- **Controller**: `src/features/tasks/task.controller.js` validates HTTP payload against OpenAPI schema.
- **Service**: `src/features/tasks/task.service.js` orchestrates business logic and idempotency verification.
- **Repository**: `src/features/tasks/task.repository.js` persists tasks in SQLite / PostgreSQL with parameterized queries.
- **AI Agent Tool**: `src/ai/task-tool.js` provides JSON schema tool binding for AI decomposition.

---

## 2. Resilience Verification
- DB down: Graceful 503 response with `Retry-After: 5`.
- Duplicate requests: Deduplicated via `Idempotency-Key` cache.
- AI Model timeout: Circuit breaker trips after 3 failures; falls back to manual template generation.
