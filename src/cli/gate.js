import { findProjectRoot, resolveActiveFeature } from '../core/config.js';
import { GATES, GATE_REGISTRY, isValidGate, evaluateGate } from '../gates/registry.js';

export { GATES } from '../gates/registry.js';

export async function runGate(args) {
  const gateName = args[0]?.toLowerCase() || 'all';
  const projectRoot = await findProjectRoot();
  const featureId = await resolveActiveFeature(projectRoot, args[1]);

  console.log(`\x1b[1m\x1b[34m🛡 [QUALITY GATE CHECK]\x1b[0m Gate: \x1b[1m${gateName.toUpperCase()}\x1b[0m | Target: \x1b[1m${featureId}\x1b[0m\n`);

  if (!isValidGate(gateName)) {
    console.error(`\x1b[31mError: Unknown gate '${gateName}'.\x1b[0m`);
    console.log(`\x1b[1mAvailable gates in canonical registry:\x1b[0m\n  ${GATES.join(', ')}, all`);
    process.exitCode = 1;
    return;
  }

  const results = await evaluateGate(projectRoot, gateName, featureId);

  for (const res of results) {
    if (res.status === 'EXPLICITLY_UNIMPLEMENTED') {
      console.log(`\x1b[33m? [UNIMPLEMENTED]\x1b[0m \x1b[1m${res.name}\x1b[0m: ${res.evidence}`);
    } else {
      const icon = res.passed ? '\x1b[32m✓ [PASS]\x1b[0m' : '\x1b[31m✗ [FAIL]\x1b[0m';
      console.log(`${icon} \x1b[1m${res.name}\x1b[0m: ${res.evidence}`);
    }
  }

  const implementedEvaluations = results.filter(r => r.status !== 'EXPLICITLY_UNIMPLEMENTED');
  const allPassed = implementedEvaluations.length > 0 && implementedEvaluations.every(r => r.passed);

  console.log('\n' + '-'.repeat(50));
  if (allPassed) {
    console.log('\x1b[32m\x1b[1m✨ All evaluated gates PASSED with verifiable evidence.\x1b[0m\n');
  } else if (implementedEvaluations.length === 0) {
    console.log('\x1b[33m\x1b[1mℹ Gate is explicitly registered as unimplemented in current release phase.\x1b[0m\n');
  } else {
    console.log('\x1b[31m\x1b[1m⚠️ Quality gate evaluation failed. Resolve failing gates before proceeding.\x1b[0m\n');
    process.exitCode = 1;
  }
}
