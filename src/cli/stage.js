import path from 'node:path';
import { findProjectRoot, resolveActiveFeature } from '../core/config.js';
import { STAGES, scaffoldStageArtifact, getStage } from '../lifecycle/stages.js';

export { STAGES } from '../lifecycle/stages.js';

export async function runStage(args) {
  const stageName = args[0]?.toLowerCase();
  const projectRoot = await findProjectRoot();
  const featureId = await resolveActiveFeature(projectRoot, args[1]);

  if (!stageName || !STAGES.includes(stageName)) {
    console.error(`\x1b[31mInvalid or missing stage name.\x1b[0m`);
    console.log(`\x1b[1mAvailable stages in canonical execution order:\x1b[0m\n  ${STAGES.join(' -> ')}`);
    process.exit(1);
  }

  const meta = getStage(stageName);
  console.log(`\x1b[35m▶ [STAGE: ${stageName.toUpperCase()}]\x1b[0m Target: \x1b[1m${featureId}\x1b[0m (${meta?.name || stageName})`);

  const result = await scaffoldStageArtifact(projectRoot, stageName, featureId);
  if (result.created) {
    console.log(`\x1b[32m✓ Created stage artifact: ${path.relative(projectRoot, result.path)}\x1b[0m`);
  } else if (result.path) {
    console.log(`ℹ Artifact already exists: ${path.relative(projectRoot, result.path)}`);
  } else {
    console.log(`ℹ ${result.reason}`);
  }

  console.log(`\x1b[36mℹ Ready to execute stage instructions. Consult .ai/prompts/${stageName}.md and agent-map.md.\x1b[0m`);
}
