import path from 'node:path';
import { ProductKnowledgeGraph } from '../graph/product-knowledge-graph.js';

export async function runGraph(args = []) {
  const projectRoot = process.cwd();
  const graph = new ProductKnowledgeGraph();
  await graph.buildFromRepository(projectRoot);

  const subCommand = args[0];
  const targetId = args[1];

  // 1. Lineage: "Why does this exist?"
  if (subCommand === 'lineage') {
    if (!targetId) {
      console.error(`\x1b[31mError: Target artifact ID required.\x1b[0m\nUsage: eos graph lineage <id>`);
      process.exit(1);
    }
    const lineage = graph.getLineage(targetId);
    if (!lineage) {
      console.error(`\x1b[31mArtifact '${targetId}' not found in knowledge graph.\x1b[0m`);
      process.exit(1);
    }
    console.log(`\n🧭 [KNOWLEDGE GRAPH LINEAGE] Why does '${targetId}' exist?\n`);
    console.log(`Target: [${lineage.target.type}] ${lineage.target.name}`);
    console.log(`Root:   [${lineage.root.type}] ${lineage.root.name}\n`);
    console.log(`Justification Path:`);
    lineage.chain.forEach((node, idx) => {
      const indent = '  '.repeat(idx);
      const prefix = idx === lineage.chain.length - 1 ? '└──' : '├──';
      console.log(`${indent}${prefix} [${node.type}] ${node.id}: ${node.name}`);
    });
    console.log(`\nSummary: ${lineage.explanation}\n`);
    return;
  }

  // 2. Impact Analysis: "What breaks if this changes?"
  if (subCommand === 'impact') {
    if (!targetId) {
      console.error(`\x1b[31mError: Target artifact ID required.\x1b[0m\nUsage: eos graph impact <id>`);
      process.exit(1);
    }
    const impact = graph.getImpactAnalysis(targetId);
    if (!impact) {
      console.error(`\x1b[31mArtifact '${targetId}' not found in knowledge graph.\x1b[0m`);
      process.exit(1);
    }
    console.log(`\n💥 [IMPACT ANALYSIS / BLAST RADIUS] What breaks if '${targetId}' changes?\n`);
    console.log(`Source: [${impact.source.type}] ${impact.source.id} (${impact.source.name})`);
    console.log(`Total Affected Entities: ${impact.totalAffected}`);
    console.log(`Directly Impacted Tasks: ${impact.affectedTasks.length}`);
    console.log(`Directly Impacted Tests: ${impact.affectedTests.length}\n`);

    if (impact.affectedNodes.length > 0) {
      console.log(`Affected Downstream Entities:`);
      impact.affectedNodes.forEach(({ node, causedBy, relationship }) => {
        console.log(`  • [${node.type}] ${node.id} (${node.name}) via '${relationship}' from ${causedBy}`);
      });
      console.log();
    } else {
      console.log(`  No downstream dependencies found. Safe to modify in isolation.\n`);
    }
    return;
  }

  // 3. Consistency check: Broken references and orphans
  if (subCommand === 'check') {
    console.log(`\n🔍 [KNOWLEDGE GRAPH CONSISTENCY CHECK]\n`);
    const check = graph.checkConsistency();
    console.log(`Total Nodes: ${graph.getAllNodes().length}`);
    console.log(`Total Edges: ${graph.getAllEdges().length}`);
    console.log(`Broken References: ${check.brokenReferences.length}`);
    console.log(`Orphaned Nodes: ${check.orphans.length}`);
    console.log(`Unverified Requirements: ${check.unverifiedRequirements.length}`);
    console.log(`Unimplemented Requirements: ${check.unimplementedRequirements.length}\n`);

    if (check.brokenReferences.length > 0) {
      console.log(`\x1b[31mBroken References:\x1b[0m`);
      check.brokenReferences.forEach(b => console.log(`  • ${b.from} -> ${b.to} (${b.relationship})`));
    }
    if (check.orphans.length > 0) {
      console.log(`\x1b[33mOrphaned Artifacts:\x1b[0m`);
      check.orphans.forEach(o => console.log(`  • [${o.type}] ${o.id}: ${o.name}`));
    }

    if (check.valid) {
      console.log(`✓ GRAPH CONSISTENCY PASSED: Zero broken references and zero orphans.\n`);
    } else {
      console.log(`⚠ Inconsistencies detected in knowledge graph.\n`);
    }
    return;
  }

  // 4. Query node
  if (subCommand === 'query') {
    if (!targetId) {
      console.error(`\x1b[31mError: Target artifact ID required.\x1b[0m\nUsage: eos graph query <id>`);
      process.exit(1);
    }
    const node = graph.getNode(targetId);
    if (!node) {
      console.error(`\x1b[31mArtifact '${targetId}' not found.\x1b[0m`);
      process.exit(1);
    }
    console.log(`\n📦 [ARTIFACT ENTITY QUERY: ${node.id}]\n`);
    console.log(`  Type:        ${node.type}`);
    console.log(`  Name:        ${node.name}`);
    console.log(`  Status:      ${node.status}`);
    console.log(`  Version:     ${node.version}`);
    console.log(`  Source File: ${node.source_file || 'N/A'}`);
    console.log(`  Created At:  ${node.created_at}`);

    const out = graph.getOutgoing(node.id);
    if (out.length > 0) {
      console.log(`\nOutgoing Relationships:`);
      out.forEach(e => console.log(`  ├── ${e.relationship} ──> [${graph.getNode(e.to)?.type || 'UNKNOWN'}] ${e.to}`));
    }

    const inc = graph.getIncoming(node.id);
    if (inc.length > 0) {
      console.log(`\nIncoming Relationships:`);
      inc.forEach(e => console.log(`  └── ${e.relationship} <── [${graph.getNode(e.from)?.type || 'UNKNOWN'}] ${e.from}`));
    }
    console.log();
    return;
  }

  // Default: Build, save, and display summary
  const graphFile = path.join(projectRoot, 'graph', 'knowledge-graph.json');
  await graph.save(graphFile);

  const nodes = graph.getAllNodes();
  const edges = graph.getAllEdges();

  // Group by type
  const typeCounts = {};
  nodes.forEach(n => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });

  console.log(`\n🕸️ [PRODUCT KNOWLEDGE GRAPH GENERATED]`);
  console.log(`Persisted to: graph/knowledge-graph.json\n`);
  console.log(`Total Entities: \x1b[1m\x1b[36m${nodes.length}\x1b[0m | Total Relationships: \x1b[1m\x1b[36m${edges.length}\x1b[0m\n`);

  console.log(`Entity Inventory:`);
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  • ${type.padEnd(16)}: ${count}`);
  });

  console.log(`\nAvailable Queries:`);
  console.log(`  eos graph lineage <id>   Trace why an artifact/task exists up to root product`);
  console.log(`  eos graph impact <id>    Determine downstream blast radius if requirement changes`);
  console.log(`  eos graph query <id>     View complete node details and bidirectional edges`);
  console.log(`  eos graph check          Audit graph for broken references or orphans\n`);
}
