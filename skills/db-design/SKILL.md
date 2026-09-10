---
name: db-design
description: Designs relational and document schemas, entity relationships, indexes, and concurrency controls.
---

# Skill: Database Design

## PURPOSE
Produce optimized, normalized, and performant data models that prevent data corruption and support zero-downtime evolution.

## INPUTS
- `dataRequirements`: Domain entities and access patterns from `spec.md`.

## TOOLS
- `view_file`
- `write_to_file` (`specs/<feature-id>/data-model.md`)

## STEPS
1. Model entities, primary keys (UUIDv7 or auto-incrementing BigInt), and foreign key constraints.
2. Determine appropriate normalization (typically 3NF for OLTP; denormalized read-models for search).
3. Identify query access patterns and design covering indexes for high-frequency queries.
4. Define optimistic concurrency control strategy (e.g. `version` column) for concurrent updates.
5. Document soft-delete vs hard-delete policy and cascade rules.

## CONSTRAINTS
- Avoid unindexed foreign keys (causes table locks during deletions in PostgreSQL).
- Never store sensitive credentials (passwords, API tokens) in plaintext.

## FAILURE CONDITIONS
- Unbounded text columns without length constraints in indexing keys.
- Missing timestamps (`created_at`, `updated_at`).

## EXPECTED OUTPUT
`specs/<feature-id>/data-model.md` with schema diagrams and DDL snippets.

## REQUIRED EVIDENCE
- Verified data model passing Data Gate review in `.ai/quality-gates.md`.
