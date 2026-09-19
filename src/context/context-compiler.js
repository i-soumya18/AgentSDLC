import path from 'node:path';
import { resolveRole, HIERARCHY_LEVELS } from './role-profiles.js';
import { filterCandidates, evaluateFileExclusion } from './filter-rules.js';
import { DependencyResolver } from './dependency-resolver.js';
import { computeContextMetrics } from './metrics.js';
import { formatJson, formatMarkdown, formatPrompt } from './formatter.js';
import { validateSchema } from '../artifacts/validator.js';

export class AgentContextCompiler {
  constructor(projectRoot = process.cwd(), options = {}) {
    this.projectRoot = projectRoot;
    this.resolver = new DependencyResolver(projectRoot);
    this.repoBaselineChars = options.repoBaselineChars || 250000;
  }

  /**
   * Compiles the minimum sufficient context pack for a given task and/or role.
   *
   * @param {object} params
   * @param {string} [params.task] - Task identifier (e.g. 'TASK-001.1')
   * @param {string} [params.role] - Agent role name or alias
   * @param {string} [params.feature] - Feature directory name
   * @param {string} [params.format='object'] - 'object' | 'json' | 'markdown' | 'prompt'
   * @returns {Promise<object|string>} Compiled Context Pack
   */
  async compile(params = {}) {
    const roleProfile = resolveRole(params.role || 'BUILDER');
    const featureId = params.feature || '001-ai-task-copilot';

    let resolvedTask = null;
    if (params.task) {
      resolvedTask = await this.resolver.resolveTask(params.task, featureId);
    } else {
      resolvedTask = {
        id: null,
        feature_id: featureId,
        title: `Role execution for ${roleProfile.name}`,
        acceptance_criteria: 'Satisfy assigned role responsibilities with machine-verifiable evidence',
        status: 'active',
        mapped_requirements: ['REQ-001.1', 'REQ-001.2']
      };
    }

    const auditLog = [];

    // 1. Mission determination
    const mission = {
      goal: resolvedTask.id
        ? `Deliver vertical slice ${resolvedTask.id}: ${resolvedTask.title}`
        : `Execute ${roleProfile.name} responsibilities for ${featureId}`,
      summary: resolvedTask.acceptance_criteria,
      deliverables: [
        resolvedTask.id ? `Implemented code and passing tests for ${resolvedTask.id}` : `Role output for ${roleProfile.name}`,
        'Machine-verifiable evidence logs confirming quality gates pass'
      ]
    };

    // 2. Requirements resolution
    let requirements = [];
    if (resolvedTask.mapped_requirements && resolvedTask.mapped_requirements.length > 0) {
      requirements = await this.resolver.resolveRequirements(resolvedTask.mapped_requirements, featureId);
    }

    // 3. Relevant Artifacts
    const rawArtifacts = await this.resolver.resolveArtifacts(resolvedTask, roleProfile);
    const { accepted: relevantArtifacts, auditLog: artifactAudit } = filterCandidates(rawArtifacts, {
      activeFeature: featureId
    });
    auditLog.push(...artifactAudit);

    // 4. Relevant Source Files (bounded to role & task)
    let relevantFiles = [];
    const allowsSourceAllocation =
      !roleProfile.code_access.startsWith('Read-only') &&
      (roleProfile.code_access.includes('src/') || ['BUILDER', 'TEST', 'EVAL'].includes(roleProfile.id));

    if (allowsSourceAllocation) {
      const rawFiles = await this.resolver.resolveSourceFiles(resolvedTask, roleProfile);
      const { accepted: filteredFiles, auditLog: fileAudit } = filterCandidates(rawFiles, {
        activeFeature: featureId
      });
      relevantFiles = filteredFiles;
      auditLog.push(...fileAudit);
    }

    // 5. Relevant Tests
    const rawTests = await this.resolver.resolveTests(resolvedTask, roleProfile);
    const { accepted: relevantTests, auditLog: testAudit } = filterCandidates(rawTests, {
      activeFeature: featureId
    });
    auditLog.push(...testAudit);

    // 6. Governing Decisions (ADRs)
    const decisions = await this.resolver.resolveDecisions(resolvedTask);

    // 7. Governing System Constraints
    const constraints = this.resolver.resolveConstraints(roleProfile);

    // 8. Assumptions and Known Risks
    const { assumptions, knownRisks } = await this.resolver.resolveAssumptionsAndRisks();

    // 9. Hierarchy Level: Pick maximum level applicable
    let hierarchyLevel = 'L5';
    if (roleProfile.id === 'PRODUCT') hierarchyLevel = 'L1';
    else if (roleProfile.id === 'ARCHITECT') hierarchyLevel = 'L2';
    else if (roleProfile.id === 'SPEC' || roleProfile.id === 'UX') hierarchyLevel = 'L3';
    else if (roleProfile.id === 'PLANNER') hierarchyLevel = 'L4';

    // 10. Forbidden Actions
    const forbiddenActions = [...roleProfile.forbidden_actions];

    // Assemble Raw Pack
    const contextPack = {
      version: '1.0.0',
      generated_at: new Date().toISOString(),
      task_id: resolvedTask.id,
      target_role: roleProfile.id,
      hierarchy_level: hierarchyLevel,
      mission,
      role: {
        name: roleProfile.name,
        code_access: roleProfile.code_access,
        authority: roleProfile.authority,
        primary_focus: roleProfile.primary_focus
      },
      constraints,
      requirements,
      relevant_artifacts: relevantArtifacts,
      relevant_files: relevantFiles,
      relevant_tests: relevantTests,
      decisions,
      assumptions,
      known_risks: knownRisks,
      forbidden_actions: forbiddenActions,
      audit_log: auditLog
    };

    // 11. Compute Metrics
    contextPack.metrics = computeContextMetrics(contextPack, this.repoBaselineChars);

    // 12. Format Output
    const format = (params.format || 'object').toLowerCase();
    switch (format) {
      case 'json':
        return formatJson(contextPack, params.pretty !== false);
      case 'markdown':
      case 'md':
        return formatMarkdown(contextPack, {
          showExplain: params.showExplain !== false,
          showMetrics: params.showMetrics !== false
        });
      case 'prompt':
        return formatPrompt(contextPack);
      case 'object':
      default:
        return contextPack;
    }
  }
}

/**
 * Convenience helper to compile a context pack.
 */
export async function compileContext(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const compiler = new AgentContextCompiler(projectRoot, options);
  return compiler.compile(options);
}
