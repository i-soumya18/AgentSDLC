/**
 * Canonical Agent Role Profiles & Bounded Context Specifications.
 *
 * Defines the operational boundaries, permissions, required hierarchy levels,
 * and constraint models for each specialized engineering agent.
 */

export const HIERARCHY_LEVELS = {
  L0: { id: 'L0', name: 'Organization', description: 'System laws, constitution, quality gates, and tool policies' },
  L1: { id: 'L1', name: 'Product', description: 'Product contract, charter, business outcomes, and personas' },
  L2: { id: 'L2', name: 'System', description: 'System context, C4 architecture, ADRs, and container models' },
  L3: { id: 'L3', name: 'Feature', description: 'Feature specifications (REQ-xxx), UX interaction flows, and domain models' },
  L4: { id: 'L4', name: 'Task', description: 'Granular vertical slice (TASK-xxx), slice dependencies, and acceptance criteria' },
  L5: { id: 'L5', name: 'Execution', description: 'Direct implementation source files, targeted unit/contract tests, and fixtures' }
};

export const ROLES = {
  PRODUCT: {
    id: 'PRODUCT',
    name: 'Product Agent',
    primary_focus: 'Problem statement, target user personas, market alternatives, and quantifiable business outcomes',
    code_access: 'Read-only',
    authority: 'Advisory; submits charter/assessment for human review',
    default_hierarchy: ['L0', 'L1'],
    allowed_artifact_types: ['PRODUCT', 'PERSONA', 'PROBLEM', 'OUTCOME'],
    forbidden_actions: [
      'Must never write or modify application source code (src/)',
      'Must never modify active database migrations or schema files',
      'Must never execute production deployments'
    ]
  },
  SPEC: {
    id: 'SPEC',
    name: 'Spec Agent',
    primary_focus: 'Translate product intent into unambiguous specifications (spec.md) with explicit REQ-xxx tags and acceptance criteria',
    code_access: 'Writes only to specs/',
    authority: 'Human Gate required for approval',
    default_hierarchy: ['L0', 'L1', 'L2', 'L3'],
    allowed_artifact_types: ['REQUIREMENT', 'FEATURE', 'UX_ARTIFACT'],
    forbidden_actions: [
      'Must never write implementation code directly in src/',
      'Must never approve own specifications without Human Gate signoff',
      'Must never delete historical REQ tags without formal deprecation'
    ]
  },
  CRITIC: {
    id: 'CRITIC',
    name: 'Requirements Critic',
    primary_focus: 'Hostile review of specifications: find contradictions, missing error states, race conditions, and attack vectors',
    code_access: 'Writes only to specs/<feature>/clarification.md',
    authority: 'Blocks progression to planning if unresolved ambiguities exist',
    default_hierarchy: ['L1', 'L3'],
    allowed_artifact_types: ['REQUIREMENT', 'ASSUMPTION', 'DECISION'],
    forbidden_actions: [
      'Must never resolve ambiguities without recording evidence or user clarification',
      'Must never modify implementation code'
    ]
  },
  UX: {
    id: 'UX',
    name: 'UX Architect',
    primary_focus: 'Information architecture, user flows, design tokens, and the 8-state interaction contract',
    code_access: 'Writes to docs/design/, design/, and specs/<feature>/ux.md',
    authority: 'UX Gate signoff',
    default_hierarchy: ['L1', 'L3'],
    allowed_artifact_types: ['UX_ARTIFACT', 'REQUIREMENT', 'FEATURE'],
    forbidden_actions: [
      'Must never design interactions that bypass security boundaries',
      'Must never write backend database migrations or API server logic'
    ]
  },
  ARCHITECT: {
    id: 'ARCHITECT',
    name: 'Principal Architect',
    primary_focus: 'Define system context, container boundaries, resilience matrices, and author ADRs',
    code_access: 'Writes to docs/architecture/ and docs/adr/',
    authority: 'Human Gate required for ADR approval',
    default_hierarchy: ['L0', 'L1', 'L2'],
    allowed_artifact_types: ['ARCHITECTURE', 'DECISION', 'CONTRACT'],
    forbidden_actions: [
      'Must never introduce new dependencies or databases without an approved ADR',
      'Must never silently rewrite existing ADRs; superseded records must remain intact'
    ]
  },
  API: {
    id: 'API',
    name: 'API / Data Agent',
    primary_focus: 'Author and maintain OpenAPI 3.1 contracts, JSON schemas, and database migrations',
    code_access: 'Writes to contracts/, schemas/, and migrations/',
    authority: 'Contract Gate signoff',
    default_hierarchy: ['L1', 'L2', 'L3'],
    allowed_artifact_types: ['CONTRACT', 'ARCHITECTURE', 'REQUIREMENT'],
    forbidden_actions: [
      'Must never make breaking schema changes without expand-contract migration',
      'Must never write frontend UI components'
    ]
  },
  PLANNER: {
    id: 'PLANNER',
    name: 'Technical Planner',
    primary_focus: 'Deconstruct approved specifications and architecture into granular vertical slice tasks (TASK-xxx)',
    code_access: 'Writes to specs/<feature>/tasks.md',
    authority: 'Advisory',
    default_hierarchy: ['L1', 'L2', 'L3', 'L4'],
    allowed_artifact_types: ['TASK', 'REQUIREMENT', 'ARCHITECTURE'],
    forbidden_actions: [
      'Must never create horizontal tasks (e.g. build all UI first, then all API)',
      'Must never create tasks that lack explicit REQ-xxx traceability'
    ]
  },
  BUILDER: {
    id: 'BUILDER',
    name: 'Builder / Coding Agent',
    primary_focus: 'Implement code strictly bounded to the active vertical task slice',
    code_access: 'Writes to application source (src/) and co-located unit tests',
    authority: 'Code Gate (must submit implementation to independent review and test agents)',
    default_hierarchy: ['L0', 'L1', 'L3', 'L4', 'L5'],
    allowed_artifact_types: ['TASK', 'REQUIREMENT', 'CONTRACT', 'DECISION'],
    forbidden_actions: [
      'Must never edit files outside the immediate scope of the active vertical task',
      'Must never bypass or delete failing tests to force a build to pass',
      'Must never commit hardcoded credentials, API keys, or private tokens',
      'Must never modify .ai/constitution.md or quality gate criteria',
      'Must never claim completion without machine-verifiable terminal evidence'
    ]
  },
  TEST: {
    id: 'TEST',
    name: 'Test Agent',
    primary_focus: 'Write and execute deterministic unit, integration, contract, and E2E tests mapped to REQ-xxx criteria',
    code_access: 'Writes to tests/',
    authority: 'Test Gate signoff',
    default_hierarchy: ['L0', 'L3', 'L4', 'L5'],
    allowed_artifact_types: ['TEST', 'REQUIREMENT', 'TASK', 'CONTRACT'],
    forbidden_actions: [
      'Must never delete assertions to make a test pass',
      'Must never modify production source code in src/ to accommodate broken tests'
    ]
  },
  SECURITY: {
    id: 'SECURITY',
    name: 'Security Agent',
    primary_focus: 'Threat modeling, secret scanning, dependency vulnerability audits, and prompt-injection defense',
    code_access: 'Read-only access to code; writes to .ai/risk-register.md and audit reports',
    authority: 'Security Gate signoff (veto power over releases)',
    default_hierarchy: ['L0', 'L1', 'L2', 'L5'],
    allowed_artifact_types: ['ARCHITECTURE', 'DECISION', 'CONTRACT'],
    forbidden_actions: [
      'Must never grant exceptions to OWASP Top 10 violations without human signoff',
      'Must never commit test payloads containing actual live exploit credentials'
    ]
  },
  EVAL: {
    id: 'EVAL',
    name: 'AI Eval Agent',
    primary_focus: 'Maintain benchmark datasets (golden, adversarial, regression, tool-use) and execute eval-runner.js',
    code_access: 'Writes to tests/evals/ and evaluation scoring scripts',
    authority: 'AI Eval Gate signoff',
    default_hierarchy: ['L0', 'L3', 'L4', 'L5'],
    allowed_artifact_types: ['EVALUATION', 'REQUIREMENT', 'TASK'],
    forbidden_actions: [
      'Must never lower evaluation threshold below agreed pass rate',
      'Must never contaminate golden test sets with training or prompts'
    ]
  },
  PERFORMANCE: {
    id: 'PERFORMANCE',
    name: 'Performance Agent',
    primary_focus: 'Profile latency, throughput, memory consumption, and token usage under load',
    code_access: 'Read-only execution; writes to performance benchmarks',
    authority: 'Performance Gate signoff',
    default_hierarchy: ['L0', 'L1', 'L2', 'L5'],
    allowed_artifact_types: ['ARCHITECTURE', 'DECISION'],
    forbidden_actions: [
      'Must never run unbounded stress tests against production environments'
    ]
  },
  RELEASE: {
    id: 'RELEASE',
    name: 'Release Agent',
    primary_focus: 'Manage CI/CD pipelines, staging smoke testing, database migration validation, and rollback verification',
    code_access: 'Writes to .github/workflows/ and infra/',
    authority: 'Release Gate signoff',
    default_hierarchy: ['L0', 'L1', 'L2', 'L5'],
    allowed_artifact_types: ['RELEASE', 'EVIDENCE', 'CONTRACT'],
    forbidden_actions: [
      'Must never deploy without verified backward-compatible rollback script',
      'Must never bypass failed quality gates'
    ]
  },
  CONVERGENCE: {
    id: 'CONVERGENCE',
    name: 'Convergence Agent',
    primary_focus: 'Detect drift between specification, architecture, contracts, tasks, and implementation code',
    code_access: 'Read-only code inspection; writes to drift reports',
    authority: 'Blocks release if drift exceeds zero-tolerance threshold',
    default_hierarchy: ['L1', 'L2', 'L3', 'L4', 'L5'],
    allowed_artifact_types: ['REQUIREMENT', 'TASK', 'CONTRACT', 'TEST', 'EVIDENCE'],
    forbidden_actions: [
      'Must never modify code or specs directly to resolve drift; must alert Human Gate'
    ]
  }
};

/**
 * Resolves a role string or alias to its canonical profile.
 */
export function resolveRole(roleInput) {
  if (!roleInput || typeof roleInput !== 'string') {
    return ROLES.BUILDER;
  }
  const clean = roleInput.trim().toUpperCase();
  if (ROLES[clean]) return ROLES[clean];

  // Common aliases
  const aliasMap = {
    'CODING': 'BUILDER',
    'CODE': 'BUILDER',
    'DEVELOPER': 'BUILDER',
    'TESTING': 'TEST',
    'QA': 'TEST',
    'PM': 'PRODUCT',
    'PRODUCT_MANAGER': 'PRODUCT',
    'SPECIFICATION': 'SPEC',
    'DATA': 'API',
    'DATABASE': 'API',
    'DEV_OPS': 'RELEASE',
    'DEVOPS': 'RELEASE',
    'SRE': 'RELEASE',
    'DRIFT': 'CONVERGENCE',
    'AI_EVAL': 'EVAL',
    'EVALS': 'EVAL'
  };

  const targetKey = aliasMap[clean];
  if (targetKey && ROLES[targetKey]) return ROLES[targetKey];

  // Try matching by role name substring
  for (const role of Object.values(ROLES)) {
    if (role.name.toUpperCase().includes(clean)) {
      return role;
    }
  }

  throw new Error(`Unknown agent role '${roleInput}'. Valid roles: ${Object.keys(ROLES).join(', ')}`);
}
