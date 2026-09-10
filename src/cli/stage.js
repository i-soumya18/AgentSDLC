import fs from 'node:fs/promises';
import path from 'node:path';

export const STAGES = [
  'assess',
  'constitution',
  'specify',
  'clarify',
  'design',
  'architect',
  'contract',
  'plan',
  'tasks',
  'implement',
  'verify',
  'review',
  'security',
  'eval',
  'release',
  'observe',
  'converge'
];

export async function runStage(args) {
  const stageName = args[0]?.toLowerCase();
  const featureId = args[1] || '001-feature';

  if (!stageName || !STAGES.includes(stageName)) {
    console.error(`\x1b[31mInvalid or missing stage name.\x1b[0m`);
    console.log(`\x1b[1mAvailable stages in execution order:\x1b[0m\n  ${STAGES.join(' -> ')}`);
    process.exit(1);
  }

  const projectRoot = process.cwd();
  const featureDir = path.join(projectRoot, 'specs', featureId);
  await fs.mkdir(featureDir, { recursive: true });

  console.log(`\x1b[35m▶ [STAGE: ${stageName.toUpperCase()}]\x1b[0m Target: \x1b[1m${featureId}\x1b[0m`);

  // Define required artifact per stage
  const stageArtifacts = {
    assess: 'assessment.md',
    specify: 'spec.md',
    clarify: 'clarification.md',
    design: 'ux.md',
    architect: 'architecture.md',
    contract: 'api-contract.md',
    plan: 'plan.md',
    tasks: 'tasks.md',
    verify: 'verification.md',
    review: 'review.md',
    security: 'security-review.md',
    eval: 'eval-report.md',
    release: 'release-checklist.md',
    observe: 'observability-plan.md',
    converge: 'drift-analysis.md'
  };

  const artifactFile = stageArtifacts[stageName];
  if (artifactFile) {
    const targetFile = path.join(featureDir, artifactFile);
    try {
      await fs.access(targetFile);
      console.log(`ℹ Artifact already exists: specs/${featureId}/${artifactFile}`);
    } catch {
      // Create skeleton from template or generate standard artifact skeleton
      const templatePath = path.join(projectRoot, 'specs', 'template', artifactFile);
      let content = '';
      try {
        content = await fs.readFile(templatePath, 'utf8');
      } catch {
        content = `# ${stageName.toUpperCase()} — ${featureId}\n\n**Feature ID:** ${featureId}\n**Stage:** ${stageName}\n**Timestamp:** ${new Date().toISOString()}\n\n## Summary\n\n## Acceptance Criteria & Evidence\n`;
      }
      await fs.writeFile(targetFile, content);
      console.log(`\x1b[32m✓ Created stage artifact: specs/${featureId}/${artifactFile}\x1b[0m`);
    }
  }

  console.log(`\x1b[36mℹ Ready to execute stage instructions. Consult .ai/prompts/${stageName}.md and agent-map.md.\x1b[0m`);
}
