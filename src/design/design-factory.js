import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Design Factory Core Engine (Phase 5).
 *
 * Converts product requirements, contracts, and user preferences into
 * implementation-ready UX and UI specifications without writing UI code prematurely.
 */
export class DesignFactory {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Generates a complete design specification bundle for a given feature.
   *
   * @param {object} options
   * @param {string} [options.featureId='001-ai-task-copilot']
   * @param {object} [options.userPreferences] - Optional override of design preferences
   * @returns {Promise<object>} Complete design specification bundle
   */
  async generateDesignBundle(options = {}) {
    const featureId = options.featureId || '001-ai-task-copilot';

    // 1. Ingest Product Contract & Discovery
    const productContract = await this._loadProductContract();
    const spec = await this._loadFeatureSpec(featureId);

    // 2. Capture & Preserve User Design Preferences
    const { designPreferences, designAssumptions } = this._resolveDesignPreferences(
      productContract,
      options.userPreferences
    );

    // 3. Generate Personas from Product Contract
    const personas = this._generatePersonas(productContract);

    // 4. Generate User Journeys
    const journeys = this._generateJourneys(personas, spec);

    // 5. Generate Information Architecture (IA)
    const informationArchitecture = this._generateInformationArchitecture(spec);

    // 6. Generate User Flows
    const userFlows = this._generateUserFlows(spec);

    // 7. Generate Design System Tokens
    const designSystem = this._generateDesignSystem(designPreferences);

    // 8. Generate Screen Specifications (mapped to REQ-xxx)
    const screens = this._generateScreenSpecifications(spec, designPreferences);

    // 9. Generate Component Specifications (Design -> Code Contracts with 8 states)
    const components = this._generateComponentSpecifications(screens, designSystem);

    // 10. Generate Traceability Matrix
    const traceability = this._buildTraceabilityMatrix(spec.requirements, screens, components);

    return {
      feature_id: featureId,
      version: '1.0.0',
      generated_at: new Date().toISOString(),
      personas,
      journeys,
      information_architecture: informationArchitecture,
      user_flows: userFlows,
      design_preferences: designPreferences,
      design_assumptions: designAssumptions,
      design_system: designSystem,
      screens,
      components,
      traceability
    };
  }

  // --- Private Helpers ---

  async _loadProductContract() {
    try {
      const contractPath = path.join(this.projectRoot, 'product', 'product-contract.json');
      const content = await fs.readFile(contractPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return {
        title: 'AgentSDLC Application',
        users: [
          { persona: 'Lead Software Architect', needs: 'Vertical slice decomposition and contract drift detection' },
          { persona: 'Autonomous AI Agent', needs: 'Unambiguous specs and machine-verifiable gates' }
        ],
        ux_preferences: { style: 'modern-clean', platforms: ['Web', 'Mobile'] },
        features: [{ name: 'Task Decomposition Engine', description: 'Decomposes complex requests' }]
      };
    }
  }

  async _loadFeatureSpec(featureId) {
    const specPath = path.join(this.projectRoot, 'specs', featureId, 'spec.md');
    let requirements = [];
    try {
      const content = await fs.readFile(specPath, 'utf8');
      const matches = content.match(/REQ-[A-Z0-9_.-]+/g) || [];
      const unique = [...new Set(matches)];
      requirements = unique.map(id => {
        let desc = `Requirement ${id}`;
        const regex = new RegExp(`###?\\s*.*\\[?${id}\\]?[\\s\\S]*?(?=###|$)`, 'i');
        const m = content.match(regex);
        if (m) desc = m[0].split('\n')[0].replace(/^[#\s]+/, '').trim();
        return { id, description: desc };
      });
    } catch {
      requirements = [
        { id: 'REQ-001.1', description: 'Task entity repository and persistence' },
        { id: 'REQ-001.2', description: 'Task HTTP controller with RFC 7807 problem validation' },
        { id: 'REQ-001.3', description: 'AI decomposition tool definition and eval benchmark' }
      ];
    }

    if (requirements.length === 0) {
      requirements = [
        { id: 'REQ-001.1', description: 'Task entity repository and persistence' },
        { id: 'REQ-001.2', description: 'Task HTTP controller with RFC 7807 problem validation' },
        { id: 'REQ-001.3', description: 'AI decomposition tool definition and eval benchmark' }
      ];
    }

    return { featureId, requirements };
  }

  _resolveDesignPreferences(productContract, overrides = {}) {
    const contractUx = productContract.ux_preferences || {};
    const assumptions = [];

    // Preserved user preferences
    const visualStyle = overrides.visual_style || contractUx.style || 'modern-clean';
    const platforms = overrides.platforms || contractUx.platforms || ['Web', 'Mobile'];
    const density = overrides.density || contractUx.density || 'comfortable';

    // Check for gaps and record assumptions
    let colorSystem = overrides.color_system;
    if (!colorSystem) {
      colorSystem = 'HSL tailored slate-cyan palette with dark-mode support';
      assumptions.push({
        id: 'D-ASSUMP-001',
        category: 'COLOR_SYSTEM',
        assumption: 'Adopt tailored slate-cyan HSL palette with WCAG AAA contrast',
        rationalization: 'User did not specify a brand color hex; standardizing on accessible slate-cyan theme.'
      });
    }

    let typography = overrides.typography;
    if (!typography) {
      typography = 'Inter (sans-serif) for UI / JetBrains Mono for code blocks';
      assumptions.push({
        id: 'D-ASSUMP-002',
        category: 'TYPOGRAPHY',
        assumption: 'Use modern sans-serif typography (Inter) with monospace code accents',
        rationalization: 'Optimizes readability across desktop and mobile screens.'
      });
    }

    let motion = overrides.motion;
    if (!motion) {
      motion = 'Subtle micro-interactions with prefers-reduced-motion fallback';
      assumptions.push({
        id: 'D-ASSUMP-003',
        category: 'MOTION',
        assumption: 'Micro-animations capped at 250ms with accessible motion suppression',
        rationalization: 'Ensures snappy interaction without triggering motion sensitivity.'
      });
    }

    const designPreferences = {
      visual_style: visualStyle,
      color_system: colorSystem,
      typography: typography,
      spacing: '8px base grid',
      density: density,
      radius: 'rounded-md (6px / 8px)',
      motion: motion,
      accessibility: 'WCAG 2.1 AA minimum contrast and full keyboard operability',
      platforms: platforms,
      reference_products: overrides.reference_products || ['GitHub Projects', 'Linear', 'VS Code'],
      brand: overrides.brand || 'Engineering OS Design Language',
      restrictions: overrides.restrictions || [
        'No unconstrained layout shifts (CLS < 0.1)',
        'No critical actions without explicit confirmation modal'
      ]
    };

    return { designPreferences, designAssumptions: assumptions };
  }

  _generatePersonas(productContract) {
    const rawUsers = productContract.users || [];
    if (rawUsers.length > 0) {
      return rawUsers.map((u, i) => ({
        id: `PERS-${String(i + 1).padStart(3, '0')}`,
        name: u.persona,
        role: u.persona,
        goals: [u.needs || 'Achieve reliable task delivery'],
        pain_points: ['Context drift', 'Ambiguous acceptance criteria', 'Silent regressions'],
        device_context: 'Desktop high-res monitor & mobile review on-the-go'
      }));
    }

    return [
      {
        id: 'PERS-001',
        name: 'Lead Software Architect',
        role: 'Engineering Lead',
        goals: ['Automated vertical slice decomposition', 'Strict contract drift detection'],
        pain_points: ['Incomplete UI states', 'Lack of traceability between requirements and UI'],
        device_context: 'Desktop workstation (1920x1080)'
      }
    ];
  }

  _generateJourneys(personas, spec) {
    return personas.map(p => ({
      id: `JOURNEY-${p.id}`,
      title: `${p.name} - End-to-End Task Management Flow`,
      persona_id: p.id,
      stages: [
        {
          stage_name: 'Discovery & Initiation',
          user_action: 'Views task dashboard and initiates new task creation',
          system_response: 'Renders Task Creator component in idle state with empty form'
        },
        {
          stage_name: 'Specification & Input',
          user_action: 'Submits task title and feature details',
          system_response: 'Transitions to loading state with skeleton cards; executes validation'
        },
        {
          stage_name: 'Verification & Review',
          user_action: 'Inspects decomposed vertical slices and verifies acceptance criteria',
          system_response: 'Renders updated task board with active status badges'
        }
      ]
    }));
  }

  _generateInformationArchitecture(spec) {
    return {
      navigation_model: 'Top-level app bar with sidebar category filtering and modal details overlay',
      hierarchy: [
        'Dashboard / Overview View',
        'Task Decomposition Workspace',
        'Verification & Evidence Log Modal',
        'Settings & Contract Configuration'
      ],
      views: [
        'VIEW-DASHBOARD: High-level SDLC status and task velocity',
        'VIEW-TASK-EDITOR: Granular vertical slice creator and inspector',
        'VIEW-EVAL-REPORT: AI decomposition benchmark results and scorecards'
      ]
    };
  }

  _generateUserFlows(spec) {
    return [
      {
        flow_id: 'FLOW-CREATE-TASK',
        title: 'Create and Decompose Task Slice',
        steps: [
          { step: 1, action: 'User opens task creator input form', target_screen: 'SCREEN-TASK-DASHBOARD' },
          { step: 2, action: 'User submits task title and tags', target_screen: 'SCREEN-TASK-DASHBOARD' },
          { step: 3, action: 'System validates against RFC 7807 problem constraints', target_screen: 'SCREEN-TASK-DASHBOARD' },
          { step: 4, action: 'System triggers AI decomposition and displays live progress', target_screen: 'SCREEN-TASK-DETAILS' }
        ]
      },
      {
        flow_id: 'FLOW-REVIEW-EVIDENCE',
        title: 'Review Machine-Verifiable Task Evidence',
        steps: [
          { step: 1, action: 'User selects task slice from dashboard', target_screen: 'SCREEN-TASK-DETAILS' },
          { step: 2, action: 'System displays test results, contract schema, and audit trail', target_screen: 'SCREEN-TASK-DETAILS' }
        ]
      }
    ];
  }

  _generateDesignSystem(preferences) {
    return {
      name: 'AgentSDLC Factory Design System',
      version: '1.0.0',
      visual_style: preferences.visual_style,
      density: preferences.density,
      platforms: preferences.platforms,
      color_system: {
        primary: 'hsl(215, 80%, 48%)',
        primary_foreground: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(215, 20%, 94%)',
        secondary_foreground: 'hsl(215, 60%, 15%)',
        accent: 'hsl(190, 90%, 42%)',
        background: 'hsl(220, 25%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        neutral: {
          border: 'hsl(215, 20%, 88%)',
          text_primary: 'hsl(220, 40%, 12%)',
          text_secondary: 'hsl(215, 15%, 42%)',
          text_muted: 'hsl(215, 10%, 60%)'
        },
        status: {
          success: 'hsl(145, 65%, 40%)',
          warning: 'hsl(38, 92%, 50%)',
          error: 'hsl(0, 75%, 55%)',
          info: 'hsl(200, 85%, 50%)'
        }
      },
      typography: {
        font_family: {
          sans: 'Inter, system-ui, -apple-system, sans-serif',
          mono: 'JetBrains Mono, ui-monospace, monospace'
        },
        font_sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        font_weights: {
          regular: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      },
      spacing: {
        unit_px: 8,
        scale: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          '2xl': '48px'
        }
      },
      radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px'
      },
      motion: {
        durations: {
          fast: '150ms',
          normal: '250ms',
          slow: '400ms'
        },
        easings: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          ease_in_out: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      },
      elevation: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      },
      responsive_breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      accessibility: {
        wcag_level: 'AA',
        min_contrast_ratio: 4.5,
        focus_indicator: '2px solid hsl(215, 80%, 48%) with 2px offset'
      }
    };
  }

  _generateScreenSpecifications(spec, preferences) {
    const reqIds = spec.requirements.map(r => r.id);

    return [
      {
        id: 'SCREEN-TASK-DASHBOARD',
        title: 'AI Task Copilot Dashboard',
        route: '/tasks',
        layout_archetype: 'dashboard',
        requirement_ids: reqIds.slice(0, 2), // Maps to REQ-001.1 and REQ-001.2
        journey_stage: 'Discovery & Initiation',
        user_flow_step: 'FLOW-CREATE-TASK: Step 1 & 2',
        components: ['COMP-TASK-CREATOR', 'COMP-TASK-LIST', 'COMP-STATUS-BADGE'],
        wireframe: {
          header: 'Top navigation bar with workspace switcher and SDLC health indicator',
          sidebar: 'Filter by tags, status (todo, in-progress, completed), and assigned agent',
          main_content: 'Task creation form followed by responsive task grid cards',
          footer: 'System status bar displaying contract verification hash and active gates'
        },
        error_handling: {
          network_failure: 'Displays persistent offline banner with cached task access',
          validation_error: 'Inline red banner mapping RFC 7807 error detail to input field',
          empty_state: 'Renders empty state illustration with single CTA to create first task'
        },
        responsive_adaptations: {
          mobile: 'Single column layout, collapsible filters, bottom action sheet',
          desktop: 'Multi-column dashboard with persistent sidebar and real-time activity stream'
        }
      },
      {
        id: 'SCREEN-TASK-DETAILS',
        title: 'Task Decomposition & Evidence Inspector',
        route: '/tasks/:id',
        layout_archetype: 'master-detail',
        requirement_ids: reqIds.length > 2 ? [reqIds[2]] : [reqIds[0]], // Maps to REQ-001.3
        journey_stage: 'Verification & Review',
        user_flow_step: 'FLOW-REVIEW-EVIDENCE: Step 1 & 2',
        components: ['COMP-EVAL-CARD', 'COMP-STATUS-BADGE', 'COMP-DELETE-MODAL'],
        wireframe: {
          header: 'Breadcrumbs navigation with back-to-dashboard CTA and status pill',
          main_content: 'Split panel: left side shows task specification; right side shows verification evidence',
          footer: 'Execution toolbar with rollback button, re-verify CTA, and delete action'
        },
        error_handling: {
          network_failure: 'Retry button with exponential backoff indicator',
          validation_error: 'Detailed RFC 7807 dialog with stack trace and spec cross-reference',
          empty_state: 'Placeholder card: "No AI evaluation benchmark recorded yet."'
        },
        responsive_adaptations: {
          mobile: 'Tabbed interface alternating between Specification and Verification evidence',
          desktop: 'Side-by-side synchronized scroll view with active gate checklist'
        }
      }
    ];
  }

  _generateComponentSpecifications(screens, designSystem) {
    return [
      {
        id: 'COMP-TASK-CREATOR',
        name: 'Task Creator Input Form',
        category: 'input',
        screen_id: 'SCREEN-TASK-DASHBOARD',
        description: 'Primary input component for creating and decomposing new tasks',
        states: {
          initial: { description: 'Input field idle with placeholder "Describe feature to decompose..."' },
          loading: { description: 'Disabled submit button with animated spinner; opacity 0.7' },
          success: { description: 'Green highlight ring, input cleared, toast notification displayed' },
          empty: { description: 'Default placeholder rendered; validation message hidden' },
          error: { description: 'Red border (status.error), RFC 7807 error detail displayed below input' },
          partial: { description: 'Title validated locally; remote AI tags pending background fetch' },
          offline: { description: 'Offline warning badge; input disabled with "Offline mode" notice' },
          destructive: { description: 'Clear form warning dialog if dirty state exists' }
        },
        dimensions: {
          width: '100%',
          min_height: '44px',
          padding: '8px 16px',
          margin: '0 0 16px 0'
        },
        visual_properties: {
          background: designSystem.color_system.surface,
          border: `1px solid ${designSystem.color_system.neutral.border}`,
          border_radius: designSystem.radius.md,
          typography: designSystem.typography.font_family.sans,
          elevation: designSystem.elevation.sm
        },
        behavior: {
          on_mount: 'Focus input if URL parameter autofocus=true is present',
          on_error: 'Scroll to error message and announce via aria-live="assertive"',
          validation: 'Trim whitespace, check non-empty and length <= 255 characters'
        },
        interaction: {
          events: ['input', 'keydown (Enter submits)', 'blur', 'focus'],
          transitions: `all ${designSystem.motion.durations.normal} ${designSystem.motion.easings.default}`
        },
        accessibility: {
          aria_role: 'form',
          aria_label: 'Create new task form',
          keyboard_navigation: 'Tab accessible, Enter submits, Esc clears current input',
          focus_indicator: designSystem.accessibility.focus_indicator
        },
        responsive_behavior: {
          mobile: 'Full width stacked layout, button below input',
          desktop: 'Inline horizontal flex layout with integrated submit button'
        },
        tokens: {
          color: 'color_system.surface',
          spacing: 'spacing.scale.md',
          radius: 'radius.md'
        }
      },
      {
        id: 'COMP-TASK-LIST',
        name: 'Task Card Grid',
        category: 'display',
        screen_id: 'SCREEN-TASK-DASHBOARD',
        description: 'Interactive list and card grid rendering active task slices',
        states: {
          initial: { description: 'Renders cached task items in chronological order' },
          loading: { description: '3 animated skeleton cards with pulse animation' },
          success: { description: 'Renders complete list of task cards with green status badges' },
          empty: { description: 'Empty state illustration with text: "No tasks yet. Create one above."' },
          error: { description: 'Error banner with "Failed to load tasks" and retry button' },
          partial: { description: 'Cached tasks rendered with top banner indicating sync in progress' },
          offline: { description: 'Read-only view of cached tasks with offline notice banner' },
          destructive: { description: 'Task deletion animates card fade-out and slide-up' }
        },
        dimensions: {
          width: '100%',
          min_height: '200px',
          padding: '16px',
          margin: '16px 0'
        },
        visual_properties: {
          background: designSystem.color_system.background,
          border: 'none',
          border_radius: designSystem.radius.md,
          typography: designSystem.typography.font_family.sans
        },
        behavior: {
          on_mount: 'Fetch task entities and subscribe to background synchronization',
          on_error: 'Render fallback cached items with retry CTA',
          validation: 'Validate each task entity structure before rendering'
        },
        interaction: {
          events: ['click (card selection)', 'keydown (Arrow keys navigate cards)'],
          transitions: `transform ${designSystem.motion.durations.fast}`
        },
        accessibility: {
          aria_role: 'list',
          aria_label: 'Decomposed task list',
          keyboard_navigation: 'Arrow up/down to navigate tasks; Enter opens details',
          focus_indicator: designSystem.accessibility.focus_indicator
        },
        responsive_behavior: {
          mobile: 'Single column vertical stack of cards',
          desktop: 'Responsive 2-column or 3-column grid layout'
        },
        tokens: {
          color: 'color_system.background',
          spacing: 'spacing.scale.lg',
          radius: 'radius.md'
        }
      },
      {
        id: 'COMP-STATUS-BADGE',
        name: 'Task Status Pill',
        category: 'feedback',
        screen_id: 'SCREEN-TASK-DASHBOARD',
        description: 'Visual indicator displaying lifecycle status (todo, in_progress, completed)',
        states: {
          initial: { description: 'Gray neutral pill for "todo" state' },
          loading: { description: 'Pulsing blue pill indicating task execution active' },
          success: { description: 'Solid green pill indicating passing tests and verified evidence' },
          empty: { description: 'Muted outline pill' },
          error: { description: 'Red pill indicating quality gate failure or contract drift' },
          partial: { description: 'Amber pill indicating partially verified vertical slice' },
          offline: { description: 'Dashed border pill indicating offline status' },
          destructive: { description: 'Red outline pill with delete icon' }
        },
        dimensions: {
          min_height: '24px',
          padding: '2px 8px'
        },
        visual_properties: {
          background: designSystem.color_system.surface,
          border: `1px solid ${designSystem.color_system.neutral.border}`,
          border_radius: designSystem.radius.full,
          typography: designSystem.typography.font_family.sans
        },
        behavior: {
          on_mount: 'Render status color corresponding to entity.status',
          on_error: 'Fallback to neutral status badge',
          validation: 'Check status is one of canonical lifecycle statuses'
        },
        interaction: {
          events: ['hover (tooltip display)'],
          transitions: 'color 150ms ease'
        },
        accessibility: {
          aria_role: 'status',
          aria_label: 'Task lifecycle status',
          keyboard_navigation: 'Non-interactive or focusable with tooltip description',
          focus_indicator: 'none'
        },
        responsive_behavior: {
          mobile: 'Compact size (font-size xs)',
          desktop: 'Standard size (font-size sm)'
        },
        tokens: {
          color: 'color_system.surface',
          spacing: 'spacing.scale.xs',
          radius: 'radius.full'
        }
      },
      {
        id: 'COMP-EVAL-CARD',
        name: 'AI Evaluation Benchmark Card',
        category: 'display',
        screen_id: 'SCREEN-TASK-DETAILS',
        description: 'Inspects AI tool decomposition benchmarks, accuracy score, and latency',
        states: {
          initial: { description: 'Renders baseline benchmark scorecards' },
          loading: { description: 'Progress bar simulating live evaluation dataset execution' },
          success: { description: 'Pass badge with score > threshold (e.g. 95% pass rate)' },
          empty: { description: 'Notice: "No evaluation runs recorded for this task"' },
          error: { description: 'Red scorecard with failing prompts highlighted' },
          partial: { description: 'Warning badge: "Evaluation completed with warnings"' },
          offline: { description: 'Cached evaluation metrics with timestamp' },
          destructive: { description: 'Purge benchmark dataset confirmation dialog' }
        },
        dimensions: {
          width: '100%',
          min_height: '180px',
          padding: '16px'
        },
        visual_properties: {
          background: designSystem.color_system.surface,
          border: `1px solid ${designSystem.color_system.neutral.border}`,
          border_radius: designSystem.radius.lg,
          typography: designSystem.typography.font_family.sans
        },
        behavior: {
          on_mount: 'Load latest eval-runner JSON report for active feature',
          on_error: 'Display fallback error details',
          validation: 'Verify eval dataset schema integrity'
        },
        interaction: {
          events: ['click (expand test prompt breakdown)'],
          transitions: `height ${designSystem.motion.durations.normal}`
        },
        accessibility: {
          aria_role: 'region',
          aria_label: 'AI benchmark results',
          keyboard_navigation: 'Tab to inspect individual prompt details',
          focus_indicator: designSystem.accessibility.focus_indicator
        },
        responsive_behavior: {
          mobile: 'Stacked metric indicators',
          desktop: 'Multi-column grid displaying Accuracy, P95 Latency, and Cost'
        },
        tokens: {
          color: 'color_system.surface',
          spacing: 'spacing.scale.md',
          radius: 'radius.lg'
        }
      },
      {
        id: 'COMP-DELETE-MODAL',
        name: 'Destructive Confirmation Modal',
        category: 'overlay',
        screen_id: 'SCREEN-TASK-DETAILS',
        description: 'Modal barrier preventing accidental task deletion or scope alteration',
        states: {
          initial: { description: 'Hidden / closed state (display: none)' },
          loading: { description: 'Delete button disabled with spinner during HTTP DELETE' },
          success: { description: 'Modal closes, toast confirms deletion' },
          empty: { description: 'Standard confirmation prompt displayed' },
          error: { description: 'Error message within modal if delete request fails' },
          partial: { description: 'Disabled if user lacks deletion authority' },
          offline: { description: 'Blocked with notice: "Cannot delete tasks in offline mode"' },
          destructive: { description: 'Prominent red "Delete Permanently" button with double confirmation' }
        },
        dimensions: {
          width: '450px',
          min_height: '220px',
          padding: '24px'
        },
        visual_properties: {
          background: designSystem.color_system.surface,
          border: `1px solid ${designSystem.color_system.status.error}`,
          border_radius: designSystem.radius.lg,
          typography: designSystem.typography.font_family.sans,
          elevation: designSystem.elevation.lg
        },
        behavior: {
          on_mount: 'Trap focus within modal dialog',
          on_error: 'Render error banner and keep modal open for retry',
          validation: 'Require user to type task ID or click explicit confirm button'
        },
        interaction: {
          events: ['click (outside backdrop cancels)', 'keydown (Escape cancels)'],
          transitions: `opacity ${designSystem.motion.durations.fast}`
        },
        accessibility: {
          aria_role: 'alertdialog',
          aria_label: 'Confirm task deletion',
          keyboard_navigation: 'Focus trapped; Esc dismisses; Tab cycles Cancel and Delete buttons',
          focus_indicator: designSystem.accessibility.focus_indicator
        },
        responsive_behavior: {
          mobile: 'Full-screen bottom sheet modal',
          desktop: 'Centered overlay dialog with darkened backdrop'
        },
        tokens: {
          color: 'color_system.surface',
          spacing: 'spacing.scale.lg',
          radius: 'radius.lg'
        }
      }
    ];
  }

  _buildTraceabilityMatrix(requirements, screens, components) {
    const matrix = [];

    for (const req of requirements) {
      // Find screens that claim this requirement
      const matchedScreens = screens.filter(s => s.requirement_ids.includes(req.id)).map(s => s.id);
      // Find components residing on those screens
      const matchedComponents = components.filter(c => matchedScreens.includes(c.screen_id)).map(c => c.id);

      matrix.push({
        requirement_id: req.id,
        screen_ids: matchedScreens,
        component_ids: matchedComponents
      });
    }

    return { matrix };
  }
}
