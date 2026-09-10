# GitHub Copilot Repository Instructions

This repository is governed by the Spec-Driven Development (SDD) Agentic AI SDLC OS.

## Core Rules for Copilot
1. Always align code suggestions with `contracts/openapi.yaml` and `.ai/constitution.md`.
2. Do not hallucinate external libraries; use existing project dependencies defined in `package.json`.
3. Never suggest embedding hardcoded credentials, secret keys, or raw SQL queries vulnerable to injection.
4. Follow the vertical slice architecture pattern: co-locate unit tests alongside implementation.
5. All error handling must adhere to RFC 7807 problem details defined in `contracts/schemas/error-response.schema.json`.
