// Core Configuration & Errors
export { findProjectRoot, resolveActiveFeature, getPackageInfo } from './core/config.js';
export {
  AgentSDLCError,
  LifecycleError,
  QualityGateError,
  DriftError,
  SchemaValidationError
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
  validateEvidence
} from './artifacts/validator.js';

// Verification & Eval Harness
export { executeVerification } from './verification/verify-runner.js';
export { runEval } from './eval/eval-runner.js';

// CLI Commands
export { runInit } from './cli/init.js';
export { runStage } from './cli/stage.js';
export { runGate } from './cli/gate.js';
export { runDrift } from './cli/drift.js';
export { runStatus } from './cli/status.js';
export { runVerify } from './cli/verify.js';
