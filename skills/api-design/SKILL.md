---
name: api-design
description: Designs and validates OpenAPI 3.1 specifications, request/response models, and error schemas.
---

# Skill: API Design

## PURPOSE
Create clean, versioned, contract-first HTTP APIs conforming to REST best practices and RFC 7807 error specifications.

## INPUTS
- `featureRequirements`: Extracted from `specs/<feature-id>/spec.md`.
- `openapiPath`: `contracts/openapi.yaml`.

## TOOLS
- `view_file`
- `write_to_file`
- `run_command` (OpenAPI validator / contract tests)

## STEPS
1. Define resource URLs using plural nouns (e.g. `/api/v1/tasks`, not `/api/v1/getTasks`).
2. Map HTTP verbs semantically: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove).
3. Include standard headers: `Idempotency-Key` on state-mutating requests; `X-Request-Id` for tracing.
4. Specify JSON schemas for request bodies and response codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).
5. Ensure all 4xx/5xx responses reference `contracts/schemas/error-response.schema.json`.
6. Validate the updated OpenAPI contract using automated tests.

## CONSTRAINTS
- Breaking contract changes require a new API version prefix (e.g. `/v2/`).
- Never expose internal database IDs or stack traces in API response bodies.

## FAILURE CONDITIONS
- Inconsistent naming conventions or missing error schemas.

## EXPECTED OUTPUT
Updated `contracts/openapi.yaml` and `specs/<feature-id>/api-contract.md`.

## REQUIRED EVIDENCE
- Automated contract test pass (`npm run test:contract`).
