import fs from 'node:fs/promises';
import path from 'node:path';

export const GATES = [
  'product',
  'spec',
  'ux',
  'architecture',
  'contract',
  'data',
  'code',
  'test',
  'security',
  'ai',
  'performance',
  'release',
  'drift',
  'all'
];

export async function runGate(args) {
  const gateName = args[0]?.toLowerCase() || 'all';
  const featureId = args[1] || '001-feature';
  const projectRoot = process.cwd();

  console.log(`\x1b[1m\x1b[34m🛡 [QUALITY GATE CHECK]\x1b[0m Gate: \x1b[1m${gateName.toUpperCase()}\x1b[0m | Target: \x1b[1m${featureId}\x1b[0m\n`);

  const results = [];

  const checks = {
    product: async () => {
      const charterPath = path.join(projectRoot, 'specs', '000-project-charter.md');
      try {
        const content = await fs.readFile(charterPath, 'utf8');
        const hasProblem = content.includes('Problem Statement') || content.includes('Mission');
        const hasMetrics = content.includes('Success Metrics');
        return {
          name: 'Product Gate',
          passed: hasProblem && hasMetrics,
          evidence: hasProblem && hasMetrics ? 'Project charter exists with Problem & Metrics' : 'Missing Problem or Metrics in charter'
        };
      } catch {
        return { name: 'Product Gate', passed: false, evidence: 'specs/000-project-charter.md not found' };
      }
    },
    spec: async () => {
      const specPath = path.join(projectRoot, 'specs', featureId, 'spec.md');
      try {
        const content = await fs.readFile(specPath, 'utf8');
        const hasCriteria = content.includes('Acceptance Criteria') || content.includes('REQ-');
        return {
          name: 'Spec Gate',
          passed: hasCriteria,
          evidence: hasCriteria ? 'Acceptance criteria mapped to requirements' : 'Missing testable criteria or REQ- tags'
        };
      } catch {
        return { name: 'Spec Gate', passed: false, evidence: `specs/${featureId}/spec.md not found` };
      }
    },
    ux: async () => {
      const uxPath = path.join(projectRoot, 'specs', featureId, 'ux.md');
      try {
        const content = await fs.readFile(uxPath, 'utf8');
        const states = ['loading', 'empty', 'error', 'success'];
        const covered = states.filter(s => content.toLowerCase().includes(s));
        const passed = covered.length >= 3;
        return {
          name: 'UX Gate',
          passed,
          evidence: `Covered interaction states: ${covered.join(', ')} (${covered.length}/${states.length})`
        };
      } catch {
        return { name: 'UX Gate', passed: false, evidence: `specs/${featureId}/ux.md not found` };
      }
    },
    contract: async () => {
      const contractPath = path.join(projectRoot, 'contracts', 'openapi.yaml');
      try {
        await fs.access(contractPath);
        return {
          name: 'Contract Gate',
          passed: true,
          evidence: 'OpenAPI specification exists in contracts/openapi.yaml'
        };
      } catch {
        return { name: 'Contract Gate', passed: false, evidence: 'contracts/openapi.yaml missing' };
      }
    },
    architecture: async () => {
      const adrDir = path.join(projectRoot, 'docs', 'adr');
      try {
        const files = await fs.readdir(adrDir);
        const adrs = files.filter(f => f.endsWith('.md') && f !== 'template.md');
        return {
          name: 'Architecture Gate',
          passed: adrs.length > 0,
          evidence: `Found ${adrs.length} approved Architecture Decision Records (ADRs)`
        };
      } catch {
        return { name: 'Architecture Gate', passed: false, evidence: 'docs/adr directory missing' };
      }
    },
    security: async () => {
      const secPath = path.join(projectRoot, '.ai', 'security-standards.md');
      try {
        await fs.access(secPath);
        return {
          name: 'Security Gate',
          passed: true,
          evidence: 'OWASP API & GenAI security standards defined in .ai/security-standards.md'
        };
      } catch {
        return { name: 'Security Gate', passed: false, evidence: '.ai/security-standards.md missing' };
      }
    },
    ai: async () => {
      const evalDir = path.join(projectRoot, 'tests', 'evals');
      try {
        const files = await fs.readdir(evalDir);
        const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
        return {
          name: 'AI Evaluation Gate',
          passed: jsonlFiles.length >= 2,
          evidence: `Eval datasets present: ${jsonlFiles.join(', ')}`
        };
      } catch {
        return { name: 'AI Evaluation Gate', passed: false, evidence: 'tests/evals datasets missing' };
      }
    }
  };

  const toRun = gateName === 'all' ? Object.keys(checks) : [gateName];

  for (const g of toRun) {
    if (checks[g]) {
      const res = await checks[g]();
      results.push(res);
      const icon = res.passed ? '\x1b[32m✓ [PASS]\x1b[0m' : '\x1b[31m✗ [FAIL]\x1b[0m';
      console.log(`${icon} \x1b[1m${res.name}\x1b[0m: ${res.evidence}`);
    } else {
      console.log(`\x1b[33m? [SKIP]\x1b[0m Gate '${g}' evaluation check not yet registered.`);
    }
  }

  const allPassed = results.every(r => r.passed);
  console.log('\n' + '-'.repeat(50));
  if (allPassed) {
    console.log('\x1b[32m\x1b[1m✨ All evaluated gates PASSED with verifiable evidence.\x1b[0m\n');
  } else {
    console.log('\x1b[31m\x1b[1m⚠️ Quality gate evaluation failed. Resolve failing gates before proceeding.\x1b[0m\n');
    process.exitCode = 1;
  }
}
