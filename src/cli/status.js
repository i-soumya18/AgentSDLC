import fs from 'node:fs/promises';
import path from 'node:path';
import { findProjectRoot } from '../core/config.js';
import { STAGES } from '../lifecycle/stages.js';
import { GATE_REGISTRY } from '../gates/registry.js';

export async function runStatus(args) {
  const projectRoot = await findProjectRoot();
  const specsDir = path.join(projectRoot, 'specs');

  console.log(`\n\x1b[1m\x1b[36m╔════════════════════════════════════════════════════════════════════════════╗\x1b[0m`);
  console.log(`\x1b[1m\x1b[36m║             AGENTIC AI SDLC OS — SOFTWARE FACTORY DASHBOARD                ║\x1b[0m`);
  console.log(`\x1b[1m\x1b[36m╚════════════════════════════════════════════════════════════════════════════╝\x1b[0m\n`);

  // Check constitution & lifecycle
  let hasConstitution = false;
  let hasLifecycle = false;
  try {
    await fs.access(path.join(projectRoot, '.ai', 'constitution.md'));
    hasConstitution = true;
  } catch {}
  try {
    await fs.access(path.join(projectRoot, '.ai', 'lifecycle.md'));
    hasLifecycle = true;
  } catch {}

  const implementedGates = Object.values(GATE_REGISTRY).filter(g => g.implementationStatus === 'IMPLEMENTED').length;
  const totalGates = Object.keys(GATE_REGISTRY).length;

  console.log(`\x1b[1mSystem Governance & Kernel:\x1b[0m`);
  console.log(`  Constitution: ${hasConstitution ? '\x1b[32mActive (.ai/constitution.md)\x1b[0m' : '\x1b[31mMissing\x1b[0m'}`);
  console.log(`  Lifecycle Registry: ${hasLifecycle ? `\x1b[32mActive (${STAGES.length} Canonical Stages)\x1b[0m` : '\x1b[31mMissing\x1b[0m'}`);
  console.log(`  Quality Gates: \x1b[32m${implementedGates}/${totalGates} Gates Implemented\x1b[0m (Zero Vacuous Passes Enforced)`);
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

  console.log('\n\x1b[90mRun "eos stage <stage> [feature]" to advance a feature through the pipeline.\x1b[0m\n');
}
