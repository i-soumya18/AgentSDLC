# Prompt: Database Migration Protocol

**Role**: API / Data Agent  
**Output**: `migrations/XXXX_description.sql` & rollback script

## Instructions
1. Design migration adhering strictly to Expand-Contract zero-downtime rules.
2. Verify:
   - Does not lock production tables for > 1 second.
   - New columns are nullable or have deterministic default values.
   - Old version of the application can run simultaneously with the new schema.
   - Matching down-migration (`rollback`) is tested and operational.
3. Validate against local/staging test database using `bash scripts/migrate.sh`.
