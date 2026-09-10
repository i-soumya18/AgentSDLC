import fs from 'node:fs/promises';
import path from 'node:path';

export async function runStatus(args) {
  const projectRoot = process.cwd();
  const specsDir = path.join(projectRoot, 'specs');

  console.log(`\n\x1b[1m\x1b[36m╔════════════════════════════════════════════════════════════════════════════╗\x1b[0m`);
  console.log(`\x1b[1m\x1b[36m║                  AGENTIC AI SDLC OS — DASHBOARD & STATUS                   ║\x1b[0m`);
  console.log(`\x1b[1m\x1b[36m╚════════════════════════════════════════════════════════════════════════════╝\x1b[0m\n`);

  // Check constitution
  let hasConstitution = false;
  try {
    await fs.access(path.join(projectRoot, '.ai', 'constitution.md'));
    hasConstitution = true;
  } catch {}

  console.log(`\x1b[1mSystem Law & Governance:\x1b[0m`);
  console.log(`  Constitution: ${hasConstitution ? '\x1b[32mActive (.ai/constitution.md)\x1b[0m' : '\x1b[31mMissing\x1b[0m'}`);
  console.log(`  Quality Gates Policy: \x1b[32mActive (.ai/quality-gates.md)\x1b[0m`);
  console.log(`  Agent Permissions: \x1b[32mLeast-Privilege Enforced (.ai/tool-policy.md)\x1b[0m\n`);

  console.log(`\x1b[1mActive Features & Specifications:\x1b[0m`);

  try {
    const entries = await fs.readdir(specsDir, { withFileTypes: true });
    const featureDirs = entries.filter(e => e.isDirectory() && e.name !== 'template');

    if (featureDirs.length === 0) {
      console.log('  (No active features found in specs/)');
    }

    for (const dir of featureDirs) {
      const fPath = path.join(specsDir, dir.name);
      const files = await fs.readdir(fPath);

      const artifacts = [
        { name: 'Spec', file: 'spec.md' },
        { name: 'Clarify', file: 'clarification.md' },
        { name: 'UX', file: 'ux.md' },
        { name: 'Arch', file: 'architecture.md' },
        { name: 'Contract', file: 'api-contract.md' },
        { name: 'Tasks', file: 'tasks.md' },
        { name: 'Verify', file: 'verification.md' }
      ];

      const stageBadges = artifacts.map(a => {
        return files.includes(a.file)
          ? `\x1b[32m[✓ ${a.name}]\x1b[0m`
          : `\x1b[90m[○ ${a.name}]\x1b[0m`;
      }).join(' ');

      console.log(`  \x1b[1m${dir.name}\x1b[0m:`);
      console.log(`    ${stageBadges}`);
    }
  } catch (err) {
    console.log(`  \x1b[31mUnable to read specs directory: ${err.message}\x1b[0m`);
  }

  console.log('\n\x1b[90mRun "eos stage <stage> <feature>" to advance a feature through the pipeline.\x1b[0m\n');
}
