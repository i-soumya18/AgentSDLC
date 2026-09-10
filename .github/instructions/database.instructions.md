# Database Path-Specific Instructions

> Applies to: `migrations/`, `db/`, `models/`, `schemas/`, `prisma/`

## 1. Zero-Downtime Migration Policy
All schema changes must follow the **Expand and Contract pattern**:
1. **Expand Phase**: Add new tables/columns as optional (nullable or with safe defaults). Application continues reading from old columns and writing to both.
2. **Backfill Phase**: Asynchronously backfill historical data.
3. **Contract Phase**: Migrate application to read only from new columns, then drop old columns in a subsequent release.

## 2. Lock Mitigation & Safety Rules
- Never run long-running table locks on production tables.
- Add indexes concurrently (`CREATE INDEX CONCURRENTLY` in Postgres).
- Every migration script must include a matching, tested down/rollback migration.
- Destructive operations (`DROP TABLE`, `DROP COLUMN`) require explicit human architectural sign-off.
