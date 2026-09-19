import fs from 'node:fs/promises';
import path from 'node:path';
import { SchemaValidationError } from '../core/errors.js';

export function validateSchema(data, schema) {
  const errors = [];

  if (schema.type === 'object') {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push(`Expected object, got ${Array.isArray(data) ? 'array' : typeof data}`);
      return errors;
    }

    if (schema.required) {
      for (const reqKey of schema.required) {
        if (!(reqKey in data) || data[reqKey] === undefined) {
          errors.push(`Missing required field: '${reqKey}'`);
        }
      }
    }

    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data && data[key] !== undefined) {
          const val = data[key];
          const expectedTypes = Array.isArray(propSchema.type) ? propSchema.type : [propSchema.type];
          const actualType = val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val;

          if (propSchema.type && !expectedTypes.includes(actualType)) {
            errors.push(`Field '${key}': expected ${expectedTypes.join('|')}, got ${actualType}`);
            continue;
          }

          if (propSchema.enum && !propSchema.enum.includes(val)) {
            errors.push(`Field '${key}': '${val}' not in allowed enum: [${propSchema.enum.join(', ')}]`);
          }

          if (propSchema.pattern && typeof val === 'string') {
            const regex = new RegExp(propSchema.pattern);
            if (!regex.test(val)) {
              errors.push(`Field '${key}': '${val}' does not match pattern ${propSchema.pattern}`);
            }
          }

          if (typeof propSchema.minLength === 'number' && typeof val === 'string' && val.length < propSchema.minLength) {
            errors.push(`Field '${key}': length ${val.length} is less than minLength ${propSchema.minLength}`);
          }

          if (typeof propSchema.maxLength === 'number' && typeof val === 'string' && val.length > propSchema.maxLength) {
            errors.push(`Field '${key}': length ${val.length} exceeds maxLength ${propSchema.maxLength}`);
          }

          if (propSchema.type === 'array' && Array.isArray(val)) {
            if (typeof propSchema.minItems === 'number' && val.length < propSchema.minItems) {
              errors.push(`Field '${key}': array length ${val.length} is less than minItems ${propSchema.minItems}`);
            }
          }
        }
      }
    }
  }

  return errors;
}

export async function loadSchema(projectRoot, schemaFileName) {
  const schemaPath = path.join(projectRoot, 'schemas', schemaFileName);
  const content = await fs.readFile(schemaPath, 'utf8');
  return JSON.parse(content);
}

export async function validateArtifactMetadata(projectRoot, metadata) {
  const schema = await loadSchema(projectRoot, 'artifact.schema.json');
  const errors = validateSchema(metadata, schema);
  if (errors.length > 0) {
    throw new SchemaValidationError(`Artifact metadata validation failed`, 'artifact.schema.json', errors);
  }
  return true;
}

export async function validateDecision(projectRoot, decision) {
  const schema = await loadSchema(projectRoot, 'decision.schema.json');
  const errors = validateSchema(decision, schema);
  if (errors.length > 0) {
    throw new SchemaValidationError(`Decision record validation failed`, 'decision.schema.json', errors);
  }
  return true;
}

export async function validateAssumption(projectRoot, assumption) {
  const schema = await loadSchema(projectRoot, 'assumption.schema.json');
  const errors = validateSchema(assumption, schema);
  if (errors.length > 0) {
    throw new SchemaValidationError(`Assumption record validation failed`, 'assumption.schema.json', errors);
  }
  return true;
}

export async function validateEvidence(projectRoot, evidence) {
  const schema = await loadSchema(projectRoot, 'evidence.schema.json');
  const errors = validateSchema(evidence, schema);
  if (errors.length > 0) {
    throw new SchemaValidationError(`Evidence validation failed`, 'evidence.schema.json', errors);
  }
  return true;
}
