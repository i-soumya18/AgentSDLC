import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Design Artifact Exporter.
 *
 * Persists machine-readable JSON artifacts and human-readable Markdown
 * specifications into design/ and specs/<feature>/ux.md.
 */
export class DesignExporter {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Exports the entire design bundle to disk.
   */
  async export(designBundle) {
    const designDir = path.join(this.projectRoot, 'design');
    await fs.mkdir(designDir, { recursive: true });

    // 1. Machine-readable JSON artifacts
    await fs.writeFile(
      path.join(designDir, 'design-spec.json'),
      JSON.stringify(designBundle, null, 2),
      'utf8'
    );
    await fs.writeFile(
      path.join(designDir, 'design-system.json'),
      JSON.stringify(designBundle.design_system, null, 2),
      'utf8'
    );
    await fs.writeFile(
      path.join(designDir, 'screens.json'),
      JSON.stringify(designBundle.screens, null, 2),
      'utf8'
    );
    await fs.writeFile(
      path.join(designDir, 'components.json'),
      JSON.stringify(designBundle.components, null, 2),
      'utf8'
    );

    // 2. Markdown documentation
    await fs.writeFile(
      path.join(designDir, 'DESIGN_SYSTEM.md'),
      this._renderDesignSystemMarkdown(designBundle.design_system, designBundle.design_preferences, designBundle.design_assumptions),
      'utf8'
    );
    await fs.writeFile(
      path.join(designDir, 'SCREENS.md'),
      this._renderScreensMarkdown(designBundle.screens, designBundle.traceability),
      'utf8'
    );
    await fs.writeFile(
      path.join(designDir, 'COMPONENTS.md'),
      this._renderComponentsMarkdown(designBundle.components),
      'utf8'
    );

    // 3. Update active feature's ux.md
    if (designBundle.feature_id) {
      const uxPath = path.join(this.projectRoot, 'specs', designBundle.feature_id, 'ux.md');
      await fs.mkdir(path.dirname(uxPath), { recursive: true });
      await fs.writeFile(uxPath, this._renderUxMd(designBundle), 'utf8');
    }

    return {
      jsonFiles: [
        'design/design-spec.json',
        'design/design-system.json',
        'design/screens.json',
        'design/components.json'
      ],
      markdownFiles: [
        'design/DESIGN_SYSTEM.md',
        'design/SCREENS.md',
        'design/COMPONENTS.md',
        `specs/${designBundle.feature_id}/ux.md`
      ]
    };
  }

  _renderDesignSystemMarkdown(ds, prefs, assumptions) {
    let md = `# Design System Specification: ${ds.name}\n\n`;
    md += `> **Visual Style:** \`${ds.visual_style}\`  \n`;
    md += `> **Density:** \`${ds.density}\`  \n`;
    md += `> **Platforms:** ${ds.platforms.join(', ')}  \n`;
    md += `> **Accessibility Standard:** WCAG 2.1 ${ds.accessibility.wcag_level} (${ds.accessibility.min_contrast_ratio}:1 contrast)\n\n`;

    if (assumptions && assumptions.length > 0) {
      md += `## Design Assumptions\n`;
      for (const a of assumptions) {
        md += `- **[${a.id}] (${a.category})**: ${a.assumption} — _${a.rationalization}_\n`;
      }
      md += `\n`;
    }

    md += `## 1. Color Palette (HSL Tokens)\n`;
    md += `| Role | HSL Value | Purpose |\n`;
    md += `|---|---|---|\n`;
    md += `| Primary | \`${ds.color_system.primary}\` | Brand interactive elements & primary CTAs |\n`;
    md += `| Secondary | \`${ds.color_system.secondary}\` | Subtle backgrounds and secondary actions |\n`;
    md += `| Accent | \`${ds.color_system.accent}\` | Highlights and active focus rings |\n`;
    md += `| Background | \`${ds.color_system.background}\` | Main application background |\n`;
    md += `| Surface | \`${ds.color_system.surface}\` | Card and modal surface container |\n`;
    md += `| Success | \`${ds.color_system.status.success}\` | Verified gates and passing tests |\n`;
    md += `| Warning | \`${ds.color_system.status.warning}\` | Potential drift and pending reviews |\n`;
    md += `| Error | \`${ds.color_system.status.error}\` | Gate failures and RFC 7807 problem details |\n\n`;

    md += `## 2. Typography Scale\n`;
    md += `- **UI Sans Font:** \`${ds.typography.font_family.sans}\`\n`;
    md += `- **Monospace Font:** \`${ds.typography.font_family.mono}\`\n\n`;
    md += `| Size Token | REM Value |\n`;
    md += `|---|---|\n`;
    for (const [k, v] of Object.entries(ds.typography.font_sizes)) {
      md += `| \`${k}\` | \`${v}\` |\n`;
    }
    md += `\n`;

    md += `## 3. Spacing Grid & Radius\n`;
    md += `- **Base Grid Unit:** \`${ds.spacing.unit_px}px\`\n`;
    md += `- **Radius Scale:** sm=\`${ds.radius.sm}\`, md=\`${ds.radius.md}\`, lg=\`${ds.radius.lg}\`, full=\`${ds.radius.full}\`\n\n`;

    return md;
  }

  _renderScreensMarkdown(screens, traceability) {
    let md = `# Screen Specifications & Traceability\n\n`;

    for (const s of screens) {
      md += `## ${s.id}: ${s.title}\n`;
      md += `- **Route:** \`${s.route}\`\n`;
      md += `- **Layout Archetype:** \`${s.layout_archetype}\`\n`;
      md += `- **Mapped Requirements:** ${s.requirement_ids.map(r => `\`${r}\``).join(', ')}\n`;
      md += `- **User Flow Step:** ${s.user_flow_step}\n`;
      md += `- **Contained Components:** ${s.components.map(c => `\`${c}\``).join(', ')}\n\n`;

      md += `### Wireframe Structure\n`;
      md += `- **Header:** ${s.wireframe.header}\n`;
      if (s.wireframe.sidebar) md += `- **Sidebar:** ${s.wireframe.sidebar}\n`;
      md += `- **Main Content:** ${s.wireframe.main_content}\n`;
      if (s.wireframe.footer) md += `- **Footer:** ${s.wireframe.footer}\n`;
      md += `\n`;

      md += `### Error & Edge State Handling\n`;
      md += `- **Network Failure:** ${s.error_handling.network_failure}\n`;
      md += `- **Validation Error:** ${s.error_handling.validation_error}\n`;
      md += `- **Empty State:** ${s.error_handling.empty_state}\n\n`;
    }

    return md;
  }

  _renderComponentsMarkdown(components) {
    let md = `# Component Specifications (Design → Code Contracts)\n\n`;

    for (const c of components) {
      md += `## ${c.id}: ${c.name}\n`;
      md += `> **Category:** \`${c.category}\` | **Parent Screen:** \`${c.screen_id}\`\n\n`;
      md += `${c.description}\n\n`;

      md += `### 8-State Interaction Matrix\n`;
      md += `| State | Specification & Behavior |\n`;
      md += `|---|---|\n`;
      for (const [st, def] of Object.entries(c.states)) {
        md += `| **${st}** | ${def.description} |\n`;
      }
      md += `\n`;

      md += `### Accessibility & Dimensions\n`;
      md += `- **ARIA Role:** \`${c.accessibility.aria_role}\`\n`;
      md += `- **ARIA Label:** \`${c.accessibility.aria_label}\`\n`;
      md += `- **Keyboard Navigation:** ${c.accessibility.keyboard_navigation}\n`;
      md += `- **Focus Indicator:** \`${c.accessibility.focus_indicator}\`\n`;
      md += `- **Min Height:** \`${c.dimensions.min_height}\`\n`;
      md += `- **Padding:** \`${c.dimensions.padding}\`\n\n`;
    }

    return md;
  }

  _renderUxMd(designBundle) {
    let md = `# UX Contract: ${designBundle.feature_id}\n\n`;
    md += `**Feature ID:** \`UX-${designBundle.feature_id}\`  \n`;
    md += `**Designer:** UX Architect  \n`;
    md += `**Generated By:** AgentSDLC Phase 5 Design Factory  \n\n`;
    md += `---\n\n`;

    md += `## 8-State Interaction Contract\n`;
    md += `1. **Initial / Idle**: Clean task creation input form with placeholder "Describe feature to decompose...".\n`;
    md += `2. **Loading / Pending**: Animated skeleton cards indicating AI generation in-flight.\n`;
    md += `3. **Success**: Toast notification "Task slice created" and visual update of task list.\n`;
    md += `4. **Empty State**: Empty board illustration with "No tasks yet. Create one above."\n`;
    md += `5. **Error State**: Red-bordered input with RFC 7807 problem details and "Retry" CTA.\n`;
    md += `6. **Partial State**: Saved tasks render normally; failed remote AI decomposition shows offline badge.\n`;
    md += `7. **Offline State**: Read-only access to cached tasks with offline warning banner.\n`;
    md += `8. **Destructive Action**: Task deletion requires modal confirmation with explicit "Delete Task" button.\n\n`;

    md += `## Screen Inventory\n`;
    for (const s of designBundle.screens) {
      md += `- **${s.id}** (\`${s.route}\`): Maps to requirements ${s.requirement_ids.join(', ')}\n`;
    }
    md += `\n`;

    md += `## Component Contract Inventory\n`;
    for (const c of designBundle.components) {
      md += `- **${c.id}** (\`${c.name}\`): Category \`${c.category}\` on \`${c.screen_id}\`\n`;
    }
    md += `\n`;

    return md;
  }
}
