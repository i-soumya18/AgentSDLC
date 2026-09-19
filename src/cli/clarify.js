import { findProjectRoot } from '../core/config.js';
import { loadDiscoveryState, applyClarification, exportMarkdownArtifacts } from '../discovery/discovery-engine.js';

export async function runClarify(args = []) {
  const clarificationText = args.join(' ').trim();
  if (!clarificationText) {
    console.error(`\x1b[31mError: Missing clarification response.\x1b[0m`);
    console.log(`\x1b[1mUsage:\x1b[0m\n  eos clarify "Single store, offline billing needed, for pharmacists and cashiers"`);
    process.exitCode = 1;
    return;
  }

  const projectRoot = await findProjectRoot();
  const state = await loadDiscoveryState(projectRoot);

  if (!state) {
    console.error(`\x1b[31mNo active discovery state found. Run 'eos idea "<text>"' first.\x1b[0m`);
    process.exitCode = 1;
    return;
  }

  console.log(`\n\x1b[1m\x1b[36m⚡ [PROCESSING USER CLARIFICATIONS]\x1b[0m\n`);
  console.log(`Clarification Input: "\x1b[1m${clarificationText}\x1b[0m"\n`);

  applyClarification(clarificationText, state);
  await exportMarkdownArtifacts(projectRoot, state);

  console.log(`\x1b[32m✓ Updated discovery state and artifacts in product/\x1b[0m`);
  console.log(`  • Completeness Score: \x1b[1m${(state.completeness_score * 100).toFixed(0)}%\x1b[0m`);
  console.log(`  • Status: ${state.status === 'DISCOVERY_COMPLETE' ? '\x1b[32mDISCOVERY COMPLETE\x1b[0m' : '\x1b[33mIN_PROGRESS\x1b[0m'}`);

  const unresolved = state.unknowns.filter(u => !u.resolved);
  if (unresolved.length > 0) {
    console.log(`\n\x1b[33mRemaining Questions (${unresolved.length}):\x1b[0m`);
    unresolved.slice(0, 2).forEach((u, i) => {
      console.log(`  ${i + 1}. [${u.impact.toUpperCase()}] ${u.question}`);
    });
  } else if (state.status === 'DISCOVERY_COMPLETE') {
    console.log(`\n\x1b[32m\x1b[1m✨ DISCOVERY COMPLETE!\x1b[0m All critical unknowns resolved.`);
    console.log(`Ready for Phase 2: Product Contract generation.`);
  }
}
