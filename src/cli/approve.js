import { ProductContractEngine } from '../contract/product-contract-engine.js';

export async function runApprove(args = []) {
  const engine = new ProductContractEngine(process.cwd());

  let approvedBy = 'user';
  const byIdx = args.indexOf('--by');
  if (byIdx !== -1 && args[byIdx + 1]) {
    approvedBy = args[byIdx + 1];
  }

  console.log(`\n🔒 [MUTUAL CONTRACT APPROVAL & SCOPE LOCK]`);
  console.log(`Auditing and sealing Product Contract...`);

  const result = await engine.approveContract({ approvedBy });

  console.log(`\n✓ PRODUCT CONTRACT v${result.contract_version} APPROVED & SCOPE LOCKED!`);
  console.log(`  • Approved By: ${result.approved_by}`);
  console.log(`  • Cryptographic Hash: ${result.contract_hash}`);
  console.log(`  • Durable Record: product/approval.json`);
  console.log(`  • Scope Status: 🔒 LOCKED\n`);
  console.log(`✨ Product Contract is officially locked. Ready for engineering execution!\n`);
}

export async function runReject(args = []) {
  const engine = new ProductContractEngine(process.cwd());

  let reason = 'Contract rejected during review';
  const reasonIdx = args.indexOf('--reason');
  if (reasonIdx !== -1 && args[reasonIdx + 1]) {
    reason = args.slice(reasonIdx + 1).join(' ');
  }

  console.log(`\n🚫 [PRODUCT CONTRACT REJECTION]`);
  const result = await engine.rejectContract({ reason });

  console.log(`\n⚠ Contract marked REJECTED.`);
  console.log(`  • Reason: ${result.reason}`);
  console.log(`  • Record: product/approval.json\n`);
}
