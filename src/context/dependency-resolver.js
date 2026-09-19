import fs from 'node:fs/promises';
import path from 'node:path';
import { ProductKnowledgeGraph } from '../graph/product-knowledge-graph.js';
import { evaluateFileExclusion } from './filter-rules.js';

/**
 * Resolves dependencies across the 6-level context hierarchy (L0 - L5)
 * using the ProductKnowledgeGraph and static code analysis.
 */
export class DependencyResolver {
  constructor(projectRoot = process.cwd(), graph = null) {
    this.projectRoot = projectRoot;
    this.graph = graph;
  }

  /**
   * Ensures the knowledge graph is populated.
   */
  async initGraph() {
    if (!this.graph) {
      this.graph = new ProductKnowledgeGraph();
      // Try loading pre-built graph if exists, else build from repository
      const graphPath = path.join(this.projectRoot, 'graph', 'knowledge-graph.json');
      try {
        await this.graph.load(graphPath);
      } catch {
        await this.graph.buildFromRepository(this.projectRoot);
      }
    }
    return this.graph;
  }

  /**
   * Resolves a task by ID (e.g. 'TASK-001.1') across features.
   */
  async resolveTask(taskId, featureId = null) {
    const specsDir = path.join(this.projectRoot, 'specs');
    let candidateFeatures = [];

    if (featureId) {
      candidateFeatures = [featureId];
    } else {
      try {
        const entries = await fs.readdir(specsDir, { withFileTypes: true });
        candidateFeatures = entries.filter(e => e.isDirectory() && e.name.startsWith('00')).map(e => e.name);
      } catch {
        candidateFeatures = ['001-ai-task-copilot'];
      }
    }

    for (const feat of candidateFeatures) {
      const tasksFile = path.join(specsDir, feat, 'tasks.md');
      try {
        const content = await fs.readFile(tasksFile, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.includes(taskId)) {
            // Found task line
            const isCompleted = line.includes('[x]');
            const cleanTitle = line.replace(/^[-* ]+\[[ x]\]\s*/, '').replace(/\(maps to [^)]+\)/, '').trim();
            const reqMatches = line.match(/REQ-[A-Z0-9_.-]+/g) || [];

            // Extract acceptance if present on next line
            let acceptance = '';
            const lineIdx = lines.indexOf(line);
            if (lineIdx >= 0 && lines[lineIdx + 1] && lines[lineIdx + 1].includes('Acceptance:')) {
              acceptance = lines[lineIdx + 1].replace(/^[-* ]+Acceptance:\s*/i, '').trim();
            }

            return {
              id: taskId,
              feature_id: feat,
              title: cleanTitle,
              acceptance_criteria: acceptance || 'Satisfies mapped requirement criteria with deterministic tests',
              status: isCompleted ? 'completed' : 'pending',
              mapped_requirements: reqMatches,
              source_file: path.relative(this.projectRoot, tasksFile).replace(/\\/g, '/')
            };
          }
        }
      } catch {}
    }

    // Default fallback task if not found
    return {
      id: taskId,
      feature_id: featureId || '001-ai-task-copilot',
      title: `Execution of ${taskId}`,
      acceptance_criteria: 'All unit and contract tests pass',
      status: 'pending',
      mapped_requirements: ['REQ-001.1'],
      source_file: `specs/${featureId || '001-ai-task-copilot'}/tasks.md`
    };
  }

  /**
   * Resolves requirements associated with given requirement IDs or feature.
   */
  async resolveRequirements(reqIds, featureId) {
    const requirements = [];
    const specPath = path.join(this.projectRoot, 'specs', featureId, 'spec.md');

    let specText = '';
    try {
      specText = await fs.readFile(specPath, 'utf8');
    } catch {}

    for (const reqId of reqIds) {
      let description = `Requirement ${reqId} declared for ${featureId}`;
      let acceptance = 'Deterministic test verification';

      if (specText) {
        // Regex search for section around reqId
        const regex = new RegExp(`###?\\s*.*\\[?${reqId}\\]?[\\s\\S]*?(?=###|$)`, 'i');
        const match = specText.match(regex);
        if (match) {
          const block = match[0].trim();
          const firstLine = block.split('\n')[0];
          description = firstLine.replace(/^[#\s]+/, '').trim();
          const accMatch = block.match(/acceptance criteria[:\s]+([\s\S]*?)(?=\n\n|$)/i);
          if (accMatch) {
            acceptance = accMatch[1].replace(/[-*]\s+/g, '').trim();
          }
        }
      }

      requirements.push({
        id: reqId,
        description,
        acceptance_criteria: acceptance,
        reason: `Directly mapped to active vertical task slice via ${featureId}/tasks.md`
      });
    }

    return requirements;
  }

  /**
   * Resolves relevant source files for a task or feature.
   */
  async resolveSourceFiles(task, role) {
    const files = [];
    const srcDir = path.join(this.projectRoot, 'src');

    // Rule-based mapping for tasks
    if (task.id === 'TASK-001.1') {
      files.push({
        path: 'src/features/tasks/task.entity.js',
        role: 'Target Entity Implementation',
        reason: 'Direct implementation file defining the Task entity and validation constraints'
      });
      files.push({
        path: 'src/features/tasks/task.repository.js',
        role: 'Target Storage Repository',
        reason: 'Direct implementation file managing in-memory and persistence storage'
      });
    } else if (task.id === 'TASK-001.2') {
      files.push({
        path: 'src/features/tasks/task.controller.js',
        role: 'Target HTTP Controller',
        reason: 'Direct implementation file handling HTTP endpoints and RFC 7807 problem responses'
      });
      files.push({
        path: 'src/features/tasks/task.service.js',
        role: 'Business Service Layer',
        reason: 'Direct dependency invoked by task.controller.js'
      });
      files.push({
        path: 'src/features/tasks/task.entity.js',
        role: 'Domain Model',
        reason: 'Entity schema imported and validated by the service layer'
      });
    } else if (task.id === 'TASK-001.3') {
      files.push({
        path: 'src/eval/eval-runner.js',
        role: 'AI Eval Harness',
        reason: 'Execution harness validating tool decomposition benchmarks'
      });
      files.push({
        path: 'tests/evals/tool-use.jsonl',
        role: 'Evaluation Dataset',
        reason: 'Benchmark dataset containing tool-call schemas and golden ground-truth'
      });
    } else {
      // General feature file resolution
      const featureTaskDir = path.join(srcDir, 'features', 'tasks');
      try {
        const entries = await fs.readdir(featureTaskDir);
        for (const f of entries) {
          if (f.endsWith('.js')) {
            files.push({
              path: `src/features/tasks/${f}`,
              role: 'Feature Implementation',
              reason: `Source file belonging to active feature '${task.feature_id}'`
            });
          }
        }
      } catch {}
    }

    // Filter out any accidentally matched non-source or ignored files
    return files.filter(f => !evaluateFileExclusion(f.path, { activeFeature: task.feature_id }).excluded);
  }

  /**
   * Resolves relevant tests for a task or feature.
   */
  async resolveTests(task, role) {
    const tests = [];

    if (task.id === 'TASK-001.1' || task.id === 'TASK-001.2') {
      tests.push({
        path: 'tests/unit/task.test.js',
        type: 'UNIT_TEST',
        reason: 'Deterministic unit tests asserting REQ-001.1 and REQ-001.2 acceptance criteria'
      });
      tests.push({
        path: 'tests/contract/contract.test.js',
        type: 'CONTRACT_TEST',
        reason: 'Contract test verifying OpenAPI 3.1 compliance and RFC 7807 problem details'
      });
    } else if (task.id === 'TASK-001.3') {
      tests.push({
        path: 'tests/evals/tool-use.jsonl',
        type: 'AI_EVALUATION',
        reason: 'Dual-track benchmark dataset testing model tool-calling precision'
      });
    } else {
      tests.push({
        path: 'tests/unit/task.test.js',
        type: 'UNIT_TEST',
        reason: 'Primary test suite for feature verification'
      });
    }

    return tests.filter(t => !evaluateFileExclusion(t.path, { activeFeature: task.feature_id }).excluded);
  }

  /**
   * Resolves relevant artifacts (specs, contracts, UX).
   */
  async resolveArtifacts(task, role) {
    const artifacts = [];

    // 1. Feature spec
    const specFile = `specs/${task.feature_id}/spec.md`;
    artifacts.push({
      path: specFile,
      type: 'SPECIFICATION',
      reason: 'Governing functional specification declaring acceptance criteria and REQ tags'
    });

    // 2. Active OpenAPI contract
    artifacts.push({
      path: 'contracts/openapi.yaml',
      type: 'CONTRACT',
      reason: 'Active OpenAPI 3.1 REST API contract defining request/response schemas'
    });

    // 3. Product Contract (if exists)
    try {
      await fs.stat(path.join(this.projectRoot, 'product', 'product-contract.json'));
      artifacts.push({
        path: 'product/product-contract.json',
        type: 'PRODUCT_CONTRACT',
        reason: 'Cryptographically locked product scope and acceptance criteria'
      });
    } catch {}

    // 4. UX model (if exists and relevant to role)
    const uxFile = `specs/${task.feature_id}/ux.md`;
    try {
      await fs.stat(path.join(this.projectRoot, uxFile));
      artifacts.push({
        path: uxFile,
        type: 'UX_ARTIFACT',
        reason: 'Interaction states, screen flows, and 8-state interaction model'
      });
    } catch {}

    return artifacts.filter(a => !evaluateFileExclusion(a.path).excluded);
  }

  /**
   * Resolves relevant ADRs / decisions.
   */
  async resolveDecisions(task) {
    const decisions = [
      {
        id: 'ADR-0000',
        summary: 'Use Spec-Driven Development as Primary Control Law',
        status: 'ACCEPTED',
        reason: 'Governing architectural decision requiring specs and contracts before code'
      },
      {
        id: 'ADR-0003',
        summary: 'Vertical Slice Decomposition over Layered Architecture',
        status: 'ACCEPTED',
        reason: 'Governing architectural decision mandating end-to-end vertical delivery'
      }
    ];

    if (task.id === 'TASK-001.3') {
      decisions.push({
        id: 'ADR-0002',
        summary: 'Dual-Track AI Evaluation Separate from Deterministic Tests',
        status: 'ACCEPTED',
        reason: 'Governing architectural decision separating probabilistic evals from unit tests'
      });
    }

    return decisions;
  }

  /**
   * Resolves governing constraints from Constitution, Tool Policy, and Security.
   */
  resolveConstraints(role) {
    return [
      {
        id: 'CONST-ART-1',
        description: 'Primacy of Specification: No code without an approved specification and contract',
        source: '.ai/constitution.md',
        reason: 'Supreme constitutional law governing all repository development'
      },
      {
        id: 'CONST-ART-2',
        description: 'Machine-Verifiable Evidence: Task completion strictly requires test/eval logs',
        source: '.ai/constitution.md',
        reason: 'Non-negotiable requirement for passing quality gates'
      },
      {
        id: 'CONST-ART-3',
        description: 'Security & Safety by Default: Zero hardcoded credentials; enforce least privilege',
        source: '.ai/constitution.md',
        reason: 'BeyondCorp and OWASP security baseline'
      },
      {
        id: 'CONST-ART-6',
        description: 'Small Reversible Vertical Slices: Changesets must be bounded to the active task slice',
        source: '.ai/constitution.md',
        reason: 'Prevents monolithic drift and enables automated rollback'
      }
    ];
  }

  /**
   * Resolves active assumptions and risks.
   */
  async resolveAssumptionsAndRisks() {
    const assumptions = [
      {
        id: 'ASSUMP-001',
        description: 'Target runtime is Node.js v20+ with native ES modules',
        reason: 'Extracted from package.json and architecture specifications'
      }
    ];

    const knownRisks = [
      {
        id: 'RISK-001',
        severity: 'MEDIUM',
        description: 'Drift between OpenAPI specification and controller response schemas',
        mitigation: 'Automated contract test suite in tests/contract/contract.test.js',
        reason: 'Active contract drift monitoring requirement'
      }
    ];

    return { assumptions, knownRisks };
  }
}
