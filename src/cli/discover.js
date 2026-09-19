import { findProjectRoot } from '../core/config.js';
import { loadDiscoveryState, computeAdaptiveQuestions } from '../discovery/discovery-engine.js';

export async function runDiscover(args = []) {
  const projectRoot = await findProjectRoot();
  const state = await loadDiscoveryState(projectRoot);

  if (!state) {
    console.log(`\x1b[33mNo active product discovery state found.\x1b[0m`);
    console.log(`Start by running:\n  eos idea "Describe your app idea..."`);
    return;
  }

  console.log(`\n\x1b[1m\x1b[36m🔍 [PRODUCT DISCOVERY STATUS]\x1b[0m\n`);
  console.log(`  Raw Idea: "\x1b[1m${state.raw_idea}\x1b[0m"`);
  console.log(`  Domain: \x1b[35m${state.intent.domain}\x1b[0m`);
  console.log(`  Status: ${state.status === 'DISCOVERY_COMPLETE' ? '\x1b[32mDISCOVERY COMPLETE\x1b[0m' : '\x1b[33mIN_PROGRESS\x1b[0m'}`);
  console.log(`  Completeness Score: \x1b[1m${(state.completeness_score * 100).toFixed(0)}%\x1b[0m\n`);

  console.log(`\x1b[1mConfirmed Personas:\x1b[0m`);
  if (state.users.length > 0) {
    state.users.forEach(u => console.log(`  • ${u.persona} (${u.needs || 'N/A'})`));
  } else {
    console.log(`  (None confirmed yet)`);
  }

  console.log(`\n\x1b[1mConfirmed Features & Scope:\x1b[0m`);
  if (state.features.length > 0) {
    state.features.forEach(f => console.log(`  • ${f.name}: ${f.description}`));
  } else {
    console.log(`  (None confirmed yet)`);
  }

  console.log(`\n\x1b[1mConstraints & Preferences:\x1b[0m`);
  if (state.constraints.length > 0) {
    state.constraints.forEach(c => console.log(`  • [${c.type}] ${c.description}`));
  }
  if (state.preferences.platform.length > 0) {
    console.log(`  • Platforms: ${state.preferences.platform.join(', ')}`);
  }

  const unresolvedUnknowns = state.unknowns.filter(u => !u.resolved);
  if (unresolvedUnknowns.length > 0) {
    console.log(`\n\x1b[1m\x1b[33mPending Questions (${unresolvedUnknowns.length}):\x1b[0m`);
    unresolvedUnknowns.slice(0, 3).forEach((u, i) => {
      console.log(`  ${i + 1}. [${u.impact.toUpperCase()}] ${u.question}`);
    });
    console.log(`\n\x1b[90mAnswer with:\x1b[0m eos clarify "your answers here"`);
  } else if (state.status === 'DISCOVERY_COMPLETE') {
    console.log(`\n\x1b[32m\x1b[1m✨ DISCOVERY COMPLETE!\x1b[0m All critical unknowns and scope boundaries resolved.`);
    console.log(`Ready for Phase 2: Product Contract generation.`);
  }
}
