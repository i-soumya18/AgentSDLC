import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import {
  DesignFactory,
  DesignTraceabilityValidator,
  DesignExporter,
  CANONICAL_INTERACTION_STATES,
  validateDesignSystem,
  validateComponentSpecification,
  validateScreenSpecification,
  validateDesignSpec
} from '../../src/index.js';

test('Phase 5 — Design Factory Tests', async (t) => {
  const projectRoot = process.cwd();
  const factory = new DesignFactory(projectRoot);
  const featureId = '001-ai-task-copilot';

  let generatedBundle = null;

  await t.test('1. Pipeline Generation: converts product intent into complete design bundle', async () => {
    generatedBundle = await factory.generateDesignBundle({ featureId });

    assert.ok(generatedBundle);
    assert.equal(generatedBundle.feature_id, featureId);
    assert.ok(generatedBundle.personas.length > 0);
    assert.ok(generatedBundle.journeys.length > 0);
    assert.ok(generatedBundle.information_architecture.hierarchy.length > 0);
    assert.ok(generatedBundle.user_flows.length > 0);
    assert.ok(generatedBundle.screens.length > 0);
    assert.ok(generatedBundle.components.length > 0);
    assert.ok(generatedBundle.traceability.matrix.length > 0);
  });

  await t.test('2. Design Preferences & Assumption Recording: preserves preferences and logs gaps', async () => {
    const customPrefs = {
      visual_style: 'dark-futuristic',
      density: 'compact',
      platforms: ['Web', 'Mobile', 'Terminal']
    };

    const bundle = await factory.generateDesignBundle({
      featureId,
      userPreferences: customPrefs
    });

    assert.equal(bundle.design_preferences.visual_style, 'dark-futuristic');
    assert.equal(bundle.design_preferences.density, 'compact');
    assert.deepEqual(bundle.design_preferences.platforms, ['Web', 'Mobile', 'Terminal']);

    // Check that missing brand color and typography gaps were recorded as assumptions
    assert.ok(bundle.design_assumptions.length >= 2);
    const assumptionCategories = bundle.design_assumptions.map(a => a.category);
    assert.ok(assumptionCategories.includes('COLOR_SYSTEM'));
    assert.ok(assumptionCategories.includes('TYPOGRAPHY'));
  });

  await t.test('3. Design System Tokens: validates schema, HSL colors, spacing grid, and radius', async () => {
    const ds = generatedBundle.design_system;
    assert.equal(ds.name, 'AgentSDLC Factory Design System');
    assert.equal(ds.spacing.unit_px, 8);
    assert.ok(ds.color_system.primary.startsWith('hsl('));
    assert.ok(ds.color_system.status.error.startsWith('hsl('));
    assert.equal(ds.accessibility.wcag_level, 'AA');

    // Schema validation
    const isValid = await validateDesignSystem(projectRoot, ds);
    assert.equal(isValid, true);
  });

  await t.test('4. Screen Specifications: validates wireframe trees, error states, and schema', async () => {
    for (const screen of generatedBundle.screens) {
      assert.ok(screen.id.startsWith('SCREEN-'));
      assert.ok(screen.requirement_ids.length > 0);
      assert.ok(screen.wireframe.header);
      assert.ok(screen.wireframe.main_content);
      assert.ok(screen.error_handling.network_failure);
      assert.ok(screen.error_handling.validation_error);
      assert.ok(screen.responsive_adaptations.mobile);
      assert.ok(screen.responsive_adaptations.desktop);

      // Schema validation
      const isValid = await validateScreenSpecification(projectRoot, screen);
      assert.equal(isValid, true);
    }
  });

  await t.test('5. Component Specifications: validates 8-state interaction matrices and accessibility', async () => {
    for (const comp of generatedBundle.components) {
      assert.ok(comp.id.startsWith('COMP-'));
      assert.ok(comp.screen_id);

      // 8 interaction states
      for (const state of CANONICAL_INTERACTION_STATES) {
        assert.ok(comp.states[state], `Component ${comp.id} missing state '${state}'`);
        assert.ok(comp.states[state].description);
      }

      // Accessibility contract
      assert.ok(comp.accessibility.aria_role);
      assert.ok(comp.accessibility.aria_label);
      assert.ok(comp.accessibility.keyboard_navigation);
      assert.ok(comp.accessibility.focus_indicator);

      // Schema validation
      const isValid = await validateComponentSpecification(projectRoot, comp);
      assert.equal(isValid, true);
    }
  });

  await t.test('6. Master Design Bundle: validates entire bundle against design-spec schema', async () => {
    const isValid = await validateDesignSpec(projectRoot, generatedBundle);
    assert.equal(isValid, true);
  });

  await t.test('7. Traceability Validation: requirement -> UX -> screen/component chain is unbroken', () => {
    const report = DesignTraceabilityValidator.validate(generatedBundle);

    assert.equal(report.valid, true);
    assert.equal(report.traceabilityErrors.length, 0);
    assert.equal(report.completenessErrors.length, 0);
    assert.ok(report.coverage.requirementsCovered > 0);
    assert.equal(report.coverage.requirementsCovered, report.coverage.totalRequirements);
  });

  await t.test('8. Negative Tests: detects broken traceability and missing required design information', () => {
    // A. Broken traceability: unmapped requirement
    const brokenTraceabilityBundle = JSON.parse(JSON.stringify(generatedBundle));
    brokenTraceabilityBundle.screens[0].requirement_ids = [];
    const reportA = DesignTraceabilityValidator.validate(brokenTraceabilityBundle, [
      { id: 'REQ-001.1' },
      { id: 'REQ-001.2' }
    ]);
    assert.equal(reportA.valid, false);
    assert.ok(reportA.traceabilityErrors.some(e => e.includes('does not trace back to any product requirement') || e.includes('not mapped to any screen')));

    // B. Broken traceability: orphaned component
    const orphanedComponentBundle = JSON.parse(JSON.stringify(generatedBundle));
    orphanedComponentBundle.components.push({
      id: 'COMP-ORPHAN',
      name: 'Orphaned Button',
      category: 'input',
      screen_id: 'SCREEN-DOES-NOT-EXIST',
      states: generatedBundle.components[0].states,
      dimensions: generatedBundle.components[0].dimensions,
      visual_properties: generatedBundle.components[0].visual_properties,
      behavior: generatedBundle.components[0].behavior,
      interaction: generatedBundle.components[0].interaction,
      accessibility: generatedBundle.components[0].accessibility,
      responsive_behavior: generatedBundle.components[0].responsive_behavior,
      tokens: generatedBundle.components[0].tokens
    });
    const reportB = DesignTraceabilityValidator.validate(orphanedComponentBundle);
    assert.equal(reportB.valid, false);
    assert.ok(reportB.traceabilityErrors.some(e => e.includes('references non-existent screen')));

    // C. Missing design info: missing interaction state (e.g. offline)
    const missingStateBundle = JSON.parse(JSON.stringify(generatedBundle));
    delete missingStateBundle.components[0].states.offline;
    const reportC = DesignTraceabilityValidator.validate(missingStateBundle);
    assert.equal(reportC.valid, false);
    assert.ok(reportC.completenessErrors.some(e => e.includes("missing required 'offline' interaction state")));

    // D. Missing design info: missing accessibility contract
    const missingA11yBundle = JSON.parse(JSON.stringify(generatedBundle));
    delete missingA11yBundle.components[0].accessibility.aria_label;
    const reportD = DesignTraceabilityValidator.validate(missingA11yBundle);
    assert.equal(reportD.valid, false);
    assert.ok(reportD.completenessErrors.some(e => e.includes("missing 'accessibility.aria_label'")));
  });

  await t.test('9. Design Exporter: generates JSON artifacts and Markdown specifications', async () => {
    const exporter = new DesignExporter(projectRoot);
    const result = await exporter.export(generatedBundle);

    assert.ok(result.jsonFiles.includes('design/design-spec.json'));
    assert.ok(result.jsonFiles.includes('design/design-system.json'));
    assert.ok(result.markdownFiles.includes('design/DESIGN_SYSTEM.md'));
    assert.ok(result.markdownFiles.includes('design/SCREENS.md'));
    assert.ok(result.markdownFiles.includes('design/COMPONENTS.md'));

    // Verify files exist on disk
    const specExists = await fs.stat(path.join(projectRoot, 'design', 'design-spec.json')).then(() => true).catch(() => false);
    assert.equal(specExists, true);

    const dsMdExists = await fs.stat(path.join(projectRoot, 'design', 'DESIGN_SYSTEM.md')).then(() => true).catch(() => false);
    assert.equal(dsMdExists, true);

    // Verify ux.md was updated with 8-state contract
    const uxMd = await fs.readFile(path.join(projectRoot, 'specs', featureId, 'ux.md'), 'utf8');
    assert.ok(uxMd.includes('8-State Interaction Contract'));
    assert.ok(uxMd.includes('SCREEN-TASK-DASHBOARD'));
    assert.ok(uxMd.includes('COMP-TASK-CREATOR'));
  });
});
