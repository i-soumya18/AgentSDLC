import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export function createEmptyDiscoveryState(rawIdea = '') {
  const now = new Date().toISOString();
  return {
    raw_idea: rawIdea.trim(),
    status: 'IN_PROGRESS',
    completeness_score: 0.0,
    intent: {
      primary_goal: '',
      problem_statement: '',
      domain: 'general'
    },
    users: [],
    problems: [],
    desired_outcomes: [],
    features: [],
    constraints: [],
    preferences: {
      platform: [],
      tech_stack: [],
      ui_style: 'standard'
    },
    assumptions: [],
    unknowns: [],
    decisions: [],
    risks: [],
    contradictions: [],
    created_at: now,
    updated_at: now
  };
}

export function analyzeIdeaText(rawText) {
  const text = rawText.toLowerCase();
  const analysis = {
    domain: 'general',
    primary_goal: rawText.slice(0, 120),
    problem_statement: '',
    users: [],
    problems: [],
    outcomes: [],
    features: [],
    constraints: [],
    platforms: [],
    tech_stack: [],
    assumptions: [],
    contradictions: []
  };

  // Domain detection
  if (text.includes('pharmacy') || text.includes('medicine') || text.includes('prescription') || text.includes('drug')) {
    analysis.domain = 'healthcare/pharmacy';
    analysis.problem_statement = 'Managing pharmacy inventory, sales, and prescription handling efficiently.';
  } else if (text.includes('student') || text.includes('school') || text.includes('learn') || text.includes('course')) {
    analysis.domain = 'education';
    analysis.problem_statement = 'Assisting students and educators in tracking academic progress and resources.';
  } else if (text.includes('pos') || text.includes('billing') || text.includes('invoice') || text.includes('checkout') || text.includes('store')) {
    analysis.domain = 'retail/pos';
    analysis.problem_statement = 'Streamlining point-of-sale checkout, inventory tracking, and transaction records.';
  } else if (text.includes('cli') || text.includes('developer') || text.includes('code') || text.includes('git') || text.includes('api')) {
    analysis.domain = 'developer_tools';
    analysis.problem_statement = 'Automating engineering workflows, task slicing, and contract governance.';
  } else {
    analysis.problem_statement = `Solving core user challenges related to: ${rawText.slice(0, 100)}`;
  }

  // Personas extraction
  if (text.includes('pharmacist') || text.includes('pharmacy staff')) {
    analysis.users.push({ persona: 'Pharmacist', needs: 'Fast inventory lookup and dispensation', confirmed: true });
  }
  if (text.includes('cashier') || text.includes('billing staff')) {
    analysis.users.push({ persona: 'Cashier', needs: 'Rapid checkout and bill generation', confirmed: true });
  }
  if (text.includes('student')) {
    analysis.users.push({ persona: 'Student', needs: 'Organizing tasks and learning material', confirmed: true });
  }
  if (text.includes('admin') || text.includes('manager') || text.includes('owner')) {
    analysis.users.push({ persona: 'Store Manager/Owner', needs: 'Revenue reporting and audit control', confirmed: true });
  }

  // Feature detection
  const featureKeywords = [
    { key: 'inventory', name: 'Inventory Management', desc: 'Track stock levels, reorder points, and item batches' },
    { key: 'billing', name: 'Billing & POS', desc: 'Process sales transactions, taxes, and receipt generation' },
    { key: 'prescription', name: 'Prescription Tracking', desc: 'Record doctor prescriptions and patient dispensation' },
    { key: 'customer', name: 'Customer Management', desc: 'Manage customer records and purchase history' },
    { key: 'report', name: 'Reports & Analytics', desc: 'Generate sales, profit, and turnover summaries' },
    { key: 'auth', name: 'Authentication & Roles', desc: 'User login and permission enforcement' },
    { key: 'task', name: 'Task Management', desc: 'Create, track, and decompose development tasks' },
    { key: 'git', name: 'Git Integration', desc: 'Automate commits, branches, and diff detection' },
    { key: 'cli', name: 'Command-Line Interface', desc: 'Interactive and non-interactive terminal commands' },
    { key: 'storage', name: 'Local Persistence', desc: 'Store data in local database or filesystem' }
  ];

  for (const item of featureKeywords) {
    if (text.includes(item.key)) {
      analysis.features.push({
        name: item.name,
        description: item.desc,
        priority: 'must',
        confirmed: true
      });
    }
  }

  // Platform extraction
  if (text.includes('mobile') || text.includes('android') || text.includes('ios')) {
    analysis.platforms.push('Mobile');
  }
  if (text.includes('web') || text.includes('browser') || text.includes('desktop')) {
    analysis.platforms.push('Web/Desktop');
  }

  // Constraints extraction
  if (text.includes('offline')) {
    analysis.constraints.push({ type: 'connectivity', description: 'Must support offline transactions with local sync', confirmed: true });
  }
  if (text.includes('single pharmacy') || text.includes('single store')) {
    analysis.constraints.push({ type: 'architecture', description: 'Single location / single branch scope', confirmed: true });
  }
  if (text.includes('multi-tenant') || text.includes('multiple branches')) {
    analysis.constraints.push({ type: 'architecture', description: 'Multi-branch / multi-tenant database partitioning', confirmed: true });
  }

  // Contradiction detection
  const hasOffline = text.includes('offline');
  const hasCloudOnly = text.includes('cloud-only') || text.includes('no local storage');
  if (hasOffline && hasCloudOnly) {
    analysis.contradictions.push({
      id: 'CONTRA-001',
      conflict: 'Conflicting connectivity requirements: offline operation requested with cloud-only storage',
      items: ['offline operation', 'cloud-only storage'],
      resolved: false
    });
  }

  const hasMobileOnly = text.includes('mobile only') || text.includes('mobile-only');
  const hasDesktopWeb = text.includes('desktop only') || text.includes('desktop-only');
  if (hasMobileOnly && hasDesktopWeb) {
    analysis.contradictions.push({
      id: 'CONTRA-002',
      conflict: 'Conflicting platform constraints: mobile-only vs desktop-only',
      items: ['mobile-only', 'desktop-only'],
      resolved: false
    });
  }

  return analysis;
}

export function computeAdaptiveQuestions(state) {
  const candidateQuestions = [];
  const text = state.raw_idea.toLowerCase();

  // If users unknown or empty
  if (state.users.length === 0) {
    candidateQuestions.push({
      id: 'UNK-USER',
      category: 'intent',
      question: 'Who are the primary people using this application (e.g. pharmacists, cashiers, store owners, or general consumers)?',
      impact: 'critical',
      uncertainty: 1.0,
      dependency: 3,
      risk: 4,
      resolved: false,
      answer: null
    });
  }

  // If domain is pharmacy/pos, check prescription tracking
  if (state.intent.domain.includes('pharmacy') && !state.features.some(f => f.name.includes('Prescription'))) {
    candidateQuestions.push({
      id: 'UNK-PRESCRIPTION',
      category: 'scope',
      question: 'Should the MVP support prescription tracking and doctor details, or only general retail products?',
      impact: 'high',
      uncertainty: 0.9,
      dependency: 2,
      risk: 3,
      resolved: false,
      answer: null
    });
  }

  // Check offline requirement
  if (!state.constraints.some(c => c.type === 'connectivity')) {
    candidateQuestions.push({
      id: 'UNK-OFFLINE',
      category: 'architecture',
      question: 'Does billing need to function offline without an active internet connection?',
      impact: 'high',
      uncertainty: 0.8,
      dependency: 3,
      risk: 3,
      resolved: false,
      answer: null
    });
  }

  // Check single branch vs multi-branch
  if (!state.constraints.some(c => c.type === 'architecture')) {
    candidateQuestions.push({
      id: 'UNK-BRANCH',
      category: 'scope',
      question: 'Is this for a single store/pharmacy location or multiple branches with centralized reporting?',
      impact: 'high',
      uncertainty: 0.85,
      dependency: 2,
      risk: 3,
      resolved: false,
      answer: null
    });
  }

  // Check platform preference if missing
  if (state.preferences.platform.length === 0) {
    candidateQuestions.push({
      id: 'UNK-PLATFORM',
      category: 'ux',
      question: 'What platform will users access this on (Web browser, Mobile Android/iOS, or Desktop application)?',
      impact: 'medium',
      uncertainty: 0.7,
      dependency: 2,
      risk: 2,
      resolved: false,
      answer: null
    });
  }

  // Sort by Question Value = impact * uncertainty * dependency * risk
  const impactWeights = { low: 1, medium: 2, high: 3, critical: 4 };
  candidateQuestions.sort((a, b) => {
    const scoreA = (impactWeights[a.impact] || 2) * a.uncertainty * a.dependency * a.risk;
    const scoreB = (impactWeights[b.impact] || 2) * b.uncertainty * b.dependency * b.risk;
    return scoreB - scoreA;
  });

  return candidateQuestions;
}

export function updateCompletenessScore(state) {
  let score = 0.0;

  // Intent completeness (up to 0.3)
  if (state.intent.primary_goal && state.intent.primary_goal.length > 5) score += 0.15;
  if (state.intent.problem_statement && state.intent.problem_statement.length > 10) score += 0.15;

  // Users defined (up to 0.2)
  if (state.users.length > 0) {
    const confirmedCount = state.users.filter(u => u.confirmed).length;
    score += confirmedCount > 0 ? 0.2 : 0.1;
  }

  // Scope & Features (up to 0.25)
  if (state.features.length > 0) {
    score += Math.min(0.25, state.features.length * 0.08);
  }

  // Constraints & Platforms (up to 0.25)
  if (state.constraints.length > 0) score += 0.15;
  if (state.preferences.platform.length > 0) score += 0.1;

  // Penalize unresolved contradictions
  const unresolvedContradictions = state.contradictions.filter(c => !c.resolved).length;
  if (unresolvedContradictions > 0) {
    score = Math.max(0.0, score - 0.4);
  }

  // Penalize critical unresolved unknowns
  const criticalUnknowns = state.unknowns.filter(u => !u.resolved && u.impact === 'critical').length;
  if (criticalUnknowns > 0) {
    score = Math.max(0.0, score - 0.3);
  }

  state.completeness_score = Math.min(1.0, Math.max(0.0, Math.round(score * 100) / 100));

  // Exit criteria check
  const hasCriticalUnknowns = state.unknowns.some(u => !u.resolved && (u.impact === 'critical' || u.impact === 'high'));
  const hasContradictions = state.contradictions.some(c => !c.resolved);

  if (state.completeness_score >= 0.80 && !hasCriticalUnknowns && !hasContradictions && state.intent.primary_goal) {
    state.status = 'DISCOVERY_COMPLETE';
  } else {
    state.status = 'IN_PROGRESS';
  }

  return state.completeness_score;
}

export function ingestIdea(rawIdea) {
  if (!rawIdea || typeof rawIdea !== 'string' || rawIdea.trim().length === 0) {
    throw new Error('Raw idea text must be a non-empty string.');
  }

  const state = createEmptyDiscoveryState(rawIdea);
  const analysis = analyzeIdeaText(rawIdea);

  state.intent.domain = analysis.domain;
  state.intent.primary_goal = analysis.primary_goal;
  state.intent.problem_statement = analysis.problem_statement;
  state.users = analysis.users;
  state.features = analysis.features;
  state.constraints = analysis.constraints;
  state.preferences.platform = analysis.platforms;
  state.contradictions = analysis.contradictions;

  // Add inferred assumptions if domain implies specific patterns
  if (state.intent.domain.includes('pharmacy') || state.intent.domain.includes('pos')) {
    state.assumptions.push({
      id: 'ASSUMPTION-001',
      assumption: 'Application requires secure transaction recording and audit logs',
      evidence_basis: 'Inferred from POS / financial domain requirements',
      confidence: 0.85,
      impact_if_invalid: 'high',
      validation_status: 'pending'
    });
  }

  // Compute adaptive unknowns
  state.unknowns = computeAdaptiveQuestions(state);
  updateCompletenessScore(state);

  return state;
}

export function applyClarification(answersText, state) {
  if (!answersText || typeof answersText !== 'string') {
    return state;
  }

  const text = answersText.toLowerCase();
  state.updated_at = new Date().toISOString();

  // Resolve users
  for (const u of state.unknowns) {
    if (u.id === 'UNK-USER' && !u.resolved) {
      if (text.includes('pharmacist') || text.includes('cashier') || text.includes('owner') || text.includes('student') || text.includes('developer')) {
        u.resolved = true;
        u.answer = answersText;
        if (text.includes('pharmacist')) state.users.push({ persona: 'Pharmacist', needs: 'Dispensary and stock oversight', confirmed: true });
        if (text.includes('cashier')) state.users.push({ persona: 'Cashier', needs: 'Point of sale billing', confirmed: true });
        if (text.includes('owner')) state.users.push({ persona: 'Pharmacy Owner', needs: 'Business reports and margins', confirmed: true });
      }
    }

    if (u.id === 'UNK-PRESCRIPTION' && !u.resolved) {
      if (text.includes('prescription') || text.includes('yes') || text.includes('track doctor')) {
        u.resolved = true;
        u.answer = 'Prescription tracking enabled';
        state.features.push({
          name: 'Prescription Tracking',
          description: 'Record doctor prescriptions and patient dispensation history',
          priority: 'must',
          confirmed: true
        });
      } else if (text.includes('no prescription') || text.includes('general only') || text.includes('no')) {
        u.resolved = true;
        u.answer = 'General retail items only (no prescription tracking)';
      }
    }

    if (u.id === 'UNK-OFFLINE' && !u.resolved) {
      if (text.includes('offline') || text.includes('yes')) {
        u.resolved = true;
        u.answer = 'Offline billing required';
        state.constraints.push({ type: 'connectivity', description: 'Offline-first billing with local SQLite cache', confirmed: true });
      } else if (text.includes('cloud only') || text.includes('no offline') || text.includes('online')) {
        u.resolved = true;
        u.answer = 'Always online connectivity acceptable';
      }
    }

    if (u.id === 'UNK-BRANCH' && !u.resolved) {
      if (text.includes('single') || text.includes('one store') || text.includes('one branch')) {
        u.resolved = true;
        u.answer = 'Single pharmacy location';
        state.constraints.push({ type: 'architecture', description: 'Single store architecture (no multi-branch complexity)', confirmed: true });
      } else if (text.includes('multi') || text.includes('multiple') || text.includes('chain')) {
        u.resolved = true;
        u.answer = 'Multi-branch chain architecture';
        state.constraints.push({ type: 'architecture', description: 'Multi-branch centralized sync', confirmed: true });
      }
    }

    if (u.id === 'UNK-PLATFORM' && !u.resolved) {
      if (text.includes('mobile') || text.includes('android')) {
        u.resolved = true;
        u.answer = 'Mobile Android';
        if (!state.preferences.platform.includes('Mobile')) state.preferences.platform.push('Mobile');
      }
      if (text.includes('web') || text.includes('browser') || text.includes('desktop')) {
        u.resolved = true;
        u.answer = 'Web/Desktop';
        if (!state.preferences.platform.includes('Web/Desktop')) state.preferences.platform.push('Web/Desktop');
      }
    }
  }

  // Resolve contradictions if user explicitly clarifies
  for (const c of state.contradictions) {
    if (c.id === 'CONTRA-001' && !c.resolved) {
      if (text.includes('prefer offline') || text.includes('use local sync')) {
        c.resolved = true;
        c.resolution = 'Resolved in favor of offline-first local storage with eventual cloud backup.';
      }
    }
  }

  // Validate or refute assumptions
  for (const a of state.assumptions) {
    if (a.validation_status === 'pending') {
      if (text.includes('no audit') || text.includes('skip logs')) {
        a.validation_status = 'refuted';
      } else if (text.includes('audit') || text.includes('secure') || text.includes('confirm')) {
        a.validation_status = 'validated';
      }
    }
  }

  updateCompletenessScore(state);
  return state;
}

export async function exportMarkdownArtifacts(projectRoot, state) {
  const productDir = path.join(projectRoot, 'product');
  await fs.mkdir(productDir, { recursive: true });

  // 1. discovery.json
  await fs.writeFile(path.join(productDir, 'discovery.json'), JSON.stringify(state, null, 2), 'utf8');

  // 2. intent.md
  const intentMd = `# Product Intent

**Domain:** ${state.intent.domain}  
**Status:** ${state.status}  
**Completeness Score:** ${(state.completeness_score * 100).toFixed(0)}%  
**Last Updated:** ${state.updated_at}  

## 1. Raw Idea
> ${state.raw_idea}

## 2. Primary Goal
${state.intent.primary_goal}

## 3. Problem Statement
${state.intent.problem_statement}
`;
  await fs.writeFile(path.join(productDir, 'intent.md'), intentMd, 'utf8');

  // 3. users.md
  const usersMd = `# Target Personas

| Persona | Key Needs | Confirmed? |
|---|---|:---:|
${state.users.map(u => `| **${u.persona}** | ${u.needs || 'N/A'} | ${u.confirmed ? '✓ Confirmed' : 'Inferred'} |`).join('\n') || '| (No personas identified yet) | - | - |'}
`;
  await fs.writeFile(path.join(productDir, 'users.md'), usersMd, 'utf8');

  // 4. problems.md
  const problemsMd = `# Problems & Pain Points

${state.problems.map((p, i) => `${i + 1}. ${p}`).join('\n') || `1. ${state.intent.problem_statement || 'General workflow inefficiency.'}`}
`;
  await fs.writeFile(path.join(productDir, 'problems.md'), problemsMd, 'utf8');

  // 5. outcomes.md
  const outcomesMd = `# Desired Outcomes

${state.desired_outcomes.map((o, i) => `${i + 1}. ${o}`).join('\n') || `1. Deliver automated vertical slice solving: ${state.intent.primary_goal || 'core requirements'}`}
`;
  await fs.writeFile(path.join(productDir, 'outcomes.md'), outcomesMd, 'utf8');

  // 6. constraints.md
  const constraintsMd = `# System Constraints

| Type | Description | Status |
|---|---|:---:|
${state.constraints.map(c => `| **${c.type}** | ${c.description} | ${c.confirmed ? 'Confirmed' : 'Inferred'} |`).join('\n') || '| None recorded | - | - |'}
`;
  await fs.writeFile(path.join(productDir, 'constraints.md'), constraintsMd, 'utf8');

  // 7. preferences.md
  const preferencesMd = `# User Preferences

- **Platforms:** ${state.preferences.platform.join(', ') || 'Not specified'}
- **Tech Stack Preferences:** ${state.preferences.tech_stack.join(', ') || 'AI Recommended / Simplest Fit'}
- **UI Style:** ${state.preferences.ui_style}
`;
  await fs.writeFile(path.join(productDir, 'preferences.md'), preferencesMd, 'utf8');

  // 8. assumptions.md
  const assumptionsMd = `# Factory Assumption Ledger

| ID | Assumption | Confidence | Impact if Invalid | Status |
|---|---|:---:|:---:|:---:|
${state.assumptions.map(a => `| **${a.id}** | ${a.assumption} | ${(a.confidence * 100).toFixed(0)}% | ${a.impact_if_invalid} | ${a.validation_status} |`).join('\n') || '| None recorded | - | - | - | - |'}
`;
  await fs.writeFile(path.join(productDir, 'assumptions.md'), assumptionsMd, 'utf8');

  // 9. unknowns.md
  const unknownsMd = `# Discovery Unknowns & Clarifications

| ID | Clarification Question | Impact | Resolved? | Answer |
|---|---|:---:|:---:|---|
${state.unknowns.map(u => `| **${u.id}** | ${u.question} | ${u.impact} | ${u.resolved ? '✓' : '✗'} | ${u.answer || 'Pending user answer'} |`).join('\n') || '| None pending | - | - | - | - |'}
`;
  await fs.writeFile(path.join(productDir, 'unknowns.md'), unknownsMd, 'utf8');

  // 10. decisions.md
  const decisionsMd = `# Discovery Decisions

${state.decisions.map((d, i) => `${i + 1}. **${d.title}**: ${d.decision}`).join('\n') || 'Zero explicit decisions registered during initial intake.'}
`;
  await fs.writeFile(path.join(productDir, 'decisions.md'), decisionsMd, 'utf8');
}

export async function loadDiscoveryState(projectRoot) {
  const jsonPath = path.join(projectRoot, 'product', 'discovery.json');
  try {
    const content = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}
