/**
 * Design Traceability and Completeness Validator.
 *
 * Enforces the unbroken chain:
 * requirement → UX → screen → component
 *
 * Verifies completeness of component 8-state matrices, accessibility contracts,
 * and wireframe specifications.
 */

export const CANONICAL_INTERACTION_STATES = [
  'initial',
  'loading',
  'success',
  'empty',
  'error',
  'partial',
  'offline',
  'destructive'
];

export class DesignTraceabilityValidator {
  /**
   * Validates a complete design bundle for traceability and design completeness.
   *
   * @param {object} designBundle - The master design bundle object.
   * @param {Array<object>} [knownRequirements=[]] - List of requirements from spec.md.
   * @returns {object} Validation report
   */
  static validate(designBundle, knownRequirements = []) {
    const traceabilityErrors = [];
    const completenessErrors = [];
    const warnings = [];

    if (!designBundle || typeof designBundle !== 'object') {
      return {
        valid: false,
        traceabilityErrors: ['Design bundle is missing or invalid'],
        completenessErrors: [],
        warnings: [],
        coverage: { requirementsCovered: 0, totalRequirements: 0, screensCount: 0, componentsCount: 0 }
      };
    }

    const screens = designBundle.screens || [];
    const components = designBundle.components || [];

    // Derive requirements either from design bundle traceability or knownRequirements
    const reqList = knownRequirements.length > 0
      ? knownRequirements
      : (designBundle.traceability?.matrix || []).map(m => ({ id: m.requirement_id }));

    const screenMap = new Map(screens.map(s => [s.id, s]));
    const componentMap = new Map(components.map(c => [c.id, c]));
    const reqMap = new Map(reqList.map(r => [r.id, r]));

    // 1. Traceability: requirement -> screen
    for (const req of reqList) {
      const screensForReq = screens.filter(s => s.requirement_ids && s.requirement_ids.includes(req.id));
      if (screensForReq.length === 0) {
        traceabilityErrors.push(`Broken Traceability: Requirement '${req.id}' is not mapped to any screen`);
      }
    }

    // 2. Traceability: screen -> requirement
    for (const screen of screens) {
      if (!screen.requirement_ids || screen.requirement_ids.length === 0) {
        traceabilityErrors.push(`Broken Traceability: Screen '${screen.id}' does not trace back to any product requirement`);
      } else {
        for (const rId of screen.requirement_ids) {
          if (reqMap.size > 0 && !reqMap.has(rId)) {
            warnings.push(`Screen '${screen.id}' references requirement '${rId}' not found in active spec`);
          }
        }
      }

      // 3. Traceability: screen -> components
      if (!screen.components || screen.components.length === 0) {
        traceabilityErrors.push(`Broken Traceability: Screen '${screen.id}' contains no components`);
      } else {
        for (const compId of screen.components) {
          if (!componentMap.has(compId)) {
            traceabilityErrors.push(`Broken Traceability: Screen '${screen.id}' references missing component '${compId}'`);
          }
        }
      }
    }

    // 4. Traceability: component -> screen (orphaned components)
    for (const comp of components) {
      if (!comp.screen_id) {
        traceabilityErrors.push(`Broken Traceability: Component '${comp.id}' lacks a screen_id association`);
      } else if (!screenMap.has(comp.screen_id)) {
        traceabilityErrors.push(`Broken Traceability: Component '${comp.id}' references non-existent screen '${comp.screen_id}'`);
      }
    }

    // 5. Completeness: Component 8-state matrix & accessibility
    for (const comp of components) {
      // 8 interaction states
      if (!comp.states || typeof comp.states !== 'object') {
        completenessErrors.push(`Missing Design Information: Component '${comp.id}' has no interaction states defined`);
      } else {
        for (const state of CANONICAL_INTERACTION_STATES) {
          if (!comp.states[state] || typeof comp.states[state] !== 'object' || !comp.states[state].description) {
            completenessErrors.push(`Missing Design Information: Component '${comp.id}' is missing required '${state}' interaction state`);
          }
        }
      }

      // Accessibility contract
      if (!comp.accessibility || typeof comp.accessibility !== 'object') {
        completenessErrors.push(`Missing Design Information: Component '${comp.id}' lacks an accessibility specification`);
      } else {
        if (!comp.accessibility.aria_role) {
          completenessErrors.push(`Missing Design Information: Component '${comp.id}' missing 'accessibility.aria_role'`);
        }
        if (!comp.accessibility.aria_label) {
          completenessErrors.push(`Missing Design Information: Component '${comp.id}' missing 'accessibility.aria_label'`);
        }
        if (!comp.accessibility.keyboard_navigation) {
          completenessErrors.push(`Missing Design Information: Component '${comp.id}' missing 'accessibility.keyboard_navigation' contract`);
        }
      }

      // Visual properties & tokens
      if (!comp.visual_properties) {
        completenessErrors.push(`Missing Design Information: Component '${comp.id}' lacks visual properties`);
      }
      if (!comp.tokens) {
        completenessErrors.push(`Missing Design Information: Component '${comp.id}' lacks design token bindings`);
      }
      if (!comp.responsive_behavior) {
        completenessErrors.push(`Missing Design Information: Component '${comp.id}' lacks responsive behavior contract`);
      }
    }

    // 6. Completeness: Screen wireframe & error handling
    for (const screen of screens) {
      if (!screen.wireframe || !screen.wireframe.header || !screen.wireframe.main_content) {
        completenessErrors.push(`Missing Design Information: Screen '${screen.id}' missing wireframe layout`);
      }
      if (!screen.error_handling || !screen.error_handling.network_failure || !screen.error_handling.validation_error) {
        completenessErrors.push(`Missing Design Information: Screen '${screen.id}' missing error handling specification`);
      }
      if (!screen.responsive_adaptations || !screen.responsive_adaptations.mobile || !screen.responsive_adaptations.desktop) {
        completenessErrors.push(`Missing Design Information: Screen '${screen.id}' missing responsive adaptations`);
      }
    }

    const coveredReqCount = reqList.filter(r => screens.some(s => s.requirement_ids && s.requirement_ids.includes(r.id))).length;

    const isValid = traceabilityErrors.length === 0 && completenessErrors.length === 0;

    return {
      valid: isValid,
      traceabilityErrors,
      completenessErrors,
      warnings,
      coverage: {
        requirementsCovered: coveredReqCount,
        totalRequirements: reqList.length,
        screensCount: screens.length,
        componentsCount: components.length
      }
    };
  }
}
