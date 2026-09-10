# API Contract Specification

**Feature ID:** `API-XXX` (maps to `SPEC-XXX`)  
**Contract Source:** `contracts/openapi.yaml`  

---

## 1. Endpoints & Operations

### `POST /api/v1/resources`
- **Summary**: Create a new resource
- **Headers**:
  - `Idempotency-Key`: string (optional, recommended for mutations)
  - `Content-Type`: `application/json`
- **Request Body**:
  ```json
  {
    "title": "string (1-255 chars, required)",
    "description": "string (optional)"
  }
  ```
- **Responses**:
  - `201 Created`: Entity object
  - `400 Bad Request`: RFC 7807 problem details
  - `401 Unauthorized`: Authentication missing or expired
  - `409 Conflict`: Idempotency key duplicate with differing payload
