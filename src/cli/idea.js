import { findProjectRoot } from '../core/config.js';
import { ingestIdea, exportMarkdownArtifacts } from '../discovery/discovery-engine.js';

export async function runIdea(args = []) {
  const rawIdea = args.join(' ').trim();
  if (!rawIdea) {
    console.error(`\x1b[31mError: Missing idea description.\x1b[0m`);
    console.log(`\x1b[1mUsage:\x1b[0m\n  eos idea "I want an app for small pharmacies to manage inventory and billing"`);
    process.exitCode = 1;
    return;
  }

  const projectRoot = await findProjectRoot();
  console.log(`\n\x1b[1m\x1b[36m💡 [PRODUCT DISCOVERY ENGINE — RAW IDEA INTAKE]\x1b[0m\n`);
  console.log(`Analyzing: "\x1b[1m${rawIdea}\x1b[0m"...\n`);

  const state = ingestIdea(rawIdea);
  await exportMarkdownArtifacts(projectRoot, state);

  console.log(`\x1b[32m✓ Initialized product discovery state in product/\x1b[0m`);
  console.log(`  • Domain Detected: \x1b[35m${state.intent.domain}\x1b[0m`);
  console.log(`  • Primary Goal: ${state.intent.primary_goal}`);
  console.log(`  • Identified Personas: ${state.users.map(u => u.persona).join(', ') || 'Unknown (Pending clarification)'}`);
  console.log(`  • Features Extracted: ${state.features.map(f => f.name).join(', ') || 'General capabilities'}`);
  console.log(`  • Completeness Score: \x1b[1m${(state.completeness_score * 100).toFixed(0)}%\x1b[0m\n`);

  // Print top adaptive questions (Round 1)
  const pendingUnknowns = state.unknowns.filter(u => !u.resolved).slice(0, 3);
  if (pendingUnknowns.length > 0) {
    console.log(`\x1b[1m\x1b[33m❓ Adaptive Clarification Questions (Round 1):\x1b[0m`);
    pendingUnknowns.forEach((u, i) => {
      console.log(`  ${i + 1}. [${u.impact.toUpperCase()}] ${u.question}`);
    });
    console.log(`\n\x1b[90mAnswer with:\x1b[0m eos clarify "your answers here"`);
  } else {
    console.log(`\x1b[32m✨ No critical unknowns detected!\x1b[0m Run 'eos discover' to view status.`);
  }
}
