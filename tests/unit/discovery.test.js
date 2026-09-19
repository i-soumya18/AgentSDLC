import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ingestIdea,
  applyClarification,
  computeAdaptiveQuestions,
  analyzeIdeaText
} from '../../src/discovery/discovery-engine.js';

test('Phase 1 — Product Discovery Engine Tests', async (t) => {
  await t.test('1. Incomplete ideas: identifies missing intent and generates critical unknowns', () => {
    const state = ingestIdea('make an app');
    assert.equal(state.status, 'IN_PROGRESS');
    assert.ok(state.completeness_score < 0.5);
    assert.ok(state.unknowns.some(u => u.id === 'UNK-USER' && u.impact === 'critical'));
    assert.equal(state.users.length, 0);
  });

  await t.test('2. Ambiguous ideas: prioritizes highest-value adaptive questions', () => {
    const state = ingestIdea('A pharmacy tool to help with items');
    assert.equal(state.intent.domain, 'healthcare/pharmacy');
    const questions = computeAdaptiveQuestions(state);
    assert.ok(questions.length > 0);
    // User or prescription tracking questions should be high value
    assert.ok(questions[0].impact === 'critical' || questions[0].impact === 'high');
  });

  await t.test('3. Contradictory requirements: detects conflict and blocks DISCOVERY COMPLETE', () => {
    const state = ingestIdea('Offline pharmacy billing app with cloud-only storage and no local files');
    assert.ok(state.contradictions.length > 0);
    assert.equal(state.contradictions[0].id, 'CONTRA-001');
    assert.equal(state.contradictions[0].resolved, false);
    // Even if answered, contradiction prevents completion until resolved
    applyClarification('for pharmacists, single branch', state);
    assert.notEqual(state.status, 'DISCOVERY_COMPLETE');
  });

  await t.test('4. Over-specified ideas: extracts features, constraints, and platform preferences', () => {
    const state = ingestIdea('A mobile Android POS app for cashiers with offline billing, inventory management, and single pharmacy store constraint');
    assert.equal(state.intent.domain, 'healthcare/pharmacy');
    assert.ok(state.users.some(u => u.persona === 'Cashier'));
    assert.ok(state.features.some(f => f.name === 'Inventory Management'));
    assert.ok(state.features.some(f => f.name === 'Billing & POS'));
    assert.ok(state.constraints.some(c => c.type === 'connectivity'));
    assert.ok(state.constraints.some(c => c.type === 'architecture'));
    assert.ok(state.preferences.platform.includes('Mobile'));
    assert.ok(state.completeness_score >= 0.7);
  });

  await t.test('5. Trivial ideas: rapid resolution to complete state', () => {
    const state = ingestIdea('A developer CLI tool for git task management with local storage for developers');
    applyClarification('for developers, single store, offline local storage, web and desktop', state);
    assert.ok(state.completeness_score >= 0.8);
    assert.equal(state.status, 'DISCOVERY_COMPLETE');
  });

  await t.test('6. Changing user answers & user correction: updates assumptions and state', () => {
    const state = ingestIdea('Pharmacy billing tool');
    assert.ok(state.assumptions.some(a => a.id === 'ASSUMPTION-001' && a.validation_status === 'pending'));

    // User explicitly clarifies audit requirements
    applyClarification('Confirm secure audit logs required for transactions', state);
    const assumption = state.assumptions.find(a => a.id === 'ASSUMPTION-001');
    assert.equal(assumption.validation_status, 'validated');
  });

  await t.test('7. Resolving unknowns iteratively transitions state to DISCOVERY_COMPLETE', () => {
    const state = ingestIdea('Pharmacy POS app for store owners');
    assert.equal(state.status, 'IN_PROGRESS');

    // Answer questions
    applyClarification('Single pharmacy location, offline billing needed, prescription tracking yes, mobile android platform', state);
    assert.ok(state.completeness_score >= 0.80);
    assert.equal(state.status, 'DISCOVERY_COMPLETE');
  });

  await t.test('8. Empty input validation: throws helpful error', () => {
    assert.throws(() => ingestIdea(''), /non-empty string/);
    assert.throws(() => ingestIdea('   '), /non-empty string/);
  });
});
