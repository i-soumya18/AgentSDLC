# API Standards & Design Guidelines

## 1. Protocol & Format
- All APIs are JSON-over-HTTP/REST or WebSocket for streaming.
- Dates and timestamps must strictly adhere to ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`).
- Identifiers must be UUIDv7 strings or prefixed URL-safe IDs (`task_01j7...`).

## 2. HTTP Status Code Discipline
- `200 OK`: Successful read or synchronous update.
- `201 Created`: Entity successfully created (must return `Location` header or created object).
- `204 No Content`: Successful mutation returning no payload (e.g. DELETE).
- `400 Bad Request`: Syntax or validation failure (RFC 7807).
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated user lacks permission to access resource.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Concurrency conflict or duplicate idempotency key.
- `422 Unprocessable Content`: Semantically invalid payload or unparsable AI output.
- `429 Too Many Requests`: Rate limit exceeded (must return `Retry-After`).
- `500 Internal Server Error`: Unhandled server exception.
- `503 Service Unavailable`: Circuit breaker open or database offline.
