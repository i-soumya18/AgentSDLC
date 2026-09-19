import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, STAGE_METADATA, getStage, isValidStage, getStageArtifact } from '../../src/lifecycle/stages.js';

test('Lifecycle Registry — Canonical Stages & Transitions', async (t) => {
  await t.test('Exactly 17 canonical stages are defined in correct order', () => {
    assert.equal(STAGES.length, 17);
    const expected = [
      'assess',
      'constitution',
      'specify',
      'clarify',
      'design',
      'architect',
      'contract',
      'plan',
      'tasks',
      'implement',
      'verify',
      'review',
      'security',
      'eval',
      'release',
      'observe',
      'converge'
    ];
    assert.deepEqual(STAGES, expected);
  });

  await t.test('Every stage has complete metadata and valid owner role', () => {
    for (const stageName of STAGES) {
      const meta = getStage(stageName);
      assert.ok(meta, `Stage '${stageName}' must have metadata`);
      assert.equal(meta.id, stageName);
      assert.ok(meta.name.length > 0);
      assert.ok(meta.ownerRole.length > 0);
      assert.ok(meta.description.length > 0);
      assert.ok(Array.isArray(meta.prerequisites));
    }
  });

  await t.test('isValidStage handles valid, invalid, and mixed-case inputs', () => {
    assert.equal(isValidStage('specify'), true);
    assert.equal(isValidStage('SPECIFY'), true);
    assert.equal(isValidStage('contract'), true);
    assert.equal(isValidStage('nonexistent_stage'), false);
    assert.equal(isValidStage(null), false);
    assert.equal(isValidStage(123), false);
  });

  await t.test('getStageArtifact returns correct artifact file', () => {
    assert.equal(getStageArtifact('specify'), 'spec.md');
    assert.equal(getStageArtifact('clarify'), 'clarification.md');
    assert.equal(getStageArtifact('contract'), 'api-contract.md');
    assert.equal(getStageArtifact('tasks'), 'tasks.md');
    assert.equal(getStageArtifact('verify'), 'verification.md');
    assert.equal(getStageArtifact('implement'), null);
  });
});
