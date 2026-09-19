import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
  AgentContextCompiler,
  compileContext,
  resolveRole,
  ROLES,
  HIERARCHY_LEVELS,
  evaluateFileExclusion,
  filterCandidates,
  FILTER_REASONS,
  computeContextMetrics,
  estimateTokens,
  formatJson,
  formatMarkdown,
  formatPrompt,
  validateContextPack
} from '../../src/index.js';

test('Phase 4 — Agent Context Compiler Tests', async (t) => {
  const projectRoot = process.cwd();
  const compiler = new AgentContextCompiler(projectRoot);

  await t.test('1. Role Profiles: canonical definitions, aliases, and permission boundaries', () => {
    const builder = resolveRole('BUILDER');
    assert.equal(builder.id, 'BUILDER');
    assert.equal(builder.code_access, 'Writes to application source (src/) and co-located unit tests');
    assert.ok(builder.forbidden_actions.length > 0);

    // Aliases
    assert.equal(resolveRole('coding').id, 'BUILDER');
    assert.equal(resolveRole('QA').id, 'TEST');
    assert.equal(resolveRole('pm').id, 'PRODUCT');
    assert.equal(resolveRole('database').id, 'API');
    assert.equal(resolveRole('sre').id, 'RELEASE');
    assert.equal(resolveRole('drift').id, 'CONVERGENCE');

    // Unknown role throws descriptive error
    assert.throws(() => resolveRole('SPACE_EXPLORER'), /Unknown agent role/);
  });

  await t.test('2. Negative Filter Rules: rejects caches, build artifacts, VCS, and vendor code', () => {
    assert.equal(evaluateFileExclusion('node_modules/express/index.js').excluded, true);
    assert.equal(evaluateFileExclusion('node_modules/express/index.js').reason, FILTER_REASONS.VENDOR);

    assert.equal(evaluateFileExclusion('.git/HEAD').excluded, true);
    assert.equal(evaluateFileExclusion('.git/HEAD').reason, FILTER_REASONS.VCS_INTERNAL);

    assert.equal(evaluateFileExclusion('dist/bundle.js').excluded, true);
    assert.equal(evaluateFileExclusion('dist/bundle.js').reason, FILTER_REASONS.GENERATED);

    assert.equal(evaluateFileExclusion('src/app.min.js').excluded, true);
    assert.equal(evaluateFileExclusion('src/app.min.js').reason, FILTER_REASONS.GENERATED);

    assert.equal(evaluateFileExclusion('src/old_code.js.bak').excluded, true);
    assert.equal(evaluateFileExclusion('src/old_code.js.bak').reason, FILTER_REASONS.HISTORICAL);

    // Unrelated feature isolation
    assert.equal(
      evaluateFileExclusion('specs/002-other-feature/spec.md', { activeFeature: '001-ai-task-copilot' }).excluded,
      true
    );

    // Legitimate project source files are allowed
    assert.equal(evaluateFileExclusion('src/features/tasks/task.entity.js').excluded, false);
    assert.equal(evaluateFileExclusion('tests/unit/task.test.js').excluded, false);
  });

  await t.test('3. Candidate Filtering & Audit Log', () => {
    const candidates = [
      { path: 'src/features/tasks/task.entity.js', reason: 'Direct entity file' },
      { path: 'node_modules/lodash/index.js', reason: 'Third party lib' },
      { path: 'dist/app.map', reason: 'Source map' },
      { path: 'tests/unit/task.test.js', reason: 'Unit test suite' }
    ];

    const { accepted, auditLog } = filterCandidates(candidates);
    assert.equal(accepted.length, 2);
    assert.equal(accepted[0].path, 'src/features/tasks/task.entity.js');
    assert.equal(accepted[1].path, 'tests/unit/task.test.js');

    assert.equal(auditLog.length, 4);
    assert.equal(auditLog.find(a => a.item === 'node_modules/lodash/index.js').status, 'FILTERED');
    assert.equal(auditLog.find(a => a.item === 'dist/app.map').status, 'FILTERED');
    assert.equal(auditLog.find(a => a.item === 'src/features/tasks/task.entity.js').status, 'INCLUDED');
  });

  await t.test('4. Task Compilation (Backend Task TASK-001.1): compiles focused slice', async () => {
    const pack = await compiler.compile({
      task: 'TASK-001.1',
      role: 'BUILDER',
      feature: '001-ai-task-copilot'
    });

    assert.equal(pack.task_id, 'TASK-001.1');
    assert.equal(pack.target_role, 'BUILDER');
    assert.equal(pack.hierarchy_level, 'L5');
    assert.ok(pack.mission.goal.includes('TASK-001.1'));

    // Bounded source files
    const filePaths = pack.relevant_files.map(f => f.path);
    assert.ok(filePaths.includes('src/features/tasks/task.entity.js'));
    assert.ok(filePaths.includes('src/features/tasks/task.repository.js'));

    // Relevant tests
    const testPaths = pack.relevant_tests.map(t => t.path);
    assert.ok(testPaths.includes('tests/unit/task.test.js'));

    // Relevant artifacts & contracts
    const artifactPaths = pack.relevant_artifacts.map(a => a.path);
    assert.ok(artifactPaths.includes('specs/001-ai-task-copilot/spec.md'));
    assert.ok(artifactPaths.includes('contracts/openapi.yaml'));

    // Constraints & forbidden actions
    assert.ok(pack.constraints.length >= 4);
    assert.ok(pack.forbidden_actions.length >= 4);

    // Validate schema compliance
    const isValid = await validateContextPack(projectRoot, pack);
    assert.equal(isValid, true);
  });

  await t.test('5. Task Compilation (HTTP Controller Task TASK-001.2): includes service & controller', async () => {
    const pack = await compiler.compile({
      task: 'TASK-001.2',
      role: 'BUILDER'
    });

    assert.equal(pack.task_id, 'TASK-001.2');
    const filePaths = pack.relevant_files.map(f => f.path);
    assert.ok(filePaths.includes('src/features/tasks/task.controller.js'));
    assert.ok(filePaths.includes('src/features/tasks/task.service.js'));

    // Schema compliance
    const isValid = await validateContextPack(projectRoot, pack);
    assert.equal(isValid, true);
  });

  await t.test('6. Task Compilation (AI Eval Task TASK-001.3): includes eval runner and datasets', async () => {
    const pack = await compiler.compile({
      task: 'TASK-001.3',
      role: 'EVAL'
    });

    assert.equal(pack.task_id, 'TASK-001.3');
    assert.equal(pack.target_role, 'EVAL');

    const filePaths = pack.relevant_files.map(f => f.path);
    assert.ok(filePaths.includes('src/eval/eval-runner.js'));

    const testPaths = pack.relevant_tests.map(t => t.path);
    assert.ok(testPaths.includes('tests/evals/tool-use.jsonl'));

    // Governing decision for AI eval
    const decisionIds = pack.decisions.map(d => d.id);
    assert.ok(decisionIds.includes('ADR-0002'));

    // Schema compliance
    const isValid = await validateContextPack(projectRoot, pack);
    assert.equal(isValid, true);
  });

  await t.test('7. Role-Based Compilation (Security Agent): read-only access and security constraints', async () => {
    const pack = await compiler.compile({
      role: 'SECURITY',
      feature: '001-ai-task-copilot'
    });

    assert.equal(pack.target_role, 'SECURITY');
    assert.equal(pack.role.code_access, 'Read-only access to code; writes to .ai/risk-register.md and audit reports');
    assert.equal(pack.relevant_files.length, 0); // Read-only role does not receive code write slices

    // Schema compliance
    const isValid = await validateContextPack(projectRoot, pack);
    assert.equal(isValid, true);
  });

  await t.test('8. Explainability Verification: 100% of included items contain an explicit reason', async () => {
    const pack = await compiler.compile({ task: 'TASK-001.1', role: 'BUILDER' });

    for (const req of pack.requirements) {
      assert.ok(req.reason && req.reason.trim().length > 0, `Requirement ${req.id} missing reason`);
    }
    for (const art of pack.relevant_artifacts) {
      assert.ok(art.reason && art.reason.trim().length > 0, `Artifact ${art.path} missing reason`);
    }
    for (const file of pack.relevant_files) {
      assert.ok(file.reason && file.reason.trim().length > 0, `File ${file.path} missing reason`);
    }
    for (const testItem of pack.relevant_tests) {
      assert.ok(testItem.reason && testItem.reason.trim().length > 0, `Test ${testItem.path} missing reason`);
    }
    for (const dec of pack.decisions) {
      assert.ok(dec.reason && dec.reason.trim().length > 0, `Decision ${dec.id} missing reason`);
    }
    for (const c of pack.constraints) {
      assert.ok(c.reason && c.reason.trim().length > 0, `Constraint ${c.id} missing reason`);
    }
    for (const assump of pack.assumptions) {
      assert.ok(assump.reason && assump.reason.trim().length > 0, `Assumption ${assump.id} missing reason`);
    }
    for (const risk of pack.known_risks) {
      assert.ok(risk.reason && risk.reason.trim().length > 0, `Risk ${risk.id} missing reason`);
    }
  });

  await t.test('9. Context Metrics: computes token estimates, compression, and relevance scores', async () => {
    const pack = await compiler.compile({ task: 'TASK-001.1', role: 'BUILDER' });

    assert.ok(pack.metrics.total_characters > 500);
    assert.ok(pack.metrics.estimated_tokens > 100);
    assert.ok(pack.metrics.compression_ratio < 0.20, `Expected high compression, got ${pack.metrics.compression_ratio}`);
    assert.ok(pack.metrics.items_included > 5);
    assert.ok(pack.metrics.relevance_score >= 0.7);
  });

  await t.test('10. Multi-Format Rendering: JSON, Markdown, and System Prompt formats', async () => {
    // JSON format
    const jsonStr = await compiler.compile({ task: 'TASK-001.1', format: 'json' });
    assert.equal(typeof jsonStr, 'string');
    const parsed = JSON.parse(jsonStr);
    assert.equal(parsed.task_id, 'TASK-001.1');

    // Markdown format
    const mdStr = await compiler.compile({ task: 'TASK-001.1', format: 'markdown' });
    assert.ok(mdStr.includes('# Agent Context Pack: TASK-001.1'));
    assert.ok(mdStr.includes('## 1. Mission'));
    assert.ok(mdStr.includes('## 9. Context Efficiency & Relevance Metrics'));

    // Prompt format
    const promptStr = await compiler.compile({ task: 'TASK-001.1', format: 'prompt' });
    assert.ok(promptStr.includes('=== ROLE ASSIGNMENT & BOUNDED CONTEXT ==='));
    assert.ok(promptStr.includes('=== MISSION OBJECTIVE ==='));
    assert.ok(promptStr.includes('TASK-001.1'));
    assert.ok(promptStr.includes('=== STRICT FORBIDDEN ACTIONS ==='));
  });
});
