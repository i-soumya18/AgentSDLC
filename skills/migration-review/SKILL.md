---
name: migration-review
description: Audits database migration scripts for backward compatibility, lock contention, and rollback safety.
---

# Skill: Migration Review

## PURPOSE
Ensure all database migrations can be applied without service interruption (zero downtime) and rolled back cleanly in an emergency.

## INPUTS
- `migrationScript`: SQL file in `migrations/`.

## TOOLS
- `view_file`
- `run_command` (`bash scripts/migrate.sh --dry-run`)

## STEPS
1. Verify the migration adheres to the **Expand-Contract** methodology.
2. Check for locking hazards:
   - Does it perform `ADD COLUMN ... NOT NULL` without a default value? (Locks table)
   - Does it create indexes synchronously on large tables? (Must use `CONCURRENTLY` in Postgres)
   - Does it perform bulk data transformation synchronously within a transaction?
3. Verify backward compatibility:
   - Can the currently deployed version of the application run against the new schema?
4. Inspect the matching down-migration (`rollback.sql`) to ensure it cleanly restores the previous schema without data loss.

## CONSTRAINTS
- Migrations must never drop a column in the same release where the application stops writing to it.
- Destructive operations require human DBA authorization.

## FAILURE CONDITIONS
- Migration script lacks a corresponding, tested rollback script.
- Migration causes exclusive table lock on high-traffic tables.

## EXPECTED OUTPUT
Migration audit report and verified rollback script.

## REQUIRED EVIDENCE
- Successful dry-run execution of `scripts/migrate.sh` applying both forward and reverse migrations.
