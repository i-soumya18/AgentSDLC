import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { ProductKnowledgeGraph, ENTITY_TYPES, RELATIONSHIPS } from '../../src/graph/product-knowledge-graph.js';

describe('Phase 3 — Product Knowledge Graph Tests', () => {
  test('1. Node & Edge Creation: enforces canonical artifact model and relationships', () => {
    const graph = new ProductKnowledgeGraph();

    const product = graph.addNode({
      id: 'PROD-001',
      type: 'PRODUCT',
      name: 'AI Task Copilot',
      description: 'AI-native task decomposition engine',
      version: '1.0.0'
    });
    assert.equal(product.id, 'PROD-001');
    assert.equal(product.type, 'PRODUCT');

    const feature = graph.addNode({
      id: 'FEAT-001',
      type: 'FEATURE',
      name: 'Task Decomposition',
      version: '1.0.0'
    });

    const req = graph.addNode({
      id: 'REQ-001',
      type: 'REQUIREMENT',
      name: 'Tool invocation',
      version: '1.0.0'
    });

    graph.addEdge('PROD-001', 'FEAT-001', 'contains');
    graph.addEdge('FEAT-001', 'REQ-001', 'contains');

    assert.equal(graph.getAllNodes().length, 3);
    assert.equal(graph.getAllEdges().length, 2);

    // Invalid type rejection
    assert.throws(() => {
      graph.addNode({ id: 'INVALID-1', type: 'NON_EXISTENT_TYPE' });
    }, /Invalid entity type/);

    // Invalid relationship rejection
    assert.throws(() => {
      graph.addEdge('PROD-001', 'FEAT-001', 'non_existent_relation');
    }, /Invalid relationship/);
  });

  test('2. Specific Domain Queries: req -> tasks, req -> tests, feat -> reqs, task -> evidence', () => {
    const graph = new ProductKnowledgeGraph();

    graph.addNode({ id: 'FEAT-001', type: 'FEATURE', name: 'Task Ingestion' });
    graph.addNode({ id: 'REQ-001', type: 'REQUIREMENT', name: 'POST /tasks endpoint' });
    graph.addNode({ id: 'TASK-001', type: 'TASK', name: 'Implement task router' });
    graph.addNode({ id: 'TASK-002', type: 'TASK', name: 'Add payload validation' });
    graph.addNode({ id: 'TEST-001', type: 'TEST', name: 'Unit test for router' });
    graph.addNode({ id: 'EVID-001', type: 'EVIDENCE', name: 'Test execution log' });
    graph.addNode({ id: 'ADR-001', type: 'DECISION', name: 'Use native HTTP' });

    graph.addEdge('FEAT-001', 'REQ-001', 'contains');
    graph.addEdge('REQ-001', 'TASK-001', 'implemented_by');
    graph.addEdge('REQ-001', 'TASK-002', 'implemented_by');
    graph.addEdge('REQ-001', 'TEST-001', 'verified_by');
    graph.addEdge('TASK-001', 'EVID-001', 'produces');
    graph.addEdge('ADR-001', 'FEAT-001', 'affects');

    // feature -> requirements
    const reqs = graph.getRequirementsForFeature('FEAT-001');
    assert.equal(reqs.length, 1);
    assert.equal(reqs[0].id, 'REQ-001');

    // requirement -> tasks
    const tasks = graph.getTasksForRequirement('REQ-001');
    assert.equal(tasks.length, 2);
    assert.deepEqual(tasks.map(t => t.id).sort(), ['TASK-001', 'TASK-002']);

    // requirement -> tests
    const tests = graph.getTestsForRequirement('REQ-001');
    assert.equal(tests.length, 1);
    assert.equal(tests[0].id, 'TEST-001');

    // task -> evidence
    const evidence = graph.getEvidenceForTask('TASK-001');
    assert.equal(evidence.length, 1);
    assert.equal(evidence[0].id, 'EVID-001');

    // decision -> affected artifacts
    const affected = graph.getAffectedArtifactsForDecision('ADR-001');
    assert.equal(affected.length, 1);
    assert.equal(affected[0].id, 'FEAT-001');
  });

  test('3. Lineage Query: Answers "Why does this code / task exist?"', () => {
    const graph = new ProductKnowledgeGraph();

    graph.addNode({ id: 'PROD-001', type: 'PRODUCT', name: 'Pharmacy POS' });
    graph.addNode({ id: 'OUT-001', type: 'OUTCOME', name: 'Sub-second checkout' });
    graph.addNode({ id: 'FEAT-001', type: 'FEATURE', name: 'Billing' });
    graph.addNode({ id: 'REQ-001', type: 'REQUIREMENT', name: 'Tax computation' });
    graph.addNode({ id: 'TASK-001', type: 'TASK', name: 'Tax calculator function' });

    graph.addEdge('PROD-001', 'OUT-001', 'achieves');
    graph.addEdge('PROD-001', 'FEAT-001', 'contains');
    graph.addEdge('FEAT-001', 'REQ-001', 'contains');
    graph.addEdge('REQ-001', 'TASK-001', 'implemented_by');

    const lineage = graph.getLineage('TASK-001');
    assert.ok(lineage);
    assert.equal(lineage.target.id, 'TASK-001');
    assert.equal(lineage.root.id, 'PROD-001');
    assert.ok(lineage.explanation.includes('TASK-001'));
    assert.ok(lineage.explanation.includes('REQ-001'));
    assert.ok(lineage.explanation.includes('FEAT-001'));
    assert.ok(lineage.explanation.includes('PROD-001'));
  });

  test('4. Impact Analysis: Answers "What breaks if this requirement changes?"', () => {
    const graph = new ProductKnowledgeGraph();

    graph.addNode({ id: 'REQ-001', type: 'REQUIREMENT', name: 'Auth token format' });
    graph.addNode({ id: 'TASK-001', type: 'TASK', name: 'Token generator' });
    graph.addNode({ id: 'TASK-002', type: 'TASK', name: 'Token validator' });
    graph.addNode({ id: 'TEST-001', type: 'TEST', name: 'Token unit test' });
    graph.addNode({ id: 'UX-001', type: 'UX_ARTIFACT', name: 'Login screen' });

    graph.addEdge('REQ-001', 'TASK-001', 'implemented_by');
    graph.addEdge('REQ-001', 'TASK-002', 'implemented_by');
    graph.addEdge('REQ-001', 'TEST-001', 'verified_by');
    graph.addEdge('REQ-001', 'UX-001', 'represented_by');

    const impact = graph.getImpactAnalysis('REQ-001');
    assert.ok(impact);
    assert.equal(impact.source.id, 'REQ-001');
    assert.equal(impact.totalAffected, 4);
    assert.equal(impact.affectedTasks.length, 2);
    assert.equal(impact.affectedTests.length, 1);
    assert.ok(impact.affectedNodes.some(n => n.node.id === 'UX-001'));
  });

  test('5. Consistency Checks: detects broken references, dangling edges, and orphaned artifacts', () => {
    const graph = new ProductKnowledgeGraph();

    graph.addNode({ id: 'PROD-001', type: 'PRODUCT', name: 'Root Product' });
    graph.addNode({ id: 'FEAT-001', type: 'FEATURE', name: 'In-Scope Feature' });
    graph.addNode({ id: 'ORPHAN-001', type: 'DECISION', name: 'Abandoned ADR' }); // Orphan!

    graph.addEdge('PROD-001', 'FEAT-001', 'contains');
    graph.addEdge('FEAT-001', 'NON-EXISTENT-REQ', 'contains'); // Dangling edge!

    const report = graph.checkConsistency();
    assert.equal(report.valid, false);

    // Broken reference detected
    assert.equal(report.brokenReferences.length, 1);
    assert.equal(report.brokenReferences[0].to, 'NON-EXISTENT-REQ');

    // Orphan detected
    assert.equal(report.orphans.length, 1);
    assert.equal(report.orphans[0].id, 'ORPHAN-001');
  });

  test('6. Repository Harvester: scans workspace artifacts and populates connected graph', async () => {
    const graph = new ProductKnowledgeGraph();
    await graph.buildFromRepository(process.cwd());

    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();

    assert.ok(nodes.length > 5, 'Should harvest multiple nodes from repo');
    assert.ok(edges.length > 3, 'Should synthesize edges between nodes');

    // Should find Product Contract / Discovery entities
    const hasProduct = nodes.some(n => n.type === 'PRODUCT');
    const hasFeature = nodes.some(n => n.type === 'FEATURE');
    const hasRequirement = nodes.some(n => n.type === 'REQUIREMENT');
    assert.ok(hasProduct, 'Must index PRODUCT');
    assert.ok(hasFeature, 'Must index FEATURE');
    assert.ok(hasRequirement, 'Must index REQUIREMENT');
  });

  test('7. Serialization & Versioning: saves and reloads knowledge graph losslessly', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'graph-test-'));
    const filePath = path.join(tmpDir, 'knowledge-graph.json');

    const graph = new ProductKnowledgeGraph();
    graph.addNode({ id: 'PROD-001', type: 'PRODUCT', name: 'Test App', version: '2.0.0' });
    graph.addNode({ id: 'FEAT-001', type: 'FEATURE', name: 'Reporting', version: '2.0.0' });
    graph.addEdge('PROD-001', 'FEAT-001', 'contains');

    await graph.save(filePath);

    const reloaded = new ProductKnowledgeGraph();
    await reloaded.load(filePath);

    assert.equal(reloaded.getAllNodes().length, 2);
    assert.equal(reloaded.getAllEdges().length, 1);
    assert.equal(reloaded.getNode('PROD-001').version, '2.0.0');
    assert.equal(reloaded.getRequirementsForFeature ? true : false, true);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});
