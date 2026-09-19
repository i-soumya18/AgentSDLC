import path from 'node:path';
import { findProjectRoot, resolveActiveFeature } from '../core/config.js';
import { evaluateGate } from '../gates/registry.js';
import { runDrift } from '../cli/drift.js';
import { runEval } from '../eval/eval-runner.js';

export async function executeVerification(options = {}) {
  const projectRoot = options.projectRoot || await findProjectRoot();
  const featureId = await resolveActiveFeature(projectRoot, options.featureId);

  console.log('\x1b[1m\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m      AGENTIC SDLC OS — COMPLETE VERIFICATION SUITE         \x1b[0m');
  console.log('\x1b[1m\x1b[36m============================================================\x1b[0m');
  console.log(`Target Feature: \x1b[1m${featureId}\x1b[0m | Root: ${projectRoot}\n`);

  // Step 1: Quality Gates
  console.log('\x1b[1m[STEP 1/3] Quality Gates Audit\x1b[0m');
  const gateResults = await evaluateGate(projectRoot, 'all', featureId);
  for (const res of gateResults) {
    const icon = res.passed ? '\x1b[32m✓ [PASS]\x1b[0m' : '\x1b[31m✗ [FAIL]\x1b[0m';
    console.log(`  ${icon} \x1b[1m${res.name}\x1b[0m: ${res.evidence}`);
  }

  const allGatesPassed = gateResults.every(r => r.passed);
  if (!allGatesPassed) {
    console.log('\n\x1b[31m⚠️ Quality gate evaluation failed. Verification halted.\x1b[0m\n');
    return { success: false, step: 'gates', gateResults };
  }

  // Step 2: Drift & Traceability
  console.log('\n\x1b[1m[STEP 2/3] Artifact Drift & Traceability Check\x1b[0m');
  await runDrift([featureId]);

  // Step 3: AI Behavioral Evaluation
  console.log('\n\x1b[1m[STEP 3/3] AI Behavioral & Guardrail Evaluation\x1b[0m');
  const evalThreshold = options.threshold || 0.8;
  await runEval(['--dataset', 'tests/evals/tool-use.jsonl', '--threshold', String(evalThreshold)]);

  console.log('\n\x1b[32m\x1b[1m✓ Full SDLC Verification Completed Successfully!\x1b[0m\n');
  return { success: true, gateResults };
}
