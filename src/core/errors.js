export class AgentSDLCError extends Error {
  constructor(message, code = 'ERR_AGENT_SDLC') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class LifecycleError extends AgentSDLCError {
  constructor(message, stage) {
    super(message, 'ERR_LIFECYCLE');
    this.stage = stage;
  }
}

export class QualityGateError extends AgentSDLCError {
  constructor(message, gate, results = []) {
    super(message, 'ERR_QUALITY_GATE');
    this.gate = gate;
    this.results = results;
  }
}

export class DriftError extends AgentSDLCError {
  constructor(message, featureId, unmapped = []) {
    super(message, 'ERR_DRIFT');
    this.featureId = featureId;
    this.unmapped = unmapped;
  }
}

export class SchemaValidationError extends AgentSDLCError {
  constructor(message, schemaName, errors = []) {
    super(message, 'ERR_SCHEMA_VALIDATION');
    this.schemaName = schemaName;
    this.errors = errors;
  }
}

export class ContractError extends AgentSDLCError {
  constructor(message, code = 'ERR_CONTRACT') {
    super(message, code);
  }
}

export class ContractIntegrityError extends ContractError {
  constructor(message, expectedHash, actualHash) {
    super(message, 'ERR_CONTRACT_INTEGRITY');
    this.expectedHash = expectedHash;
    this.actualHash = actualHash;
  }
}

export class ScopeViolationError extends ContractError {
  constructor(message, attemptedItem) {
    super(message, 'ERR_SCOPE_VIOLATION');
    this.attemptedItem = attemptedItem;
  }
}

