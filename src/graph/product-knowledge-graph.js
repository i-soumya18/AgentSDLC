import fs from 'node:fs/promises';
import path from 'node:path';

export const ENTITY_TYPES = [
  'PRODUCT',
  'PERSONA',
  'PROBLEM',
  'OUTCOME',
  'FEATURE',
  'REQUIREMENT',
  'UX_ARTIFACT',
  'ARCHITECTURE',
  'CONTRACT',
  'TASK',
  'TEST',
  'EVALUATION',
  'EVIDENCE',
  'DECISION',
  'ASSUMPTION',
  'CHANGE_REQUEST',
  'RELEASE'
];

export const RELATIONSHIPS = [
  'contains',
  'serves',
  'achieves',
  'implemented_by',
  'verified_by',
  'represented_by',
  'constrained_by',
  'produces',
  'affects',
  'depends_on',
  'references',
  'modifies'
];

export class ProductKnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.outEdges = new Map(); // fromId -> array of { to, relationship, metadata }
    this.inEdges = new Map();  // toId -> array of { from, relationship, metadata }
  }

  /**
   * Adds or updates a node in the knowledge graph.
   */
  addNode(node) {
    if (!node.id) throw new Error('Graph node must have an id');
    if (!node.type || !ENTITY_TYPES.includes(node.type.toUpperCase())) {
      throw new Error(`Invalid entity type '${node.type}'. Must be one of: ${ENTITY_TYPES.join(', ')}`);
    }

    const now = new Date().toISOString();
    const canonicalNode = {
      id: String(node.id).trim(),
      type: node.type.toUpperCase(),
      name: node.name || node.title || node.id,
      description: node.description || '',
      version: node.version || '1.0.0',
      status: node.status || 'active',
      parent: node.parent || null,
      dependencies: Array.isArray(node.dependencies) ? [...node.dependencies] : [],
      references: Array.isArray(node.references) ? [...node.references] : [],
      evidence: Array.isArray(node.evidence) ? [...node.evidence] : [],
      source_file: node.source_file || null,
      created_at: node.created_at || now,
      updated_at: now,
      data: node.data || {}
    };

    this.nodes.set(canonicalNode.id, canonicalNode);
    if (!this.outEdges.has(canonicalNode.id)) this.outEdges.set(canonicalNode.id, []);
    if (!this.inEdges.has(canonicalNode.id)) this.inEdges.set(canonicalNode.id, []);

    return canonicalNode;
  }

  /**
   * Retrieves a node by ID.
   */
  getNode(id) {
    return this.nodes.get(id) || null;
  }

  /**
   * Checks if a node exists.
   */
  hasNode(id) {
    return this.nodes.has(id);
  }

  /**
   * Adds a directed relationship edge between two nodes.
   */
  addEdge(fromId, toId, relationship, metadata = {}) {
    if (!RELATIONSHIPS.includes(relationship)) {
      throw new Error(`Invalid relationship '${relationship}'. Must be one of: ${RELATIONSHIPS.join(', ')}`);
    }

    if (!this.outEdges.has(fromId)) this.outEdges.set(fromId, []);
    if (!this.inEdges.has(toId)) this.inEdges.set(toId, []);

    // Avoid duplicate edges
    const existing = this.outEdges.get(fromId).find(e => e.to === toId && e.relationship === relationship);
    if (!existing) {
      const edge = { from: fromId, to: toId, relationship, metadata };
      this.outEdges.get(fromId).push(edge);
      this.inEdges.get(toId).push(edge);
    }
  }

  /**
   * Returns all outgoing edges for a node.
   */
  getOutgoing(id) {
    return this.outEdges.get(id) || [];
  }

  /**
   * Returns all incoming edges for a node.
   */
  getIncoming(id) {
    return this.inEdges.get(id) || [];
  }

  /**
   * Returns all nodes as an array.
   */
  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  /**
   * Returns all edges as an array.
   */
  getAllEdges() {
    const edges = [];
    for (const edgeList of this.outEdges.values()) {
      for (const edge of edgeList) {
        edges.push(edge);
      }
    }
    return edges;
  }

  // ==========================================
  // SPECIFIC DOMAIN QUERIES
  // ==========================================

  /**
   * requirement -> tasks
   */
  getTasksForRequirement(reqId) {
    const edges = this.getOutgoing(reqId);
    return edges
      .filter(e => e.relationship === 'implemented_by')
      .map(e => this.getNode(e.to))
      .filter(Boolean);
  }

  /**
   * requirement -> tests
   */
  getTestsForRequirement(reqId) {
    const edges = this.getOutgoing(reqId);
    return edges
      .filter(e => e.relationship === 'verified_by')
      .map(e => this.getNode(e.to))
      .filter(Boolean);
  }

  /**
   * feature -> requirements
   */
  getRequirementsForFeature(featureId) {
    const edges = this.getOutgoing(featureId);
    return edges
      .filter(e => e.relationship === 'contains')
      .map(e => this.getNode(e.to))
      .filter(Boolean);
  }

  /**
   * task -> evidence
   */
  getEvidenceForTask(taskId) {
    const edges = this.getOutgoing(taskId);
    return edges
      .filter(e => e.relationship === 'produces')
      .map(e => this.getNode(e.to))
      .filter(Boolean);
  }

  /**
   * decision -> affected artifacts
   */
  getAffectedArtifactsForDecision(decisionId) {
    const edges = this.getOutgoing(decisionId);
    return edges
      .filter(e => e.relationship === 'affects')
      .map(e => this.getNode(e.to))
      .filter(Boolean);
  }

  /**
   * artifact -> direct dependents
   */
  getDependents(artifactId) {
    const inEdges = this.getIncoming(artifactId);
    return inEdges.map(e => ({
      node: this.getNode(e.from),
      relationship: e.relationship
    })).filter(item => item.node !== null);
  }

  /**
   * Lineage: Answers "Why does this code / task / test exist?"
   * Ascends the incoming/parent links to trace back to Feature, Outcome, and Product.
   */
  getLineage(nodeId) {
    const startNode = this.getNode(nodeId);
    if (!startNode) return null;

    const chain = [startNode];
    const visited = new Set([nodeId]);
    let current = startNode;

    while (current) {
      let parentNode = null;
      let relation = '';

      // Check incoming relationships that explain existence
      const incoming = this.getIncoming(current.id);
      for (const edge of incoming) {
        if (
          edge.relationship === 'contains' ||
          edge.relationship === 'implemented_by' ||
          edge.relationship === 'verified_by' ||
          edge.relationship === 'achieves' ||
          edge.relationship === 'serves'
        ) {
          const fromNode = this.getNode(edge.from);
          if (fromNode && !visited.has(fromNode.id)) {
            parentNode = fromNode;
            relation = edge.relationship;
            break;
          }
        }
      }

      // Fallback to explicit parent field if no incoming edge matched
      if (!parentNode && current.parent && !visited.has(current.parent)) {
        parentNode = this.getNode(current.parent);
        relation = 'parent';
      }

      if (parentNode) {
        visited.add(parentNode.id);
        chain.unshift(parentNode);
        current = parentNode;
      } else {
        break;
      }
    }

    const explanation = chain.map((n, idx) => {
      return `${idx + 1}. [${n.type}] ${n.id} (${n.name})`;
    }).join(' -> ');

    return {
      target: startNode,
      root: chain[0],
      chain,
      explanation
    };
  }

  /**
   * Impact Analysis: Answers "What breaks if this requirement/feature changes?"
   * Descends downstream dependencies to identify the complete blast radius.
   */
  getImpactAnalysis(nodeId) {
    const sourceNode = this.getNode(nodeId);
    if (!sourceNode) return null;

    const affected = new Map();
    const queue = [nodeId];
    const visited = new Set([nodeId]);

    while (queue.length > 0) {
      const currId = queue.shift();
      const outgoing = this.getOutgoing(currId);

      for (const edge of outgoing) {
        // Downstream relations that get impacted
        if (
          edge.relationship === 'contains' ||
          edge.relationship === 'implemented_by' ||
          edge.relationship === 'verified_by' ||
          edge.relationship === 'represented_by' ||
          edge.relationship === 'depends_on' ||
          edge.relationship === 'constrained_by'
        ) {
          const targetNode = this.getNode(edge.to);
          if (targetNode && !visited.has(targetNode.id)) {
            visited.add(targetNode.id);
            affected.set(targetNode.id, {
              node: targetNode,
              causedBy: currId,
              relationship: edge.relationship
            });
            queue.push(targetNode.id);
          }
        }
      }
    }

    const affectedList = Array.from(affected.values());
    const affectedTasks = affectedList.filter(a => a.node.type === 'TASK').map(a => a.node);
    const affectedTests = affectedList.filter(a => a.node.type === 'TEST' || a.node.type === 'EVALUATION').map(a => a.node);

    return {
      source: sourceNode,
      totalAffected: affectedList.length,
      affectedNodes: affectedList,
      affectedTasks,
      affectedTests
    };
  }

  /**
   * Consistency & Health Checking
   * Detects broken references, dangling edges, and orphaned artifacts.
   */
  checkConsistency() {
    const brokenReferences = [];
    const orphans = [];
    const unverifiedRequirements = [];
    const unimplementedRequirements = [];

    // 1. Check broken references (edges pointing to non-existent nodes)
    for (const [fromId, edgeList] of this.outEdges.entries()) {
      if (!this.nodes.has(fromId)) {
        brokenReferences.push({ type: 'MISSING_SOURCE', from: fromId });
      }
      for (const edge of edgeList) {
        if (!this.nodes.has(edge.to)) {
          brokenReferences.push({
            type: 'DANGLING_EDGE',
            from: fromId,
            to: edge.to,
            relationship: edge.relationship
          });
        }
      }
    }

    // 2. Check orphans and requirement completeness
    for (const node of this.nodes.values()) {
      const outCount = (this.outEdges.get(node.id) || []).length;
      const inCount = (this.inEdges.get(node.id) || []).length;

      // Root PRODUCT or RELEASE can have no incoming edges
      if (outCount === 0 && inCount === 0 && node.type !== 'PRODUCT') {
        orphans.push(node);
      }

      // Check requirement verification and implementation
      if (node.type === 'REQUIREMENT') {
        const out = this.getOutgoing(node.id);
        const hasTasks = out.some(e => e.relationship === 'implemented_by');
        const hasTests = out.some(e => e.relationship === 'verified_by');

        if (!hasTasks) unimplementedRequirements.push(node);
        if (!hasTests) unverifiedRequirements.push(node);
      }
    }

    return {
      valid: brokenReferences.length === 0 && orphans.length === 0,
      brokenReferences,
      orphans,
      unverifiedRequirements,
      unimplementedRequirements
    };
  }

  // ==========================================
  // REPOSITORY HARVESTER
  // ==========================================

  /**
   * Automatically scans existing repository artifacts to construct the knowledge graph.
   */
  async buildFromRepository(projectRoot = process.cwd()) {
    // 1. Ingest Product Contract (product/product-contract.json)
    const contractPath = path.join(projectRoot, 'product', 'product-contract.json');
    let hasContract = false;
    try {
      const raw = await fs.readFile(contractPath, 'utf8');
      const contract = JSON.parse(raw);
      hasContract = true;

      // Product node
      const prodId = 'PROD-001';
      this.addNode({
        id: prodId,
        type: 'PRODUCT',
        name: contract.product.name,
        description: contract.product.description,
        version: String(contract.contract_version),
        status: contract.scope_locked ? 'locked' : 'open',
        source_file: 'product/product-contract.json'
      });

      // Personas
      (contract.users || []).forEach((u, idx) => {
        const persId = `PERS-${String(idx + 1).padStart(3, '0')}`;
        this.addNode({
          id: persId,
          type: 'PERSONA',
          name: u.persona,
          description: u.needs,
          status: u.confirmed ? 'confirmed' : 'inferred',
          source_file: 'product/users.md'
        });
        this.addEdge(prodId, persId, 'serves');
      });

      // Outcomes
      (contract.desired_outcomes || []).forEach((o, idx) => {
        const outId = `OUT-${String(idx + 1).padStart(3, '0')}`;
        this.addNode({
          id: outId,
          type: 'OUTCOME',
          name: o,
          description: o,
          source_file: 'product/outcomes.md'
        });
        this.addEdge(prodId, outId, 'achieves');
      });

      // Features
      (contract.features || []).forEach((f) => {
        this.addNode({
          id: f.id,
          type: 'FEATURE',
          name: f.name,
          description: f.description,
          status: f.status,
          source_file: 'product/product-contract.md'
        });
        this.addEdge(prodId, f.id, 'contains');
      });

      // Requirements from contract
      (contract.requirements || []).forEach((r, idx) => {
        this.addNode({
          id: r.id,
          type: 'REQUIREMENT',
          name: r.title,
          description: r.description,
          status: r.type,
          data: { acceptance_criteria: r.acceptance_criteria },
          source_file: 'product/acceptance.md'
        });

        // Map requirement to corresponding feature
        const matchingFeature = (contract.features || [])[idx] || (contract.features || [])[0];
        if (matchingFeature) {
          this.addEdge(matchingFeature.id, r.id, 'contains');
        }
      });

      // Contract node
      const contractId = 'CONTRACT-001';
      this.addNode({
        id: contractId,
        type: 'CONTRACT',
        name: `Product Contract v${contract.contract_version}`,
        description: `Cryptographic hash: ${contract.contract_hash}`,
        version: String(contract.contract_version),
        status: contract.scope_locked ? 'locked' : 'open',
        source_file: 'product/product-contract.json'
      });
      (contract.requirements || []).forEach(r => {
        this.addEdge(r.id, contractId, 'constrained_by');
      });

    } catch {
      // Contract not present or invalid
    }

    // 2. Ingest Discovery state if contract was not loaded
    if (!hasContract) {
      const discPath = path.join(projectRoot, 'product', 'discovery.json');
      try {
        const raw = await fs.readFile(discPath, 'utf8');
        const disc = JSON.parse(raw);
        const prodId = 'PROD-001';
        this.addNode({
          id: prodId,
          type: 'PRODUCT',
          name: disc.intent?.primary_goal || disc.raw_idea || 'AgentSDLC Product',
          description: disc.intent?.problem_statement || '',
          source_file: 'product/discovery.json'
        });

        (disc.users || []).forEach((u, idx) => {
          const persId = `PERS-${String(idx + 1).padStart(3, '0')}`;
          this.addNode({
            id: persId,
            type: 'PERSONA',
            name: u.persona,
            description: u.needs,
            source_file: 'product/users.md'
          });
          this.addEdge(prodId, persId, 'serves');
        });

        (disc.features || []).forEach((f, idx) => {
          const featId = `FEAT-${String(idx + 1).padStart(3, '0')}`;
          this.addNode({
            id: featId,
            type: 'FEATURE',
            name: f.name,
            description: f.description,
            source_file: 'product/discovery.json'
          });
          this.addEdge(prodId, featId, 'contains');
        });
      } catch {
        // Discovery not present
      }
    }

    // 3. Ingest Specs (specs/)
    const specsDir = path.join(projectRoot, 'specs');
    try {
      const entries = await fs.readdir(specsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const featureId = entry.name;
          const featureDir = path.join(specsDir, featureId);

          // Ingest spec.md
          try {
            const specContent = await fs.readFile(path.join(featureDir, 'spec.md'), 'utf8');
            const reqMatches = specContent.match(/REQ-[A-Z0-9_.-]+/g) || [];
            const uniqueReqs = [...new Set(reqMatches)];

            for (const req of uniqueReqs) {
              if (!this.hasNode(req)) {
                this.addNode({
                  id: req,
                  type: 'REQUIREMENT',
                  name: req,
                  description: `Declared in specs/${featureId}/spec.md`,
                  source_file: `specs/${featureId}/spec.md`
                });
              }
            }
          } catch {}

          // Ingest tasks.md
          try {
            const tasksContent = await fs.readFile(path.join(featureDir, 'tasks.md'), 'utf8');
            const taskLines = tasksContent.split('\n');

            for (const line of taskLines) {
              const taskMatch = line.match(/(TASK-[A-Z0-9_.-]+)/);
              if (taskMatch) {
                const taskId = taskMatch[1];
                const isComplete = line.includes('[x]');
                this.addNode({
                  id: taskId,
                  type: 'TASK',
                  name: taskId,
                  description: line.replace(/^[-* ]+\[[ x]\] */, '').trim(),
                  status: isComplete ? 'completed' : 'pending',
                  source_file: `specs/${featureId}/tasks.md`
                });

                // Link to requirements referenced in the line or task
                const reqMatches = line.match(/REQ-[A-Z0-9_.-]+/g) || [];
                for (const req of reqMatches) {
                  if (this.hasNode(req)) {
                    this.addEdge(req, taskId, 'implemented_by');
                  }
                }
              }
            }
          } catch {}

          // Ingest ux.md
          try {
            await fs.stat(path.join(featureDir, 'ux.md'));
            const uxId = `UX-${featureId}`;
            this.addNode({
              id: uxId,
              type: 'UX_ARTIFACT',
              name: `UX Interaction Model for ${featureId}`,
              source_file: `specs/${featureId}/ux.md`
            });
            // Connect to requirements for this feature
            const reqMatches = (await fs.readFile(path.join(featureDir, 'spec.md'), 'utf8').catch(() => ''))
              .match(/REQ-[A-Z0-9_.-]+/g) || [];
            for (const req of [...new Set(reqMatches)]) {
              if (this.hasNode(req)) {
                this.addEdge(req, uxId, 'represented_by');
              }
            }
          } catch {}
        }
      }
    } catch {}

    // 4. Ingest ADRs (docs/adr/)
    const adrDir = path.join(projectRoot, 'docs', 'adr');
    try {
      const files = await fs.readdir(adrDir);
      for (const f of files) {
        if (f.endsWith('.md') && f !== 'template.md') {
          const adrId = f.replace(/\.md$/, '').toUpperCase();
          this.addNode({
            id: adrId,
            type: 'DECISION',
            name: f.replace(/\.md$/, ''),
            source_file: `docs/adr/${f}`
          });
          // Connect decision to Architecture or Product
          if (this.hasNode('PROD-001')) {
            this.addEdge(adrId, 'PROD-001', 'affects');
          }
        }
      }
    } catch {}

    // 5. Ingest Tests (tests/unit & tests/contract)
    const testDirs = [
      path.join(projectRoot, 'tests', 'unit'),
      path.join(projectRoot, 'tests', 'contract')
    ];
    for (const tDir of testDirs) {
      try {
        const testFiles = await fs.readdir(tDir);
        for (const f of testFiles) {
          if (f.endsWith('.test.js')) {
            const testId = `TEST-${f.replace(/\.test\.js$/, '').toUpperCase()}`;
            this.addNode({
              id: testId,
              type: 'TEST',
              name: f,
              source_file: path.relative(projectRoot, path.join(tDir, f)).replace(/\\/g, '/')
            });

            // Match requirement references in test file
            try {
              const content = await fs.readFile(path.join(tDir, f), 'utf8');
              const reqMatches = content.match(/REQ-[A-Z0-9_.-]+/g) || [];
              const uniqueReqs = [...new Set(reqMatches)];
              for (const req of uniqueReqs) {
                if (this.hasNode(req)) {
                  this.addEdge(req, testId, 'verified_by');
                }
              }
              // If system test without specific REQ, link to PROD-001
              if (uniqueReqs.length === 0 && this.hasNode('PROD-001')) {
                this.addEdge('PROD-001', testId, 'verified_by');
              }
            } catch {}
          }
        }
      } catch {}
    }

    // 6. Ingest Evidence (verification.md)
    try {
      const verPath = path.join(projectRoot, 'specs', '001-ai-task-copilot', 'verification.md');
      await fs.stat(verPath);
      const evidId = 'EVID-VERIFICATION-001';
      this.addNode({
        id: evidId,
        type: 'EVIDENCE',
        name: 'Full SDLC Verification Report',
        source_file: 'specs/001-ai-task-copilot/verification.md'
      });
      // Link tasks to evidence
      for (const node of this.nodes.values()) {
        if (node.type === 'TASK') {
          this.addEdge(node.id, evidId, 'produces');
        }
      }
    } catch {}

    return this;
  }

  /**
   * Serializes the graph to JSON format conforming to schema.
   */
  toJSON() {
    return {
      version: '1.0.0',
      generated_at: new Date().toISOString(),
      nodes: this.getAllNodes(),
      edges: this.getAllEdges()
    };
  }

  /**
   * Saves graph to disk at path.
   */
  async save(filePath) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const jsonStr = JSON.stringify(this.toJSON(), null, 2);
    await fs.writeFile(filePath, jsonStr, 'utf8');
  }

  /**
   * Loads a serialized graph from disk.
   */
  async load(filePath) {
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    this.nodes.clear();
    this.outEdges.clear();
    this.inEdges.clear();

    for (const n of data.nodes || []) {
      this.addNode(n);
    }
    for (const e of data.edges || []) {
      this.addEdge(e.from, e.to, e.relationship, e.metadata);
    }
    return this;
  }
}
