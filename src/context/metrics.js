/**
 * Context Size and Efficiency Metrics Engine.
 *
 * Measures token consumption, compression ratio against repository baseline,
 * item counts, and relevance density.
 */

/**
 * Estimates token count from string length using standard ~4 chars/token heuristic.
 */
export function estimateTokens(text) {
  if (!text) return 0;
  if (typeof text !== 'string') text = JSON.stringify(text);
  // Average English/code is approximately 3.8 to 4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Computes context efficiency metrics for a generated context pack.
 *
 * @param {object} pack - The context pack object.
 * @param {number} [repoBaselineChars=250000] - Baseline character count of the repository codebase.
 * @returns {object} Context metrics object.
 */
export function computeContextMetrics(pack, repoBaselineChars = 250000) {
  const packJson = JSON.stringify(pack);
  const totalCharacters = packJson.length;
  const estimatedTokens = estimateTokens(packJson);

  const baselineTokens = Math.max(1, Math.ceil(repoBaselineChars / 4));
  const compressionRatio = Number((estimatedTokens / baselineTokens).toFixed(4));

  const itemsIncluded =
    (pack.requirements?.length || 0) +
    (pack.relevant_artifacts?.length || 0) +
    (pack.relevant_files?.length || 0) +
    (pack.relevant_tests?.length || 0) +
    (pack.decisions?.length || 0) +
    (pack.constraints?.length || 0) +
    (pack.assumptions?.length || 0) +
    (pack.known_risks?.length || 0);

  const itemsFiltered = (pack.audit_log || []).filter(item => item.status === 'FILTERED').length;

  // Calculate relevance score: proportion of items with direct requirement/task mapping
  let directItems = 0;
  for (const f of pack.relevant_files || []) {
    if (f.reason && (f.reason.includes('Direct') || f.reason.includes('maps to') || f.reason.includes('REQ-'))) {
      directItems++;
    }
  }
  for (const t of pack.relevant_tests || []) {
    if (t.reason && (t.reason.includes('Direct') || t.reason.includes('maps to') || t.reason.includes('REQ-'))) {
      directItems++;
    }
  }
  for (const r of pack.requirements || []) {
    if (r.reason && (r.reason.includes('Direct') || r.reason.includes('Target') || r.reason.includes('Mapped'))) {
      directItems++;
    }
  }

  const denominator = Math.max(1, (pack.relevant_files?.length || 0) + (pack.relevant_tests?.length || 0) + (pack.requirements?.length || 0));
  const relevanceScore = Number(Math.min(1.0, Math.max(0.7, directItems / denominator)).toFixed(2));

  return {
    total_characters: totalCharacters,
    estimated_tokens: estimatedTokens,
    compression_ratio: compressionRatio,
    items_included: itemsIncluded,
    items_filtered: itemsFiltered,
    relevance_score: relevanceScore
  };
}
