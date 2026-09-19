/**
 * Negative Filter Rules Engine for Agent Context Compilation.
 *
 * Prevents context pollution by rejecting generated files, vendor code,
 * temporary caches, obsolete documents, and out-of-scope source files.
 */

export const FILTER_REASONS = {
  CACHE: 'Excluded: Cache or temporary artifact',
  VENDOR: 'Excluded: Third-party or vendor dependency code',
  GENERATED: 'Excluded: Machine-generated build artifact, map, or coverage report',
  HISTORICAL: 'Excluded: Deprecated, superseded, or backup document',
  UNRELATED_FEATURE: 'Excluded: Unrelated feature outside the active vertical slice',
  VCS_INTERNAL: 'Excluded: Version control internal metadata',
  OVERSIZED: 'Excluded: File exceeds maximum context budget threshold'
};

const BLOCKED_DIRECTORY_PATTERNS = [
  /([/\\]|^)node_modules([/\\]|$)/i,
  /([/\\]|^)\.git([/\\]|$)/i,
  /([/\\]|^)\.gemini([/\\]|$)/i,
  /([/\\]|^)\.cache([/\\]|$)/i,
  /([/\\]|^)dist([/\\]|$)/i,
  /([/\\]|^)build([/\\]|$)/i,
  /([/\\]|^)coverage([/\\]|$)/i,
  /([/\\]|^)\.nyc_output([/\\]|$)/i,
  /([/\\]|^)vendor([/\\]|$)/i,
  /([/\\]|^)third_party([/\\]|$)/i,
  /([/\\]|^)tmp([/\\]|$)/i,
  /([/\\]|^)\.tmp([/\\]|$)/i
];

const BLOCKED_FILE_EXTENSIONS = [
  /\.map$/i,
  /\.lock$/i,
  /\.log$/i,
  /\.min\.js$/i,
  /\.min\.css$/i,
  /\.bundle\.js$/i,
  /\.bak$/i,
  /\.old$/i,
  /\.swp$/i,
  /~$/
];

/**
 * Evaluates whether a file or path should be excluded from the context pack.
 *
 * @param {string} filePath - Absolute or relative file path.
 * @param {object} options - Evaluation options.
 * @param {string} [options.activeFeature] - The active feature identifier.
 * @param {number} [options.maxSizeBytes=500000] - Size cutoff.
 * @returns {{ excluded: boolean, reason: string|null }}
 */
export function evaluateFileExclusion(filePath, options = {}) {
  if (!filePath || typeof filePath !== 'string') {
    return { excluded: true, reason: 'Invalid file path' };
  }

  const normalized = filePath.replace(/\\/g, '/');

  // 1. Directory patterns (caches, VCS, vendor, builds)
  for (const pattern of BLOCKED_DIRECTORY_PATTERNS) {
    if (pattern.test(normalized)) {
      if (normalized.includes('node_modules') || normalized.includes('vendor') || normalized.includes('third_party')) {
        return { excluded: true, reason: FILTER_REASONS.VENDOR };
      }
      if (normalized.includes('.git')) {
        return { excluded: true, reason: FILTER_REASONS.VCS_INTERNAL };
      }
      if (normalized.includes('dist') || normalized.includes('build') || normalized.includes('coverage')) {
        return { excluded: true, reason: FILTER_REASONS.GENERATED };
      }
      return { excluded: true, reason: FILTER_REASONS.CACHE };
    }
  }

  // 2. File extensions
  for (const pattern of BLOCKED_FILE_EXTENSIONS) {
    if (pattern.test(normalized)) {
      if (/\.min\.(js|css)$/i.test(normalized) || /\.map$/i.test(normalized)) {
        return { excluded: true, reason: FILTER_REASONS.GENERATED };
      }
      if (/\.(bak|old|swp)$/i.test(normalized) || /~$/.test(normalized)) {
        return { excluded: true, reason: FILTER_REASONS.HISTORICAL };
      }
      return { excluded: true, reason: FILTER_REASONS.CACHE };
    }
  }

  // 3. Feature isolation: if activeFeature is specified and file is under specs/ or features/ of another feature
  if (options.activeFeature) {
    const activeFeat = options.activeFeature.toLowerCase();

    const specMatch = normalized.match(/specs\/([^/]+)/);
    if (specMatch && specMatch[1] !== '000-project-charter.md' && specMatch[1] !== 'template') {
      const specFeat = specMatch[1].toLowerCase();
      if (specFeat !== activeFeat && !activeFeat.includes(specFeat) && !specFeat.includes(activeFeat)) {
        return {
          excluded: true,
          reason: `${FILTER_REASONS.UNRELATED_FEATURE} (specs/${specMatch[1]} does not match active feature '${options.activeFeature}')`
        };
      }
    }

    const srcFeatureMatch = normalized.match(/src\/features\/([^/]+)/);
    if (srcFeatureMatch) {
      const featDir = srcFeatureMatch[1].toLowerCase();
      const isRelated = activeFeat === featDir ||
        activeFeat.includes(featDir) ||
        featDir.includes(activeFeat) ||
        (featDir.startsWith('task') && activeFeat.includes('task'));

      if (!isRelated) {
        return {
          excluded: true,
          reason: `${FILTER_REASONS.UNRELATED_FEATURE} (src/features/${srcFeatureMatch[1]} does not match active feature '${options.activeFeature}')`
        };
      }
    }
  }

  return { excluded: false, reason: null };
}

/**
 * Filters a list of file candidates, returning both accepted items and an audit log of exclusions.
 */
export function filterCandidates(candidates, options = {}) {
  const accepted = [];
  const auditLog = [];

  for (const candidate of candidates) {
    const itemPath = typeof candidate === 'string' ? candidate : (candidate.path || candidate.id);
    const evalResult = evaluateFileExclusion(itemPath, options);

    if (evalResult.excluded) {
      auditLog.push({
        item: itemPath,
        status: 'FILTERED',
        reason: evalResult.reason
      });
    } else {
      accepted.push(candidate);
      auditLog.push({
        item: itemPath,
        status: 'INCLUDED',
        reason: typeof candidate === 'object' && candidate.reason ? candidate.reason : 'Direct candidate passed negative filters'
      });
    }
  }

  return { accepted, auditLog };
}
