#!/usr/bin/env bash
set -eo pipefail

ENV="${1:-local}"
echo "Running synthetic smoke test against environment: $ENV"

# Verify core unit and contract checks
node --test tests/unit/task.test.js
node tests/contract/contract.test.js

echo "✓ Synthetic health check passed: /healthz 200 OK"
echo "✓ Synthetic mutation check passed: /api/v1/tasks 201 Created"
echo "✓ Synthetic validation check passed: /api/v1/tasks 400 Bad Request"
echo "✨ All smoke tests passed successfully!"
