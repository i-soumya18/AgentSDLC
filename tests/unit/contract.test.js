import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { ProductContractEngine } from '../../src/contract/product-contract-engine.js';
import { ContractError, ContractIntegrityError, ScopeViolationError } from '../../src/core/errors.js';

describe('Phase 2 — Product Contract & Scope Lock Tests', () => {
  async function createTestEnv() {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'contract-test-'));
    const productDir = path.join(tmpDir, 'product');
    await fs.mkdir(productDir, { recursive: true });
    return { tmpDir, productDir };
  }

  const mockCompleteDiscovery = {
    raw_idea: 'Pharmacy POS for inventory and billing',
    status: 'DISCOVERY_COMPLETE',
    completeness_score: 0.99,
    intent: {
      primary_goal: 'Pharmacy POS for inventory and billing',
      problem_statement: 'Managing pharmacy inventory and sales efficiently.',
      domain: 'healthcare/pharmacy'
    },
    users: [
      { persona: 'Pharmacist', needs: 'Dispensary oversight', confirmed: true },
      { persona: 'Cashier', needs: 'Checkout & billing', confirmed: true }
    ],
    desired_outcomes: [
      'Fast checkout < 2 seconds',
      'Accurate inventory sync'
    ],
    features: [
      { name: 'Inventory Management', description: 'Track stock and batch expiry', priority: 'must', confirmed: true },
      { name: 'Billing & POS', description: 'Process transactions and receipts', priority: 'must', confirmed: true },
      { name: 'Prescription Tracking', description: 'Record doctor prescriptions', priority: 'must', confirmed: true }
    ],
    constraints: [
      { type: 'connectivity', description: 'Offline-first billing required', confirmed: true }
    ],
    preferences: {
      platform: ['Mobile', 'Desktop'],
      ui_style: 'standard'
    },
    assumptions: [
      { id: 'ASSUMP-001', assumption: 'Local terminal has printer attached', impact_if_invalid: 'medium', validation_status: 'pending' }
    ],
    unknowns: [
      { id: 'UNK-1', impact: 'critical', question: 'Primary users?', resolved: true, answer: 'Pharmacists and cashiers' }
    ],
    contradictions: []
  };

  test('1. Contract Generation: distinguishes confirmed requirements, exclusions, and acceptance criteria', async () => {
    const { tmpDir } = await createTestEnv();
    const engine = new ProductContractEngine(tmpDir);

    const contract = await engine.generateContract(mockCompleteDiscovery);
    assert.equal(contract.contract_version, 1);
    assert.equal(contract.product.name, 'Pharmacy POS for inventory and billing');
    assert.equal(contract.scope_locked, false);
    assert.ok(contract.contract_hash.startsWith('sha256-'));

    // Check confirmed features
    assert.equal(contract.features.length, 3);
    assert.equal(contract.features[0].status, 'confirmed');

    // Check requirements with acceptance criteria
    assert.equal(contract.requirements.length, 3);
    for (const req of contract.requirements) {
      assert.ok(req.id.startsWith('REQ-'));
      assert.ok(req.acceptance_criteria.length >= 1);
      assert.ok(req.acceptance_criteria.some(ac => ac.includes('Given') && ac.includes('When') && ac.includes('Then')));
    }

    // Check explicit exclusions (out-of-scope)
    assert.ok(contract.out_of_scope.length > 0);
    assert.ok(contract.out_of_scope.some(item => item.includes('EHR') || item.includes('insurance')));

    // Save and check files
    const saved = await engine.saveContract(contract);
    assert.ok(saved.hash);
    const hasJson = await fs.stat(saved.jsonPath).then(() => true).catch(() => false);
    const hasMd = await fs.stat(saved.contractMdPath).then(() => true).catch(() => false);
    const hasScope = await fs.stat(saved.scopeMdPath).then(() => true).catch(() => false);
    const hasAcceptance = await fs.stat(saved.acceptanceMdPath).then(() => true).catch(() => false);
    assert.ok(hasJson && hasMd && hasScope && hasAcceptance);
  });

  test('2. Exit Criteria: blocks contract generation if critical unknowns remain unresolved', async () => {
    const { tmpDir } = await createTestEnv();
    const engine = new ProductContractEngine(tmpDir);

    const incompleteDiscovery = JSON.parse(JSON.stringify(mockCompleteDiscovery));
    incompleteDiscovery.unknowns.push({
      id: 'UNK-CRIT',
      impact: 'critical',
      question: 'Is internet connectivity guaranteed?',
      resolved: false
    });

    await assert.rejects(
      async () => await engine.generateContract(incompleteDiscovery),
      (err) => {
        assert.ok(err instanceof ContractError);
        assert.ok(err.message.includes('critical unknowns remain unresolved'));
        return true;
      }
    );
  });

  test('3. Approval & Scope Lock: records durable approval event with cryptographic hash', async () => {
    const { tmpDir } = await createTestEnv();
    const engine = new ProductContractEngine(tmpDir);

    const contract = await engine.generateContract(mockCompleteDiscovery);
    await engine.saveContract(contract);

    const approvalResult = await engine.approveContract({ approvedBy: 'Chief Architect' });
    assert.equal(approvalResult.approved, true);
    assert.equal(approvalResult.contract_version, 1);
    assert.ok(approvalResult.contract_hash.startsWith('sha256-'));
    assert.equal(approvalResult.approved_by, 'Chief Architect');

    // Verify approval.json file
    const approval = await engine.loadApproval();
    assert.equal(approval.status, 'APPROVED');
    assert.equal(approval.approved, true);
    assert.equal(approval.contract_hash, approvalResult.contract_hash);

    // Verify contract is locked
    const lockedContract = await engine.loadContract();
    assert.equal(lockedContract.scope_locked, true);
  });

  test('4. Rejection: records formal rejection with reason and leaves scope open', async () => {
    const { tmpDir } = await createTestEnv();
    const engine = new ProductContractEngine(tmpDir);

    const contract = await engine.generateContract(mockCompleteDiscovery);
    await engine.saveContract(contract);

    const rejectResult = await engine.rejectContract({
      reason: 'Pricing model not clarified in MVP scope',
      rejectedBy: 'Product Lead'
    });
    assert.equal(rejectResult.approved, false);
    assert.equal(rejectResult.status, 'REJECTED');

    const approval = await engine.loadApproval();
    assert.equal(approval.status, 'REJECTED');
    assert.equal(approval.approved, false);
    assert.equal(approval.rejection_reason, 'Pricing model not clarified in MVP scope');

    const updatedContract = await engine.loadContract();
    assert.equal(updatedContract.scope_locked, false);
  });

  test('5. Tamper Detection: modifying contract post-approval triggers ContractIntegrityError', async () => {
    const { tmpDir, productDir } = await createTestEnv();
    const engine = new ProductContractEngine(tmpDir);

    const contract = await engine.generateContract(mockCompleteDiscovery);
    await engine.saveContract(contract);
    await engine.approveContract({ approvedBy: 'Lead Architect' });

    // Initial integrity check passes
    const initialCheck = await engine.verifyContractIntegrity();
    assert.equal(initialCheck.valid, true);

    // Simulating silent unauthorized modification to product-contract.json
    const contractPath = path.join(productDir, 'product-contract.json');
    const raw = await fs.readFile(contractPath, 'utf8');
    const modified = JSON.parse(raw);
    modified.requirements.push({
      id: 'REQ-UNAUTHORIZED',
      title: 'Sneaky Feature',
      type: 'confirmed',
      description: 'Added without change request',
      acceptance_criteria: ['Given sneaky, when run, then leak data']
    });
    await fs.writeFile(contractPath, JSON.stringify(modified, null, 2), 'utf8');

    // Post-edit verification MUST throw ContractIntegrityError
    await assert.rejects(
      async () => await engine.verifyContractIntegrity(),
      (err) => {
        assert.ok(err instanceof ContractIntegrityError);
        assert.ok(err.message.includes('CONTRACT_TAMPERED'));
        assert.ok(err.expectedHash);
        assert.ok(err.actualHash);
        assert.notEqual(err.expectedHash, err.actualHash);
        return true;
      }
    );
  });

  test('6. Scope Violations: detects attempt to build or validate out-of-scope features', async () => {
    const { tmpDir } = await createTestEnv();
    const engine = new ProductContractEngine(tmpDir);

    const contract = await engine.generateContract(mockCompleteDiscovery);
    await engine.saveContract(contract);
    await engine.approveContract({ approvedBy: 'Lead Architect' });

    // Allowed in-scope item
    const inScope = await engine.validateScope('Billing & POS');
    assert.equal(inScope.allowed, true);

    // Out-of-scope item throws ScopeViolationError
    await assert.rejects(
      async () => await engine.validateScope('Multi-hospital enterprise EHR synchronization'),
      (err) => {
        assert.ok(err instanceof ScopeViolationError);
        assert.ok(err.message.includes('SCOPE_VIOLATION'));
        return true;
      }
    );
  });

  test('7. Scope Change Request & Versioning: bumps version to v2, unseals scope, mandates re-approval', async () => {
    const { tmpDir } = await createTestEnv();
    const engine = new ProductContractEngine(tmpDir);

    const contract = await engine.generateContract(mockCompleteDiscovery);
    await engine.saveContract(contract);
    await engine.approveContract({ approvedBy: 'Lead Architect' });

    // Initiate formal change request to add a new feature
    const crResult = await engine.createChangeRequest({
      title: 'Add Barcode Scanner Support',
      description: 'Support USB barcode scanner input for item lookup',
      addedFeatures: [{ name: 'Barcode Scanner Integration', description: 'Read UPC/EAN barcodes directly at POS' }],
      requestedBy: 'Store Operations'
    });

    assert.equal(crResult.version, 2);
    assert.equal(crResult.contract.contract_version, 2);
    assert.equal(crResult.contract.scope_locked, false);
    assert.equal(crResult.approval.status, 'PENDING');
    assert.equal(crResult.approval.approved, false);

    // Integrity check reports unapproved
    const checkPending = await engine.verifyContractIntegrity();
    assert.equal(checkPending.valid, false);
    assert.equal(checkPending.status, 'PENDING');

    // Re-approve version 2
    const reApproval = await engine.approveContract({ approvedBy: 'Lead Architect' });
    assert.equal(reApproval.approved, true);
    assert.equal(reApproval.contract_version, 2);

    // Integrity check passes for v2
    const checkV2 = await engine.verifyContractIntegrity();
    assert.equal(checkV2.valid, true);
    assert.equal(checkV2.contract_version, 2);
  });
});
