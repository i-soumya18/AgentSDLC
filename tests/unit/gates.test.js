import test from 'node:test';
import assert from 'node:assert/strict';
import { GATES, GATE_REGISTRY, getGate, isValidGate, evaluateGate } from '../../src/gates/registry.js';
import { findProjectRoot } from '../../src/core/config.js';

test('Quality Gate Registry — Canonical Gates & Evaluation', async (t) => {
  const projectRoot = await findProjectRoot();

  await t.test('All advertised gates have strictly defined implementationStatus', () => {
    assert.ok(GATES.length >= 14);
    for (const gateId of GATES) {
      const gate = getGate(gateId);
      assert.ok(gate, `Gate '${gateId}' must exist in GATE_REGISTRY`);
      assert.ok(['IMPLEMENTED', 'EXPLICITLY_UNIMPLEMENTED'].includes(gate.implementationStatus),
        `Gate '${gateId}' must be strictly IMPLEMENTED or EXPLICITLY_UNIMPLEMENTED, got ${gate.implementationStatus}`);
      assert.ok(gate.name.length > 0);
      assert.ok(gate.purpose.length > 0);
      assert.ok(gate.requiredEvidence.length > 0);
      assert.equal(typeof gate.evaluate, 'function');
    }
  });

  await t.test('isValidGate correctly checks valid gates and "all"', () => {
    assert.equal(isValidGate('product'), true);
    assert.equal(isValidGate('spec'), true);
    assert.equal(isValidGate('all'), true);
    assert.equal(isValidGate('fake_gate'), false);
    assert.equal(isValidGate(null), false);
  });

  await t.test('Explicitly unimplemented gates return EXPLICITLY_UNIMPLEMENTED status', async () => {
    const unimplGates = Object.values(GATE_REGISTRY).filter(g => g.implementationStatus === 'EXPLICITLY_UNIMPLEMENTED');
    assert.ok(unimplGates.length > 0);

    for (const gate of unimplGates) {
      const results = await evaluateGate(projectRoot, gate.id, '001-ai-task-copilot');
      assert.equal(results.length, 1);
      assert.equal(results[0].status, 'EXPLICITLY_UNIMPLEMENTED');
      assert.equal(results[0].passed, false);
      assert.ok(results[0].evidence.length > 0);
    }
  });

  await t.test('Active implemented gates pass against 001-ai-task-copilot', async () => {
    const results = await evaluateGate(projectRoot, 'all', '001-ai-task-copilot');
    assert.ok(results.length >= 7);

    for (const res of results) {
      assert.equal(res.passed, true, `Gate ${res.name} failed: ${res.evidence}`);
      assert.equal(res.status, 'PASS');
      assert.ok(res.evidence.length > 0);
    }
  });
});
