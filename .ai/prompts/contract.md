# Prompt: Contracts First (`/contract`)

**Role**: API / Data Agent  
**Output**: `contracts/openapi.yaml`, `contracts/schemas/`, and `specs/<feature-id>/api-contract.md`

## Instructions
1. Author or update OpenAPI 3.1 definitions in `contracts/openapi.yaml`.
2. Define all request bodies, headers (including `Idempotency-Key` for mutations), and response models.
3. Standardize error responses to RFC 7807 problem details schema.
4. For database changes, author SQL migration with expand-contract compatibility.
5. Provide verification script or automated validation test ensuring contract syntax validity.
