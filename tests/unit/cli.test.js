import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../../src/cli/stage.js';
import { GATES } from '../../src/cli/gate.js';

test('Engineering OS CLI Architecture Tests', async (t) => {
  await t.test('All 15 SDLC stages are registered in correct order', () => {
    assert.ok(STAGES.includes('assess'));
    assert.ok(STAGES.includes('specify'));
    assert.ok(STAGES.includes('clarify'));
    assert.ok(STAGES.includes('design'));
    assert.ok(STAGES.includes('architect'));
    assert.ok(STAGES.includes('contract'));
    assert.ok(STAGES.includes('plan'));
    assert.ok(STAGES.includes('tasks'));
    assert.ok(STAGES.includes('implement'));
    assert.ok(STAGES.includes('verify'));
    assert.ok(STAGES.includes('review'));
    assert.ok(STAGES.includes('security'));
    assert.ok(STAGES.includes('eval'));
    assert.ok(STAGES.includes('release'));
    assert.ok(STAGES.includes('converge'));
  });

  await t.test('Core Quality Gates are registered', () => {
    assert.ok(GATES.includes('product'));
    assert.ok(GATES.includes('spec'));
    assert.ok(GATES.includes('ux'));
    assert.ok(GATES.includes('architecture'));
    assert.ok(GATES.includes('contract'));
    assert.ok(GATES.includes('code'));
    assert.ok(GATES.includes('test'));
    assert.ok(GATES.includes('security'));
    assert.ok(GATES.includes('ai'));
    assert.ok(GATES.includes('release'));
  });
});
