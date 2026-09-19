import fs from 'node:fs/promises';
import path from 'node:path';
import { LifecycleError } from '../core/errors.js';

export const STAGES = [
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

export const STAGE_METADATA = {
  assess: {
    id: 'assess',
    name: 'Problem & Market Assessment',
    ownerRole: 'Product Agent',
    artifactFile: 'assessment.md',
    description: 'Initial intent intake, problem statement, user personas, and quantified metrics.',
    prerequisites: []
  },
  constitution: {
    id: 'constitution',
    name: 'Project Constitution & Law',
    ownerRole: 'Principal SWE',
    artifactFile: 'constitution.md',
    globalPath: '.ai/constitution.md',
    description: 'Inviolable project laws, security rules, and non-negotiables.',
    prerequisites: ['assess']
  },
  specify: {
    id: 'specify',
    name: 'Feature Specification',
    ownerRole: 'Spec Agent',
    artifactFile: 'spec.md',
    description: 'Translates intent into testable REQ-xxx tags with Given-When-Then criteria.',
    prerequisites: ['assess']
  },
  clarify: {
    id: 'clarify',
    name: 'Requirements & Ambiguity Attack',
    ownerRole: 'Requirements Critic',
    artifactFile: 'clarification.md',
    description: 'Adversarial review to expose race conditions, edge cases, and contradictions.',
    prerequisites: ['specify']
  },
  design: {
    id: 'design',
    name: 'UX & Interaction Design',
    ownerRole: 'UX Architect',
    artifactFile: 'ux.md',
    description: '8-state UI interaction contract, accessibility, and user flows.',
    prerequisites: ['specify']
  },
  architect: {
    id: 'architect',
    name: 'C4 Architecture & Resilience',
    ownerRole: 'Principal Architect',
    artifactFile: 'architecture.md',
    description: 'Component boundaries, ADR authoring, and 14-point failure resilience checklist.',
    prerequisites: ['specify']
  },
  contract: {
    id: 'contract',
    name: 'API & Data Contracts',
    ownerRole: 'API / Data Agent',
    artifactFile: 'api-contract.md',
    description: 'OpenAPI 3.1 specification, JSON schemas, and RFC 7807 error envelopes.',
    prerequisites: ['architect']
  },
  plan: {
    id: 'plan',
    name: 'Vertical Slice Planning',
    ownerRole: 'Technical Planner',
    artifactFile: 'plan.md',
    description: 'Cross-cutting vertical slices breakdown delivering end-to-end functionality.',
    prerequisites: ['contract']
  },
  tasks: {
    id: 'tasks',
    name: 'Vertical Tasks Decomposition',
    ownerRole: 'Technical Planner',
    artifactFile: 'tasks.md',
    description: 'Granular TASK-xxx.y items mapped directly to REQ-xxx tags.',
    prerequisites: ['plan']
  },
  implement: {
    id: 'implement',
    name: 'Vertical Slice Implementation',
    ownerRole: 'Builder / Coding Agent',
    artifactFile: null,
    description: 'Source code in src/ implementing active vertical slices.',
    prerequisites: ['tasks']
  },
  verify: {
    id: 'verify',
    name: 'Deterministic Verification',
    ownerRole: 'Test Agent',
    artifactFile: 'verification.md',
    description: 'Automated test suite execution and machine-verifiable evidence collection.',
    prerequisites: ['implement']
  },
  review: {
    id: 'review',
    name: 'Independent Code Review',
    ownerRole: 'Code Reviewer',
    artifactFile: 'review.md',
    description: 'Independent evaluation of code correctness, style, and modularity.',
    prerequisites: ['verify']
  },
  security: {
    id: 'security',
    name: 'Threat Model & Security Scan',
    ownerRole: 'Security Agent',
    artifactFile: 'security-review.md',
    description: 'OWASP API and GenAI Top 10 threat audit and secret scan.',
    prerequisites: ['implement']
  },
  eval: {
    id: 'eval',
    name: 'AI Benchmark Evaluation',
    ownerRole: 'AI Eval Agent',
    artifactFile: 'eval-report.md',
    description: 'Dual-track benchmark execution against golden and adversarial datasets.',
    prerequisites: ['implement']
  },
  release: {
    id: 'release',
    name: 'Release Staging & Rollback',
    ownerRole: 'Release Agent',
    artifactFile: 'release-checklist.md',
    description: 'Pre-flight checks, migration dry-runs, and rollback verification.',
    prerequisites: ['verify', 'security']
  },
  observe: {
    id: 'observe',
    name: 'Telemetry & Observability',
    ownerRole: 'SRE Agent',
    artifactFile: 'observability-plan.md',
    description: 'Structured logging, RED metrics, spans, and SLO definitions.',
    prerequisites: ['release']
  },
  converge: {
    id: 'converge',
    name: 'Drift Analysis & Convergence',
    ownerRole: 'Convergence Agent',
    artifactFile: 'drift-analysis.md',
    description: 'Automated audit of spec-to-task-to-code drift with zero-tolerance policy.',
    prerequisites: ['verify']
  }
};

export function isValidStage(stageName) {
  return typeof stageName === 'string' && STAGES.includes(stageName.toLowerCase());
}

export function getStage(stageName) {
  if (!isValidStage(stageName)) return null;
  return STAGE_METADATA[stageName.toLowerCase()];
}

export function getStageArtifact(stageName) {
  const stage = getStage(stageName);
  return stage?.artifactFile || null;
}

export async function scaffoldStageArtifact(projectRoot, stageName, featureId) {
  const meta = getStage(stageName);
  if (!meta) {
    throw new LifecycleError(`Invalid stage name: ${stageName}`, stageName);
  }

  if (!meta.artifactFile) {
    return { created: false, path: null, reason: 'Stage does not produce a markdown artifact' };
  }

  const featureDir = path.join(projectRoot, 'specs', featureId);
  await fs.mkdir(featureDir, { recursive: true });

  const targetFile = path.join(featureDir, meta.artifactFile);
  try {
    await fs.access(targetFile);
    return { created: false, path: targetFile, reason: 'Artifact already exists' };
  } catch {
    // Check template in specs/template/
    const templatePath = path.join(projectRoot, 'specs', 'template', meta.artifactFile);
    let content = '';
    try {
      content = await fs.readFile(templatePath, 'utf8');
    } catch {
      content = `# ${meta.name.toUpperCase()} — ${featureId}\n\n**Feature ID:** ${featureId}\n**Stage:** ${stageName}\n**Owner:** ${meta.ownerRole}\n**Timestamp:** ${new Date().toISOString()}\n\n## 1. Overview\n${meta.description}\n\n## 2. Acceptance Criteria & Verifiable Evidence\n`;
    }
    await fs.writeFile(targetFile, content, 'utf8');
    return { created: true, path: targetFile, reason: 'Scaffolded from template' };
  }
}
