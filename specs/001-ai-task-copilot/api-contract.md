# API Contract: AI Task Copilot

**Feature ID:** `API-001` (maps to `SPEC-001`)  
**Contract Defined In:** `contracts/openapi.yaml`  

---

## 1. Endpoints

### `POST /api/v1/tasks`
- Creates a new task entity.
- Request Header: `Idempotency-Key` (optional string)
- Request Body:
  ```json
  {
    "title": "Build user auth slice",
    "description": "Implement login endpoint and session validation",
    "tags": ["auth", "backend"]
  }
  ```
- Responses:
  - `201 Created`: Returns task JSON object with `id`, `status`, `createdAt`.
  - `400 Bad Request`: Returns RFC 7807 problem details if `title` is missing or exceeds 255 chars.

### `GET /api/v1/tasks`
- Returns paginated list of tasks matching `contracts/schemas/pagination.schema.json`.
