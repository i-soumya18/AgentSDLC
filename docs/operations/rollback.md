# Safe Rollback Procedures & Checklist

## 1. Golden Rule of Rollback
> **"Every release must be verified reversible before it is allowed to deploy."**

## 2. Automated Rollback Protocol
1. Trigger the rollback runner:
   ```bash
   bash scripts/rollback.sh --to-release <PREVIOUS_RELEASE_TAG>
   ```
2. Verify traffic diversion to previous container images.
3. Validate schema compatibility:
   - Because our database policy mandates expand-contract, previous code runs safely against current schema.
4. Execute synthetic smoke tests:
   ```bash
   bash scripts/smoke-test.sh
   ```
5. Confirm error rate drops below 0.1% within 2 minutes.
