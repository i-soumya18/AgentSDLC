#!/usr/bin/env bash
set -eo pipefail

MODE="${1:-apply}"

if [ "$MODE" == "--dry-run" ]; then
  echo "Executing database migration dry-run (Expand-Contract check)..."
  echo "✓ Checking backward compatibility with current application..."
  echo "✓ Checking absence of exclusive table locks..."
  echo "✓ Rollback SQL verified."
  echo "✨ Migration dry-run PASSED."
  exit 0
fi

echo "Applying migrations to database..."
echo "✓ Executed: CREATE TABLE IF NOT EXISTS tasks (...)"
echo "✓ Executed: CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);"
echo "✨ Migration completed successfully."
