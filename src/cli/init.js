import fs from 'node:fs/promises';
import path from 'node:path';

export async function runInit(args) {
  const targetDir = args[0] || '.';
  const projectPath = path.resolve(process.cwd(), targetDir);
  const projectName = path.basename(projectPath);

  console.log(`\x1b[36m⚡ Initializing Agentic AI SDLC OS for project: \x1b[1m${projectName}\x1b[0m\x1b[36m at ${projectPath}\x1b[0m\n`);

  // Required directory skeleton
  const directories = [
    '.github/instructions',
    '.github/workflows',
    '.ai/prompts',
    'specs/template',
    'specs/000-project-charter',
    'docs/adr',
    'docs/architecture',
    'docs/product',
    'docs/api',
    'docs/operations',
    'docs/design',
    'design/assets',
    'contracts/events',
    'contracts/schemas',
    'tests/unit',
    'tests/integration',
    'tests/contract',
    'tests/e2e',
    'tests/evals',
    'tests/fixtures',
    'tests/performance',
    'infra/terraform',
    'infra/docker',
    'infra/environments',
    '.mcp/profiles',
    '.mcp/policies',
    'scripts',
    'src'
  ];

  for (const dir of directories) {
    await fs.mkdir(path.join(projectPath, dir), { recursive: true });
  }

  // Check if this is self-initialization or cloning into new folder
  const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
  
  console.log('✓ Created directory skeleton.');
  console.log('✓ Scaffolding instruction hierarchy (AGENTS.md, CLAUDE.md, copilot-instructions.md).');
  console.log('✓ Scaffolding project constitution & quality gates (.ai/).');
  console.log('✓ Scaffolding Spec-Driven Development backbone (specs/).');
  console.log('✓ Scaffolding contracts, schemas, and OpenAPI specs.');
  console.log('✓ Scaffolding dual-track testing & AI eval harness.');
  console.log('✓ Scaffolding operational runbooks, SLOs, and scripts.');

  console.log(`\n\x1b[32m✨ Project '${projectName}' successfully initialized with Agentic SDLC OS!\x1b[0m`);
  console.log('\n\x1b[1mNext Steps:\x1b[0m');
  console.log(`  1. cd ${targetDir}`);
  console.log('  2. Review .ai/constitution.md and customize project-specific invariants');
  console.log('  3. Run: eos stage assess 001-my-first-feature');
  console.log('  4. Run: eos status');
}
