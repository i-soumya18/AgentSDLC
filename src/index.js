// Core Configuration & Errors
export { findProjectRoot, resolveActiveFeature, getPackageInfo } from './core/config.js';
export {
  AgentSDLCError,
  LifecycleError,
  QualityGateError,
  DriftError,
  SchemaValidationError,
  ContractError,
  ContractIntegrityError,
  ScopeViolationError
} from './core/errors.js';

// Canonical Registries
export { STAGES, STAGE_METADATA, getStage, isValidStage, scaffoldStageArtifact } from './lifecycle/stages.js';
export { GATES, GATE_REGISTRY, getGate, isValidGate, evaluateGate } from './gates/registry.js';

// Artifacts & Validation
export {
  validateSchema,
  loadSchema,
  validateArtifactMetadata,
  validateDecision,
  validateAssumption,
  validateEvidence,
  validateContextPack,
  validateDesignSystem,
  validateComponentSpecification,
  validateScreenSpecification,
  validateDesignSpec
} from './artifacts/validator.js';

// Product Discovery Engine (Phase 1)
export {
  ingestIdea,
  analyzeIdeaText,
  computeAdaptiveQuestions,
  updateCompletenessScore,
  applyClarification,
  exportMarkdownArtifacts,
  loadDiscoveryState
} from './discovery/discovery-engine.js';

// Product Contract & Scope Lock (Phase 2)
export { ProductContractEngine } from './contract/product-contract-engine.js';

// Product Knowledge Graph (Phase 3)
export {
  ProductKnowledgeGraph,
  ENTITY_TYPES,
  RELATIONSHIPS
} from './graph/product-knowledge-graph.js';

// Agent Context Compiler (Phase 4)
export {
  AgentContextCompiler,
  compileContext
} from './context/context-compiler.js';
export {
  ROLES,
  HIERARCHY_LEVELS,
  resolveRole
} from './context/role-profiles.js';
export {
  evaluateFileExclusion,
  filterCandidates,
  FILTER_REASONS
} from './context/filter-rules.js';
export {
  computeContextMetrics,
  estimateTokens
} from './context/metrics.js';
export {
  formatJson,
  formatMarkdown,
  formatPrompt
} from './context/formatter.js';

// Design Factory (Phase 5)
export { DesignFactory } from './design/design-factory.js';
export {
  DesignTraceabilityValidator,
  CANONICAL_INTERACTION_STATES
} from './design/traceability-validator.js';
export { DesignExporter } from './design/design-exporter.js';

// Verification & Eval Harness
export { executeVerification } from './verification/verify-runner.js';
export { runEval } from './eval/eval-runner.js';

// CLI Commands
export { runIdea } from './cli/idea.js';
export { runDiscover } from './cli/discover.js';
export { runClarify } from './cli/clarify.js';
export { runContract } from './cli/contract.js';
export { runApprove, runReject } from './cli/approve.js';
export { runGraph } from './cli/graph.js';
export { runContext } from './cli/context.js';
export { runDesign } from './cli/design.js';
export { runInit } from './cli/init.js';
export { runStage } from './cli/stage.js';
export { runGate } from './cli/gate.js';
export { runDrift } from './cli/drift.js';
export { runStatus } from './cli/status.js';
export { runVerify } from './cli/verify.js';

