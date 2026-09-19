import path from 'node:path';
import { ProductContractEngine } from '../contract/product-contract-engine.js';
import { ContractIntegrityError, ScopeViolationError } from '../core/errors.js';

export async function runContract(args = []) {
  const engine = new ProductContractEngine(process.cwd());

  // Check for --verify or verify
  if (args.includes('--verify') || args.includes('verify')) {
    console.log(`\n🔒 [PRODUCT CONTRACT INTEGRITY AUDIT]\n`);
    try {
      const integrity = await engine.verifyContractIntegrity();
      if (!integrity.valid) {
        console.log(`  ⚠ Contract Status: ${integrity.reason}`);
        if (integrity.status) console.log(`  Status Details: ${integrity.status}`);
        if (integrity.rejection_reason) console.log(`  Rejection Reason: ${integrity.rejection_reason}`);
        process.exit(1);
      }
      console.log(`  ✓ CONTRACT INTEGRITY VERIFIED (v${integrity.contract_version})`);
      console.log(`  • Hash: ${integrity.contract_hash}`);
      console.log(`  • Approved By: ${integrity.approved_by} on ${integrity.approved_at}`);
      console.log(`  • Scope Status: ${integrity.scope_locked ? '🔒 LOCKED' : '🔓 OPEN'}\n`);
      return;
    } catch (err) {
      if (err instanceof ContractIntegrityError) {
        console.error(`\x1b[31m  ✗ CONTRACT TAMPERING DETECTED!\x1b[0m`);
        console.error(`  ${err.message}\n`);
        process.exit(1);
      }
      throw err;
    }
  }

  // Check for change request: eos contract change "<description>"
  if (args[0] === 'change') {
    const changeDesc = args.slice(1).join(' ').trim();
    if (!changeDesc) {
      console.error(`\x1b[31mError: Change description required.\x1b[0m\nUsage: eos contract change "<change description>"`);
      process.exit(1);
    }

    console.log(`\n📝 [SCOPE CHANGE REQUEST INITIATED]`);
    console.log(`  Change: "${changeDesc}"...`);

    const result = await engine.createChangeRequest({
      title: changeDesc.split('.')[0] || changeDesc,
      description: changeDesc,
      addedFeatures: [{ name: changeDesc, description: changeDesc }]
    });

    console.log(`\n✓ Contract upgraded to version ${result.version}`);
    console.log(`  • Scope unlocked: 🔓 OPEN`);
    console.log(`  • Prior approval invalidated. Current status: PENDING`);
    console.log(`  • Updated artifacts saved in product/\n`);
    console.log(`Re-approve with: eos approve --by "Your Name"\n`);
    return;
  }

  // Default: Generate and display Product Contract
  console.log(`\n📜 [PRODUCT CONTRACT GENERATION]`);
  console.log(`Transforming discovered intent into formal contract...\n`);

  const contract = await engine.generateContract();
  const saved = await engine.saveContract(contract);

  console.log(`✓ Generated and synchronized Product Contract v${contract.contract_version} in product/`);
  console.log(`  • Product: ${contract.product.name}`);
  console.log(`  • Domain: ${contract.product.domain}`);
  console.log(`  • In-Scope Features: ${contract.mvp_scope.included_features.join(', ')}`);
  console.log(`  • Requirements: ${contract.requirements.length} REQ items with Given/When/Then acceptance criteria`);
  console.log(`  • Explicit Exclusions: ${contract.out_of_scope.length} items out of scope`);
  console.log(`  • Contract Hash: ${saved.hash}`);
  console.log(`  • Scope Status: 🔓 OPEN (Pending Approval)\n`);

  console.log(`Artifacts generated:`);
  console.log(`  - product/product-contract.json (Machine-readable contract)`);
  console.log(`  - product/product-contract.md   (Human-readable contract)`);
  console.log(`  - product/scope.md              (MVP scope vs Exclusions)`);
  console.log(`  - product/acceptance.md         (Acceptance matrix)\n`);

  console.log(`Next step: Lock scope with: eos approve\n`);
}
