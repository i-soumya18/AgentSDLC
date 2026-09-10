# Testing Path-Specific Instructions

> Applies to: `tests/`, `__tests__/`, `*.test.js`, `*.spec.ts`

## 1. The Testing Pyramid
- **Unit Tests (`tests/unit/`)**: Fast, deterministic, isolated tests covering domain logic, data transformations, and state machines. Zero network calls.
- **Contract Tests (`tests/contract/`)**: Validate request/response payloads against `contracts/openapi.yaml` and event schemas.
- **Integration Tests (`tests/integration/`)**: Test database repositories, external client adapters with testcontainers or mocked network boundaries.
- **End-to-End Tests (`tests/e2e/`)**: Test the critical golden user journeys (Playwright/browser flows).

## 2. Evidence Requirements
- Every acceptance criterion in `spec.md` (`REQ-xxx`) must link to at least one test assertion.
- Bugs must have a reproduction test committed before fixing.
- Flaky tests are treated as P1 defects and quarantined immediately.
