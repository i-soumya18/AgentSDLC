import fs from 'node:fs/promises';
import path from 'node:path';

export async function findProjectRoot(startDir = process.cwd()) {
  let curr = path.resolve(startDir);
  while (curr !== path.dirname(curr)) {
    try {
      await fs.access(path.join(curr, 'package.json'));
      return curr;
    } catch {
      curr = path.dirname(curr);
    }
  }
  return process.cwd();
}

export async function resolveActiveFeature(projectRoot = process.cwd(), explicitFeatureId) {
  if (explicitFeatureId && explicitFeatureId !== '001-feature') {
    return explicitFeatureId;
  }

  const specsDir = path.join(projectRoot, 'specs');
  try {
    const entries = await fs.readdir(specsDir, { withFileTypes: true });
    const featureDirs = entries
      .filter(e => e.isDirectory() && e.name !== 'template')
      .map(e => e.name);

    if (featureDirs.length > 0) {
      // Prioritize 001-ai-task-copilot if present, otherwise the first feature
      if (featureDirs.includes('001-ai-task-copilot')) {
        return '001-ai-task-copilot';
      }
      return featureDirs[0];
    }
  } catch {
    // If specs dir cannot be read, fallback
  }

  return explicitFeatureId || '001-ai-task-copilot';
}

export async function getPackageInfo(projectRoot = process.cwd()) {
  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    const content = await fs.readFile(pkgPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return { name: '@engineering-os/core', version: '1.0.0' };
  }
}
