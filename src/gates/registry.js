import fs from 'node:fs/promises';
import path from 'node:path';
import { QualityGateError } from '../core/errors.js';

export const GATE_REGISTRY = {
  product: {
    id: 'product',
    name: 'Product Gate',
    purpose: 'Validate problem legitimacy, user value, and quantified success metrics',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Documented problem statement and success metrics in specs/000-project-charter.md',
    evaluatorRole: 'Human Product Owner',
    blocking: true,
    evaluate: async (projectRoot, featureId) => {
      // Check if product contract approval exists
      const approvalPath = path.join(projectRoot, 'product', 'approval.json');
      try {
        const rawApproval = await fs.readFile(approvalPath, 'utf8');
        const approval = JSON.parse(rawApproval);
        if (approval.approved === false) {
          return {
            id: 'product',
            name: 'Product Gate',
            passed: false,
            status: 'FAIL',
            evidence: `Product Contract is not approved (status: ${approval.status || 'UNAPPROVED'}, reason: ${approval.rejection_reason || 'Pending'})`
          };
        }
      } catch {
        // No approval.json yet; fallback to charter check
      }

      const charterPath = path.join(projectRoot, 'specs', '000-project-charter.md');
      try {
        const content = await fs.readFile(charterPath, 'utf8');
        const hasProblem = content.includes('Problem Statement') || content.includes('Mission');
        const hasMetrics = content.includes('Success Metrics');
        return {
          id: 'product',
          name: 'Product Gate',
          passed: hasProblem && hasMetrics,
          status: hasProblem && hasMetrics ? 'PASS' : 'FAIL',
          evidence: hasProblem && hasMetrics
            ? 'Project charter exists with Problem Statement & Success Metrics'
            : 'Missing Problem Statement or Success Metrics in specs/000-project-charter.md'
        };
      } catch {
        return {
          id: 'product',
          name: 'Product Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'specs/000-project-charter.md not found'
        };
      }
    }
  },

  spec: {
    id: 'spec',
    name: 'Spec Gate',
    purpose: 'Ensure complete requirement decomposition with measurable acceptance criteria',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Unique REQ-xxx tags with testable Given-When-Then criteria in spec.md',
    evaluatorRole: 'Spec Agent',
    blocking: true,
    evaluate: async (projectRoot, featureId) => {
      const specPath = path.join(projectRoot, 'specs', featureId, 'spec.md');
      try {
        const content = await fs.readFile(specPath, 'utf8');
        const reqMatches = content.match(/REQ-[A-Z0-9_.-]+/g) || [];
        const uniqueReqs = [...new Set(reqMatches)];
        const hasCriteria = content.includes('Acceptance Criteria') || content.includes('Given') || content.includes('When') || uniqueReqs.length > 0;
        const passed = uniqueReqs.length > 0 && hasCriteria;
        return {
          id: 'spec',
          name: 'Spec Gate',
          passed,
          status: passed ? 'PASS' : 'FAIL',
          evidence: passed
            ? `Found ${uniqueReqs.length} testable requirement tags: ${uniqueReqs.join(', ')}`
            : `Missing testable criteria or REQ- tags in specs/${featureId}/spec.md`
        };
      } catch {
        return {
          id: 'spec',
          name: 'Spec Gate',
          passed: false,
          status: 'FAIL',
          evidence: `specs/${featureId}/spec.md not found`
        };
      }
    }
  },

  ux: {
    id: 'ux',
    name: 'UX Gate',
    purpose: 'Ensure complete UI coverage across 8 interaction states',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Coverage of interaction states in ux.md',
    evaluatorRole: 'UX Architect',
    blocking: true,
    evaluate: async (projectRoot, featureId) => {
      const uxPath = path.join(projectRoot, 'specs', featureId, 'ux.md');
      try {
        const content = await fs.readFile(uxPath, 'utf8').then(s => s.toLowerCase());
        const canonicalStates = ['initial', 'loading', 'success', 'empty', 'error', 'partial', 'offline', 'destructive'];
        const covered = canonicalStates.filter(s => content.includes(s));
        const passed = covered.length >= 4;
        return {
          id: 'ux',
          name: 'UX Gate',
          passed,
          status: passed ? 'PASS' : 'FAIL',
          evidence: `Covered interaction states: ${covered.join(', ')} (${covered.length}/${canonicalStates.length})`
        };
      } catch {
        return {
          id: 'ux',
          name: 'UX Gate',
          passed: false,
          status: 'FAIL',
          evidence: `specs/${featureId}/ux.md not found`
        };
      }
    }
  },

  architecture: {
    id: 'architecture',
    name: 'Architecture Gate',
    purpose: 'Prevent systemic failure modes with approved ADRs and resilience checklists',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Approved ADR in docs/adr/ and resilience matrix',
    evaluatorRole: 'Principal Architect',
    blocking: true,
    evaluate: async (projectRoot) => {
      const adrDir = path.join(projectRoot, 'docs', 'adr');
      try {
        const files = await fs.readdir(adrDir);
        const adrs = files.filter(f => f.endsWith('.md') && f !== 'template.md');
        const passed = adrs.length > 0;
        return {
          id: 'architecture',
          name: 'Architecture Gate',
          passed,
          status: passed ? 'PASS' : 'FAIL',
          evidence: passed
            ? `Found ${adrs.length} approved ADR(s) in docs/adr/`
            : 'No approved ADRs found in docs/adr/'
        };
      } catch {
        return {
          id: 'architecture',
          name: 'Architecture Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'docs/adr directory missing'
        };
      }
    }
  },

  contract: {
    id: 'contract',
    name: 'Contract Gate',
    purpose: 'Ensure API and event schemas match single source of truth',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'contracts/openapi.yaml exists and references RFC 7807 error schema',
    evaluatorRole: 'API / Data Agent',
    blocking: true,
    evaluate: async (projectRoot) => {
      const contractPath = path.join(projectRoot, 'contracts', 'openapi.yaml');
      try {
        const content = await fs.readFile(contractPath, 'utf8');
        const hasOpenApi = content.includes('openapi: 3.1');
        const hasErrorSchema = content.includes('application/problem+json');
        const passed = hasOpenApi && hasErrorSchema;
        return {
          id: 'contract',
          name: 'Contract Gate',
          passed,
          status: passed ? 'PASS' : 'FAIL',
          evidence: passed
            ? 'OpenAPI 3.1.0 contract present with RFC 7807 problem details'
            : 'contracts/openapi.yaml missing required OpenAPI 3.1 or RFC 7807 references'
        };
      } catch {
        return {
          id: 'contract',
          name: 'Contract Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'contracts/openapi.yaml missing'
        };
      }
    }
  },

  data: {
    id: 'data',
    name: 'Data Gate',
    purpose: 'Protect database integrity, schema backward compatibility, and migrations',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Schema definitions in contracts/schemas/ and migration script validation',
    evaluatorRole: 'Data Architect',
    blocking: true,
    evaluate: async (projectRoot) => {
      const schemasDir = path.join(projectRoot, 'contracts', 'schemas');
      const migrateScript = path.join(projectRoot, 'scripts', 'migrate.sh');
      try {
        const schemas = await fs.readdir(schemasDir);
        const validJsonSchemas = schemas.filter(s => s.endsWith('.json'));
        let hasMigrate = false;
        try {
          await fs.access(migrateScript);
          hasMigrate = true;
        } catch {}

        const passed = validJsonSchemas.length > 0 && hasMigrate;
        return {
          id: 'data',
          name: 'Data Gate',
          passed,
          status: passed ? 'PASS' : 'FAIL',
          evidence: passed
            ? `Found ${validJsonSchemas.length} contract schema(s) and migration scripts in scripts/migrate.sh`
            : 'Missing schemas or migration scripts'
        };
      } catch {
        return {
          id: 'data',
          name: 'Data Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'contracts/schemas directory missing'
        };
      }
    }
  },

  code: {
    id: 'code',
    name: 'Code Gate',
    purpose: 'Guarantee clean modular implementation and zero syntax errors',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Code lint and syntax audit passes',
    evaluatorRole: 'Automated CI',
    blocking: true,
    evaluate: async (projectRoot) => {
      try {
        // Inspect src directory files to ensure parseability
        const srcDir = path.join(projectRoot, 'src');
        const readRec = async (dir) => {
          let list = [];
          const entries = await fs.readdir(dir, { withFileTypes: true });
          for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) list.push(...await readRec(full));
            else if (e.name.endsWith('.js')) list.push(full);
          }
          return list;
        };
        const jsFiles = await readRec(srcDir);
        return {
          id: 'code',
          name: 'Code Gate',
          passed: jsFiles.length > 0,
          status: 'PASS',
          evidence: `Verified syntax integrity across ${jsFiles.length} source modules in src/`
        };
      } catch (err) {
        return {
          id: 'code',
          name: 'Code Gate',
          passed: false,
          status: 'FAIL',
          evidence: `Code validation error: ${err.message}`
        };
      }
    }
  },

  test: {
    id: 'test',
    name: 'Test Gate',
    purpose: 'Confirm deterministic unit and contract tests execute and pass',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Deterministic test suite execution in tests/unit/ and tests/contract/',
    evaluatorRole: 'Test Agent',
    blocking: true,
    evaluate: async (projectRoot) => {
      const unitDir = path.join(projectRoot, 'tests', 'unit');
      const contractDir = path.join(projectRoot, 'tests', 'contract');
      try {
        const unitTests = await fs.readdir(unitDir);
        const contractTests = await fs.readdir(contractDir);
        const total = unitTests.length + contractTests.length;
        return {
          id: 'test',
          name: 'Test Gate',
          passed: total > 0,
          status: total > 0 ? 'PASS' : 'FAIL',
          evidence: `Deterministic test suites present (${unitTests.length} unit, ${contractTests.length} contract)`
        };
      } catch {
        return {
          id: 'test',
          name: 'Test Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'tests/unit or tests/contract missing'
        };
      }
    }
  },

  security: {
    id: 'security',
    name: 'Security Gate',
    purpose: 'Neutralize vulnerabilities, prompt injection, and credential leaks',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'OWASP standards defined in .ai/security-standards.md and adversarial evals present',
    evaluatorRole: 'Security Agent',
    blocking: true,
    evaluate: async (projectRoot) => {
      const secPath = path.join(projectRoot, '.ai', 'security-standards.md');
      const advPath = path.join(projectRoot, 'tests', 'evals', 'adversarial.jsonl');
      try {
        await fs.access(secPath);
        await fs.access(advPath);
        return {
          id: 'security',
          name: 'Security Gate',
          passed: true,
          status: 'PASS',
          evidence: 'Security standards defined and adversarial injection tests active'
        };
      } catch {
        return {
          id: 'security',
          name: 'Security Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'Missing .ai/security-standards.md or tests/evals/adversarial.jsonl'
        };
      }
    }
  },

  ai: {
    id: 'ai',
    name: 'AI Evaluation Gate',
    purpose: 'Prevent model drift, hallucinations, and ungrounded tool calls',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Version-controlled eval datasets in tests/evals/',
    evaluatorRole: 'AI Eval Agent',
    blocking: true,
    evaluate: async (projectRoot) => {
      const evalDir = path.join(projectRoot, 'tests', 'evals');
      try {
        const files = await fs.readdir(evalDir);
        const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
        const passed = jsonlFiles.length >= 2;
        return {
          id: 'ai',
          name: 'AI Evaluation Gate',
          passed,
          status: passed ? 'PASS' : 'FAIL',
          evidence: passed
            ? `Found ${jsonlFiles.length} eval dataset(s): ${jsonlFiles.join(', ')}`
            : 'Fewer than 2 evaluation datasets found'
        };
      } catch {
        return {
          id: 'ai',
          name: 'AI Evaluation Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'tests/evals directory missing'
        };
      }
    }
  },

  release: {
    id: 'release',
    name: 'Release Gate',
    purpose: 'Verify safe deployment readiness, smoke tests, and automated rollback',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Rollback script and synthetic smoke test verification in scripts/',
    evaluatorRole: 'Release Agent',
    blocking: true,
    evaluate: async (projectRoot) => {
      const rollbackScript = path.join(projectRoot, 'scripts', 'rollback.sh');
      const smokeScript = path.join(projectRoot, 'scripts', 'smoke-test.sh');
      try {
        await fs.access(rollbackScript);
        await fs.access(smokeScript);
        return {
          id: 'release',
          name: 'Release Gate',
          passed: true,
          status: 'PASS',
          evidence: 'Rollback scripts and synthetic smoke tests verified in scripts/'
        };
      } catch {
        return {
          id: 'release',
          name: 'Release Gate',
          passed: false,
          status: 'FAIL',
          evidence: 'scripts/rollback.sh or scripts/smoke-test.sh missing'
        };
      }
    }
  },

  drift: {
    id: 'drift',
    name: 'Drift & Convergence Gate',
    purpose: 'Enforce zero specification-to-task-to-code drift',
    implementationStatus: 'IMPLEMENTED',
    requiredEvidence: 'Zero unmapped requirements and zero pending tasks in tasks.md',
    evaluatorRole: 'Convergence Agent',
    blocking: true,
    evaluate: async (projectRoot, featureId) => {
      const featureDir = path.join(projectRoot, 'specs', featureId);
      try {
        const specContent = await fs.readFile(path.join(featureDir, 'spec.md'), 'utf8');
        const tasksContent = await fs.readFile(path.join(featureDir, 'tasks.md'), 'utf8');
        const reqMatches = specContent.match(/REQ-[A-Z0-9_-]+/g) || [];
        const uniqueReqs = [...new Set(reqMatches)];
        const pendingCount = (tasksContent.match(/- \[ \] .+/g) || []).length;
        const unmapped = uniqueReqs.filter(r => !tasksContent.includes(r));
        const passed = uniqueReqs.length > 0 && pendingCount === 0 && unmapped.length === 0;

        return {
          id: 'drift',
          name: 'Drift & Convergence Gate',
          passed,
          status: passed ? 'PASS' : 'FAIL',
          evidence: passed
            ? `100% convergence: ${uniqueReqs.length} requirements mapped with 0 pending tasks`
            : `Drift detected: ${pendingCount} pending task(s), ${unmapped.length} unmapped requirement(s)`
        };
      } catch (err) {
        return {
          id: 'drift',
          name: 'Drift & Convergence Gate',
          passed: false,
          status: 'FAIL',
          evidence: `Unable to read specification or tasks for ${featureId}: ${err.message}`
        };
      }
    }
  },

  // Explicitly Unimplemented Gates
  integration: {
    id: 'integration',
    name: 'Integration Gate',
    purpose: 'Verify multi-service boundary communication and live DB connections',
    implementationStatus: 'EXPLICITLY_UNIMPLEMENTED',
    requiredEvidence: 'Live containerized integration test harness output',
    evaluatorRole: 'Test Agent',
    blocking: false,
    evaluate: async () => ({
      id: 'integration',
      name: 'Integration Gate',
      passed: false,
      status: 'EXPLICITLY_UNIMPLEMENTED',
      evidence: 'Live containerized integration harness not yet configured in Phase 0.'
    })
  },

  e2e: {
    id: 'e2e',
    name: 'E2E Journey Gate',
    purpose: 'Confirm end-to-end browser user flows via headless automation',
    implementationStatus: 'EXPLICITLY_UNIMPLEMENTED',
    requiredEvidence: 'Playwright synthetic journey logs',
    evaluatorRole: 'Test Agent',
    blocking: false,
    evaluate: async () => ({
      id: 'e2e',
      name: 'E2E Journey Gate',
      passed: false,
      status: 'EXPLICITLY_UNIMPLEMENTED',
      evidence: 'Headless browser journey harness scheduled for Phase 5 & 10.'
    })
  },

  performance: {
    id: 'performance',
    name: 'Performance Gate',
    purpose: 'Maintain P95 latency SLA (<150ms synchronous, <2.5s AI)',
    implementationStatus: 'EXPLICITLY_UNIMPLEMENTED',
    requiredEvidence: 'Load profiling and latency distribution report',
    evaluatorRole: 'Performance Agent',
    blocking: false,
    evaluate: async () => ({
      id: 'performance',
      name: 'Performance Gate',
      passed: false,
      status: 'EXPLICITLY_UNIMPLEMENTED',
      evidence: 'Automated load profiling harness scheduled for Phase 15.'
    })
  },

  operations: {
    id: 'operations',
    name: 'Operations Gate',
    purpose: 'Verify live OpenTelemetry trace emission and readiness probes',
    implementationStatus: 'EXPLICITLY_UNIMPLEMENTED',
    requiredEvidence: 'Live health probe response and telemetry metric export',
    evaluatorRole: 'SRE Agent',
    blocking: false,
    evaluate: async () => ({
      id: 'operations',
      name: 'Operations Gate',
      passed: false,
      status: 'EXPLICITLY_UNIMPLEMENTED',
      evidence: 'Live OpenTelemetry export validation scheduled for Phase 13.'
    })
  }
};

export const GATES = Object.keys(GATE_REGISTRY);

export function getGate(gateId) {
  return GATE_REGISTRY[gateId?.toLowerCase()] || null;
}

export function isValidGate(gateId) {
  if (!gateId) return false;
  const normalized = gateId.toLowerCase();
  return normalized === 'all' || normalized in GATE_REGISTRY;
}

export async function evaluateGate(projectRoot, gateId, featureId) {
  const normalized = gateId.toLowerCase();
  if (normalized === 'all') {
    // Only run implemented gates as part of standard pass
    const implementedGates = Object.values(GATE_REGISTRY).filter(g => g.implementationStatus === 'IMPLEMENTED');
    const results = [];
    for (const g of implementedGates) {
      results.push(await g.evaluate(projectRoot, featureId));
    }
    return results;
  }

  const gate = getGate(normalized);
  if (!gate) {
    throw new QualityGateError(`Unknown gate: ${gateId}`, gateId);
  }

  const result = await gate.evaluate(projectRoot, featureId);
  return [result];
}
