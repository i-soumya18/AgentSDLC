import path from 'node:path';
import fs from 'node:fs/promises';
import { DesignFactory } from '../design/design-factory.js';
import { DesignTraceabilityValidator } from '../design/traceability-validator.js';
import { DesignExporter } from '../design/design-exporter.js';
import { findProjectRoot, resolveActiveFeature } from '../core/config.js';

export async function runDesign(args = []) {
  const projectRoot = await findProjectRoot();
  const subCommand = args[0] || 'check';
  const asJson = args.includes('--json');

  let featureId = null;
  const featIndex = args.indexOf('--feature') !== -1 ? args.indexOf('--feature') : args.indexOf('-f');
  if (featIndex !== -1 && args[featIndex + 1]) {
    featureId = args[featIndex + 1];
  } else if (args[1] && !args[1].startsWith('-')) {
    featureId = args[1];
  }
  featureId = await resolveActiveFeature(projectRoot, featureId);

  const factory = new DesignFactory(projectRoot);
  const exporter = new DesignExporter(projectRoot);

  switch (subCommand) {
    case 'generate': {
      const bundle = await factory.generateDesignBundle({ featureId });
      const exportResult = await exporter.export(bundle);
      const validation = DesignTraceabilityValidator.validate(bundle);

      if (asJson) {
        console.log(JSON.stringify({ bundle, exportResult, validation }, null, 2));
      } else {
        console.log(`\x1b[1m\x1b[36m🎨 [DESIGN FACTORY] Generated Design Specifications\x1b[0m`);
        console.log(`Feature: \x1b[32m${featureId}\x1b[0m | Style: \x1b[33m${bundle.design_preferences.visual_style}\x1b[0m\n`);
        console.log(`Generated Artifacts:`);
        for (const f of [...exportResult.jsonFiles, ...exportResult.markdownFiles]) {
          console.log(`  ✓ ${f}`);
        }
        console.log(`\nTraceability & Completeness:`);
        console.log(`  • Requirements Covered: ${validation.coverage.requirementsCovered}/${validation.coverage.totalRequirements}`);
        console.log(`  • Screens Generated: ${validation.coverage.screensCount}`);
        console.log(`  • Components (8-State Contracts): ${validation.coverage.componentsCount}`);
        console.log(`  • Status: ${validation.valid ? '\x1b[32m100% VALID\x1b[0m' : '\x1b[31mINVALID\x1b[0m'}`);
      }
      break;
    }

    case 'check':
    case 'verify': {
      let bundle = null;
      try {
        const raw = await fs.readFile(path.join(projectRoot, 'design', 'design-spec.json'), 'utf8');
        bundle = JSON.parse(raw);
      } catch {
        // If not exported yet, generate in-memory to validate
        bundle = await factory.generateDesignBundle({ featureId });
      }

      const report = DesignTraceabilityValidator.validate(bundle);

      if (asJson) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(`\x1b[1m\x1b[36m🔍 [DESIGN TRACEABILITY VALIDATOR]\x1b[0m Checking: ${featureId}\n`);
        console.log(`Traceability Matrix:`);
        for (const m of bundle.traceability?.matrix || []) {
          console.log(`  • \x1b[32m${m.requirement_id}\x1b[0m → Screens: [${m.screen_ids.join(', ')}] → Components: [${m.component_ids.join(', ')}]`);
        }

        console.log(`\nCoverage Summary:`);
        console.log(`  Requirements: ${report.coverage.requirementsCovered}/${report.coverage.totalRequirements}`);
        console.log(`  Screens:      ${report.coverage.screensCount}`);
        console.log(`  Components:   ${report.coverage.componentsCount}`);

        if (report.traceabilityErrors.length > 0) {
          console.log(`\n\x1b[31mTraceability Errors:\x1b[0m`);
          for (const err of report.traceabilityErrors) console.log(`  ❌ ${err}`);
        }
        if (report.completenessErrors.length > 0) {
          console.log(`\n\x1b[31mCompleteness Errors:\x1b[0m`);
          for (const err of report.completenessErrors) console.log(`  ❌ ${err}`);
        }

        if (report.valid) {
          console.log(`\n\x1b[32m✓ DESIGN GATE PASSED: 100% Traceability & 8-State Contract Completeness\x1b[0m`);
        } else {
          console.log(`\n\x1b[31m✗ DESIGN GATE FAILED: Broken traceability or missing design info\x1b[0m`);
          process.exit(1);
        }
      }
      break;
    }

    case 'tokens': {
      let ds = null;
      try {
        const raw = await fs.readFile(path.join(projectRoot, 'design', 'design-system.json'), 'utf8');
        ds = JSON.parse(raw);
      } catch {
        const bundle = await factory.generateDesignBundle({ featureId });
        ds = bundle.design_system;
      }

      if (asJson) {
        console.log(JSON.stringify(ds, null, 2));
      } else {
        console.log(`\x1b[1m\x1b[36m🎨 [DESIGN SYSTEM TOKENS]\x1b[0m ${ds.name} (v${ds.version})`);
        console.log(`Visual Style: ${ds.visual_style} | Density: ${ds.density}\n`);
        console.log(`Primary Color:    ${ds.color_system.primary}`);
        console.log(`Background Color: ${ds.color_system.background}`);
        console.log(`Surface Color:    ${ds.color_system.surface}`);
        console.log(`Base Spacing:     ${ds.spacing.unit_px}px`);
        console.log(`Font Family:      ${ds.typography.font_family.sans}`);
        console.log(`WCAG Level:       ${ds.accessibility.wcag_level}`);
      }
      break;
    }

    case 'screens': {
      let screens = null;
      try {
        const raw = await fs.readFile(path.join(projectRoot, 'design', 'screens.json'), 'utf8');
        screens = JSON.parse(raw);
      } catch {
        const bundle = await factory.generateDesignBundle({ featureId });
        screens = bundle.screens;
      }

      if (asJson) {
        console.log(JSON.stringify(screens, null, 2));
      } else {
        console.log(`\x1b[1m\x1b[36m🖥️ [SCREEN INVENTORY]\x1b[0m (${screens.length} screens defined)\n`);
        for (const s of screens) {
          console.log(`• \x1b[1m${s.id}\x1b[0m: ${s.title}`);
          console.log(`  Route:        ${s.route}`);
          console.log(`  Archetype:    ${s.layout_archetype}`);
          console.log(`  Requirements: ${s.requirement_ids.join(', ')}`);
          console.log(`  Components:   ${s.components.join(', ')}\n`);
        }
      }
      break;
    }

    case 'components': {
      let components = null;
      try {
        const raw = await fs.readFile(path.join(projectRoot, 'design', 'components.json'), 'utf8');
        components = JSON.parse(raw);
      } catch {
        const bundle = await factory.generateDesignBundle({ featureId });
        components = bundle.components;
      }

      if (asJson) {
        console.log(JSON.stringify(components, null, 2));
      } else {
        console.log(`\x1b[1m\x1b[36m🧩 [COMPONENT CONTRACTS]\x1b[0m (${components.length} components with 8-State Matrices)\n`);
        for (const c of components) {
          console.log(`• \x1b[1m${c.id}\x1b[0m: ${c.name} [${c.category}]`);
          console.log(`  Parent Screen: ${c.screen_id}`);
          console.log(`  ARIA Role:     ${c.accessibility.aria_role} ("${c.accessibility.aria_label}")`);
          console.log(`  States (8/8):  ${Object.keys(c.states).join(', ')}\n`);
        }
      }
      break;
    }

    default:
      console.error(`Unknown design subcommand '${subCommand}'. Use: generate, check, tokens, screens, components`);
      process.exit(1);
  }
}
