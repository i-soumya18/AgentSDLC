import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { findProjectRoot } from '../../src/core/config.js';
import {
  validateSchema,
  loadSchema,
  validateArtifactMetadata,
  validateDecision,
  validateAssumption,
  validateEvidence
} from '../../src/artifacts/validator.js';

test('Artifact Metadata & Schema Validation Tests', async (t) => {
  const projectRoot = await findProjectRoot();

  await t.test('All JSON schemas in schemas/ are well-formed and valid JSON', async () => {
    const schemasDir = path.join(projectRoot, 'schemas');
    const files = await fs.readdir(schemasDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    assert.ok(jsonFiles.length >= 5);
    for (const f of jsonFiles) {
      const content = await fs.readFile(path.join(schemasDir, f), 'utf8');
      const parsed = JSON.parse(content);
      assert.ok(parsed.title);
      assert.equal(parsed.type, 'object');
      assert.ok(parsed.required);
    }
  });

  await t.test('Valid artifact metadata passes validation', async () => {
    const validMeta = {
      id: 'SPEC-001',
      type: 'spec',
      version: '1.0.0',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: 'Spec Agent'
    };

    const result = await validateArtifactMetadata(projectRoot, validMeta);
    assert.equal(result, true);
  });

  await t.test('Invalid artifact metadata is rejected with SchemaValidationError', async () => {
    const invalidMeta = {
      id: 'bad id with spaces!',
      type: 'unknown_type',
      version: 'not-semver'
      // missing required fields
    };

    await assert.rejects(
      async () => await validateArtifactMetadata(projectRoot, invalidMeta),
      (err) => {
        assert.equal(err.name, 'SchemaValidationError');
        assert.ok(err.errors.length > 0);
        return true;
      }
    );
  });

  await t.test('Valid decision record passes validateDecision', async () => {
    const validDecision = {
      id: 'ADR-0001',
      title: 'Use Least Privilege MCP Model',
      status: 'accepted',
      date: '2026-09-11',
      deciders: ['Principal Architect'],
      context: 'Agents need restricted tool execution boundaries.',
      decision: 'Enforce role-based MCP tool policy.',
      alternatives_considered: [
        { option: 'Unrestricted execution', rejection_rationale: 'Too high risk for prompt injection.' }
      ],
      consequences: {
        positive: ['Reduced blast radius'],
        negative: ['Requires upfront permission definition']
      }
    };

    const result = await validateDecision(projectRoot, validDecision);
    assert.equal(result, true);
  });

  await t.test('Valid assumption record passes validateAssumption', async () => {
    const validAssumption = {
      id: 'ASSUMPTION-001',
      assumption: 'User prefers desktop terminal over mobile UI for developer workflows',
      evidence_basis: 'User initial request mentioned CLI tool usage.',
      confidence: 0.85,
      impact_if_invalid: 'medium',
      validation_status: 'pending',
      created_at: new Date().toISOString()
    };

    const result = await validateAssumption(projectRoot, validAssumption);
    assert.equal(result, true);
  });

  await t.test('Valid evidence record passes validateEvidence', async () => {
    const validEvidence = {
      evidence_id: 'EVID-TEST-001',
      gate_id: 'test',
      target_artifact: '001-ai-task-copilot',
      timestamp: new Date().toISOString(),
      evaluator: 'Test Agent',
      status: 'pass',
      summary: 'All deterministic unit tests passed',
      command_executed: 'npm test'
    };

    const result = await validateEvidence(projectRoot, validEvidence);
    assert.equal(result, true);
  });
});
