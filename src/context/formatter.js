/**
 * Context Pack Formatter.
 *
 * Formats context packs into JSON, clean Markdown, or prompt-ready system instructions.
 */

/**
 * Formats Context Pack as JSON string.
 */
export function formatJson(pack, pretty = true) {
  return pretty ? JSON.stringify(pack, null, 2) : JSON.stringify(pack);
}

/**
 * Formats Context Pack as readable Markdown.
 */
export function formatMarkdown(pack, options = {}) {
  const { showExplain = true, showMetrics = true } = options;

  let md = `# Agent Context Pack: ${pack.task_id || pack.mission.goal}\n\n`;
  md += `> **Target Role:** \`${pack.role.name}\` (${pack.target_role})\n`;
  md += `> **Hierarchy Level:** \`${pack.hierarchy_level}\`\n`;
  md += `> **Authority:** ${pack.role.authority}\n`;
  md += `> **Code Access:** \`${pack.role.code_access}\`\n\n`;

  md += `## 1. Mission\n`;
  md += `- **Goal:** ${pack.mission.goal}\n`;
  md += `- **Summary:** ${pack.mission.summary}\n`;
  if (pack.mission.deliverables && pack.mission.deliverables.length > 0) {
    md += `- **Deliverables:**\n`;
    for (const d of pack.mission.deliverables) {
      md += `  - ${d}\n`;
    }
  }
  md += `\n`;

  md += `## 2. Active Requirements & Criteria\n`;
  if (pack.requirements.length === 0) {
    md += `*No direct requirements mapped.*\n\n`;
  } else {
    for (const req of pack.requirements) {
      md += `### ${req.id}: ${req.description}\n`;
      if (req.acceptance_criteria) {
        md += `- **Acceptance:** ${req.acceptance_criteria}\n`;
      }
      if (showExplain && req.reason) {
        md += `- **Reason:** _${req.reason}_\n`;
      }
      md += `\n`;
    }
  }

  md += `## 3. Relevant Artifacts & Governing Contracts\n`;
  for (const art of pack.relevant_artifacts) {
    md += `- **\`${art.path}\`** (${art.type})\n`;
    if (showExplain && art.reason) md += `  - _Reason: ${art.reason}_\n`;
  }
  md += `\n`;

  md += `## 4. Relevant Source Files\n`;
  if (pack.relevant_files.length === 0) {
    md += `*No direct source files allocated (Read-only or Planning role).*\n\n`;
  } else {
    for (const file of pack.relevant_files) {
      md += `- **\`${file.path}\`** [${file.role || 'Source'}]\n`;
      if (showExplain && file.reason) md += `  - _Reason: ${file.reason}_\n`;
    }
    md += `\n`;
  }

  md += `## 5. Relevant Tests\n`;
  if (pack.relevant_tests.length === 0) {
    md += `*No direct tests mapped.*\n\n`;
  } else {
    for (const test of pack.relevant_tests) {
      md += `- **\`${test.path}\`** [${test.type}]\n`;
      if (showExplain && test.reason) md += `  - _Reason: ${test.reason}_\n`;
    }
    md += `\n`;
  }

  md += `## 6. Governing Decisions (ADRs)\n`;
  for (const dec of pack.decisions) {
    md += `- **${dec.id}:** ${dec.summary} [${dec.status || 'ACCEPTED'}]\n`;
    if (showExplain && dec.reason) md += `  - _Reason: ${dec.reason}_\n`;
  }
  md += `\n`;

  md += `## 7. Governing System Constraints\n`;
  for (const c of pack.constraints) {
    md += `- **[${c.id}]** ${c.description} _(Source: ${c.source})_\n`;
    if (showExplain && c.reason) md += `  - _Reason: ${c.reason}_\n`;
  }
  md += `\n`;

  md += `## 8. Forbidden Actions\n`;
  for (const fa of pack.forbidden_actions) {
    md += `- ❌ ${fa}\n`;
  }
  md += `\n`;

  if (showMetrics && pack.metrics) {
    md += `## 9. Context Efficiency & Relevance Metrics\n`;
    md += `| Metric | Value |\n`;
    md += `|---|---|\n`;
    md += `| **Estimated Tokens** | ${pack.metrics.estimated_tokens} |\n`;
    md += `| **Total Characters** | ${pack.metrics.total_characters} |\n`;
    md += `| **Compression Ratio** | ${(pack.metrics.compression_ratio * 100).toFixed(1)}% of repository baseline |\n`;
    md += `| **Included Items** | ${pack.metrics.items_included} |\n`;
    md += `| **Filtered Noise Items** | ${pack.metrics.items_filtered} |\n`;
    md += `| **Relevance Density** | ${(pack.metrics.relevance_score * 100).toFixed(0)}% |\n\n`;
  }

  return md;
}

/**
 * Formats Context Pack as a prompt ready for LLM consumption.
 */
export function formatPrompt(pack) {
  let p = `=== ROLE ASSIGNMENT & BOUNDED CONTEXT ===\n`;
  p += `You are acting as: ${pack.role.name} (${pack.target_role})\n`;
  p += `Code Access: ${pack.role.code_access}\n`;
  p += `Authority: ${pack.role.authority}\n\n`;

  p += `=== MISSION OBJECTIVE ===\n`;
  p += `Task: ${pack.task_id || 'System Governance'}\n`;
  p += `Goal: ${pack.mission.goal}\n`;
  p += `Summary: ${pack.mission.summary}\n\n`;

  p += `=== REQUIREMENTS & ACCEPTANCE CRITERIA ===\n`;
  for (const req of pack.requirements) {
    p += `[${req.id}] ${req.description}\n`;
    if (req.acceptance_criteria) p += `Acceptance: ${req.acceptance_criteria}\n`;
  }
  p += `\n`;

  p += `=== ALLOCATED SOURCE FILES ===\n`;
  for (const f of pack.relevant_files) {
    p += `- ${f.path} (${f.role || 'Source'})\n`;
  }
  p += `\n`;

  p += `=== VERIFICATION TESTS ===\n`;
  for (const t of pack.relevant_tests) {
    p += `- ${t.path} (${t.type})\n`;
  }
  p += `\n`;

  p += `=== GOVERNING CONSTRAINTS & CONTRACTS ===\n`;
  for (const c of pack.constraints) {
    p += `- ${c.id}: ${c.description}\n`;
  }
  for (const a of pack.relevant_artifacts) {
    p += `- Artifact: ${a.path} (${a.type})\n`;
  }
  p += `\n`;

  p += `=== STRICT FORBIDDEN ACTIONS ===\n`;
  for (const fa of pack.forbidden_actions) {
    p += `- ${fa}\n`;
  }
  p += `\n`;
  p += `Execute strictly within these boundaries and produce machine-verifiable evidence.\n`;

  return p;
}
